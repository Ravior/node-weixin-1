var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Weixin = require('./Weixin');

var WeixinProcessor = module.exports = function(secret) {
  EventEmitter.call(this);
	this.secret = secret;
};

util.inherit(WeixinProcessor, EventEmitter);

WeixinProcessor.prototype.validate = function(req, res) {
	if(Weixin.validate(this.secret, req))
		res.send(req.query.echostr);
	else
		res.send('error');
};

WeixinProcessor.prototype.process = function(req, res) {
	if(!Weixin.validate(req))
		return res.send('error');

	Weixin.normalize(req, function(err, xml) {
		if (err)
			this.emit('error', err, xml, res);
		else {
			this.emit('message', xml);
			if (xml.MsgType == 'event')
				this.emit('event:' + xml.Event, xml, res);
			else
				this.emit(xml.MsgType, xml, res);
		}
	});
};
