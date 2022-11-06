import React from 'react';

import PropTypes from 'prop-types';

import { useProfile, useTheme } from '../../context/Context';
import { Image, View } from 'react-native';

import OgcisumText from '../OgcisumText';
import { styles } from './styles';

/**
 * React component for each Profile list item.
 *
 * @param {object} props - Object containing props for this component.
 * @param {boolean} props.isUser - Flag to indicate whether the item is-
 * showing user profile or not.
 * @returns {JSX.Element} React component for Profile list item.
 */
function ProfileListItem({ isUser }) {
	const { profile } = useProfile();
	const { themeIcons } = useTheme();
	const userHasPhoto = 'uri' in profile.photo;
	let imageSource;
	if (isUser && userHasPhoto) {
		imageSource = { uri: profile.photo.uri, width: 100, height: 100 };
	} else {
		imageSource = themeIcons.iconSmiley;
	}
	return (
		<View style={styles.profileCard}>
			<View style={styles.profilePictureContainer}>
				<Image
					source={imageSource}
					resizeMode="cover"
					style={styles.profilePicture}
				/>
			</View>
			<OgcisumText
				variant={'body'}
				text={isUser ? profile.name || 'Enter Your Name' : 'And Others...'}
			/>
		</View>
	);
}

ProfileListItem.propTypes = {
	isUser: PropTypes.bool,
};

export default ProfileListItem;
