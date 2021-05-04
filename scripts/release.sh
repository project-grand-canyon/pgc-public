set +eux
set REACT_APP_SENTRY_RELEASE=$(git rev-parse --short HEAD)
react-app-rewired build
node scripts/upload-source-maps-sentry.js
