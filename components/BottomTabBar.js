import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet, Text, View } from 'react-native';

import icons from '../data/icons';
import { colors } from '../data/theme';
import Map from '../screens/Map';
import NowPlaying from '../screens/NowPlaying';
import Profile from '../screens/Profile';
import { useLocation } from '../context/Context';

const Tab = createBottomTabNavigator();
export default function BottomTabBar({ navigation }) {
	return (
		<Tab.Navigator screenOptions={{ headerShown: false }}>
			<Tab.Screen
				name="Map"
				children={() => <Map navigation={navigation} />}
				options={tabOptions(icons.tabMapPurple)}
			/>
			<Tab.Screen
				name="Now Playing"
				children={() => <NowPlaying navigation={navigation} />}
				options={tabOptions(icons.logoWhite)}
			/>
			<Tab.Screen
				name="Profile"
				children={() => <Profile navigation={navigation} />}
				options={tabOptions(icons.tabProfilePurple)}
			/>
		</Tab.Navigator>
	);
}

function TabIcon({ focused, icon, type }) {
	const location = useLocation();
	if (icon !== icons.logoWhite) {
		return (
			<View style={styles.tabIconContainer}>
				<Image
					source={icon}
					resizeMode="contain"
					style={[
						styles.tabIconImage,
						{
							tintColor: focused
								? colors.blackColorTranslucentMore
								: colors.blackColorTranslucentLess,
						},
					]}
				/>
			</View>
		);
	}
	if (icon === icons.logoWhite) {
		if (typeof location !== 'undefined') {
			return (
				<View>
					<Image
						source={icon}
						resizeMode="center"
						style={[
							styles.tabLogoImage,
							{
								tintColor: focused
									? colors.blackColorTranslucentMore
									: colors.blackColorTranslucentLess,
							},
						]}
					/>
					<Text style={{ color: 'black' }}>
						{location.nearby.id}
						{location.nearby.location}
					</Text>
				</View>
			);
		}
	}
}

function tabOptions(icon) {
	return {
		tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={icon} />,
		tabBarShowLabel: false,
	};
}

const styles = StyleSheet.create({
	tabIconContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		height: 80,
		width: 50,
	},
	tabIconImage: {
		width: 30,
		height: 30,
	},
	tabLogoImage: {
		width: 60,
		height: 30,
	},
});
