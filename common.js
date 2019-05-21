function getMails (query) {
  var threads = GmailApp.search(query);
  var messages = GmailApp.getMessagesForThreads(threads);
  return messages;
}

function sendToSlack (json) {
  const WEBHOOK_URL = getWebhookUrl();
  
  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": json
  };

  UrlFetchApp.fetch(WEBHOOK_URL, options); 
}
