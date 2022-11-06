import React from 'react';
import PropTypes from 'prop-types';
import { ImageBackground, TouchableWithoutFeedback, View } from 'react-native';
import { styles } from './styles';

/**
 * React component for Profile Photo section.
 *
 * @param {object} props - props for this component.
 * @param {object} props.photo - Object containing Photo data.
 * @param {JSX.Element} props.children - React component(s) that are wrapped by this component.
 * @param {Function} props.onPress - A callback to handle onPress event.
 * @returns {JSX.Element} React component for Profile Photo section.
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

export default Photo;
