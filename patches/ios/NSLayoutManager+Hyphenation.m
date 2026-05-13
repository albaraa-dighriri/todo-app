// Patches NSLayoutManager to enable soft hyphen character (`\u00AD`) rendering as a visible "-" on all iOS versions (iOS < 26).
//
// React Native (Fabric) uses NSLayoutManager to render text. NSLayoutManager has
// a hyphenationFactor property (0.0 = off, 1.0 = on) that must be > 0 for
// CoreText to render \u00AD as a visible "-" when a word wraps at that position.
// React Native never sets this, so older iOS silently drops the visible dash.

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
