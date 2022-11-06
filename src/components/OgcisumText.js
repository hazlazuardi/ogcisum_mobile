import React from 'react';
import { StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';

import { useTheme } from '../context/Context';
import { sizes } from '../data/theme';

/**
 * This is a React Component for OgcisumText.
 *
 * @param {object} props - props for this component.
 * @param {string} props.variant — specify the variant of the Text.
 * @param {string} props.text — text for the Text component.
 * @returns {JSX.Element} React component for OgcisumText.
 */
function OgcisumText({ variant, text }) {
	const { themeColors } = useTheme();

	let style;
	if (variant === 'header') {
		style = {
			...styles.header,
			color: themeColors.textColor,
		};
	}
	if (variant === 'title') {
		style = {
			...styles.titleText,
			color: themeColors.textColor,
		};
	}
	if (variant === 'body') {
		style = {
			...styles.bodyText,
			color: themeColors.textColor,
		};
	}

	return <Text style={style}>{text}</Text>;
}

OgcisumText.propTypes = {
	variant: PropTypes.string.isRequired,
	text: PropTypes.string,
};

const styles = StyleSheet.create({
	bodyText: {
		fontSize: sizes.body3,
	},
	header: {
		fontSize: sizes.body1,
		fontWeight: 'bold',
		marginBottom: 8,
	},
	titleText: {
		fontSize: sizes.heading,
		fontWeight: 'bold',
	},
});

export default OgcisumText;
