// Import React Native
import React, {
	useState,
	useEffect,
	useMemo,
	useCallback,
	useRef,
} from 'react';
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

	/** retrieve music locations from Context */
	const { liveLocations, musicLocations } = useLocation();

	/** set up initial map state data for initial render */
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

	/**
	 * Run location permissions check after render due to side effects
	 * iOS relies on ios/mapApp/Info.plist
	 */
	useEffect(() => {
		setMapState({
			...mapState,
			locationPermission: true,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/** Memoize Map State to avoid infinite re-render*/
	const memoizedMapState = useMemo(() => {
		return {
			userLocation: mapState.userLocation,
			locations: mapState.locations,
			nearbyLocation: mapState.nearbyLocation,
			locationPermission: mapState.locationPermission,
		};
	}, [
		mapState.userLocation,
		mapState.locations,
		mapState.nearbyLocation,
		mapState.locationPermission,
	]);

	/**
	 * This is a function to calculate distance between user location and music locations,
	 * and to find the nearest music location
	 * @param {Object} userCoordinate — Objects containing user's location coordinate
	 * @param {Array}  musicCoordinates — Array of Objects containing musics location coordinates
	 * @returns Object containing the nearest music location coordinate
	 */

	/** Retrieve dispatch location reducer function from Context  */
	// const dispatchLocations = useLocationDispatch();

	// const refTmpUserLoc = useRef(tmpUserLoc);
	const [tmpUserLoc, setTmpUserLoc] = useState({
		latitude: null,
		longitude: null,
	});
	/** useEffect to watch user's position in real time */
	useEffect(() => {
		let watchID = null;
		if (musicLocations && memoizedMapState.locationPermission === true) {
			watchID = Geolocation.watchPosition(
				(position) => {
					console.log('wID', watchID);
					const userLocation = {
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
					};
					setTmpUserLoc(userLocation);
				},
				(error) => {},
			);
		}
		return () => {
			watchID !== null && Geolocation.clearWatch(watchID);
		};
	}, [memoizedMapState.locationPermission, musicLocations]);

	// useEffect(() => {
	// 	console.log('tmpUserLoc: ', tmpUserLoc);
	// }, [tmpUserLoc]);

	const setLiveLocations = useLocationDispatch();
	useEffect(() => {
		console.log('setLocations: ');
		setLiveLocations((prev) => ({
			...prev,
			userLocation: {
				latitude: tmpUserLoc.latitude,
				longitude: tmpUserLoc.longitude,
			},
		}));
	}, [setLiveLocations, tmpUserLoc.latitude, tmpUserLoc.longitude]);

	// useEffect(() => {
	// 	console.log('live locations: ', liveLocations);
	// }, [liveLocations]);

	// useEffect(() => {
	// 	console.log('musicLocations: ', musicLocations);
	// }, [musicLocations]);

	// const tmpMsl = { ...musicLocations };
	const [tmpNearbyLoc, setTmpNearbyLoc] = useState();
	useEffect(() => {
		function calculateDistance(userCoordinate, musicCoordinates) {
			const nearestLocations = musicCoordinates
				?.map((location) => {
					const metres = getDistance(userCoordinate, location.coordinates);
					location.distance = {
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

		if (tmpUserLoc === null) return;
		console.log('musicLoc: ', musicLocations);
		console.log('tmpLocCal: ', tmpUserLoc);
		if (tmpUserLoc.latitude && tmpUserLoc.longitude && musicLocations) {
			// console.log('nearbyLoc: ', calculateDistance(tmpUserLoc, musicLocations));
			const nl = calculateDistance(tmpUserLoc, musicLocations);
			// console.log('nearby: ', typeof nl);
			setTmpNearbyLoc(nl);
		}
	}, [musicLocations, tmpUserLoc]);

	// useEffect(() => {
	// 	console.log('tmpNear: ', tmpNearbyLoc);
	// }, [tmpNearbyLoc]);

	useEffect(() => {
		if (tmpNearbyLoc?.distance) {
			console.log('setNearby: ');
			setLiveLocations((prev) => ({
				...prev,
				nearbyLocation: tmpNearbyLoc,
			}));
		}
	}, [setLiveLocations, tmpNearbyLoc]);

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
