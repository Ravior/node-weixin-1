var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Weixin = require('./Weixin');

var WeixinProcessor = module.exports = function(secret) {
	EventEmitter.call(this);
	this.secret = secret;
};
util.inherits(WeixinProcessor, EventEmitter);

WeixinProcessor.prototype.validate = function(req, res) {
	if(Weixin.validate(this.secret, req))
		res.send(req.query.echostr);
	else
		res.send('error');
};

WeixinProcessor.prototype.process = function(req, res) {
	if(!Weixin.validate(this.secret, req))
		return res.send('error');
	var _this = this;
	Weixin.normalize(req, function(err, xml) {
		if (err)
			_this.emit('error', err, xml, res);
		else {
			_this.emit('message', xml);
			if (xml.MsgType == 'location')
				res.send(null);

			if (xml.MsgType == 'event')
				_this.emit('event:' + xml.Event, xml, res);
			else
				_this.emit(xml.MsgType, xml, res);
		}
	});
};
