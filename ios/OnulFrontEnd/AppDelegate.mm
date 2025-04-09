#import "AppDelegate.h"
#import <Firebase.h> // Firebase 헤더
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h> // ✅ RootView를 직접 제어하기 위해 필요
#import "RNSplashScreen.h" // react-native-splash-screen 추가

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // Firebase 초기화
  [FIRApp configure];

  // React Native 초기화 설정
  self.moduleName = @"OnulFrontEnd";
  self.initialProps = @{};

  // React Native bridge 초기화 (super 먼저 호출)
  BOOL didFinishLaunching = [super application:application didFinishLaunchingWithOptions:launchOptions];

  // ✅ rootView의 배경색 설정 (흰 화면 방지)
  RCTRootView *rootView = (RCTRootView *)self.window.rootViewController.view;
  rootView.backgroundColor = [UIColor blackColor]; // ← 원하는 색으로 변경 (예: 검정)

  // ✅ 스플래시 화면 표시
  [RNSplashScreen show];

  return didFinishLaunching;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
