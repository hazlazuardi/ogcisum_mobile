import React, { useState, useRef } from 'react';

import {
	SafeAreaView,
	ScrollView,
	View,
	Image,
	Dimensions,
	Text,
	Button,
} from 'react-native';

import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

const styles = {
	container: {
		padding: 20,
	},
	webViewContainer: {
		height: height / 2,
		borderWidth: 3,
		marginBottom: 20,
	},
	webView: {},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
};

export default function NowPlaying() {
	const [webViewState, setWebViewState] = useState({
		loaded: false,
		actioned: false,
	});
	const webViewRef = useRef();

	function webViewLoaded() {
		setWebViewState({
			...webViewState,
			loaded: true,
		});
	}

	function handleReloadPress() {
		webViewRef.current.reload();
	}

	function handleActionPress() {
		if (!webViewState.actioned) {
			webViewRef.current.injectJavaScript('startPlayback()');
		} else {
			webViewRef.current.injectJavaScript('stopPlayback()');
		}
		setWebViewState({
			...webViewState,
			actioned: !webViewState.actioned,
		});
	}

	return (
		<SafeAreaView>
			<View style={styles.container}>
				{/* <View style={styles.webViewContainer}> */}
				<WebView
					ref={(ref) => (webViewRef.current = ref)}
					originWhitelist={['*']}
					source={{
						uri: 'https://wmp.interaction.courses/test-webview/',
					}}
					pullToRefreshEnabled={true}
					onLoad={webViewLoaded}
					style={styles.webView}
				/>
				{/* </View> */}
				{webViewState && (
					<View style={styles.buttonContainer}>
						<Button onPress={handleReloadPress} title="Reload WebView" />
						<Button
							onPress={handleActionPress}
							title={
								!webViewState.actioned ? 'Start Playback' : 'Stop Playback'
							}
						/>
					</View>
				)}
			</View>
		</SafeAreaView>
	);
}
