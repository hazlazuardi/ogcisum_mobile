import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';

import { useTheme } from '../context/Context';
import { sizes } from '../data/theme';

/**
 * This is a React Component for OgcisumButton.
 *
 * @param {object} props - props for this component.
 * @param {string} props.text — text in the button
 * @param {Function} props.onPress — function invoked when the button is pressed
 * @param {boolean} props.fullWidth — specify whether the button should be full width or not
 * @param {boolean} props.disabled — specify whether the button should be full width or not
 * @returns {JSX.Element} React component for OgcisumButton
 */
function OgcisumButton({ text, onPress, fullWidth, disabled }) {
	const { themeColors } = useTheme();

	/** Object containing styles that use dynamic conditions. */
	const dynamicStyles = {
		buttonTouchable: {
			backgroundColor: disabled
				? themeColors.fgColorLighter
				: themeColors.textColor,
			flex: fullWidth && 1,
		},
		buttonText: {
			color: themeColors.bgColor,
		},
	};

	return (
		<View style={styles.buttonContainer}>
			<TouchableOpacity
				style={[styles.buttonTouchable, dynamicStyles.buttonTouchable]}
				onPress={onPress}
				disabled={disabled}
			>
				<Text style={[styles.buttonText, dynamicStyles.buttonText]}>
					{text}
				</Text>
			</TouchableOpacity>
		</View>
	);
}

OgcisumButton.propTypes = {
	text: PropTypes.string,
	onPress: PropTypes.func,
	fullWidth: PropTypes.bool,
	disabled: PropTypes.bool,
};

/** Stylesheet containing styles that use non-dynamic conditions. Exists so these objects won't re-render */
const styles = StyleSheet.create({
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	buttonText: {
		fontWeight: '800',
	},
	buttonTouchable: {
		alignItems: 'center',
		borderRadius: sizes.radius,
		display: 'flex',
		justifyContent: 'center',
		paddingHorizontal: sizes.padding,
		paddingVertical: sizes.padding / 2,
	},
});

export default OgcisumButton;
