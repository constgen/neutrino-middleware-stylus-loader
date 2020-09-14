let path = require('path')

let arrify    = require('arrify')
let deepmerge = require('deepmerge')

module.exports = function (customSettings = {}) {
	return function (neutrino) {
		const STYLUS_EXTENSIONS        = /\.styl(us)?$/
		const STYLUS_MODULE_EXTENSIONS = /\.module\.styl(us)?$/
		let projectNodeModules         = path.resolve(process.cwd(), 'node_modules')
		let { config }                 = neutrino
		let styleRule                  = config.module.rules.get('style')
		let stylusRule                 = config.module.rule('stylus')
		let styleExtensions            = styleRule && styleRule.get('test')
		let defaultSettings            = {
			include: [neutrino.options.source, neutrino.options.tests],
			exclude: [],
			stylus : {}
		}
		let settings                   = deepmerge(defaultSettings, customSettings)

		if (styleExtensions) {
			let extensions = arrify(styleExtensions).concat(STYLUS_EXTENSIONS)

			styleRule.test(extensions)
		}
		if (styleRule) {
			let oneOfs        = styleRule.oneOfs.values().filter(oneOf => oneOf.get('test'))
			let moduleOneOfs  = oneOfs.filter(oneOf => oneOf.uses.get('css').get('options').modules)
			let defaultOneOfs = oneOfs.filter(oneOf => !oneOf.uses.get('css').get('options').modules)

			moduleOneOfs.forEach(function (oneOf) {
				let extensions = arrify(oneOf.get('test')).concat(STYLUS_MODULE_EXTENSIONS)

				styleRule.oneOf(oneOf.name).test(extensions)
			})
			defaultOneOfs.forEach(function (oneOf) {
				let extensions = arrify(oneOf.get('test')).concat(STYLUS_EXTENSIONS)

				styleRule.oneOf(oneOf.name).test(extensions)
			})
		}

		stylusRule
			.test(STYLUS_EXTENSIONS)
			.include
				.merge(settings.include || [])
				.end()
			.exclude
				.merge(settings.exclude || [])
				.end()
			.use('stylus')
				.loader(require.resolve('stylus-loader'))
				.tap((options = {}) => options)
				.tap(options => deepmerge({
					sourceMap      : true,
					webpackImporter: true,
					additionalData : undefined,
					stylusOptions  : {
						paths  : [projectNodeModules],
						use    : [require('nib')()],
						import : ['nib'],
						include: [],
						define : [
							// [key, value, raw]
						],
						includeCSS: true,
						resolveUrl: true
					}
				}, options))
				.tap(options => deepmerge(options, { stylusOptions: settings.stylus }))
				.end()
	}
}