## Ibrik instrumenter loader for [webpack](https://webpack.github.io/)

Instrument JS files with [Ibrik](https://github.com/Constellation/ibrik) for subsequent code coverage reporting.

[![Downloads](http://img.shields.io/npm/dm/ibrik-instrumenter-loader.svg)](https://npmjs.org/package/ibrik-instrumenter-loader) [![Code Climate](https://codeclimate.com/github/vectart/ibrik-instrumenter-loader/badges/gpa.svg)](https://codeclimate.com/github/vectart/ibrik-instrumenter-loader) [![David Dependencies](https://david-dm.org/vectart/ibrik-instrumenter-loader.svg)](https://david-dm.org/vectart/ibrik-instrumenter-loader)

### Install

```sh
$ npm install --save-dev ibrik-instrumenter-loader
```

### Usage

Useful to get work together [karma-webpack](https://github.com/webpack/karma-webpack) and [karma-coverage](https://github.com/karma-runner/karma-coverage). For example:

1. [karma-webpack config](https://github.com/webpack/karma-webpack#karma-webpack)
2. [karma-coverage config](https://github.com/karma-runner/karma-coverage#configuration)
3. replace `karma-coverage`'s code instrumenting with `ibrik-instrumenter-loader`'s one:

```javascript
config.set({
    ...
    files: [
      // 'src/**/*.js', << you don't need this anymore
      'test/**/*.js'
    ],
    ...
    preprocessors: {
        // 'src/**/*.js': ['coverage'], << and this too
        'test/**/*.js': [ 'webpack' ]
    },
    reporters: [ 'progress', 'coverage' ],
    coverageReporter: {
        type: 'html',
        dir: 'coverage/'
    },
    ...
    webpack: {
        ...
        module: {
            preLoaders: [ // << add subject as webpack's preloader
                {
                  test: /\.coffee$/,
                  // exclude this dirs from coverage
                  exclude: /(test|node_modules|bower_components)\//,
                  loader: 'ibrik-instrumenter-loader'
                },
            ],
            // other webpack loaders excluding coffeescript ...
            loaders: [ ... ],
        },
        ...
    }
});
```

[Documentation: Using loaders](https://webpack.github.io/docs/using-loaders.html).

### License
[WTFPL](http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-strip.jpg)
