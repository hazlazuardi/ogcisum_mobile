import React, { useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import BottomTabBar from './components/BottomTabBar';
import LocationProvider from './context/Context';

export default function App() {
	const [userLocation, setUserLocation] = useState();

	return (
		<LocationProvider>
			<NavigationContainer>
				<BottomTabBar />
			</NavigationContainer>
		</LocationProvider>
	);
}
