// Express.js + JSON parser
const Express = require("express");
const BodyParser = require("body-parser");

// Slack Dependencies
const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;

// RTM Related dependencies
var botToken = process.env.SLACK_API_TOKEN;
var rtm = new RtmClient(botToken);

// Since emojis must run over Web API
var WebClient = require('@slack/client').WebClient;
var web = new WebClient(process.env.SLACK_API_TOKEN);

// Port
const port = 1337;

// REST stuff
var RestClient = require('node-rest-client').Client;
var restClient = new RestClient();

// Incoming message handler
rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
  if (message["type"] === "message" && message["user"] !== rtm.activeUserId) {
    
    var args = {
      data: { text: message["text"] },
      headers: { "Content-Type": "application/json" }
    };
    
    restClient.registerMethod("postMethod", "http://eba.cloud:8080/getEmoji", "POST");
    restClient.methods.postMethod(args, function (data, response) {
      if(data.emoji.length > 0) {
        web.reactions.add(data.emoji, {
          channel: message["channel"],
          timestamp: message["ts"]
        });
      }
    });

    // Uncomment this later
    //rtm.sendMessage(message["text"], message["channel"]);
  }
});

// Connect with slack
rtm.start();

const app = Express();
app.get("/", function(req, res) {
  res.send("The bot will automatically register with slack. Nothing needs to be done.");
});

app.listen(port, function() {
  console.log("App listening on port: %d!", port);
});
