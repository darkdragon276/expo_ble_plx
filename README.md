## Installation

```bash
npm install
npx patch-package
```

## Running the App

To start the app on Android, run:

```bash
npx expo run:android
```

To start the app on Iphone, run:

```bash
npx expo run:ios
```

## Android build

To compile and build the apk for Android, run:

```bash
npx expo prebuild --platform android
cd ./android
./gradlew assembleRelease
adb install -r .\app\build\outputs\apk\release\app-release.apk
```

## IOS release

To compile and build the apk for Android, run:

```bash
rm -rf ./ios
npx expo prebuild --platform ios 
cd ./ios
pod install
```

* Open xcode with project workspace file in ./ios folder
* Edit schema to release
* Add signing & certificate
* Set: General => AppIcon => 'check' include all app icon assets
* Build & Archive to Apple Store connect.