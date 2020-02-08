# build the site
npm run build

# remove previous site

aws s3 rm s3://cclcalls.org  --recursive  --profile cclcalls-public-ci --exclude "img/*"

# copy the build directory

aws s3 cp build/ s3://cclcalls.org/ --recursive --profile cclcalls-public-ci