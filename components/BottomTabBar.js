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
								style={styles.linearGradient}
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
	const isNearAndHasRecordingData =
		liveLocations.nearbyLocation.distance?.isNear && hasRecordingData;

	const dynamicStyles = StyleSheet.create({
		tabIconContainer: {
			backgroundColor: focused && colors.blackColorTranslucentLess,
		},
		tabIconImage: {
			tintColor: focused ? colors.white : colors.whiteColorTranslucentLess,
		},

		tabLogoContainer: {
			backgroundColor: focused && colors.blackColorTranslucentLess,
		},
		tabLogoImage: {
			flex: isNearAndHasRecordingData ? 0.8 : 1,
			width: '100%',
		},
	});
	if (!isLogo) {
		return (
			<View style={[styles.tabIconContainer, dynamicStyles.tabIconContainer]}>
				<Image
					source={icon}
					resizeMode="contain"
					style={[styles.tabIconImage, dynamicStyles.tabIconImage]}
				/>
			</View>
		);
	}
	if (isLogo) {
		if (typeof liveLocations !== 'undefined') {
			return (
				<View style={[styles.tabLogoContainer, dynamicStyles.tabLogoContainer]}>
					<View style={[styles.tabLogoImageContainer]}>
						<Image
							source={icon}
							resizeMode="contain"
							style={dynamicStyles.tabLogoImage}
						/>
					</View>
					{isNearAndHasRecordingData && (
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
	tabContainer: {
		height: sizes.bottomTabBarHeight,
		paddingBottom: sizes.padding,
	},
	linearGradient: {
		height: '100%',
	},
	tabLogoContainer: {
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'center',
		width: '120%',
		flex: 1,
		padding: 8,
	},
	tabLogoImageContainer: {
		width: '100%',
		flex: 1,
		paddingBottom: sizes.tabPadding / 2,
		paddingHorizontal: 4,
		alignItems: 'center',
		justifyContent: 'center',
	},
	tabLogoText: {
		color: colors.white,
		textAlign: 'center',
		fontSize: sizes.body5,
	},
	tabIconContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		width: '90%',
		height: '100%',
		padding: sizes.padding,
		flex: 1,
		aspectRatio: 1,
	},
	tabIconImage: {
		width: 30,
		height: sizes.tabIcon,
	},
});
