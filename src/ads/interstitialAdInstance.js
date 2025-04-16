import { InterstitialAd } from 'react-native-google-mobile-ads';
import { INTERSTITIAL_AD_UNIT_ID } from '@env';

const interstitialAd = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID);

export default interstitialAd;
