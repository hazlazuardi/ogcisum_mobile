import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import BottomTabBar from './components/BottomTabBar';

export default function App() {
	return (
		<NavigationContainer>
			<BottomTabBar />
		</NavigationContainer>
	);
}
