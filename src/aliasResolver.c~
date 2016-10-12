#include "aliasResolver.h"
#include <CoreFoundation/CoreFoundation.h>
#include <string.h>

bool resolveAliasToBuffer(char *aliasPath, char *buffer, int bufferLength, unsigned long *pathSize) {
  char * result = resolveAlias(aliasPath);
  if (result) {
    *pathSize = strlen(result);
    strncpy(buffer, result, bufferLength);
    free(result);
    return true;
  }
  return false;
}

char * resolveAlias(char *aliasPath) {
  CFErrorRef error = NULL;

  CFStringRef pathStr = CFStringCreateWithCString(NULL, aliasPath, kCFStringEncodingUTF8);

  CFURLRef url = CFURLCreateWithFileSystemPath(NULL, pathStr, kCFURLPOSIXPathStyle, false);
  CFRelease(pathStr);

  CFDataRef bookmark = CFURLCreateBookmarkDataFromFile(NULL, url, &error);
  CFRelease(url);
  if (!bookmark) {
    if (error != NULL) {
      if (CFErrorGetCode(error) != 256) {
        logError(error);
      }
      CFRelease(error);
    }
    return NULL;
  }


  Boolean stale;
  CFURLRef finalUrl = CFURLCreateByResolvingBookmarkData(NULL, bookmark, 0, NULL , NULL, &stale , &error);
  CFRelease(bookmark);

  if (!finalUrl) {
    if (error) {
      logError(error);
      CFRelease(error);
    }
    return NULL;
  }

  CFStringRef string = CFURLGetString(finalUrl);
  CFRetain(string);
  CFRelease(finalUrl);

  int bufSize = (CFStringGetLength(string) + 1) * sizeof(char); 
  char * cString = (char *)malloc(bufSize);
    
  CFStringGetCString(string, cString, bufSize, kCFStringEncodingUTF8);
  CFRelease(string);

  return cString;
}

void logError(CFErrorRef error) {

  CFStringRef desc = CFErrorCopyDescription( error );
  const char *errorStr = "no error details";
  char buffer[512];

  if ( desc != NULL ) {
    CFStringGetCString( desc, buffer, sizeof(buffer), kCFStringEncodingUTF8 );
    errorStr = buffer;
  }

  printf( "Error code (%d):  %s\n", (int) CFErrorGetCode(error), errorStr );

}
