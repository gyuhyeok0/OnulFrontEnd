// ads/BannerAdComponent.js
import React from 'react';
import { BannerAd } from 'react-native-google-mobile-ads';
import bannerAdConfig from './bannerAdInstance';

const BannerAdComponent = () => (
  <BannerAd
    unitId={bannerAdConfig.unitId}
    size={bannerAdConfig.size}
    requestOptions={bannerAdConfig.requestOptions}
    onAdFailedToLoad={(error) => {
      console.log('[BannerAdComponent] 배너 광고 로드 실패:', error);
    }}
  />
);

export default BannerAdComponent;
