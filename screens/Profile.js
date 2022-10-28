import React, { useState } from 'react';

import {
	SafeAreaView,
	ScrollView,
	View,
	Image,
	Dimensions,
	Text,
	Button,
	StyleSheet,
	TextInput,
	Platform,
	TouchableWithoutFeedback,
	Keyboard,
} from 'react-native';

import { launchImageLibrary } from 'react-native-image-picker';
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView';
import ButtonIOS from '../components/ButtonIOS';
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
		fontSize: sizes.heading,
	},
});

export default function Profile() {
	const [photoState, setPhotoState] = useState({});

	console.log('photoState: ', photoState);
	async function handleChangePress() {
		await launchImageLibrary()
			.then((result) => {
				if (typeof result.assets[0] === 'object') {
					setPhotoState(result.assets[0]);
				}
			})
			.catch((e) => console.log(e));
	}

	const hasPhoto = typeof photoState.uri !== 'undefined';

	function Photo(props) {
		if (hasPhoto) {
			return (
				<View style={styles.photoFullView}>
					<Image
						style={styles.photoFullImage}
						resizeMode="cover"
						source={{
							uri: photoState.uri,
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

	const [text, onChangeText] = useState('Useless Text');

	return (
		// <KeyboardAvoidingView enabled behavior={'padding'} style={styles.container}>
		// 	<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
		// 		<View style={styles.container}>
		// 			<Text>Edit Profile</Text>
		// 			<Text>Mirror, Mirror On The Wall...</Text>
		// 			<Photo />
		// 			<View style={styles.buttonView}>
		// 				<Button
		// 					onPress={handleChangePress}
		// 					title={hasPhoto ? 'Change Photo' : 'Add Photo'}
		// 				/>
		// 				{/* {hasPhoto && (
		// 				<Button onPress={handleRemovePress} title="Remove Photo" />
		// 			)} */}
		// 			</View>
		// 			<TextInput
		// 				style={styles.input}
		// 				onChangeText={onChangeText}
		// 				value={text}
		// 			/>
		// 		</View>
		// 	</TouchableWithoutFeedback>
		// </KeyboardAvoidingView>
		<KeyboardAvoid>
			<SafeAreaView>
				<Text style={styles.header}>Header</Text>
				<Photo />
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
			backgroundColor: colors.purpleColorLighter,
			borderRadius: sizes.radius,
			textAlign: 'center',
			// borderColor: '#000000',
			// borderBottomWidth: 1,
			marginBottom: 36,
			color: colors.white,
		},
	});
	return (
		<KeyboardAvoidingView behavior={'position'}>
			<ScrollView>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<View style={stl.inner}>
						{children}
						<TextInput placeholder="Username" style={stl.textInput} />
					</View>
				</TouchableWithoutFeedback>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
