
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNImageViewModalSpec.h"

@interface ImageViewModal : NSObject <NativeImageViewModalSpec>
#else
#import <React/RCTBridgeModule.h>

@interface ImageViewModal : NSObject <RCTBridgeModule>
#endif

@end
