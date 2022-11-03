import React, { useEffect, useState } from 'react';
import { createContext, useContext, useReducer } from 'react';
import { useColorScheme } from 'react-native';

import {
	LOCATION_URL,
	SAMPLES_TO_LOCATIONS_URL,
	SAMPLES_URL,
} from '../data/constants';
import icons from '../data/icons';
import { colors } from '../data/theme';

import useFetch from '../hooks/useFetch';
import useWhyDidYouUpdate from '../hooks/useWhyDidYouUpdate';

const LocationContext = createContext(null);
const LocationDispatchContext = createContext(null);
const SamplesContext = createContext(null);
const SamplesToLocationsContext = createContext(null);
const ProfileContext = createContext(null);
const ThemeContext = createContext(null);

/** Function as async function for custom hook useFetch. */
const samplesFetcher = async () =>
	await fetch(SAMPLES_URL).then((res) => res.json());

/** Function as async function for custom hook useFetch. */
const samplesToLocationsFetcher = async () =>
	await fetch(SAMPLES_TO_LOCATIONS_URL).then((res) => res.json());

export default function StoreProvider({ children }) {
	/** Reducer to store live locations and update it using dispatch. */
	const [profile, dispatchProfile] = useReducer(profileReducer, initialProfile);

	/** Reducer to store live locations and update it using dispatch. */
	// const [liveLocations, dispatchLiveLocations] = useReducer(
	// 	locationsReducer,
	// 	initialLiveLocations,
	// );
	const [liveLocations, setLiveLocations] = useState(initialLiveLocations);

	/** This is to fetch locations from API and store it into a state. */
	const [musicLocations, setMusicLocations] = useState();
	useEffect(() => {
		async function getLocations() {
			await fetch(LOCATION_URL)
				.then((res) => res.json())
				.then((res) => {
					const modified = res.locations.map((location) => {
						const latlong = location.latlong.split(', ');
						location.coordinates = {
							latitude: parseFloat(latlong[0]),
							longitude: parseFloat(latlong[1]),
						};
						return location;
					});
					setMusicLocations(modified);
				})
				.catch((e) => console.log(e));
		}
		getLocations();
	}, []);

	/** This is to fetch samples using custom hooks from API and store it into a state. */
	const { status: statusSamples, value: samples } = useFetch(
		samplesFetcher,
		true,
	);

	/** This is to fetch samples_to_locations using custom hooks from API and store it into a state. */
	const { status: statusSTL, value: samplesToLocations } = useFetch(
		samplesToLocationsFetcher,
		true,
	);

	// useEffect(() => {
	// 	console.log('ctxloc: ', liveLocations);
	// }, [liveLocations]);

	const [recordingData, setRecordingData] = useState(null);
	const [hasRecordingData, setHasRecordingData] = useState(false);
	useEffect(() => {
		function getSamplesFromLocations(nearLoc, allSam, allStl) {
			console.log('nearf: ', typeof nearLoc.id);
			console.log('allSam: ', allSam);
			console.log('allStl: ', allStl);
			// Filter samples to location by location_id
			const filteredStl = allStl
				.filter((stl) => stl.locations_id === nearLoc.id)
				.map((stl) => stl);
			// Make a list of samples_id to filter samples
			const sidRef = filteredStl.map((stl) => stl.samples_id);
			//  Filter samples by samples_id
			const filteredSam = allSam
				.filter((sam) => sidRef.includes(sam.id))
				.map((sam) => {
					const parsedRec = {
						...sam,
						recording_data: JSON.parse(sam.recording_data),
					};
					return parsedRec;
				});
			return filteredSam;
		}

		if (liveLocations.nearbyLocation?.id && samples && samplesToLocations) {
			const sams = getSamplesFromLocations(
				liveLocations.nearbyLocation,
				samples?.samples,
				samplesToLocations?.samples_to_locations,
			);

			const rec = sams?.map((sample) => {
				return { type: sample.type, recording_data: sample.recording_data };
			});
			console.log('rec: ', rec);
			if (rec?.length > 0) {
				setRecordingData(rec);
				setHasRecordingData(true);
			}
		}
	}, [liveLocations.nearbyLocation, samples, samplesToLocations]);

	useWhyDidYouUpdate('Context', { recordingData });

	/** Detect device's color scheme. */
	const colorScheme = useColorScheme();
	const isDarkMode = colorScheme === 'dark';

	/** Objects containing colors and icons based on color scheme. */
	const themeColors = isDarkMode ? colors.dark : colors.light;
	const themeIcons = isDarkMode ? icons.dark : icons.light;

	return (
		<ThemeContext.Provider value={{ isDarkMode, themeColors, themeIcons }}>
			<ProfileContext.Provider value={{ profile, dispatchProfile }}>
				<LocationContext.Provider
					value={{
						liveLocations,
						musicLocations: musicLocations,
					}}
				>
					<LocationDispatchContext.Provider value={setLiveLocations}>
						<SamplesContext.Provider
							value={{
								samples: samples?.samples,
								statusSamples,
								hasRecordingData,
							}}
						>
							<SamplesToLocationsContext.Provider
								value={{
									samplesToLocations: samplesToLocations?.samples_to_locations,
									statusSTL,
								}}
							>
								{children}
							</SamplesToLocationsContext.Provider>
						</SamplesContext.Provider>
					</LocationDispatchContext.Provider>
				</LocationContext.Provider>
			</ProfileContext.Provider>
		</ThemeContext.Provider>
	);
}

/** Custom hook to get live locations from context. */
export function useLocation() {
	return useContext(LocationContext);
}

/** Custom hook to update live locations from context. */
export function useLocationDispatch() {
	return useContext(LocationDispatchContext);
}

/** Custom hook to get samples from context. */
export function useSamples() {
	return useContext(SamplesContext);
}

/** Custom hook to get samples_to_locations from context. */
export function useSamplesToLocations() {
	return useContext(SamplesToLocationsContext);
}

/** Custom hook to get profile from context. */
export function useProfile() {
	return useContext(ProfileContext);
}

/** Custom hook to get colors and icons from context. */
export function useTheme() {
	return useContext(ThemeContext);
}

/** Function as reducer for live locations. */
// function locationsReducer(state, action) {
// 	switch (action.type) {
// 		case 'updated': {
// 			return {
// 				...state,
// 				user: action.user,
// 				nearbyLocation: action.nearbyLocation,
// 			};
// 		}
// 		default: {
// 			throw Error(`Unknown action: ${action.type}`);
// 		}
// 	}
// }

/** Function as reducer for profile. */
function profileReducer(state, action) {
	switch (action.type) {
		case 'setPhoto': {
			return {
				...state,
				photo: action.photo,
			};
		}
		case 'setName': {
			return {
				...state,
				name: action.name,
			};
		}
		default: {
			throw Error(`Unkown action: ${action.type}`);
		}
	}
}

const initialLiveLocations = {
	nearbyLocation: {},
	nearbySamples: [],
	user: {},
};

const initialProfile = {
	photo: {},
	name: '',
};
