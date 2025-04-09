// ads/interstitialAdInstance.js
import { InterstitialAd, TestIds } from 'react-native-google-mobile-ads';

// 실 서비스 시 실제 광고 ID로 교체
const adUnitId = TestIds.INTERSTITIAL;

const interstitialAd = InterstitialAd.createForAdRequest(adUnitId);

export default interstitialAd;
