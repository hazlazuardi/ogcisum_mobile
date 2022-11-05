import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import BottomTabBar from './src/components/BottomTabBar';
import StoreProvider from './src/context/Context';

export default function App() {
	return (
		<StoreProvider>
			<NavigationContainer>
				<BottomTabBar />
			</NavigationContainer>
		</StoreProvider>
	);
}
