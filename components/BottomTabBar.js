import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet, Text, View } from 'react-native';

import icons from '../data/icons';
import { colors, sizes } from '../data/theme';
import Map from '../screens/Map';
import NowPlaying from '../screens/NowPlaying';
import Profile from '../screens/Profile';
import { useLocation, useSamples } from '../context/Context';
import LinearGradient from 'react-native-linear-gradient';

const Tab = createBottomTabNavigator();
export default function BottomTabBar({ navigation }) {
	return (
		<Tab.Navigator
			screenOptions={{
				headerShown: false,
				tabBarBackground: () => {
					return (
						<View>
							<LinearGradient
								start={{ x: 0, y: 0 }}
								end={{ x: 0, y: 1 }}
								colors={[colors.purpleColorLighter, colors.blueColorDarker]}
								style={{ height: '100%' }}
							/>
						</View>
					);
				},
			}}
		>
			<Tab.Screen
				name="Map"
				children={() => <Map navigation={navigation} />}
				options={tabOptions(icons.tabMapPurple)}
			/>
			<Tab.Screen
				name="Now Playing"
				children={() => <NowPlaying navigation={navigation} />}
				options={tabOptions(icons.logoWhite, true)}
			/>
			<Tab.Screen
				name="Profile"
				children={() => <Profile navigation={navigation} />}
				options={tabOptions(icons.tabProfilePurple)}
			/>
		</Tab.Navigator>
	);
}

function tabOptions(icon, isLogo) {
	return {
		tabBarIcon: ({ focused, size }) => (
			<TabIcon focused={focused} icon={icon} isLogo={isLogo} size={size} />
		),
		tabBarShowLabel: false,
		tabBarStyle: [styles.tabContainer],
	};
}

function TabIcon({ focused, icon, isLogo, size }) {
	const { liveLocations } = useLocation();
	const { hasRecordingData } = useSamples();
	// console.log(location);
	if (!isLogo) {
		return (
			<View
				style={[
					styles.tabIconContainer,
					{
						backgroundColor: focused && colors.blackColorTranslucentLess,
					},
				]}
			>
				<Image
					source={icon}
					resizeMode="contain"
					style={[
						styles.tabIconImage,
						{
							tintColor: focused
								? colors.white
								: colors.whiteColorTranslucentLess,
						},
					]}
				/>
			</View>
		);
	}
	if (isLogo) {
		if (typeof liveLocations !== 'undefined') {
			return (
				<View
					style={[
						styles.tabLogoContainer,
						{
							backgroundColor: focused && colors.blackColorTranslucentLess,
						},
					]}
				>
					<Image
						source={icon}
						resizeMode="contain"
						style={[
							styles.tabLogoImage,
							{
								tintColor: focused ? colors.white : colors.white,
							},
						]}
					/>
					{liveLocations.nearbyLocation.distance?.nearbyLocation &&
						hasRecordingData && (
							<View>
								<Text style={styles.tabLogoText}>There's Music Nearby</Text>
							</View>
						)}
				</View>
			);
		}
	}
}

const styles = StyleSheet.create({
	tabIconContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%',
		padding: 20,

		// width: '100%',
	},
	tabIconImage: {
		width: 30,
		height: 30,
	},
	tabLogoImage: {
		height: 30,
		width: 100,
	},
	tabContainer: {},
	tabLogoContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: '120%',
		padding: 10,
		height: '100%',
	},
	tabLogoText: {
		color: colors.white,
		textAlign: 'center',
		fontSize: sizes.body5,
	},
});
