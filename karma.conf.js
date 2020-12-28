module.exports = function(config) {
  config.set({
    basePath: ".",
    browsers: ["ChromeHeadless"],
    frameworks: ["qunit"],
    reporters: ["progress"],
    singleRun: true,
    autoWatch: false,
    customContextFile: "test/javascripts/context.html",
    customDebugFile: "test/javascripts/context.html",
    files: [
      { pattern: "app/assets/javascripts/stimulus/libraries/es-module-shims@0.7.1.js", type: "module" },
      { pattern: "test/javascripts/tests.html", type: "dom" },
      { pattern: "test/javascripts/importmap.json", included: false },
      { pattern: "test/javascripts/**/*.js", included: false },
      { pattern: "app/assets/javascripts/**/*.js", included: false },
      { pattern: "test/fixtures/files/**/*.js", included: false },
    ],
    preprocessors: {
      "test/javascripts/application_test_case.js": ["rollup"],
    },
    rollupPreprocessor: {
      plugins: [
        require("@rollup/plugin-node-resolve").nodeResolve({
          moduleDirectories: [
            "node_modules",
          ]
        }),
      ],
      output: {
        format: 'es',
        sourcemap: 'inline',
      },
    },
    client: {
      clearContext: false,
      qunit: {
        showUI: true
      }
    },
    hostname: "0.0.0.0",
    captureTimeout: 180000,
    browserDisconnectTimeout: 180000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 300000
  })
}
