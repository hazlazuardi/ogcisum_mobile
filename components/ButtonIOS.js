import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, sizes } from '../data/theme';

export default function ButtonIOS({ text, onPress }) {
	const styles = StyleSheet.create({
		buttonContainer: {
			flexDirection: 'row',
			justifyContent: 'space-around',
		},
		buttonBackground: {
			backgroundColor: colors.light.fgColor,
			paddingHorizontal: sizes.padding,
			paddingVertical: sizes.padding / 2,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			borderRadius: sizes.radius,
		},
		buttonText: {
			color: colors.white,
			fontWeight: '800',
		},
	});
	return (
		<View style={styles.buttonContainer}>
			{/* <Button onPress={handleReloadPress} title="Reload WebView" /> */}
			<TouchableOpacity style={styles.buttonBackground} onPress={onPress}>
				<Text style={styles.buttonText}>{text}</Text>
			</TouchableOpacity>
		</View>
	);
}
