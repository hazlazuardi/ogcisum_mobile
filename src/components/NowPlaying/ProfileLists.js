import React from 'react';

import { View } from 'react-native';
import OgcisumText from '../OgcisumText';
import ProfileListItem from './ProfileListItem';
import { styles } from './styles';

/**
 * React component for Profile list section.
 *
 * @returns {JSX.Element} React component for Profile list section.
 */
function ProfileLists() {
	return (
		<View style={styles.section}>
			<OgcisumText variant={'title'} text={'Currently At This Location: '} />
			<ProfileListItem isUser={true} />
			<ProfileListItem />
		</View>
	);
}

export default ProfileLists;
