import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useIsFocused } from '@react-navigation/native';
import {
	SafeAreaView,
	ScrollView,
	View,
	Image,
	Dimensions,
	Text,
	Button,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';

import { WebView } from 'react-native-webview';
import {
	useLocation,
	useSamples,
	useSamplesToLocations,
} from '../context/Context';
import { dummySample } from '../data/dummy';
import { colors, sizes } from '../data/theme';
import ButtonIOS from '../components/ButtonIOS';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
	safeContainer: {},
	container: {
		paddingHorizontal: 20,
		paddingBottom: 20,
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
});

function PlayButton({ webViewState, handleActionPress }) {
	return (
		<ButtonIOS
			text={!webViewState.actioned ? 'Play Music' : 'Stop Music'}
			onPress={handleActionPress}
		/>
	);
}

export default function NowPlaying() {
	const { samples, statusSamples } = useSamples();
	const { samplesToLocations, statusSTL } = useSamplesToLocations();
	const { nearbyLocation } = useLocation();
	const [recData, setRecData] = useState();

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
		// const filteredSamples = allSam
		// 	.filter(sam => sam.id === )
		return filteredSam;
		// const filteredSTL = allStl
		// 	.filter((stl) => {
		// 		stl.location_id === nearLoc.id;
		// 	})
		// 	.map((stl) => stl);
		// const filteredSampleIDs = filteredSTL.map((stl) => stl.samples_id);
		// const filteredSample = allSam
		// 	?.filter((sample) => filteredSampleIDs.include(sample.id))
		// 	.map((sample) => sample);
		// return filteredSample;
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
		const strdum = JSON.stringify(dummySample);
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

	console.log(nearbyLocation);
	return (
		<SafeAreaView style={styles.safeContainer}>
			<ScrollView contentContainerStyle={styles.container}>
				<View style={styles.webViewContainer}>
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
				<View>
					<Text>{nearbyLocation.location}</Text>
					<Text>{`${nearbyLocation.suburb}, ${nearbyLocation.state}`}</Text>
				</View>

				{webViewState && (
					<PlayButton
						handleActionPress={handleActionPress}
						webViewState={webViewState}
					/>
				)}
			</ScrollView>
		</SafeAreaView>
	);
}
