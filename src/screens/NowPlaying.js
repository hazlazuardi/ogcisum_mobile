import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useIsFocused } from '@react-navigation/native';
import {
	SafeAreaView,
	ScrollView,
	View,
	Image,
	StyleSheet,
	RefreshControl,
} from 'react-native';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';

import {
	useLocation,
	useProfile,
	useSamples,
	useTheme,
} from '../context/Context';

import { colors, sizes } from '../data/theme';

import OgcisumButton from '../components/OgcisumButton';
import OgcisumText from '../components/OgcisumText';

/**
 * React component for main Now Playing page
 *
 * @return {JSX.Element} React component for main Now Playing page.
 */
function NowPlaying() {
	const { recordingData, hasRecordingData, fetchSTL, statusSTL } = useSamples();
	const { liveLocations } = useLocation();
	const { nearbyLocation } = liveLocations;

	/** useState for pull to refresh functionality */
	const [refreshing, setRefreshing] = useState(false);

	/**
	 * Function for onRefresh function on Refresh Control.
	 * When the user pull the screen down, this function
	 * will be invoked.
	 *
	 * @callback onRefresh
	 * */
	const onRefresh = useCallback(() => {
		setRefreshing(true);
		fetchSTL();
		if (statusSTL === 'success') {
			setRefreshing(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/** Reload webView when the screen changes */
	const isFocused = useIsFocused();
	useEffect(() => {
		if (isFocused) {
			webViewRef.current.reload();
		}
	}, [isFocused]);

	/** useState to store webView loaded or actioned */
	const [webViewState, setWebViewState] = useState({
		loaded: false,
		actioned: false,
	});
	const webViewRef = useRef();

	/**
	 * Function for onPress function on OgcisumButton
	 *
	 * @callback onLoadWebview
	 * */
	const onLoadWebview = useCallback(() => {
		setWebViewState({
			...webViewState,
			loaded: true,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/** This function is invoked when play button is pressed (onPress) */
	function handleActionPress() {
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
	}

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
						onRefresh={onRefresh}
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
							handlePlay={handleActionPress}
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
				/>
			</View>
		</SafeAreaView>
	);
}

function ProfileListItem({ isUser }) {
	const { profile } = useProfile();
	const { themeIcons } = useTheme();
	const userHasPhoto = 'uri' in profile.photo;
	let imageSource;
	if (isUser && userHasPhoto) {
		imageSource = { uri: profile.photo.uri, width: 100, height: 100 };
	} else {
		imageSource = themeIcons.iconSmiley;
	}
	return (
		<View style={styles.profileCard}>
			<View style={styles.profilePictureContainer}>
				<Image
					source={imageSource}
					resizeMode="cover"
					style={styles.profilePicture}
				/>
			</View>
			<OgcisumText
				variant={'body'}
				text={isUser ? profile.name || 'Enter Your Name' : 'And Others...'}
			/>
		</View>
	);
}

ProfileListItem.propTypes = {
	isUser: PropTypes.bool,
};

function ProfileLists() {
	return (
		<View style={styles.section}>
			<OgcisumText variant={'title'} text={'Currently At This Location: '} />
			<ProfileListItem isUser={true} />
			<ProfileListItem />
		</View>
	);
}

function PlayButton({ webViewState, handlePlay }) {
	let buttonText;
	if (webViewState.loaded && !webViewState.actioned) {
		buttonText = 'Play Music';
	} else if (webViewState.loaded && webViewState.actioned) {
		buttonText = 'Stop Music';
	} else {
		buttonText = 'Loading Samples..';
	}
	return (
		<OgcisumButton
			text={buttonText}
			onPress={handlePlay}
			fullWidth
			disabled={!webViewState.loaded}
		/>
	);
}

PlayButton.propTypes = {
	webViewState: PropTypes.object,
	handlePlay: PropTypes.func,
};

function MusicPlayer({ nearbyLocation, webViewState, handlePlay }) {
	const { themeIcons } = useTheme();
	return (
		<View style={styles.section}>
			<View style={[styles.headerContainer]}>
				<View style={[styles.flexRow, styles.groupView]}>
					<View style={styles.headerIconContainer}>
						<Image
							source={themeIcons.iconPin}
							style={styles.headerIcon}
							resizeMode="contain"
						/>
					</View>
					<View style={styles.headerTextContainer}>
						<OgcisumText variant={'header'} text={nearbyLocation.location} />
						<OgcisumText
							variant={'body'}
							text={`${nearbyLocation.suburb}, ${nearbyLocation.state}`}
						/>
					</View>
				</View>
				{webViewState && (
					<PlayButton handlePlay={handlePlay} webViewState={webViewState} />
				)}
			</View>
		</View>
	);
}

MusicPlayer.propTypes = {
	nearbyLocation: PropTypes.object,
	webViewState: PropTypes.object,
	handlePlay: PropTypes.func,
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-between',
		paddingHorizontal: sizes.padding,
	},
	flexRow: {
		display: 'flex',
		flexDirection: 'row',
	},

	groupView: {
		paddingBottom: sizes.padding,
	},
	headerContainer: {
		height: sizes.headerHeight,
		// backgroundColor: 'red',
	},
	headerIcon: {
		height: '55%',
		width: '100%',
	},
	headerIconContainer: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
		// backgroundColor: 'green',
	},
	headerTextContainer: {
		flex: 3,
		justifyContent: 'center',
	},
	profileCard: {
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'row',
		paddingTop: sizes.padding,
	},
	profilePicture: {
		borderRadius: 1000,
		height: '100%',
		width: '100%',
	},
	profilePictureContainer: {
		alignItems: 'center',
		aspectRatio: 1,
		borderColor: colors.light.fgColorLighter,
		borderRadius: 1000,
		borderWidth: 3,
		justifyContent: 'center',
		marginRight: sizes.padding,
		width: '20%',
	},
	safeContainer: {
		flex: 1,
	},
	section: {
		paddingVertical: sizes.padding,
		// backgroundColor: 'green',
	},
});

export default NowPlaying;
