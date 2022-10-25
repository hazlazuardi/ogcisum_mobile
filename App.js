import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Text, SafeAreaView } from 'react-native';

export default function App() {
	const Stack = createStackNavigator();

	const Landing = () => {
		return <Text>This is Landing</Text>;
	};

	return (
		<SafeAreaView>
			<NavigationContainer></NavigationContainer>
		</SafeAreaView>
	);
}
