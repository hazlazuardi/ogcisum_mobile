import { StyleSheet } from 'react-native';
import { colors, sizes } from '../../data/theme';

export const styles = StyleSheet.create({
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
	},
	headerIcon: {
		height: '55%',
		width: '100%',
	},
	headerIconContainer: {
		alignItems: 'center',
		flex: 1,
		justifyContent: 'center',
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
	},
});
