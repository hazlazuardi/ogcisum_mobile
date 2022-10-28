// Import React Native
import React, { useState, useEffect, useMemo } from 'react';
import {
	StyleSheet,
	Appearance,
	View,
	SafeAreaView,
	Text,
	Image,
} from 'react-native';

// Import React Native Maps
import MapView, { Marker, Circle } from 'react-native-maps';

// Import React Native Geolocation
import Geolocation from '@react-native-community/geolocation';
import { getDistance } from 'geolib';

// Import Locations Data
import { locations } from '../data/locations';
import { useLocationDispatch } from '../context/Context';

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
	const dispatch = useLocationDispatch();

	// Convert string-based latlong to object-based on each location
	const updatedLocations = locations.map((location) => {
		const latlong = location.latlong.split(', ');
		location.coordinates = {
			latitude: parseFloat(latlong[0]),
			longitude: parseFloat(latlong[1]),
		};
		return location;
	});

	// Setup state for map data
	const initialMapState = {
		locationPermission: false,
		locations: updatedLocations,
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
		setMapState({
			...mapState,
			locationPermission: true,
		});
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
	// Only watch the user's current location when device permission granted
	useEffect(() => {
		function calculateDistance(userLocation) {
			const nearestLocations = memoizedMapState.locations
				.map((location) => {
					const metres = getDistance(userLocation, location.coordinates);
					location['distance'] = {
						metres: metres,
						nearbyLocation: metres <= 100 ? true : false,
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

		if (memoizedMapState.locationPermission) {
			Geolocation.watchPosition(
				(position) => {
					const userLocation = {
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
					};
					const nearbyLocation = calculateDistance(userLocation);
					setMapState({
						...memoizedMapState,
						userLocation,
						nearbyLocation: nearbyLocation,
					});
					dispatch({
						type: 'updated',
						nearbyLocation: nearbyLocation,
						user: userLocation,
					});
				},
				(error) => console.log(error),
			);
		}
		return () => {
			Geolocation.clearWatch();
		};
	}, [dispatch, memoizedMapState]);

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
				{mapState.locations.map((location) => (
					<Circle
						key={location.id}
						center={location.coordinates}
						radius={100}
						strokeWidth={3}
						strokeColor="#A42DE8"
						fillColor={
							colorScheme == 'dark'
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
