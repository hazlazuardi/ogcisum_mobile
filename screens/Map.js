// Import React Native
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, Appearance } from 'react-native';

// Import React Native Maps
import MapView, { Circle } from 'react-native-maps';

// Import React Native Geolocation
import Geolocation from '@react-native-community/geolocation';
import { getDistance } from 'geolib';

// Import Locations Data
// import { locations } from '../data/locations';
import { useLocation, useLocationDispatch } from '../context/Context';

import { LogBox } from 'react-native';

// Define Stylesheet
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
const colorScheme = Appearance.getColorScheme();

// Main component for displaying the map and markers
export default function Map() {
	LogBox.ignoreAllLogs();

	const dispatchLocations = useLocationDispatch();

	const { musicLocations } = useLocation();

	// Setup state for map data
	const initialMapState = {
		locationPermission: false,
		locations: musicLocations,
		userLocation: {
			latitude: -27.498248114899546,
			longitude: 153.01788081097033,
			// Starts at "Indooroopilly Shopping Centre"
		},
		nearbyLocation: {},
	};
	const [mapState, setMapState] = useState(initialMapState);

	// Run location permissions check after render due to side effects
	// Only Android needs extra code to check for permissions (in addition to android/app/src/main/AndroidManifest.xml)
	// iOS relies on ios/mapApp/Info.plist
	useEffect(() => {
		Geolocation.requestAuthorization(
			(success) => {
				setMapState({ ...memoizedMapState, locationPermission: true });
			},
			(error) => {
				setMapState({ ...memoizedMapState, locationPermission: false });
			},
		);

		// setMapState({
		// 	...mapState,
		// 	locationPermission: true,
		// });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const memoizedMapState = useMemo(
		() => mapState,
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			mapState.userLocation,
			mapState.locationPermission,
			mapState.locations,
			mapState.nearbyLocation,
		],
	);

	const calculateDistance = useCallback((userLocation, mloc) => {
		const nearestLocations = mloc
			.map((location) => {
				const metres = getDistance(userLocation, location.coordinates);
				location.distance = {
					metres: metres,
					nearbyLocation: metres <= 100 ? true : false,
				};
				return location;
			})
			.sort((previousLocation, thisLocation) => {
				return previousLocation.distance.metres - thisLocation.distance.metres;
			});
		return nearestLocations.shift();
	}, []);

	// Only watch the user's current location when device permission granted
	LogBox.ignoreLogs([
		'Sending `geolocationDidChange` with no listeners registered.',
	]); // Ignore log notification by message
	useEffect(() => {
		let watchID = null;
		if (musicLocations && memoizedMapState.locationPermission === true) {
			watchID = Geolocation.watchPosition(
				(position) => {
					const userLocation = {
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
					};
					const nearbyLocation = calculateDistance(
						userLocation,
						musicLocations,
					);
					setMapState({
						...memoizedMapState,
						userLocation,
						nearbyLocation: nearbyLocation,
					});
					dispatchLocations({
						type: 'updated',
						nearbyLocation: nearbyLocation,
						user: userLocation,
					});
				},
				(error) => {
					// Geolocation.requestAuthorization(
					// 	(success) => {
					// 		setMapState({ ...memoizedMapState, locationPermission: true });
					// 	},
					// 	(error) => {
					// 		setMapState({ ...memoizedMapState, locationPermission: false });
					// 	},
					// );
				},
			);
		}
		return () => {
			watchID !== null && Geolocation.clearWatch(watchID);
		};
	}, [calculateDistance, dispatchLocations, memoizedMapState, musicLocations]);

	return (
		<>
			<MapView
				camera={{
					center: mapState.userLocation,
					pitch: 0, // Angle of 3D map
					heading: 0, // Compass direction
					altitude: 3000, // Zoom level for iOS
					zoom: 15, // Zoom level For Android
				}}
				showsUserLocation={mapState.locationPermission}
				style={styles.container}
			>
				{musicLocations &&
					musicLocations.map((location) => (
						<Circle
							key={location.id}
							center={location.coordinates}
							radius={100}
							strokeWidth={3}
							strokeColor="#A42DE8"
							fillColor={
								colorScheme === 'dark'
									? 'rgba(128,0,128,0.5)'
									: 'rgba(210,169,210,0.5)'
							}
						/>
					))}
			</MapView>
			{/* <NearbyLocation {...mapState.nearbyLocation} /> */}
		</>
	);
}
