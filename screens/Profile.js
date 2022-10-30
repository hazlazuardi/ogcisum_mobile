import React from 'react';

import {
	SafeAreaView,
	ScrollView,
	View,
	Image,
	Dimensions,
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

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
	container: {
		padding: 20,
		justifyContent: 'space-around',
	},
	photoFullView: {
		overflow: 'hidden',
		borderWidth: 4,
		borderRadius: 10,
		borderColor: colors.light.fgColorLighter,
		height: height / 2,
		flex: 1,
		display: 'flex',
		justifyContent: 'flex-end',
		alignItems: 'center',
		paddingBottom: sizes.padding,
		marginBottom: sizes.padding,
	},
	photoFullImage: {},
	photoEmptyView: {
		borderWidth: 3,
		borderRadius: 10,
		borderColor: '#999',
		borderStyle: 'dashed',
		height: height / 2,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: sizes.padding,
	},
	buttonView: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	inputContainer: {
		flex: 1,
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

export default function Profile() {
	const { profile, dispatchProfile: dispatch } = useProfile();

	console.log('ctx: ', profile);
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

	const hasPhoto = typeof profile.photo.uri !== 'undefined';
	const { themeColors } = useTheme();
	return (
		<KeyboardAvoid>
			{/* <SafeAreaView style={{ backgroundColor: themeColors.bgColor }}> */}
			<View>
				<Text style={[styles.header, { color: themeColors.headerTextColor }]}>
					Edit Profile
				</Text>
				<Text style={[styles.subtitle, { color: themeColors.headerTextColor }]}>
					Mirror, Mirror On The Wall...
				</Text>
			</View>
			{/* <Photo photo={profile.photo} /> */}
			<Photo photo={profile.photo} onPress={handleChangePress}>
				<ButtonIOS
					onPress={handleChangePress}
					text={hasPhoto ? 'Change Photo' : 'Add Photo'}
				/>
			</Photo>
			{/* </SafeAreaView> */}
		</KeyboardAvoid>
	);
}

function KeyboardAvoid({ children }) {
	const stl = StyleSheet.create({
		container: {
			flex: 1,
		},
		inner: {
			padding: 24,
			flex: 1,
			justifyContent: 'space-around',
		},
		header: {
			fontSize: 36,
			marginBottom: 48,
		},
		textInput: {
			height: 40,
			borderRadius: sizes.radius,
			textAlign: 'center',
			// borderColor: '#000000',
			// borderBottomWidth: 1,
			marginBottom: 36,
			color: colors.white,
		},
	});
	const { dispatchProfile } = useProfile();
	function handleChange(value) {
		dispatchProfile({ type: 'setName', name: value });
	}
	const { themeColors } = useTheme();
	return (
		<KeyboardAvoidingView behavior={'position'}>
			<SafeAreaView
				style={{ height: '100%', backgroundColor: themeColors.bgColor }}
			>
				<ScrollView>
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<View style={stl.inner}>
							{children}
							<TextInput
								placeholder="Enter Your Name"
								placeholderTextColor={{ color: themeColors.fgColor }}
								style={[
									stl.textInput,
									{
										backgroundColor: themeColors.fgColorLighter,
										color: themeColors.fgColor,
									},
								]}
								onChangeText={(value) => handleChange(value)}
							/>
						</View>
					</TouchableWithoutFeedback>
				</ScrollView>
			</SafeAreaView>
		</KeyboardAvoidingView>
	);
}

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
						width: width,
						height: height / 2,
					}}
				>
					{children}
				</ImageBackground>
			</TouchableWithoutFeedback>
		);
	} else {
		// return <View style={styles.photoEmptyView} />;
		return (
			<TouchableWithoutFeedback onPress={onPress}>
				<View style={styles.photoEmptyView}>{children}</View>
			</TouchableWithoutFeedback>
		);
	}
}
