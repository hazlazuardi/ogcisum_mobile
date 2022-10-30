import React from 'react';
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	useColorScheme,
	View,
} from 'react-native';
import { useTheme } from '../context/Context';
import { colors, sizes } from '../data/theme';

export default function ButtonIOS({ text, onPress, fullWidth }) {
	const { themeColors } = useTheme();

	return (
		<View style={styles.buttonContainer}>
			{/* <Button onPress={handleReloadPress} title="Reload WebView" /> */}
			<TouchableOpacity
				style={[
					styles.buttonBackground,
					{
						backgroundColor: themeColors.headerTextColor,
						flex: fullWidth && 1,
					},
				]}
				onPress={onPress}
			>
				<Text style={[styles.buttonText, { color: themeColors.bgColor }]}>
					{text}
				</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	buttonBackground: {
		paddingHorizontal: sizes.padding,
		paddingVertical: sizes.padding / 2,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: sizes.radius,
	},
	buttonText: {
		fontWeight: '800',
	},
});
