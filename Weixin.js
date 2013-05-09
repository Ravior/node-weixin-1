var fs = require('fs');
var crypto = require('crypto');
var xml2js = require('xml2js');
var BufferHelper = require('bufferhelper');
var WeixinMessage = require('./WeixinMessage');
var parser = new xml2js.Parser();

var Weixin = module.exports = {};

//微信接口验证
Weixin.validate = function(secret, req) {
  if (!req.query.nonce || !req.query.timestamp || !req.query.signature)
		return false;
	var validator = [secret, req.query.timestamp, req.query.nonce].sort().join('');

	var sha1Sum = crypto.createHash('sha1');
	var v = sha1Sum.update(validator).digest('hex');

	return req.query.signature == v;
};

//解析微信发来的ＸＭＬ，支持文本、事件、图片
Weixin.normalize = function(req, cb) {
	var bufferHelper = new BufferHelper();
	req.on('data', function (chunk) {
		bufferHelper.concat(chunk);
	});
	req.on('end', function () {
		var xmlStr = bufferHelper.toBuffer().toString();
		parser.parseString(xmlStr, function(err, result) {
			if (err || !result || !result.xml)
				return cb(err || new Error('no xml string'));
			var xmlTmp = result.xml
			var xml = {
				MsgId: xmlTmp.MsgId[0],
				MsgType: xmlTmp.MsgType[0],
				ToUserName: xmlTmp.ToUserName[0],
				FromUserName: xmlTmp.FromUserName[0],
				CreateTime: xmlTmp.CreateTime[0],
				//text
				Content: xmlTmp.Content ? xmlTmp.Content[0] : '',
				//image
				PicUrl: xmlTmp.PicUrl ? xmlTmp.PicUrl[0] : '',
				//link
				Description: xmlTmp.Description ? xmlTmp.Description[0] : '',
				Url: xmlTmp.Url ? xmlTmp.Url[0] : '',
				//event
				Event: xmlTmp.Event ? xmlTmp.Event[0] : '',
				EventKey: xmlTmp.EventKey ? xmlTmp.EventKey[0] : ''
			};
			cb(null, xml);
		});
	});
};

Weixin.responseText = function(xml, content) {
	return WeixinMessage.text(content)
						.from(xml.ToUserName)
						.to(xml.FromUserName)
						.created(xml.CreateTime);
};

Weixin.responseMulti = function(xml, items) {
	return WeixinMessage.news(items)
						.from(xml.ToUserName)
						.to(xml.FromUserName)
						.created(xml.CreateTime);
};
