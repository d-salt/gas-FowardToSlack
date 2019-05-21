function checkPortal() {
  var messages = getMails('is:unread label:agu/portal');
  
  messages.forEach(function (thread) {
    thread.forEach(function (message) {
      if (message.isUnread()) {
        var payload = portalMessageToJson(message);
        sendToSlack(payload);
        message.markRead();
      }
    });
  });
}

function portalMessageToJson (message) {
  var subject = message.getSubject();
  Logger.log(subject);
  var body = message.getPlainBody();
  Logger.log(body);
  // do not set 'global' option.
  var sender = /\[発信部署\]\s*(.*)/i.exec(body)[1];
  var title = /\[タイトル\]\s*(.*)/i.exec(body)[1];
  var content = /\[メッセージ\]\s*([\S\s]+?)\[発信部署\]/i.exec(body)[1];
  var matches = /\[表示期間\][\s\S]+\[(.*)\]\s*(.*)/i.exec(body);
  var attachment = (matches[1] !== '') ? { title: matches[1], url: matches[2] } : { title: '', url: '' };
  var strAttachment = attachment.title !== '' ? '<' + attachment.url + '|' + attachment.title + '>' : 'なし';
  var sendTo = (subject.indexOf('【個人】') > 0 || subject.indexOf('【呼出】') > 0) ? '@d.shiozawa' : '#portal';
          
  var json = JSON.stringify({
    "username" : sender,
    "channel": sendTo,
    "text": title,
    "attachments": [
      {
        "text": content, 
        "fields": [
          {
             "title": "添付資料",
             "value": strAttachment,
             "short": false
           }
         ]
       }
    ]
  });
  
  return json;
}

function checkCalledTo () {
  var messages = getMails('is:unread label:agu-portal');
  messages.forEach(function (thread) {
    thread.forEach(function (message) {
      if (message.isUnread()) {
        var subject = message.getSubject();
        var isCalled = subject.indexOf('【呼出】') > 0 ? true : false;
        if (isCalled) {
          var payload = portalMessageToJson(message);
          sendToSlack(payload);
          message.markRead();
        }
      }
    });
  });
}