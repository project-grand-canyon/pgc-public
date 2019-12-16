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
            "@text-color": "#111111",
            "@label-color": "#111111",
            "@text-color-secondary": "#5A7931",
            "@heading-color": "#0081C7",
        },
        javascriptEnabled: true,
    }),
);