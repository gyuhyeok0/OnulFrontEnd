module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    process.env.NODE_ENV === 'production' && 'transform-remove-console',
    'react-native-reanimated/plugin', // 기존 플러그인 유지
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
      blocklist: null,
      allowlist: null,
      safe: false,
      allowUndefined: true
    }]
  ].filter(Boolean), // falsy 값 제거 (예: false일 땐 적용 안 함)
};
