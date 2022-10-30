import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useTheme } from '../context/Context';
import { sizes } from '../data/theme';

export default function HeaderText({ children }) {
	const { themeColors } = useTheme();
	return (
		<Text
			style={[styles.headingLocation, { color: themeColors.headerTextColor }]}
		>
			{children}
		</Text>
	);
}

const styles = StyleSheet.create({
	headingLocation: {
		fontSize: sizes.body1,
		fontWeight: 'bold',
		marginBottom: 8,
	},
});
