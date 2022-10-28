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
} from 'react-native';

import { launchImageLibrary } from 'react-native-image-picker';
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView';
import ButtonIOS from '../components/ButtonIOS';
import { useProfile } from '../context/Context';
import { colors, sizes } from '../data/theme';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
	container: {
		padding: 20,
		justifyContent: 'space-around',
	},
	photoFullView: {
		marginBottom: 20,
	},
	photoEmptyView: {
		borderWidth: 3,
		borderRadius: 10,
		borderColor: '#999',
		borderStyle: 'dashed',
		height: height / 2,
		marginBottom: 20,
	},
	photoFullImage: {
		width: '100%',
		borderRadius: 10,
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
	},
	subtitle: {
		fontSize: sizes.body3,
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

	return (
		<KeyboardAvoid>
			<SafeAreaView>
				<Text style={styles.header}>Edit Profile</Text>
				<Text style={styles.subtitle}>Mirror, Mirror On The Wall...</Text>
				<Photo photo={profile.photo} />
				<ButtonIOS
					onPress={handleChangePress}
					text={hasPhoto ? 'Change Photo' : 'Add Photo'}
				/>
			</SafeAreaView>
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
			backgroundColor: colors.light.fgColorLighter,
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
	return (
		<KeyboardAvoidingView behavior={'position'}>
			<ScrollView>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<View style={stl.inner}>
						{children}
						<TextInput
							placeholder="Enter Your Name"
							placeholderTextColor={colors.light.fgColor}
							style={stl.textInput}
							onChangeText={(value) => handleChange(value)}
						/>
					</View>
				</TouchableWithoutFeedback>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

function Photo({ photo }) {
	const hasPhoto = typeof photo.uri !== 'undefined';
	if (hasPhoto) {
		return (
			<View style={styles.photoFullView}>
				<Image
					style={styles.photoFullImage}
					resizeMode="cover"
					source={{
						uri: photo.uri,
						width: width,
						height: height / 2,
					}}
				/>
			</View>
		);
	} else {
		return <View style={styles.photoEmptyView} />;
	}
}
