// kmAndTime 조건 함수
export const isKmAndTime = (exerciseName) => 
    ['야외 러닝', '스텝 밀', '스프린트', '싸이클', '일립티컬 머신', '스테퍼', '워킹', '러닝머신', '인클라인 트레드 밀', '로잉머신'].includes(exerciseName);

// time 조건 함수
export const isTime = (exerciseName) => 
    ['스트레칭', '할로우', '폼롤러', '배틀로프', '균형잡기', '박스', '플란체', '매달리기', '마운틴 클라이머', '러시안 트위스트', '플랭크', '줄넘기', '폼 롤러'].some(term => 
        exerciseName.includes(term)
    );


// number 조건 함수
export const isNumber = (exerciseName) => {
    
    const excludeCrunches = [
        '중량 크런치',
        '중량 케이블 크런치',
        '머신 크런치',
        '케이블 스탠딩 크런치',
        '케이블 시티드 크런치'
    ];

    const excludeDips = ['머신 시티드 딥스', '중량 딥스'];

    const excludeGimball = ['짐볼 덤벨 풀오버', '짐볼 중량 월 스쿼트', '짐볼 덤벨 인클라인 플라이'];

    const excludePullUp = ['엘싯 풀업', '어시스티드 머신 풀업', '중량 풀업', '아처 풀업'];

    const excludeBlitz = ['덤벨 브릿지'];



    return (
        (exerciseName.includes('푸시') ||
            exerciseName.includes('필라테스') ||
            exerciseName.includes('점프') ||
            exerciseName.includes('버피') ||
            exerciseName.includes('하이퍼') ||
            exerciseName.includes('밴드') ||
            exerciseName.includes('제자리') ||
            exerciseName.includes('물구나무') ||
            exerciseName.includes('맨몸') ||
            exerciseName.includes('보수') ||
            (exerciseName.includes('크런치') && !excludeCrunches.includes(exerciseName)) ||
            (exerciseName.includes('풀업') && !excludePullUp.includes(exerciseName)) ||
            (exerciseName.includes('짐볼') && !excludeGimball.includes(exerciseName)) ||
            (exerciseName.includes('브릿지') && !excludeBlitz.includes(exerciseName)) ||
            (exerciseName.includes('딥스') && !excludeDips.includes(exerciseName))) ||
        [
            '요가', 
            '허리 돌리기', 
            '팔벌려뛰기', 
            '토즈 투바', 
            '마운틴 클라이머', 
            '러시안 트위스트', 
            '시티드 트위스트', 
            '바벨 스탠딩 트위스트', 
            '시티드 니 업', 
            '디클라인 싯업', 
            '로만 체어 싯업', 
            '친업', 
            '글루트 킥 백', 
            '글루트 햄 디벨로퍼 힙 익스텐션', 
            '데피싯 네로우 스쿼트', 
            '스텐딩 수영', 
            '힌두 스쿼트', 
            '로만 체어 싯 업', 
            '윗몸 앞으로 굽히기', 
            '워킹 런지', 
            '사이드 스탭 스윙', 
            '사이드 스탭 플라이', 
            '네거티브 풀업',
            '라잉 레그 크로스', 
            '힙 스쿼트', 
            '데드 행 스트레치', 
            '노드릭 햄스트링 컬', 
            '행잉 니 레이즈', 
            '글루트 햄 디벨로퍼 힙 익스텐션', 
            '리버스 하이퍼 익스텐션', 
            '인앤아웃 스쿼트', 
            '드래곤 플래그', 
            '스케이터 점프', 
            '싱글 레그 데드리프트', 
            '스탠딩 힙 어브덕션', 
            '맨몸 와이드 ', 
            '펄스 런지', 
            '짐볼 백 익스텐션', 
            '짐볼 월 스쿼트', 
            '짐볼 풀 인', 
            '에어 바이크', 
            '친업', 
            '디클라인 싯업', 
            '머슬업', 
            '스탠딩 AB 슬라이드', 
            'AB 슬라이드', 
            '다이아몬드 프레스', 
            '클램쉘', 
            '맨몸 정지 스쿼트', 
            '백 레버', 
            '프론트 레버', 
            '플러터 킥', 
            '데드 버그', 
            '머드 독', 
            'V-싯', 
            'L-싯', 
            '쉬림프 스쿼트', 
            '스플릿 스쿼트', 
            '사이드 스쿼트', 
            '링 인버티드 로우', 
            '레그 레이즈 힙 리프트', 
            '라잉 사이드 래그 레이즈', 
            '라잉 레그 힙 레이즈', 
            '암 슬링 행잉 레그 레이즈', 
            '캡틴스 체어 레그 레이즈', 
            '캡틴스 체어 니 레이즈', 
            '링 머슬업', 
            '크로스 런지', 
            '45도 익스텐션', 
            '친업', 
            '트라이셉스 딥스 플로어', 
            '링 딥스', 
            '덤벨 버피', 
            '스쿼트 버피', 
            '암 워킹',
            '계단 오르기', 
            '배틀로프', 
            '피스톨 스쿼트', 
            '오버해드 스쿼트', 
            '인버티드 로우', 
            '밴드 벤트 오버 로우', 
            '사이드 레그 레이즈', 
            '레그 레이즈', 
            '행잉 레그 레이즈', 
            '클루트 햄 레이즈', 
            '링 머슬 업', 
            '크로스 런지', 
            '런지', 
            '벤치 딥스', 
            '백 익스텐션', 
            '윗몸일으키기', 
            '시티드 니 업', 
            '러시안 트위스트', 
            '마운틴 클라이머', 
            '땅바닥 짚기'].includes(exerciseName)
    );
};
