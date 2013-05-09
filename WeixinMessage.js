
var WeixinMessage = module.exports = function(type) {
	this._type = type;
	this._content = '';
	this._flag = 0;
	this._items = [];
	this._create = null;
};

WeixinMessage.text = function(content) {
	var message = new WeixinMessage('text');
	return message.content(content);
};

WeixinMessage.news = function(items) {
	var message = new WeixinMessage('news');
	if (items && items.length > 0)
		items.forEach(function(item) {
			message.item(item);
		});
	return message;
};

WeixinMessage.prototype.from = function(from) {
	this._from = from;
	return this;
};

WeixinMessage.prototype.to = function(to) {
	this._to = to;
	return this;
};

WeixinMessage.prototype.content = function(content) {
	this._content = content || '';
	return this;
};

WeixinMessage.prototype.flag = function(flag) {
	this._flag = flag;
	return this;
};

WeixinMessage.prototype.item = function(item) {
	if (this._type != 'news')
		throw new Error('只能在msgType为news的消息中添加item: ' + this._type);
	this._items.push(item);
	return this;
};

WeixinMessage.prototype.created = function(created) {
	this._created = created;
	return this;
};

WeixinMessage.prototype.toString = function() {
	var resStr = '<xml>';
	resStr += '<FromUserName><![CDATA[' + this._from + ']]></FromUserName>';
	resStr += '<ToUserName><![CDATA[' + this._to + ']]></ToUserName>';
	resStr += '<Content><![CDATA[' + this._content + ']]></Content>';
	resStr += '<CreateTime>' + this._created + '</CreateTime>';
	resStr += '<MsgType><![CDATA[' + this._type + ']]></MsgType>';
	resStr += '<FuncFlag>' + this._flag + '</FuncFlag>';
	if (this._items.length > 0) {
		resStr += '<ArticleCount>' + this._items.length + '</ArticleCount>';
		resStr += '<Articles>';
		for (var i = 0, j = this._items.length; i < j; i++) {
			item = this._items[i];
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
