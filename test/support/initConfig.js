/**
 * Created by deexiao on 2017/8/29.
 */
"use strict";

const
	path = require('path'),
	co = require('co'),
	log = require('../../src/server/taf/logger/index'),
	ConfigHelper = require('@taf/taf-config-helper').Helper;

module.exports = {
	init: function (initApp,done) {
		co(function * getTafConfigAndStart() {
			//console.log('begin get config');
			const env = process.env.NODE_ENV || 'development';
			let fileName = `jinzheng_${env}.conf`;
			let conf = yield ConfigHelper.getConfig({
				fileName: fileName,
				path: path.resolve(__dirname, '../../' + fileName)
			});
			if (conf.iRet === ConfigHelper.E_RET.OK) {
				// 成功获取配置文件
				try {
					//console.log(conf.data);
					global.taf_config = JSON.parse(conf.data);
					initApp();
					done();
				} catch (e) {
					log.exception.error('Fail to parse config: ', e);
					global.taf_config = {};
				}
			} else {
				log.error.error(conf);
			}
		}).catch(err => {
			log.error.error(err);
		});
	}
}


