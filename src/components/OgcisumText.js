import React from 'react';
import { StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';

import { useTheme } from '../context/Context';
import { sizes } from '../data/theme';

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
	variant: PropTypes.string,
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
