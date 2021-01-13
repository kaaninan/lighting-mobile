import { Dimensions, Platform, DeviceInfo, PixelRatio } from 'react-native';
import { Header } from 'react-navigation-stack';

export const paddingScreen = 16
export const iPadWidth = 600 // HomeScreen, Settings, Profile

export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;



export const LANDSCAPE = 'landscape';
export const PORTRAIT = 'portrait';

export const getHeaderHeight = () => {
  let height;
  const orientation = getOrientation();
  height = getHeaderSafeAreaHeight();
  height += DeviceInfo.isIPhoneX_deprecated && orientation === PORTRAIT ? 24 : 0;

  return height;
};

// This does not include the new bar area in the iPhone X, so I use this when I need a custom headerTitle component
export const getHeaderSafeAreaHeight = () => {
  const orientation = getOrientation();
  if (Platform.OS === 'ios' && orientation === LANDSCAPE && !Platform.isPad) {
    return 32;
  }
  return Header.HEIGHT;
};

export const getOrientation = () => {
  const { width, height } = Dimensions.get('window');
  return width > height ? LANDSCAPE : PORTRAIT;
};




export const scaleToDimension = (size) => {
  return screenWidth * size / 375
};

export const headerTitleTreshold = 50;

const getWidthFromDP = (widthPercentage) => {
  const percentageDesired = parseFloat(widthPercentage);
  const widthPercentageToDP = PixelRatio.roundToNearestPixel(
    (screenWidth * percentageDesired) / 100,
  );

  return widthPercentageToDP;
};

const getHeightFromDP = (heightPercentage) => {
  const percentageDesired = parseFloat(heightPercentage);
  const heightPercentageToDP = PixelRatio.roundToNearestPixel(
    (screenHeight * percentageDesired) / 100,
  );

  return heightPercentageToDP;
};

export default {
  statusBarHeight: Platform.OS === 'ios' ? 20 : 0,
  navigationHeaderHeight: Platform.OS === 'ios' ? 64 : 54,
  borderRadius: 8,

  navigationHeaderFontSize: Platform.OS === 'ios' ? 17 : 19,

  extraSmallSize: getWidthFromDP('1%'),
  smallSize: getWidthFromDP('2%'),
  mediumSize: getWidthFromDP('3%'),
  largeSize: getWidthFromDP('4%'),
  extraLargeSize: getWidthFromDP('5%'),

  getWidthFromDP,
  getHeightFromDP,
};
