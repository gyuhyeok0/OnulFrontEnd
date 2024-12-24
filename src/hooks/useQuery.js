// import { useQuery } from '@tanstack/react-query';
// import { submitExerciseRecord, deleteExerciseRecord} from '../../src/apis/SubmitExerciseRecordAPI';
// import { useDispatch, useSelector } from 'react-redux'; // useDispatch 가져오기

// export const useSubmitExerciseQuery = ({
//     currentSet,
//     currentSetNumber,
//     memberId,
//     exerciseService,
//     exercise,
//     exerciseType,
//     volume,
//     weightUnit,
//     kmUnit,
// }) => {

//     return useQuery({
//         queryKey: ['submitExercise', currentSetNumber],
//         queryFn: async () => {

//             console.log("서브밋 쿼리 호출")
//             if (currentSet && currentSetNumber !== null) {
//                 const result = await submitExerciseRecord(
//                     memberId,
//                     exerciseService,
//                     currentSetNumber,
//                     currentSet,
//                     exercise,
//                     exerciseType,
//                     volume,
//                     weightUnit,
//                     kmUnit
//                 );
//                 return result; // 서버 응답 반환
//             }
//             return { success: false, message: 'Invalid parameters' }; // 기본값 반환
//         },
//         enabled: false, // 수동으로 실행
//     });
// };


// export const useDeleteExerciseQuery = ({ memberId, exerciseService, dispatch }) => {
//     return useQuery({
//         queryKey: ['deleteExercise'], // 고유 쿼리 키
//         queryFn: async ({ queryKey, queryFnParams }) => {
//             console.log("딜리트 쿼리 호출");

//             // refetch 호출 시 전달된 매개변수 처리
//             const { currentSet, currentSetNumber, exercise } = queryFnParams || {};

//             console.log((currentSet, currentSetNumber, exercise));
//             if (currentSet && currentSetNumber !== null) {
//                 const today = moment().format('YYYY-MM-DD');

//                 const result = await deleteExerciseRecord(
//                     memberId,
//                     currentSetNumber,
//                     today,
//                     exercise,
//                     exerciseService,
//                     dispatch
//                 );
//                 return result; // 서버 응답 반환
//             }
//             return { success: false, message: 'Invalid parameters' }; // 기본값 반환
//         },
//         enabled: false, // 수동 실행
//     });
// };
