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
			backgroundColor: colors.purpleColorLighter,
			paddingHorizontal: sizes.padding,
			paddingVertical: sizes.padding / 2,
			width: '100%',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			borderRadius: sizes.radius,
		},
		buttonText: {
			color: colors.white,
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
