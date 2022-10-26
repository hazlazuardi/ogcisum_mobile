import React, { useState, useRef, useEffect } from 'react';

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
import useFetch from '../hooks/useFetch';

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

const fetcher = () => fetch(LOCATION_URL).then((res) => res.json());
const LOCATION_URL =
	'https://wmp.interaction.courses/api/v1/?apiKey=n1FVp837&mode=read&endpoint=locations&order=asc';

export default function NowPlaying() {
	const { execute, status, value, error } = useFetch(fetcher, true);

	// const fetchData = async (url) => {
	// 	await fetch(url)
	// 		.then((res) => res.json())
	// 		.then((res) => console.log(res))
	// 		.catch((e) => console.log(e));
	// };

	// useEffect(() => {
	// 	fetchData(LOCATION_URL);
	// }, []);

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
				{status === 'success' && <Text>{JSON.stringify(value)}</Text>}
				{webViewState && (
					<View style={styles.buttonContainer}>
						<Button onPress={handleReloadPress} title="Reload WebView" />
						<Button
							onPress={handleActionPress}
							title={
								!webViewState.actioned ? 'Start Playback' : 'Stop Playback'
							}
						/>
						<Button onPress={execute} title="Fetch" />
					</View>
				)}
			</View>
		</SafeAreaView>
	);
}
