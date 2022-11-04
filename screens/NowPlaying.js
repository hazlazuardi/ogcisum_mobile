import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useIsFocused } from '@react-navigation/native';
import {
	SafeAreaView,
	ScrollView,
	View,
	Image,
	Dimensions,
	StyleSheet,
	RefreshControl,
} from 'react-native';

import { WebView } from 'react-native-webview';
import {
	useLocation,
	useProfile,
	useSamples,
	useTheme,
} from '../context/Context';
import { colors, sizes } from '../data/theme';
import ButtonIOS from '../components/ButtonIOS';
import HeaderText from '../components/HeaderText';
import BodyText from '../components/BodyText';
import TitleText from '../components/TitleText';

const { height } = Dimensions.get('window');
export default function NowPlaying() {
	const { recordingData, hasRecordingData, fetchSTL, statusSTL } = useSamples();
	const { liveLocations } = useLocation();
	const { nearbyLocation } = liveLocations;

	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		console.log('refresh');
		fetchSTL();
		console.log(statusSTL);
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

	/** This function is invoked when webView is loaded (onLoad) */
	function webViewLoaded() {
		setWebViewState({
			...webViewState,
			loaded: true,
		});
	}

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
						<HeaderText>No music nearby</HeaderText>
						<BodyText>Oh it's so quiet here...</BodyText>
					</View>
				)}
			</ScrollView>
			<View style={false && styles.webViewContainer}>
				<WebView
					ref={(ref) => (webViewRef.current = ref)}
					originWhitelist={['*']}
					source={{
						// uri: 'https://wmp.interaction.courses/test-webview/',
						uri: 'https://wmp.interaction.courses/playback-webview/',
					}}
					pullToRefreshEnabled={true}
					onLoad={webViewLoaded}
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
			<BodyText>
				{isUser ? profile.name || 'Enter Your Name' : 'And Others...'}
			</BodyText>
		</View>
	);
}

function ProfileLists() {
	return (
		<View style={styles.section}>
			<TitleText>Currently At This Location: </TitleText>
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
		<ButtonIOS
			text={buttonText}
			onPress={handlePlay}
			fullWidth
			disabled={!webViewState.loaded}
		/>
	);
}

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
						<HeaderText>{nearbyLocation.location}</HeaderText>
						<BodyText>
							{nearbyLocation.suburb}, {nearbyLocation.state}
						</BodyText>
					</View>
				</View>
				{webViewState && (
					<PlayButton handlePlay={handlePlay} webViewState={webViewState} />
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	flexRow: {
		display: 'flex',
		flexDirection: 'row',
	},
	groupView: {
		paddingBottom: sizes.padding,
	},

	safeContainer: {
		flex: 1,
	},
	container: {
		paddingHorizontal: sizes.padding,
		justifyContent: 'space-between',
		flex: 1,
	},
	webViewContainer: {
		height: height / 2,
		borderWidth: 3,
		marginBottom: 20,
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	playButton: {
		backgroundColor: colors.purpleColorLighter,
		paddingHorizontal: sizes.padding,
		paddingVertical: sizes.padding / 2,
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: sizes.radius,
	},
	playButtonText: {
		color: colors.white,
	},
	section: {
		paddingVertical: sizes.padding,
		// backgroundColor: 'green',
	},
	headerContainer: {
		height: sizes.headerHeight,
		// backgroundColor: 'red',
	},
	headerIconContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		// backgroundColor: 'green',
	},
	headerIcon: {
		width: '100%',
		height: '55%',
	},
	headerTextContainer: {
		flex: 3,
		justifyContent: 'center',
	},
	headingLocation: {
		fontSize: sizes.body1,
		fontWeight: 'bold',
		marginBottom: 8,
	},
	subHeadingLocation: {
		fontSize: sizes.body3,
	},
	profileCard: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: sizes.padding,
	},
	profilePictureContainer: {
		aspectRatio: 1,
		width: '20%',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: sizes.padding,
		borderWidth: 3,
		borderColor: colors.light.fgColorLighter,
		borderRadius: 1000,
	},
	profilePicture: {
		borderRadius: 1000,
		width: '100%',
		height: '100%',
	},
	profileName: {
		color: colors.light.fgColor,
		fontWeight: '600',
	},
});
