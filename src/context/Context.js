import React, {
	useEffect,
	useState,
	createContext,
	useContext,
	useReducer,
} from 'react';
import { useColorScheme } from 'react-native';
import PropTypes from 'prop-types';

import {
	LOCATION_URL,
	SAMPLES_TO_LOCATIONS_URL,
	SAMPLES_URL,
} from '../data/constants';
import icons from '../data/icons';
import { colors } from '../data/theme';

import useFetch from '../hooks/useFetch';

const LocationContext = createContext(null);
const LocationDispatchContext = createContext(null);
const SamplesContext = createContext(null);
const SamplesToLocationsContext = createContext(null);
const ProfileContext = createContext(null);
const ThemeContext = createContext(null);

/** Async function for custom hook useFetch. */
const samplesFetcher = async () => {
	return fetch(SAMPLES_URL).then((res) => res.json());
};

/** Async function for custom hook useFetch. */
const samplesToLocationsFetcher = async () => {
	return fetch(SAMPLES_TO_LOCATIONS_URL).then((res) => res.json());
};

/**
 * React component for the Context API that acts as
 * the Store Provider.
 *
 * @param {object} props - Object containing props for this component.
 * @param {JSX.Element} props.children — React components that can-
 * access data in this Store.
 * @returns {JSX.Element} React component for Providers of data.
 */
function StoreProvider({ children }) {
	/** Reducer to store live locations and update it using dispatch. */
	const [profile, dispatchProfile] = useReducer(profileReducer, initialProfile);

	const [liveLocations, setLiveLocations] = useState(initialLiveLocations);
	const { nearbyLocation } = liveLocations;

	/** This is to fetch locations from API and store it into a state. */
	const [musicLocations, setMusicLocations] = useState();
	useEffect(() => {
		/**
		 *
		 */
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
	const { value: samplesResponse } = useFetch(samplesFetcher, true);
	const samples = samplesResponse?.samples;
	/** This is to fetch samples_to_locations using custom hooks from API and store it into a state. */
	const {
		value: samplesToLocationsResponse,
		execute: fetchSharedSamples,
		status: statusSharedSamples,
	} = useFetch(samplesToLocationsFetcher, true);
	const samplesToLocations = samplesToLocationsResponse?.samples_to_locations;

	const [recordingData, setRecordingData] = useState(null);
	const [hasRecordingData, setHasRecordingData] = useState(false);
	useEffect(() => {
		/**
		 * This is a function to get samples from locations.
		 * This function is inside a useEffect as a best practice since-
		 * nothing uses this function anywhere else.
		 *
		 * @param {object} nearLoc - Object containing nearby location data.
		 * @param {object} allSam - Object containing samples data.
		 * @param {object} allStl - Object containing samples to locations data.
		 * @returns {Array} Array of filtered samples based on location.
		 */
		function getSamplesFromLocations(nearLoc, allSam, allStl) {
			const filteredSamplesToLocations = allStl
				.filter((stl) => stl.locations_id === nearLoc.id)
				.map((stl) => stl)
				.map((stl) => stl.samples_id);
			const filteredSamples = allSam
				.filter((sam) => filteredSamplesToLocations.includes(sam.id))
				.map((sam) => {
					const parsedRecordingData = {
						...sam,
						recording_data: JSON.parse(sam.recording_data),
					};
					return parsedRecordingData;
				});
			return filteredSamples;
		}

		if (nearbyLocation?.id && samples && samplesToLocations) {
			const samplesFromLocations = getSamplesFromLocations(
				nearbyLocation,
				samples,
				samplesToLocations,
			);

			const extractedRecordingData = samplesFromLocations?.map((sample) => {
				return { type: sample.type, recording_data: sample.recording_data };
			});
			if (extractedRecordingData?.length > 0) {
				setRecordingData(extractedRecordingData);
				setHasRecordingData(true);
			} else {
				setRecordingData([]);
				setHasRecordingData(false);
			}
		}
	}, [nearbyLocation, samples, samplesToLocations]);

	// useWhyDidYouUpdate('Context', { ...liveLocations });

	/** Detect device's color scheme. */
	const colorScheme = useColorScheme();
	const isDarkMode = colorScheme === 'dark';

	/** Objects containing colors and icons based on color scheme. */
	const themeColors = isDarkMode ? colors.dark : colors.light;
	const themeIcons = isDarkMode ? icons.dark : icons.light;

	return (
		<ThemeContext.Provider value={{ isDarkMode, themeColors, themeIcons }}>
			<ProfileContext.Provider value={{ profile, dispatchProfile }}>
				<LocationContext.Provider value={{ liveLocations, musicLocations }}>
					<LocationDispatchContext.Provider value={setLiveLocations}>
						<SamplesContext.Provider
							value={{
								recordingData,
								hasRecordingData,
								fetchSharedSamples,
								statusSharedSamples,
							}}
						>
							{children}
						</SamplesContext.Provider>
					</LocationDispatchContext.Provider>
				</LocationContext.Provider>
			</ProfileContext.Provider>
		</ThemeContext.Provider>
	);
}

StoreProvider.propTypes = {
	children: PropTypes.element,
};

/**
 * Custom hook to get live locations from context.
 *
 * @returns {object} Context object responsible for Location data.
 */
export function useLocation() {
	return useContext(LocationContext);
}

/**
 * Custom hook to update live locations from context.
 *
 * @returns {object} Context object responsible for
 * Location Dispatch action.
 */
export function useLocationDispatch() {
	return useContext(LocationDispatchContext);
}

/**
 * Custom hook to get samples from context.
 *
 * @returns {object} Context object responsible for Samples data.
 */
export function useSamples() {
	return useContext(SamplesContext);
}

/**
 * Custom hook to get samples_to_locations from context.
 *
 * @returns {object} Context object responsible for Samples
 * to Locations data.
 */
export function useSamplesToLocations() {
	return useContext(SamplesToLocationsContext);
}

/**
 * Custom hook to get profile from context.
 *
 * @returns {object} Context object responsible for Profile data.
 */
export function useProfile() {
	return useContext(ProfileContext);
}

/**
 * Custom hook to get colors and icons from context.
 *
 * @returns {object} Context object responsible for color scheme data.
 */
export function useTheme() {
	return useContext(ThemeContext);
}

/**
 * Function as reducer for profile.
 *
 * @param {object} state - Object containing Profile data.
 * @param {object} action - Object containing dispatch data.
 * @returns {object} Updated Profile data from dispatch payload.
 */
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
	userLocation: {
		latitude: -27.498248114899546,
		longitude: 153.01788081097033,
	},
};

const initialProfile = {
	photo: {},
	name: '',
};

export default StoreProvider;
