import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import BottomTabBar from './components/BottomTabBar';
import LocationProvider from './context/Context';

export default function App() {
	return (
		<LocationProvider>
			<NavigationContainer>
				<BottomTabBar />
			</NavigationContainer>
		</LocationProvider>
	);
}
