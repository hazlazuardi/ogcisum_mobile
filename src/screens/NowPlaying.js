import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useIsFocused } from '@react-navigation/native';
import {
	SafeAreaView,
	ScrollView,
	View,
	StyleSheet,
	RefreshControl,
	LogBox,
} from 'react-native';
import { WebView } from 'react-native-webview';

import { useLocation, useSamples, useTheme } from '../context/Context';

import OgcisumText from '../components/OgcisumText';

import { styles } from '../components/NowPlaying/styles';
import ProfileLists from '../components/NowPlaying/ProfileLists';
import MusicPlayer from '../components/NowPlaying/MusicPlayer';

/**
 * React component for main Now Playing page
 *
 * @returns {JSX.Element} React component for main Now Playing page.
 */
function NowPlaying() {
	/** 
	 * Ignore all warning logs related to WMP API
	 * not updating the samples yet.
	 */
	LogBox.ignoreAllLogs();

	const {
		recordingData,
		hasRecordingData,
		fetchSharedSamples,
		statusSharedSamples,
	} = useSamples();
	const { liveLocations } = useLocation();
	const { nearbyLocation } = liveLocations;

	/** useState to store webView loaded and actioned */
	const [webViewState, setWebViewState] = useState({
		loaded: false,
		actioned: false,
	});
	const webViewRef = useRef();

	/** useState for pull to refresh functionality */
	const [refreshing, setRefreshing] = useState(false);

	/**
	 * Function for onRefresh function on Refresh Control.
	 * When the user pull the screen down, this function
	 * will be invoked.
	 *
	 * @callback onRefreshPull
	 */
	const onRefreshPull = useCallback(() => {
		webViewRef.current.reload();
		setRefreshing(true);
		fetchSharedSamples();
		if (webViewState.actioned === true) {
			setWebViewState({
				...webViewState,
				actioned: false,
			});
		}
		if (statusSharedSamples === 'success') {
			setRefreshing(false);
		}
	}, [webViewState.actioned, webViewState.loaded]);

	/** Flag for current focus state of the screen. */
	const isFocused = useIsFocused();

	/**
	 * Effect for reloading the WebView.
	 * When the user changes screen, this
	 * effect will run.
	 */
	useEffect(() => {
		if (isFocused) {
			webViewRef.current.reload();
		}
	}, [isFocused]);


	/**
	 * Function for onLoad function on WebView.
	 * When the WebView is loaded, this function
	 * will be invoked.
	 *
	 * @callback onLoadWebview
	 */
	const onLoadWebview = useCallback(() => {
		setWebViewState({
			...webViewState,
			loaded: true,
		});
	}, [webViewState.loaded, webViewState.actioned]);

	/**
	 * Function for onPress function on PlayButton.
	 * When the Play Button is pressed, this function
	 * will be invoked.
	 *
	 * @callback onPressPlay
	 */
	const onPressPlay = useCallback(() => {
		const stringifiedSamples = JSON.stringify(recordingData);
		if (!webViewState.actioned) {
			webViewRef.current.injectJavaScript(`setupParts(${stringifiedSamples})`);
			webViewRef.current.injectJavaScript('startPlayback()');
		} else {
			webViewRef.current.injectJavaScript('stopPlayback()');
		}
		setWebViewState({
			...webViewState,
			actioned: !webViewState.actioned,
		});
	}, [webViewState.actioned, webViewState.loaded]);

	/** This is to set style dynamically depending on color scheme */
	const { themeColors } = useTheme();
	const dynamicStyles = StyleSheet.create({
		safeContainer: {
			backgroundColor: themeColors.bgColor,
		},
	});
	return (
		<SafeAreaView style={[styles.safeContainer, dynamicStyles.safeContainer]}>
			<ScrollView
				contentContainerStyle={styles.container}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefreshPull}
						tintColor={themeColors.fgColor}
						title={'Fetching samples...'}
						titleColor={themeColors.fgColor}
					/>
				}
				horizontal={false}
				showsVerticalScrollIndicator={false}
			>
				{hasRecordingData ? (
					<>
						<MusicPlayer
							nearbyLocation={nearbyLocation}
							webViewState={webViewState}
							onPressPlay={onPressPlay}
							hasRecordingData={hasRecordingData}
						/>
						<ProfileLists />
					</>
				) : (
					<View style={styles.section}>
						<OgcisumText variant={'header'} text={'No music nearby'} />
						<OgcisumText variant={'body'} text={"Oh it's so quiet here..."} />
					</View>
				)}
			</ScrollView>
			<View>
				<WebView
					ref={(ref) => (webViewRef.current = ref)}
					originWhitelist={['*']}
					source={{
						// uri: 'https://wmp.interaction.courses/test-webview/',
						uri: 'https://wmp.interaction.courses/playback-webview/',
					}}
					pullToRefreshEnabled={true}
					onLoad={onLoadWebview}
					style={styles.webView}
					ignoreSilentHardwareSwitch={true}
				/>
			</View>
		</SafeAreaView>
	);
}

export default NowPlaying;
