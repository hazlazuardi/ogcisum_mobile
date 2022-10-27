import React from 'react';
import { createContext, useContext, useReducer } from 'react';

import { SAMPLES_TO_LOCATIONS_URL, SAMPLES_URL } from '../data/constants';

import useFetch from '../hooks/useFetch';

const Context = createContext(null);
const LocationDispatchContext = createContext(null);
const SamplesContext = createContext(null);
const SamplesToLocationsContext = createContext(null);

const samplesFetcher = async () =>
	await fetch(SAMPLES_URL).then((res) => res.json());
const samplesToLocationsFetcher = async () =>
	await fetch(SAMPLES_TO_LOCATIONS_URL).then((res) => res.json());

export default function LocationProvider({ children }) {
	const [location, dispatch] = useReducer(locationReducer, initialLocation);

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
		<Context.Provider value={location}>
			<LocationDispatchContext.Provider value={dispatch}>
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
		</Context.Provider>
	);
}

export function useLocation() {
	return useContext(Context);
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

function locationReducer(location, action) {
	switch (action.type) {
		case 'updated': {
			return {
				...location,
				user: action.user,
				nearby: action.nearby,
			};
		}
		default: {
			throw Error(`Unknown action: ${action.type}`);
		}
	}
}

const initialLocation = {
	nearby: {},
	nearbySamples: [],
	user: {},
};
