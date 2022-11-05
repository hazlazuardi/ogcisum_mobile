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
function TitleText({ text }) {
	/** Retrieve theme colors from Context */
	const { themeColors } = useTheme();

	/** Style object for dynamic styling */
	const dynamicStyles = StyleSheet.create({
		titleText: {
			color: themeColors.textColor,
		},
	});

	return (
		<Text style={[styles.titleText, dynamicStyles.titleText]}>{text}</Text>
	);
}

/** Props checking */
TitleText.propTypes = {
	text: PropTypes.string,
};

/** Style object for static StyleSheet */
const styles = StyleSheet.create({
	titleText: {
		fontSize: sizes.heading,
		fontWeight: 'bold',
	},
});

export default TitleText;
