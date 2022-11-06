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

import PropTypes from 'prop-types';

import { launchImageLibrary } from 'react-native-image-picker';
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView';
import ButtonIOS from '../components/OgcisumButton';
import { useProfile, useTheme } from '../context/Context';
import { colors, sizes } from '../data/theme';

/**
 * Main React component for Profile page
 *
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
		themeTextColor: { color: themeColors.textColor },
	});

	/** Main React Component for Profile page */
	return (
		<KeyboardView>
			<View>
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
			</View>
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
		keyboardChildren: {
			flex: 1,
			justifyContent: 'space-around',
			padding: 24,
		},
		keyboardContainer: {
			flex: 1,
		},
		textInput: {
			backgroundColor: themeColors.fgColorLighter,
			borderRadius: sizes.radius,
			color: themeColors.fgColor,
			height: 40,
			textAlign: 'center',
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

/** Props checking */
KeyboardView.propTypes = {
	children: PropTypes.element,
};

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

Photo.propTypes = {
	photo: PropTypes.object,
	children: PropTypes.element,
	onPress: PropTypes.func,
};

const styles = StyleSheet.create({
	header: {
		fontSize: sizes.body1,
		fontWeight: 'bold',
	},
	photoEmptyView: {
		alignItems: 'center',
		aspectRatio: 3 / 4,
		borderColor: colors.grey,
		borderRadius: 10,
		borderStyle: 'dashed',
		borderWidth: 3,
		display: 'flex',
		justifyContent: 'center',
		marginBottom: sizes.padding,
		width: '100%',
	},
	photoFullView: {
		alignItems: 'center',
		aspectRatio: 3 / 4,
		borderColor: colors.light.fgColorLighter,
		borderRadius: 10,
		borderWidth: 4,
		display: 'flex',
		flex: 1,
		justifyContent: 'flex-end',
		marginBottom: sizes.padding,
		overflow: 'hidden',
		paddingBottom: sizes.padding,
		width: '100%',
	},
	subtitle: {
		color: colors.light.fgColor,
		fontSize: sizes.body3,
		marginBottom: sizes.padding,
	},
});
