var allTestFiles = [];
var TEST_REGEXP = /^\/base\/test\/.*\.js$/;

// Normalize a path to RequireJS module name.
var pathToModule = function (path) {
    return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

for (var file in window.__karma__.files) {
    if (TEST_REGEXP.test(file)) {
        console.log(file);
        allTestFiles.push(pathToModule(file));
    }
}

require.config({
    baseUrl: '/base',

    // Dynamically require all test files.
    deps: allTestFiles,

    // We have to kickoff testing framework,
    // after RequireJS is done with loading all the files.
    callback: window.__karma__.start
});