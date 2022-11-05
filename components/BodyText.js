import React from 'react';
import { StyleSheet, Text } from 'react-native';

import PropTypes from 'prop-types';

import { useTheme } from '../context/Context';
import { sizes } from '../data/theme';

/**
 * React component for Title Text by wrapping the text.
 * @param {JSX.Element} text - React component(s) that are wrapped by this component
 * @return {JSX.Element} React component for Text
 */
function BodyText({ text }) {
	/** Retrieve theme colors from Context */
	const { themeColors } = useTheme();

	/** Style object for dynamic styling */
	const dynamicStyles = StyleSheet.create({
		bodyText: {
			color: themeColors.textColor,
		},
	});

	return <Text style={[styles.bodyText, dynamicStyles.bodyText]}>{text}</Text>;
}

/** Props checking */
BodyText.propTypes = {
	text: PropTypes.string,
};

/** Style object for static StyleSheet */
const styles = StyleSheet.create({
	bodyText: {
		fontSize: sizes.body3,
	},
});

export default BodyText;
