// ads/bannerAdInstance.js
import { BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = TestIds.BANNER; // 실제 배포 시 광고 ID로 변경

const bannerAdConfig = {
  unitId: adUnitId,
  size: BannerAdSize.ANCHORED_ADAPTIVE_BANNER,
  requestOptions: {
    requestNonPersonalizedAdsOnly: true,
  },
};

export default bannerAdConfig;
