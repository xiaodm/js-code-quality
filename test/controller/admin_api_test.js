/**
 * Created by deexiao on 2017/8/29.
 */
'use strict';

const should = require("should");

const initConfig = require('../support/initConfig');

let app;
let request;

function initApp() {
	 app = require('../../src/server/app');
	 request = require('supertest')(app);
}

describe('admin_api.js', function () {
	this.timeout(5000);
	before(function (done) {
		// runs before all tests in this block
		initConfig.init(initApp,done);
	});

	describe('/api/lecturer/list all', function () {
		it('should get all data when no params', function (done) {
			//console.log('begin test 1');
			request.get('/api/lecturer/list')
				.set('Accept', 'application/json')
				.expect(200)
				.end(function (err, res) {
					res.body.ret.should.equal('0');
					should.not.exist(err);
					(res.body.data.length > 0).should.be.ok();
					done();
				});
		});
	});

	describe('/api/lecturer/list byid', function () {
		it('should get all data when no params', function (done) {
			//console.log('begin test 2');
			request.get('/api/lecturer/list?lecturer_id=78')
				.set('Accept', 'application/json')
				.expect(200)
				.end(function (err, res) {
					//console.log(res.body);
					res.body.ret.should.equal('0');
					should.not.exist(err);
					(res.body.data.length === 1).should.be.ok();
					done();
				});
		});
	});
});
