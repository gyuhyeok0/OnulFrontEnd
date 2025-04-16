import { BannerAdSize } from 'react-native-google-mobile-ads';
import { BANNER_AD_UNIT_ID } from '@env';

const bannerAdConfig = {
  unitId: BANNER_AD_UNIT_ID,
  size: BannerAdSize.ANCHORED_ADAPTIVE_BANNER,
  requestOptions: {
    requestNonPersonalizedAdsOnly: true,
  },
};

export default bannerAdConfig;
