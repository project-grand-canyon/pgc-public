set +eux
export REACT_APP_SENTRY_RELEASE=$(git rev-parse --short HEAD)
node scripts/upload-source-maps-sentry.js