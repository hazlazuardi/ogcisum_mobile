import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useIsFocused } from '@react-navigation/native';
import {
	SafeAreaView,
	ScrollView,
	View,
	Image,
	Dimensions,
	StyleSheet,
} from 'react-native';

import { WebView } from 'react-native-webview';
import {
	useLocation,
	useProfile,
	useSamples,
	useSamplesToLocations,
	useTheme,
} from '../context/Context';
// import { dummySample } from '../data/dummy';
import { colors, sizes } from '../data/theme';
import ButtonIOS from '../components/ButtonIOS';
import HeaderText from '../components/HeaderText';
import BodyText from '../components/BodyText';
import TitleText from '../components/TitleText';

const { height } = Dimensions.get('window');
export default function NowPlaying() {
	const { samples, statusSamples } = useSamples();
	const { samplesToLocations, statusSTL } = useSamplesToLocations();
	const { nearbyLocation } = useLocation();
	const [recData, setRecData] = useState();

	// console.log(nearbyLocation);
	// console.log(recData.length === 0);

	function getSamplesFromLocations(nearLoc, allSam, allStl) {
		// console.log('nearf: ', typeof nearLoc.id);
		// console.log('allSam: ', allSam);
		// console.log('allStl: ', allStl);
		// Filter samples to location by location_id
		const filteredStl = allStl
			.filter((stl) => stl.locations_id === nearLoc.id)
			.map((stl) => stl);
		// Make a list of samples_id to filter samples
		const sidRef = filteredStl.map((stl) => stl.samples_id);
		//  Filter samples by samples_id
		const filteredSam = allSam
			.filter((sam) => sidRef.includes(sam.id))
			.map((sam) => {
				const parsedRec = {
					...sam,
					recording_data: JSON.parse(sam.recording_data),
				};
				return parsedRec;
			});
		return filteredSam;
	}

	const memoizedNearby = useMemo(
		() => nearbyLocation,
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[nearbyLocation.distance],
	);
	useEffect(() => {
		// webViewRef.current.injectJavaScript(`setupParts([${dummySample})]`);
		if (
			memoizedNearby &&
			statusSTL === 'success' &&
			statusSamples === 'success'
		) {
			// console.log(getSamplesFromLocations(nearbyLocation, samples, samplesToLocations));
			const sams = getSamplesFromLocations(
				nearbyLocation,
				samples,
				samplesToLocations,
			);
			const rec = sams.map((sample) => {
				return { type: sample.type, recording_data: sample.recording_data };
			});
			// Make a list of filtered recording data
			setRecData(rec);
			// console.log(rec);
			// console.log('dummy', JSON.stringify(dummySample));
			// console.log('real', JSON.stringify(rec));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [memoizedNearby]);

	const isFocused = useIsFocused();
	useEffect(() => {
		if (isFocused) {
			webViewRef.current.reload();
		}
	}, [isFocused]);

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

	function handleActionPress() {
		const sampleStr = JSON.stringify(recData);
		// const strdum = JSON.stringify(dummySample);
		if (!webViewState.actioned) {
			webViewRef.current.injectJavaScript(`setupParts(${sampleStr})`);
			webViewRef.current.injectJavaScript('startPlayback()');
		} else {
			webViewRef.current.injectJavaScript('stopPlayback()');
			// webViewRef.current.reload();
		}
		setWebViewState({
			...webViewState,
			actioned: !webViewState.actioned,
		});
	}

	// console.log(nearbyLocation);
	const hasRecData = recData?.length !== 0;
	const { themeColors } = useTheme();

	return (
		<SafeAreaView
			style={[styles.safeContainer, { backgroundColor: themeColors.bgColor }]}
		>
			<ScrollView contentContainerStyle={styles.container}>
				{hasRecData ? (
					<>
						<MusicPlayer
							nearbyLocation={nearbyLocation}
							webViewState={webViewState}
							handlePlay={handleActionPress}
						/>
						<ProfilesList />
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

function PhotoProfile({ isUser }) {
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

function PlayButton({ webViewState, handlePlay }) {
	return (
		<ButtonIOS
			text={!webViewState.actioned ? 'Play Music' : 'Stop Music'}
			onPress={handlePlay}
			fullWidth
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

function ProfilesList() {
	return (
		<View style={styles.section}>
			<TitleText>Currently At This Location: </TitleText>
			<PhotoProfile isUser={true} />
			<PhotoProfile />
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
