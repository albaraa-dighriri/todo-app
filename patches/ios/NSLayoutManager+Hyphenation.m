// Enables automatic hyphenation for all React Native text on iOS.
//
// React Native does not expose iOS's hyphenation API as a prop (unlike Android).
// This patch sets hyphenationFactor = 1.0 on NSLayoutManager, which tells CoreText
// to use its built-in dictionary to find the best break point and render a visible "-".

#import <UIKit/UIKit.h>
#import <objc/runtime.h>

@implementation NSLayoutManager (Hyphenation)

+ (void)load
{
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        Class class = [NSLayoutManager class];
        SEL original = @selector(addTextContainer:);
        SEL patched  = @selector(hyphenation_addTextContainer:);
        method_exchangeImplementations(
            class_getInstanceMethod(class, original),
            class_getInstanceMethod(class, patched)
        );
    });
}

- (void)hyphenation_addTextContainer:(NSTextContainer *)container
{
    self.hyphenationFactor = 1.0;
    // Calls the original addTextContainer: (swapped via method_exchangeImplementations).
    [self hyphenation_addTextContainer:container];
}

@end
