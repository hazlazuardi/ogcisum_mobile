import React from 'react';

import PropTypes from 'prop-types';
import OgcisumButton from '../OgcisumButton';

/**
 * React component for Play Button in MusicPlayer section.
 *
 * @param {object} props - Object containing props for this component.
 * @param {object} props.webViewState - Object containing WebView state.
 * @param {Function} props.onPressPlay - Callback function invoked when user press Play.
 * @param {boolean} props.hasRecordingData - Flag to indicate if samples exists.
 * @returns {JSX.Element} React component for Play Button in MusicPlayer section.
 */
function PlayButton({ webViewState, onPressPlay, hasRecordingData }) {
	let buttonText;
	if (webViewState.loaded && hasRecordingData && !webViewState.actioned) {
		buttonText = 'Play Music';
	} else if (webViewState.loaded && webViewState.actioned) {
		buttonText = 'Stop Music';
	} else if (webViewState.loaded && !hasRecordingData) {
		buttonText = 'No music shared.'
	} else {
		buttonText = 'Loading Samples..';
	}
	return (
		<OgcisumButton
			text={buttonText}
			onPress={onPressPlay}
			fullWidth
			disabled={!webViewState.loaded}
		/>
	);
}

PlayButton.propTypes = {
	webViewState: PropTypes.object,
	onPressPlay: PropTypes.func,
	hasRecordingData: PropTypes.bool
};

export default PlayButton;
