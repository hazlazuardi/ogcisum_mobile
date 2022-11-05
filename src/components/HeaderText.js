import React from 'react';
import { StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';

import { useTheme } from '../context/Context';
import { sizes } from '../data/theme';

function HeaderText({ text }) {
	const { themeColors } = useTheme();
	return (
		<Text style={[styles.headingLocation, { color: themeColors.textColor }]}>
			{text}
		</Text>
	);
}

HeaderText.propTypes = {
	text: PropTypes.string,
};

const styles = StyleSheet.create({
	headingLocation: {
		fontSize: sizes.body1,
		fontWeight: 'bold',
		marginBottom: 8,
	},
});

export default HeaderText;
