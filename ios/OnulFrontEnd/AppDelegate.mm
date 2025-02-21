#import "AppDelegate.h"
#import <Firebase.h> // Firebase 헤더 추가
#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // Firebase 초기화: 다른 코드보다 먼저 호출해야 합니다.
  [FIRApp configure];

  // React Native 초기화 코드
  self.moduleName = @"OnulFrontEnd";
  self.initialProps = @{};
  
  // super의 didFinishLaunchingWithOptions 호출
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
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
