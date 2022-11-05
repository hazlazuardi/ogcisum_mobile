import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

import icons from '../data/icons';
import { colors, sizes } from '../data/theme';
import Map from '../screens/Map';
import NowPlaying from '../screens/NowPlaying';
import Profile from '../screens/Profile';
import { useLocation, useSamples } from '../context/Context';
import LinearGradient from 'react-native-linear-gradient';

/** Initiate BottomTabNavigator */
const Tab = createBottomTabNavigator();
const { height } = Dimensions.get('screen');
/** This is main component for Bottom Tab Bar */
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

/** This function specify the tab options for each distinct tab */
function tabOptions(icon, isLogo) {
	return {
		tabBarIcon: ({ focused, size }) => (
			<TabIcon focused={focused} icon={icon} isLogo={isLogo} size={size} />
		),
		tabBarShowLabel: false,
		tabBarStyle: {
			height: height / 10,
		},
		tabBarItemStyle: {
			flex: isLogo ? 2 : 1,
		},
	};
}

/** This is a Tab Icon component to be passed to tabBarIcon. */
function TabIcon({ focused, icon, isLogo, size }) {
	/** Retrieve live locations from Context. */
	const { liveLocations } = useLocation();

	/** Retrieve recording data flag from Context. */
	const { hasRecordingData } = useSamples();

	const isNearAndHasRecordingData =
		liveLocations.nearbyLocation.distance?.isNear && hasRecordingData;

	/** Dynamic StyleSheet to style with conditions in mind. */
	const dynamicStyles = StyleSheet.create({
		tabIconContainer: {
			backgroundColor: focused && colors.blackColorTranslucentLess,
			padding: isLogo ? size / 3 : size / 2,
			// width: isLogo ? '120%' : '90%',
			// width: isLogo ? 140 : 60,
		},
		tabIconImage: {
			tintColor: focused ? colors.white : colors.whiteColorTranslucentLess,
			width: '100%',
			height: '100%',
		},

		tabLogoImage: {
			width: '100%',
			height: '100%',
			opacity: !focused && !isNearAndHasRecordingData ? 0.5 : 1,
		},
		tabLogoImageContainer: {
			// alignItems: 'center',
			// justifyContent: 'center',
			flex: 1.5,
			padding: isNearAndHasRecordingData ? null : sizes.tabPadding / 2,
		},
		tabLogoTextContainer: {
			width: '100%',
			height: '100%',
			flex: 1,
			// alignItems: 'center',
			// justifyContent: 'center',
			// paddingTop: isNearAndHasRecordingData && sizes.tabPadding / 2,
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
		return (
			<View style={[styles.tabLogoContainer, dynamicStyles.tabIconContainer]}>
				<View
					style={[
						styles.tabLogoImageContainer,
						dynamicStyles.tabLogoImageContainer,
					]}
				>
					<Image
						source={icon}
						resizeMode="contain"
						style={dynamicStyles.tabLogoImage}
					/>
				</View>
				{isNearAndHasRecordingData && (
					<View style={dynamicStyles.tabLogoTextContainer}>
						<Text style={styles.tabLogoText}>There's Music Nearby</Text>
					</View>
				)}
			</View>
		);
	}
}

/** StyleSheet as a wider scope to reduce re-render. */
const styles = StyleSheet.create({
	flexCenter: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	flexSpaceAround: {
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	linearGradient: {
		height: '100%',
	},
	tabLogoContainer: {
		// justifyContent: 'space-around',
		// alignItems: 'center',
		width: '100%',
		flex: 1,
		// padding: sizes.tabPadding,
	},
	tabLogoImageContainer: {
		width: '100%',
		height: '100%',
		flex: 1,
		paddingHorizontal: 4,
		// alignItems: 'center',
		// justifyContent: 'center',
	},
	tabLogoText: {
		color: colors.white,
		textAlign: 'center',
		fontSize: sizes.body5,
	},
	tabIconContainer: {
		// alignItems: 'center',
		// justifyContent: 'center',
		width: '90%',
		height: '100%',
		// padding: sizes.tabPadding,
		flex: 1,
		aspectRatio: 1,
	},
});
