import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useTheme } from '../context/Context';
import { sizes } from '../data/theme';

export default function BodyText({ children }) {
	const { themeColors } = useTheme();

	return (
		<Text
			style={[
				styles.subHeadingLocation,
				{ color: themeColors.headerTextColor },
			]}
		>
			{children}
		</Text>
	);
}

const styles = StyleSheet.create({
	subHeadingLocation: {
		fontSize: sizes.body3,
	},
});
