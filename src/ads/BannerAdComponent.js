// ads/BannerAdComponent.js
import React from 'react';
import { BannerAd } from 'react-native-google-mobile-ads';
import bannerAdConfig from './bannerAdInstance';

const BannerAdComponent = () => (
  <BannerAd
    unitId={bannerAdConfig.unitId}
    size={bannerAdConfig.size}
    requestOptions={bannerAdConfig.requestOptions}
  />
);

export default BannerAdComponent;
