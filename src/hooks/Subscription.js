// import Purchases from "react-native-purchases";

// // 사용자가 구독했는지 확인
// export async function getSubscriptionStatus() {
//     try {
//         const customerInfo = await Purchases.getCustomerInfo();
//         console.log("✅ 구독 정보:", customerInfo);

//         if (customerInfo.entitlements.active["premium"]) { // ← 실제 엔타이틀먼트 ID로 변경
//         console.log("🔓 유저는 구독 중!");
//         return true;
//         } else {
//         console.log("🔒 유저는 구독 안 함");
//         return false;
//         }
//     } catch (e) {
//         console.error("❌ 구독 상태 가져오기 실패", e);
//         return false;
//     }

//     // return true;
// }

// // 구독 상품 목록 조회
// export async function fetchOfferings() {
//     try {
//         const offerings = await Purchases.getOfferings();
//         if (offerings.current) {
//         console.log("✅ 구독 상품:", offerings.current);
//         return offerings.current.availablePackages;
//         } else {
//         console.log("⚠️ 구독 상품 없음");
//         return [];
//         }
//     } catch (e) {
//         console.error("❌ 구독 정보 가져오기 실패", e);
//         return [];
//     }
// }

