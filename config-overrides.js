const { override, fixBabelImports, addLessLoader } = require('customize-cra');

// Helpful reference
// https://github.com/andriijas/monkey-admin/blob/master/config-overrides.js

module.exports = override(
    fixBabelImports('import', { 
        libraryName: 'antd', 
        libraryDirectory: 'es', 
        style: true 
    }),
    addLessLoader({
        modifyVars: {
            "@primary-color": "#1698d9",
            "@font-size-base": "16px",
            "@font-size-sm" : "14px"
        },
        javascriptEnabled: true,
    }),
);