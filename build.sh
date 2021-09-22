echo Building Vue project
npm run build:android
npm run icons
echo Building native android
cd ./android
./gradlew buildDebug
