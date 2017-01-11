#import <CoreFoundation/CoreFoundation.h>
bool resolveAliasToBuffer(char *aliasPath, char *buffer, int bufferLength, unsigned long *pathSize);
char * resolveAlias(char *aliasPath);
void logError(CFErrorRef error);

int createAlias(char *fromPath, char *aliasPath);
bool createAliasForFile(char *fromPath, char *aliasPath);

