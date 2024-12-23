// import { useDispatch } from 'react-redux';
// import { Alert } from 'react-native';
// import { startRequest, requestSuccess, requestFailed } from '../modules/ApiSlice';

// const useApiHandler = () => {
//   const dispatch = useDispatch();

//   // 타임아웃 처리된 fetch
//   const fetchWithTimeout = (url, options, timeout = 5000) => {
//     return Promise.race([
//       fetch(url, options),
//       new Promise((_, reject) =>
//         setTimeout(() => reject(new Error('Timeout')), timeout)
//       ),
//     ]);
//   };

//   const sendRequest = async (url, options) => {
//     dispatch(startRequest()); // 로딩 시작
//     try {
//       const response = await fetchWithTimeout(url, options, 5000); // 5초 타임아웃
//       if (!response.ok) {
//         throw new Error(`Server error: ${response.status}`);
//       }
//       const data = await response.json();
//       dispatch(requestSuccess()); // 요청 성공 시 상태 업데이트
//       return data;
//     } catch (err) {
//       dispatch(requestFailed()); // 요청 실패 시 로딩 종료
//       throw err; // 실패 알림 처리
//     }
//   };

//   return { sendRequest };
// };

// export default useApiHandler;
