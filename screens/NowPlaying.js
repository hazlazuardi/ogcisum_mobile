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

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
	safeContainer: {},
	container: {
		paddingHorizontal: 20,
		paddingBottom: 20,
	},
	webViewContainer: {
		// height: height / 2,
		// borderWidth: 3,
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

// const fetcher = async () => await fetch(LOCATION_URL).then((res) => res.json());
export default function NowPlaying() {
	// const { execute, status, value, error } = useFetch(fetcher, true);

	const { samples, statusSamples } = useSamples();
	const { samplesToLocations, statusSTL } = useSamplesToLocations();
	const { nearby } = useLocation();
	const [recData, setRecData] = useState();
	// console.log('samples: ', samples);
	// console.log('stl: ', samplesToLocations);

	function getSamplesFromLocations(nearLoc, allSam, allStl) {
		// console.log('nearf: ', typeof nearLoc.id);
		// console.log('allSam: ', allSam);
		// console.log('allStl: ', allStl);
		const filteredStl = allStl
			.filter((stl) => stl.locations_id === nearLoc.id)
			.map((stl) => stl);
		const sidRef = filteredStl.map((stl) => stl.samples_id);
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

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const memoizedNearby = useMemo(() => nearby, [nearby.distance]);
	useEffect(() => {
		// webViewRef.current.injectJavaScript(`setupParts([${dummySample})]`);
		if (
			memoizedNearby &&
			statusSTL === 'success' &&
			statusSamples === 'success'
		) {
			// console.log(getSamplesFromLocations(nearby, samples, samplesToLocations));
			const sams = getSamplesFromLocations(nearby, samples, samplesToLocations);
			const rec = sams.map((sample) => {
				return { type: sample.type, recording_data: sample.recording_data };
			});
			setRecData(rec);
			console.log(rec);
			console.log('dummy', JSON.stringify(dummySample));
			console.log('real', JSON.stringify(rec).replace(/\\/g, ''));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [memoizedNearby]);

	function getSamples(location) {
		//  TODO
		// Filter samples to location by location_id
		// Make a list of samples_id to filter samples
		//  Filter samples by samples_id
		// Make a list of filtered recording data
	}

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

	// function handleReloadPress() {
	// 	// webViewRef.current.injectJavaScript(`setupParts(${[...dummySample]})`);
	// 	webViewRef.current.reload();
	// }

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
				{webViewState && (
					<View style={styles.buttonContainer}>
						{/* <Button onPress={handleReloadPress} title="Reload WebView" /> */}
						<TouchableOpacity
							style={styles.playButton}
							onPress={handleActionPress}
						>
							<Text style={styles.playButtonText}>
								{!webViewState.actioned ? 'Play Music' : 'Stop Music'}
							</Text>
						</TouchableOpacity>
						{/* <Button onPress={execute} title="Fetch" /> */}
					</View>
				)}
				{/* {recData && (
					// recData.map((rec) => (
					// 	<View key={rec.recording_data}>
					// 		<Text>{rec.type}</Text>
					// 		<Text>{rec.recording_data}</Text>
					// 	</View>
					// ))}
					<View>
						<Text>{JSON.stringify(recData).replace(/\\/g, '')}</Text>
					</View>
				)} */}
			</ScrollView>
		</SafeAreaView>
	);
}
