import { RewardedAd } from 'react-native-google-mobile-ads';
import { REWARDED_AD_UNIT_ID } from '@env';


const rewardedAd = RewardedAd.createForAdRequest(REWARDED_AD_UNIT_ID);

export default rewardedAd;
