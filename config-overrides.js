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
            "@primary-color": "#0081C7",
            "@font-size-base": "14px",
            "@font-size-sm" : "12px",
            "@heading-1-size": "30px",
            "@heading-2-size": "26px",
            "@heading-3-size": "20px",
            "@heading-4-size": "16px",
            "@text-color": "#544741",
            "@label-color": "#544741",
            "@text-color-secondary": "#544741",
            "@heading-color": "#544741",
        },
        javascriptEnabled: true,
    }),
);