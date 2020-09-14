# Neutrino Stylus loader middleware

[![npm](https://img.shields.io/npm/v/neutrino-middleware-stylus-loader.svg)](https://www.npmjs.com/package/neutrino-middleware-stylus-loader)
[![npm](https://img.shields.io/npm/dt/neutrino-middleware-stylus-loader.svg)](https://www.npmjs.com/package/neutrino-middleware-stylus-loader)

`neutrino-middleware-stylus-loader` is a [Neutrino](https://neutrino.js.org) middleware for compiling styles with [Stylus](https://stylus-lang.com/). This middleware only transforms Stylus to CSS. It is recommended to have `@neutrinojs/style-loader` (or its substitution) in the configuration to be able to compile Stylus styles to JavaScript modules.

## Features

- Compatible with any other middlewares. Requires `style` rule to be defined before.
- Include `nib` extension by default. You can `@import 'nib'` in your code

## Requirements

* Node.js v10.13+
* Neutrino v9

## Installation

`neutrino-middleware-stylus-loader` can be installed from NPM. You should install it to `"dependencies"` (--save) or `"devDependncies"` (--save-dev) depending on your goal.

```bash
npm install --save-dev neutrino-middleware-stylus-loader
```

## Usage

`neutrino-middleware-stylus-loader` can be consumed from the Neutrino API, middleware, or presets.

### In preset

Require this package and plug it into Neutrino. The following shows how you can pass an options object to the middleware, showing the defaults:

```js
let stylusLoader = require('neutrino-middleware-stylus-loader')

neutrino.use(stylusLoader({
   include: ['src', 'test'],
   exclude: [],
   stylus : {
      paths  : ['node_modules'],
      use    : [nib()],
      import : ['nib'],
      include: [],
      define : [
         // [key, value, raw]
      ],
      includeCSS: true,
      resolveUrl: true
   }
}))
```

- `include`: optional array of paths to include in the compilation. Maps to Webpack's rule.include.
- `exclude`: optional array of paths to exclude from the compilation. Maps to Webpack's rule.include.
- `stylus`: optional [Stylus options](https://stylus-lang.com/docs/js.html) config that is passed to the loader.

It is recommended to call this middleware after the `neutrino.config.module.rule('style')` to make it work properly. More information about usage of Neutrino middlewares can be found in the [documentation](https://neutrino.js.org/middleware).

### In **neutrinorc**

The middleware also may be used together with another presets in Neutrino rc-file, e.g.:

**.neutrinorc.js**

```js
let web    = require('@neutrino/web')
let stylus = require('neutrino-middleware-stylus-loader')

module.exports = {
   use: [
      web(),
      stylus()
   ]
}
```

### Imports paths

The loader can resolve paths in one of two modes: Stylus or Webpack.

Webpack's resolver is used by default. To use its advantages to look up the `modules` you need to prepend `~` to the path:

```css
@import "~bootstrap/stylus/bootstrap";
```

Otherwise the path will be determined as a relative URL, `@import "file"` is the same as `@import "./file"`

### Plugins

> This middleware already includes `nib` plugin by default. So you don't need to include it by yourself

In order to use Stylus plugins, simply add them to the the `use` option:

```js
let myStylusPlugin = require('my-stylus-plugin')

neutrino.use(stylusLoader({
   stylus: {
      use: [myStylusPlugin()]
   }
}))
```