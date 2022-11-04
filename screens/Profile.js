import React from 'react';

import {
	SafeAreaView,
	ScrollView,
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableWithoutFeedback,
	Keyboard,
	ImageBackground,
} from 'react-native';

import { launchImageLibrary } from 'react-native-image-picker';
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView';
import ButtonIOS from '../components/ButtonIOS';
import { useProfile, useTheme } from '../context/Context';
import { colors, sizes } from '../data/theme';

/**
 * Main React component for Profile page
 * @return {JSX.Element} React component for Profile page
 */
export default function Profile() {
	const { profile, dispatchProfile: dispatch } = useProfile();

	/** Flag to check if photo exists in the Context */
	const hasPhoto = typeof profile.photo.uri !== 'undefined';

	/**
	 * Function for onPress function on ButtonIOS
	 *
	 * @callback handleChangePress
	 * */
	async function handleChangePress() {
		await launchImageLibrary()
			.then((result) => {
				if (typeof result.assets[0] === 'object') {
					dispatch({
						type: 'setPhoto',
						photo: result.assets[0],
					});
				}
			})
			.catch((e) => console.log(e));
	}

	/** Retrieve theme colors from Context */
	const { themeColors } = useTheme();

	/** StyleSheet that uses dynamic conditions */
	const dynamicStyles = StyleSheet.create({
		themeTextColor: { color: themeColors.headerTextColor },
	});

	/** Main React Component for Profile page */
	return (
		<KeyboardView>
			<View>
				<Text style={[styles.header, dynamicStyles.themeTextColor]}>
					Edit Profile
				</Text>
				<Text style={[styles.subtitle, dynamicStyles.themeTextColor]}>
					Mirror, Mirror On The Wall...
				</Text>
			</View>
			<Photo photo={profile.photo} onPress={handleChangePress}>
				<ButtonIOS
					onPress={handleChangePress}
					text={hasPhoto ? 'Change Photo' : 'Add Photo'}
				/>
			</Photo>
		</KeyboardView>
	);
}

/**
 * React component for Keyboard by wrapping the children and Text Input
 * obtain Profile name
 * @param {JSX.Element} children - React component(s) that are wrapped by this component
 * @return {JSX.Element} React component for Keyboard and TextInput
 */
function KeyboardView({ children }) {
	const { dispatchProfile } = useProfile();
	function handleChange(value) {
		dispatchProfile({ type: 'setName', name: value });
	}
	const { themeColors } = useTheme();

	const dynamicStyles = StyleSheet.create({
		keyboardContainer: {
			flex: 1,
		},
		keyboardChildren: {
			padding: 24,
			flex: 1,
			justifyContent: 'space-around',
		},
		textInput: {
			height: 40,
			borderRadius: sizes.radius,
			textAlign: 'center',
			backgroundColor: themeColors.fgColorLighter,
			color: themeColors.fgColor,
		},
	});
	return (
		<SafeAreaView
			style={[
				dynamicStyles.keyboardContainer,
				{ backgroundColor: themeColors.bgColor },
			]}
		>
			<KeyboardAvoidingView behavior={'position'}>
				<ScrollView showsVerticalScrollIndicator={false}>
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<View style={dynamicStyles.keyboardChildren}>
							{children}
							<TextInput
								placeholder="Enter Your Name"
								placeholderTextColor={themeColors.fgColor}
								style={dynamicStyles.textInput}
								onChangeText={(value) => handleChange(value)}
							/>
						</View>
					</TouchableWithoutFeedback>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

/**
 * Main React component for Profile page
 * @param {Object} photo - Object containing Photo data
 * @param {JSX.Element} children - React component(s) that are wrapped by this component
 * @param {handleChangePress} onPress - A callback to handle onPress event
 * @return {JSX.Element} React component for Profile page
 */
function Photo({ photo, children, onPress }) {
	const hasPhoto = typeof photo.uri !== 'undefined';
	if (hasPhoto) {
		return (
			<TouchableWithoutFeedback onPress={onPress}>
				<ImageBackground
					style={styles.photoFullView}
					resizeMode="cover"
					source={{
						uri: photo.uri,
					}}
				>
					{children}
				</ImageBackground>
			</TouchableWithoutFeedback>
		);
	}
	return (
		<TouchableWithoutFeedback onPress={onPress}>
			<View style={styles.photoEmptyView}>{children}</View>
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	photoFullView: {
		overflow: 'hidden',
		borderWidth: 4,
		borderRadius: 10,
		borderColor: colors.light.fgColorLighter,
		width: '100%',
		aspectRatio: 3 / 4,
		flex: 1,
		display: 'flex',
		justifyContent: 'flex-end',
		alignItems: 'center',
		paddingBottom: sizes.padding,
		marginBottom: sizes.padding,
	},
	photoEmptyView: {
		borderWidth: 3,
		borderRadius: 10,
		borderColor: '#999',
		borderStyle: 'dashed',
		width: '100%',
		aspectRatio: 3 / 4,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: sizes.padding,
	},
	header: {
		fontSize: sizes.body1,
		fontWeight: 'bold',
	},
	subtitle: {
		fontSize: sizes.body3,
		color: colors.light.fgColor,
		marginBottom: sizes.padding,
	},
});
