function checkCoursePower() {
  var messages = getMails('is:unread label:agu/coursepower');
  
  messages.forEach(function (thread) {
    thread.forEach(function (message) {
      if (message.isUnread()) {
        var payload = cpMessageToJson(message);
        if (payload !== null) sendToSlack(payload);
        message.markRead();
      }
    });
  });
}

function cpMessageToJson (message) {
  var subject = message.getSubject();
  Logger.log(subject);
  var body = message.getPlainBody();
  Logger.log(body);
  if (/発信者:\s*(.*)/i.exec(body) === null) return null
  var sender = /発信者:\s*(.*)/i.exec(body)[1];
  var title = /関連講義名:\s*(.*)/i.exec(body)[1];
  var content = /内容:\s*([\S\s]+?)添付ファイル:/i.exec(body)[1];
  var attachment = /添付ファイル:\s*(.*)/i.exec(body);
//  var strAttachment = attachment.title !== '' ? '<' + attachment.url + '|' + attachment.title + '>' : 'なし';
  var sendTo = '@d.shiozawa';
          
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
             "value": attachment,
             "short": false
           }
         ]
       }
    ]
  });
  
  return json;
}