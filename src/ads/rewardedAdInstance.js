// ads/rewardedAdInstance.js
import { RewardedAd, TestIds } from 'react-native-google-mobile-ads';

// ⚠️ 실제 광고 ID로 교체 필요
const adUnitId = TestIds.REWARDED; 

const rewardedAd = RewardedAd.createForAdRequest(adUnitId);

export default rewardedAd;
