import {
    moderateScale,
    moderateVerticalScale,
    scale,
    verticalScale,
} from 'react-native-size-matters';

export const s = (size: number) => scale(size);
export const vs = (size: number) => verticalScale(size);
export const ms = (size: number, factor: number = 0.5) => moderateScale(size, factor);
export const mvs = (size: number, factor: number = 0.5) => moderateVerticalScale(size, factor);
