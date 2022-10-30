import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useTheme } from '../context/Context';
import { sizes } from '../data/theme';

export default function TitleText({ children }) {
	const { themeColors } = useTheme();

	return (
		<Text
			style={[styles.headingProfile, { color: themeColors.headerTextColor }]}
		>
			{children}
		</Text>
	);
}

const styles = StyleSheet.create({
	headingProfile: {
		fontSize: sizes.heading,
		fontWeight: 'bold',
	},
});
