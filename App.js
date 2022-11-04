import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import BottomTabBar from './components/BottomTabBar';
import StoreProvider from './context/Context';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
	return (
		<StoreProvider>
			<NavigationContainer>
				<BottomTabBar />
			</NavigationContainer>
		</StoreProvider>
	);
}
