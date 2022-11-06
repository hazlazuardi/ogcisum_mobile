import { StyleSheet } from 'react-native';
import { colors, sizes } from '../../data/theme';

export const styles = StyleSheet.create({
	header: {
		fontSize: sizes.body1,
		fontWeight: 'bold',
	},
	photoEmptyView: {
		alignItems: 'center',
		aspectRatio: 3 / 4,
		borderColor: colors.grey,
		borderRadius: 10,
		borderStyle: 'dashed',
		borderWidth: 3,
		display: 'flex',
		justifyContent: 'center',
		marginBottom: sizes.padding,
		width: '100%',
	},
	photoFullView: {
		alignItems: 'center',
		aspectRatio: 3 / 4,
		borderColor: colors.light.fgColorLighter,
		borderRadius: 10,
		borderWidth: 4,
		display: 'flex',
		flex: 1,
		justifyContent: 'flex-end',
		marginBottom: sizes.padding,
		overflow: 'hidden',
		paddingBottom: sizes.padding,
		width: '100%',
	},
	subtitle: {
		color: colors.light.fgColor,
		fontSize: sizes.body3,
		marginBottom: sizes.padding,
	},
});
