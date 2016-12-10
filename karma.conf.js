var tsconfig = require("./tsconfig.json");
module.exports = function (config) {
    config.set({
        frameworks: ["requirejs", "qunit"],
        files: [
            "./test-main.js",

            { pattern: "src/**/*.ts", included: false },
            { pattern: "test/**/*.ts", included: false }
        ],
        preprocessors: {
            '**/*.ts': ["typescript"]
        },
        reporters: ["progress"],
        typescriptPreprocessor: {
            options: tsconfig.compilerOptions
        },
        browsers: ["Chrome", "IE7"],
        customLaunchers: {
            IE7: {
                base: 'IE',
                'x-ua-compatible': 'IE=7'
            },
            IE8: {
                base: 'IE',
                'x-ua-compatible': 'IE=8'
            },
            IE9: {
                base: 'IE',
                'x-ua-compatible': 'IE=9'
            },
            IE10: {
                base: 'IE',
                'x-ua-compatible': 'IE=10'
            }
        }
    });
};
