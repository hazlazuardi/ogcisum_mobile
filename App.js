import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import BottomTabBar from './src/components/BottomTabBar';
import StoreProvider from './src/context/Context';

/**
 * Function as the starting point of the App.
 *
 * @returns {JSX.Element} App components with Store, Navigation,
 * and Bottom Tab Bar.
 */
export default function App() {
	return (
		<StoreProvider>
			<NavigationContainer>
				<BottomTabBar />
			</NavigationContainer>
		</StoreProvider>
	);
}
