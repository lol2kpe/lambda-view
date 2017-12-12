#!/usr/bin/env node
var program = require('commander')

var lv-svr = lv-svr || {};

program
	.version(require('./package.json').version)

program
	.command('start')
	.description('start lambda-view web server')
	.option('-b, --background', 'run in background')
	.option('-p, --public', 'enable public access')
	.action(function() {
		console.log('starting lambda-view web server...')
		var opt = {
			background: this.background,
			public: this.public
		}
		require('fmtjs-web').start(opt, function(err, status) {
			if (err) {
				console.error(err.message)
				return
			}
			console.log(status.url)
		})
	})

program
	.command('stop')
	.description('stop lambda-view web server')
	.action(function() {
		console.log('stopping lambda-view web server...')
		require('fmtjs-web').stop(function(err) {
			if (err) {
				console.error(err.message)
				return
			}
			console.log('done.')
		})
	})

program
	.command('status')
	.description('retrieve lambda-view web server status')
	.action(function() {
		console.log('retrieving lambda-view web server status...')
		require('fmtjs-web').status(function(err, status) {
			if (err) {
				console.error(err.message)
				return
			}
			console.log(status)
		})
	})

if (process.argv.length <= 2) {
	program.parse(process.argv.concat(['--help']))
}
else {
	program.parse(process.argv)
}
