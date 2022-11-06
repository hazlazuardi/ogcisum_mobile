import React from 'react';

import PropTypes from 'prop-types';
import { Image, View } from 'react-native';
import OgcisumText from '../OgcisumText';
import { useTheme } from '../../context/Context';
import PlayButton from './PlayButton';
import { styles } from './styles';

/**
 * React component for MusicPlayer section.
 *
 * @param {object} props - Object containing props for this component.
 * @param {object} props.nearbyLocation - Object containing nearest location data.
 * @param {object} props.webViewState - Object containing WebView state.
 * @param {Function} props.onPressPlay - Callback function invoked when user press Play.
 * @returns {JSX.Element} React component for MusicPlayer section.
 */
function MusicPlayer({ nearbyLocation, webViewState, onPressPlay }) {
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
					<PlayButton onPressPlay={onPressPlay} webViewState={webViewState} />
				)}
			</View>
		</View>
	);
}

MusicPlayer.propTypes = {
	nearbyLocation: PropTypes.object,
	webViewState: PropTypes.object,
	onPressPlay: PropTypes.func,
};

export default MusicPlayer;
