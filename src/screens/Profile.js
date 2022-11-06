import React from 'react';

import { View, Text, StyleSheet } from 'react-native';

import { launchImageLibrary } from 'react-native-image-picker';
import OgcisumButton from '../components/OgcisumButton';
import { useProfile, useTheme } from '../context/Context';
import KeyboardView from '../components/Profile/KeyboardView';
import { styles } from '../components/Profile/styles';
import Photo from '../components/Profile/Photo';

/**
 * Main React component for Profile page
 *
 * @returns {JSX.Element} React component for Profile page
 */
function Profile() {
	const { profile, dispatchProfile: dispatch } = useProfile();

	/** Flag to check if photo exists in the Context */
	const hasPhoto = typeof profile.photo.uri !== 'undefined';

	/**
	 * Async Function for onPress function on OgcisumButton
	 *
	 * @callback onPressChangePhoto
	 */
	async function onPressChangePhoto() {
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
				<Photo photo={profile.photo} onPress={onPressChangePhoto}>
					<OgcisumButton
						onPress={onPressChangePhoto}
						text={hasPhoto ? 'Change Photo' : 'Add Photo'}
					/>
				</Photo>
			</View>
		</KeyboardView>
	);
}

export default Profile;
