var allTestFiles = [];
var TEST_REGEXP = /^\/base\/test\/.*\.js$/;

// Normalize a path to RequireJS module name.
var pathToModule = function (path) {
    return path
        .replace(/\.js$/, "");
};

for (var file in window.__karma__.files) {
    if (TEST_REGEXP.test(file)) {
        allTestFiles.push(pathToModule(file));
    }
}

require.config({
    baseUrl: '/base/src',

    // Dynamically require all test files.
    deps: allTestFiles,

    // We have to kickoff testing framework,
    // after RequireJS is done with loading all the files.
    callback: window.__karma__.start
});