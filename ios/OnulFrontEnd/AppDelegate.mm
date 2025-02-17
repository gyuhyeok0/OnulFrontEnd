#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import "RNSplashScreen.h" 

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"OnulFrontEnd";
  self.initialProps = @{};

// ✅ 스플래시 화면을 강제로 표시
  // [RNSplashScreen show];
  // dispatch_async(dispatch_get_main_queue(), ^{
  //   [RNSplashScreen show];
  //   NSLog(@"[AppDelegate] RNSplashScreen.show() 호출 후");
  // });
  

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
