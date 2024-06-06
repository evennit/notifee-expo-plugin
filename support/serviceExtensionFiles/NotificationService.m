#import "NotificationService.h"
#import "NotifeeExtensionHelper.h"

@interface NotificationService ()

@property (nonatomic, strong) void (^contentHandler)(UNNotificationContent *contentToDeliver);
@property (nonatomic, strong) UNNotificationRequest *receivedRequest;
@property (nonatomic, strong) UNMutableNotificationContent *bestAttemptContent;

@end

@implementation NotificationService

- (void)didReceiveNotificationRequest:(UNNotificationRequest *)request withContentHandler:(void (^)(UNNotificationContent * _Nonnull))contentHandler {
    self.receivedRequest = request;
    self.contentHandler = contentHandler;
    NSMutableDictionary *userInfoDict = [self.bestAttemptContent.userInfo mutableCopy];
    userInfoDict[@"notifee_options"] = [NSMutableDictionary dictionary];
    userInfoDict[@"notifee_options"][@"title"] = @"Modified Title";
    self.bestAttemptContent = [request.content mutableCopy];
    [NotifeeExtensionHelper populateNotificationContent:request
                                withContent: self.bestAttemptContent
                                withContentHandler:contentHandler];
}

- (void)serviceExtensionTimeWillExpire {
    // Called just before the extension will be terminated by the system.
    // Use this as an opportunity to deliver your "best attempt" at modified content, otherwise the original push payload will be used.
    self.contentHandler(self.bestAttemptContent);
}

@end