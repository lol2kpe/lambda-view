#!/usr/bin/env node
var helper = require('./helper')
var assert = require('assert')
var path = require('path')
var program = require('commander')
var async = require('async')
var fmtjs = require('fmtjs')
var fmtjs_web = require('fmtjs-web')
var log = helper.log

var g = {
	url: null
}

var lv = lv || {};

program
	.version(require('./package').version)
	// .option('-s, --simple-mode', 'analyze as simple mode')
	// .option('-p, --package-mode', 'analyze as package mode')

program.parse(process.argv)

if (!program.args.length) {
	program.help()
}
else {
	run(program.args)
}

function run(files) {
	// start web server automatically
	start_web_server(function(err, status) {
		if (err) return

		g.url = status.url

		var funs = files.map(function(file) {
			return function(callback) {
				compile(file, function(err) {
					if (err) {
						callback(err)
					}
					else {
						console.log('')
						callback(err)
					}
				})
			}
		})
		async.series(funs, function(err, results) {
			if (err) {
				return
			}
		})
	})
}

function start_web_server(cb) {
	is_web_server_started(
		function yes(status) {
			cb(undefined, status)
		},
		function no() {
			var opt = {
				background: true,
				public: false
			}
			fmtjs_web.start(opt, function(err, status) {
				if (err) {
					log.error(err.message)
					cb(err)
					return
				}
				cb(undefined, status)
			})
		}
	)
}

function is_web_server_started(yes_cb, no_cb) {
	var web = require('fmtjs-web')
	web.status(function(err, status) {
		if (err) {
			no_cb()
		}
		else {
			yes_cb(status)
		}
	})
}

function compile(target, cb) {
	var filename = target
	if (!/^https?:\/\//i.test(target)) {
		filename = path.resolve(filename)
	}
	log.info('processing target: ' + filename)
	fmtjs_web.compile(
		{
			type: 'file',
			filename: filename
		},
		function (err, res) {
			if (err) {
				log.error(err.message)
				cb(err)
				return
			}
			else if (!res.ok) {
				log.error(res.error)
				cb(new Error(res.error))
				return
			}

			log.info('done, see ' + res.result.url)
			helper.open_html_file(res.result.url)
			cb(null)
		}
	)
}
