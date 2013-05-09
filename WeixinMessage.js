
var WeixinMessage = module.exports = function(type) {
  this.type = type;
	this.content = '';
	this.flag = 0;
	this.items = null;
	this.created = null;
};

WeixinMessage.text = function(content) {
	var message = new WeixinMessage('text');
	return message.content(content);
};

WeixinMessage.news = function(items) {
	var message = new WeixinMessage('news');
	if (items && items.length > 0)
		items.forEach(message.bind(message));
	return message;
};

WeixinMessage.prototype.from = function(from) {
	this.from = from;
	return this;
};

WeixinMessage.prototype.to = function(to) {
	this.to = to;
	return this;
};

WeixinMessage.prototype.content = function(content) {
	this.content = content || '';
	return this;
};

WeixinMessage.prototype.flag = function(flag) {
	this.flag = flag;
	return this;
};

WeixinMessage.prototype.item = function(item) {
	if (this.type != 'news')
		throw new Error('只能在msgType为news的消息中添加item');
	this.item.push(item);
	return this;
};

WeixinMessage.prototype.created = function(created) {
	this.created = created;
	return this;
};

WeixinMessage.prototype.toString = function() {
	var resStr = '<xml>';
	resStr += '<FromUserName><![CDATA[' + this.from + ']]></FromUserName>';
	resStr += '<ToUserName><![CDATA[' + this.to + ']]></ToUserName>';
	resStr += '<Content><![CDATA[' + this.content + ']]></Content>';
	resStr += '<CreateTime>' + this.created + '</CreateTime>';
	resStr += '<MsgType><![CDATA[' + this.type + ']]></MsgType>';
	resStr += '<FuncFlag>' + this.flag + '</FuncFlag>';
	if (this.items.length > 0) {
		resStr += '<ArticleCount>' + this.items.length + '</ArticleCount>';
		resStr += '<Articles>';
		for (var i = 0, j = this.items.length; i < j; i++) {
			item = this.items[i];
			resStr += '<item>';
			resStr += '<Title><![CDATA[' + item.title + ']]></Title>';
			resStr += '<Description><![CDATA[' + item.description + ']]></Description>';
			resStr += '<PicUrl><![CDATA[' + item.pic + ']]></PicUrl>';
			resStr += '<Url><![CDATA[' + item.url + ']]></Url>';
			resStr += '</item>';
		}
	}
	resStr += '</xml>';
	return resStr;
};
