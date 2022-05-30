# TopLists

(TopLists)[https://toplists-6e595.web.app/]
Créer vos listes de tops afin de les partager et les comparers.

# FirebaseX

Android : npm remove cordova-plugin-firebasex
Ios: npm install cordova-plugin-firebasex

## Add Initialization Code

To connect to Firebase when your iOS app starts up, you need to add the following to your AppDelegate.swift file.

First, add an import at the top of the file:

import Firebase
… and then add the configuration method for Firebase to initialization code to your AppDelegate.swift file, in the application(didFinishLaunchingWithOptions) method.

FirebaseApp.configure()

## URL REVERSED_CLIENT_ID

XCode > App > Info > Url Types
Click to "+" and add into URL Schemes value REVERSED_CLIENT_ID from GoogleService-Info.plis

## Android

Append to AndroidManifest.xml
line 24

```
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https" android:host="toplists-6e595.web.app" />
</intent-filter>
```

### Build Android APK Signed

use /Users/jordanazoulay/Keystore/toplists.jks with Key alias: keythree
