import React from 'react';
import { createContext, useContext, useReducer } from 'react';
import { useColorScheme } from 'react-native';

import { SAMPLES_TO_LOCATIONS_URL, SAMPLES_URL } from '../data/constants';
import icons from '../data/icons';
import { colors } from '../data/theme';

import useFetch from '../hooks/useFetch';

const LocationContext = createContext(null);
const LocationDispatchContext = createContext(null);
const SamplesContext = createContext(null);
const SamplesToLocationsContext = createContext(null);
const ProfileContext = createContext(null);
const ThemeContext = createContext(null);

const samplesFetcher = async () =>
	await fetch(SAMPLES_URL).then((res) => res.json());
const samplesToLocationsFetcher = async () =>
	await fetch(SAMPLES_TO_LOCATIONS_URL).then((res) => res.json());

export default function StoreProvider({ children }) {
	const [locations, dispatchLocations] = useReducer(
		locationsReducer,
		initialLocations,
	);
	const [profile, dispatchProfile] = useReducer(profileReducer, initialProfile);
	const colorScheme = useColorScheme();
	const isDarkMode = colorScheme === 'dark';
	const themeColors = isDarkMode ? colors.dark : colors.light;
	const themeIcons = isDarkMode ? icons.dark : icons.light;

	// Fetch Samples
	const { status: statusSamples, value: samples } = useFetch(
		samplesFetcher,
		true,
	);

	// Fetch Samples to Locations
	const { status: statusSTL, value: samplesToLocations } = useFetch(
		samplesToLocationsFetcher,
		true,
	);

	return (
		<ThemeContext.Provider value={{ themeColors, themeIcons }}>
			<ProfileContext.Provider value={{ profile, dispatchProfile }}>
				<LocationContext.Provider value={locations}>
					<LocationDispatchContext.Provider value={dispatchLocations}>
						<SamplesContext.Provider
							value={{ samples: samples?.samples, statusSamples }}
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

export function useLocation() {
	return useContext(LocationContext);
}

export function useLocationDispatch() {
	return useContext(LocationDispatchContext);
}

export function useSamples() {
	return useContext(SamplesContext);
}
export function useSamplesToLocations() {
	return useContext(SamplesToLocationsContext);
}

export function useProfile() {
	return useContext(ProfileContext);
}

export function useTheme() {
	return useContext(ThemeContext);
}

function locationsReducer(state, action) {
	switch (action.type) {
		case 'updated': {
			return {
				...state,
				user: action.user,
				nearbyLocation: action.nearbyLocation,
			};
		}
		default: {
			throw Error(`Unknown action: ${action.type}`);
		}
	}
}

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

const initialLocations = {
	nearbyLocation: {},
	nearbySamples: [],
	user: {},
};

const initialProfile = {
	photo: {},
	name: '',
};
