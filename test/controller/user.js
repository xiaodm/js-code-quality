/**
 * Created by deexiao on 2017/9/4.
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

describe('user.js', function () {
	this.timeout(5000);
	before(function (done) {
		// runs before all tests in this block
		initConfig.init(initApp,done);
	});
	describe('/user/login test', function () {
		it('should success when user and pwd correct', function (done) {
			request.post('/user/login')
				.send({uid:"lzw4284",pwd:"888888"})
				.expect(200)
				.end(function (err, res) {
					res.body.ret.should.equal('0');
					should.not.exist(err);
					res.body.data.name.should.be.eql('liaozhiwei');
					done();
				});
		});

		it('should fail when user and pwd incorrect', function (done) {
			request.post('/user/login')
				.send({uid:"lzw4284",pwd:"111111"})
				.expect(200)
				.end(function (err, res) {
					res.body.ret.should.equal('1003');
					should.not.exist(err);
					//res.body.data.name.should.be.eql('liaozhiwei');
					done();
				});
		});

		it('should fail when  no user and pwd', function (done) {
			request.post('/user/login')
				.send({uid:"",pwd:""})
				.expect(200)
				.end(function (err, res) {
					res.body.ret.should.equal('0001');
					should.not.exist(err);
					//res.body.data.name.should.be.eql('liaozhiwei');
					done();
				});
		});
	});

	describe('/user/PcLogin test', function () {
		it('should fail when hqright and userid correct', function (done) {
			request.post('/user/PcLogin')
				.send({hqright:"wq3gfNjLhlsxP65rClKsU%2FazK0Ifjy5QlOg0P5bmWoDMuJvzMH0%2FrS2QTHpV63JnC1OLrdEdPeUj1PF3PooXkNoXDXZPSlt6tp0GfiOirPA%3D",userid:"r6DSE9K00j8%3D"})
				.expect(200)
				.end(function (err, res) {
					res.body.ret.should.equal('0');
					should.not.exist(err);
					res.body.data.name.should.be.eql('td_26');
					done();
				});
		});

		it('should fail when hqright and userid incorrect', function (done) {
			request.post('/user/PcLogin')
				.send({hqright:"wq3gfNjLhlsxP65rClKsU%2FazK0Ifjy5QlOg0P5bmWoDMuJvzMH0%2FrS2QTHpV63JnC1OLrdEdPeUj1PF3PooXkNoXDXZPSlt6tp0GfiOirPA%3D",userid:"r5DSE1K00j8%3D"})
				.expect(200)
				.end(function (err, res) {
					res.body.ret.should.equal('1004');
					should.not.exist(err);
					//res.body.data.name.should.be.eql('liaozhiwei');
					done();
				});
		});

		it('should fail when  no hqright and userid', function (done) {
			request.post('/user/PcLogin')
				.send({hqright:"",userid:""})
				.expect(200)
				.end(function (err, res) {
					res.body.ret.should.equal('0001');
					should.not.exist(err);
					//res.body.data.name.should.be.eql('liaozhiwei');
					done();
				});
		});
	});

	describe('/user/auth test', function () {
		it('should fail when uid and token incorrect', function (done) {
			request.post('/user/auth')
				.send({uid:"lzw4284",token:"111111"})
				.expect(200)
				.end(function (err, res) {
					res.body.ret.should.equal('-1');
					should.not.exist(err);
					//res.body.data.name.should.be.eql('liaozhiwei');
					done();
				});
		});

		it('should fail when  no uid and token', function (done) {
			request.post('/user/auth')
				.send({uid:"",token:""})
				.expect(200)
				.end(function (err, res) {
					res.body.ret.should.equal('0001');
					should.not.exist(err);
					//res.body.data.name.should.be.eql('liaozhiwei');
					done();
				});
		});
	});
});
