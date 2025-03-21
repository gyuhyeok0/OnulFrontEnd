module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin', // 기존 플러그인 유지
    // 'transform-remove-console', 
    ['module:react-native-dotenv', {
      moduleName: '@env', // @env로 환경 변수를 가져옴
      path: '.env',       // .env 파일 경로
      blocklist: null,    // (옵션) 특정 환경 변수 제외
      allowlist: null,    // (옵션) 허용된 환경 변수만 사용
      safe: false,        // (옵션) .env.example로 안전성 검증 여부
      allowUndefined: true // (옵션) undefined 변수를 허용할지 여부
    }]
  ],
};
