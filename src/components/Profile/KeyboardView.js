import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
	Keyboard,
	KeyboardAvoidingView,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import { useProfile, useTheme } from '../../context/Context';
import { sizes } from '../../data/theme';

/**
 * React component for Keyboard by wrapping the children and Text Input
 * obtain Profile name.
 *
 * @param {JSX.Element} children - React component(s) that are wrapped by this component.
 * @returns {JSX.Element} React component for Keyboard and TextInput.
 */
function KeyboardView({ children }) {
	const { dispatchProfile } = useProfile();
	/**
	 * Function for onChangeText function on Text Input.
	 * When the user type on the Text Field, this function
	 * will be invoked.
	 *
	 * @callback onChangeName
	 * @param {string} value - Text obtained from TextInput.
	 */
	const onChangeName = useCallback((value) => {
		dispatchProfile({ type: 'setName', name: value });
	}, []);

	const { themeColors } = useTheme();
	const dynamicStyles = StyleSheet.create({
		keyboardChildren: {
			flex: 1,
			justifyContent: 'space-around',
			padding: 24,
		},
		keyboardContainer: {
			flex: 1,
		},
		textInput: {
			backgroundColor: themeColors.fgColorLighter,
			borderRadius: sizes.radius,
			color: themeColors.fgColor,
			height: 40,
			textAlign: 'center',
		},
	});
	return (
		<SafeAreaView
			style={[
				dynamicStyles.keyboardContainer,
				{ backgroundColor: themeColors.bgColor },
			]}
		>
			<KeyboardAvoidingView behavior={'position'}>
				<ScrollView showsVerticalScrollIndicator={false}>
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<View style={dynamicStyles.keyboardChildren}>
							{children}
							<TextInput
								placeholder="Enter Your Name"
								placeholderTextColor={themeColors.fgColor}
								style={dynamicStyles.textInput}
								onChangeText={(value) => onChangeName(value)}
							/>
						</View>
					</TouchableWithoutFeedback>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

/** Props checking */
KeyboardView.propTypes = {
	children: PropTypes.element,
};

export default KeyboardView;
