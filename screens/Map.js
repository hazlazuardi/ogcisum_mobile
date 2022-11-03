// Import React Native
import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, LogBox } from 'react-native';

// Import React Native Maps
import MapView, { Circle } from 'react-native-maps';

// Import React Native Geolocation
import Geolocation from '@react-native-community/geolocation';
import { getDistance } from 'geolib';

import { useLocation, useLocationDispatch, useTheme } from '../context/Context';

/**
 *	This is the main component of Map page
 * @returns React component for Map page
 */
export default function Map() {
	/** Ignore all warning logs related to Geolocation */
	LogBox.ignoreLogs([
		'Sending `geolocationError` with no listeners registered.',
		'Sending `geolocationDidChange` with no listeners registered.',
	]);

	/** retrieve live location and music locations from Context */
	const { liveLocations, musicLocations } = useLocation();

	/** useState to get/set location permission */
	const [locationPermission, setLocationPermission] = useState(false);

	/**
	 * Run location permissions check after render due to side effects
	 * iOS relies on ios/mapApp/Info.plist
	 */
	useEffect(() => {
		setLocationPermission(true);
	}, []);

	/** useState to get/set user location for MapView.
	 * It exists to avoid unnecessary re-render if using setter from
	 * Context.
	 */
	const [userLocation, setUserLocation] = useState(liveLocations.userLocation);

	/** useEffect to watch user's position in real time.
	 * It also store the current user location into
	 * userLocation state.
	 */
	useEffect(() => {
		let watchID = null;
		if (musicLocations && locationPermission === true) {
			watchID = Geolocation.watchPosition(
				(position) => {
					console.log('wID', watchID);
					const coordinate = {
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
					};
					setUserLocation(coordinate);
				},
				(error) => {},
			);
		}
		return () => {
			watchID !== null && Geolocation.clearWatch(watchID);
		};
	}, [locationPermission, musicLocations]);

	/** use live location setter from Context  */
	const setLiveLocations = useLocationDispatch();

	/** useEffect to store user's live location from
	 * this userLocation state to live location's userLocation
	 * state in Context  */
	useEffect(() => {
		setLiveLocations((prev) => ({
			...prev,
			userLocation: {
				latitude: userLocation.latitude,
				longitude: userLocation.longitude,
			},
		}));
	}, [setLiveLocations, userLocation.latitude, userLocation.longitude]);

	const [nearbyLocation, setNearbyLocation] = useState();
	useEffect(() => {
		function calculateDistance(userCoordinate, musicCoordinates) {
			const nearestLocations = musicCoordinates
				?.map((location) => {
					const metres = getDistance(userCoordinate, location.coordinates);
					location.distance = {
						metres: metres,
						isNear: metres <= 100 ? true : false,
					};
					return location;
				})
				.sort((previousLocation, thisLocation) => {
					return (
						previousLocation.distance.metres - thisLocation.distance.metres
					);
				});
			return nearestLocations.shift();
		}

		// if (userLocation === null) return;
		if (userLocation.latitude && userLocation.longitude && musicLocations) {
			const nl = calculateDistance(userLocation, musicLocations);
			setNearbyLocation(nl);
		}
	}, [musicLocations, userLocation]);

	useEffect(() => {
		if (nearbyLocation?.distance) {
			// console.log('setNearby: ');
			setLiveLocations((prev) => ({
				...prev,
				nearbyLocation: nearbyLocation,
			}));
		}
	}, [setLiveLocations, nearbyLocation]);

	/** Retrieve current device's color scheme from Context */
	const { isDarkMode } = useTheme();

	/** Memoize dynamic styles to avoid re-creation */
	const dynamicStyles = useMemo(() => {
		return {
			circleFill: isDarkMode ? 'rgba(128,0,128,0.5)' : 'rgba(210,169,210,0.5)',
			circleStroke: '#A42DE8',
		};
	}, [isDarkMode]);

	/** Return Map page */
	return (
		<>
			<MapView
				camera={{
					center: userLocation,
					pitch: 0, // Angle of 3D map
					heading: 0, // Compass direction
					altitude: 3000, // Zoom level for iOS
					zoom: 15, // Zoom level For Android
				}}
				showsUserLocation={locationPermission}
				style={styles.container}
			>
				{musicLocations &&
					musicLocations.map((location) => (
						<Circle
							key={location.id}
							center={location.coordinates}
							radius={100}
							strokeWidth={3}
							strokeColor={dynamicStyles.circleStroke}
							fillColor={dynamicStyles.circleFill}
						/>
					))}
			</MapView>
		</>
	);
}

/** Stylesheet containing styles that use non-dynamic conditions. Exists so these objects won't re-render */
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	nearbyLocationSafeAreaView: {
		backgroundColor: 'black',
	},
	nearbyLocationView: {
		padding: 20,
	},
	nearbyLocationText: {
		color: 'white',
		lineHeight: 25,
	},
});
