'use strict';

var request = require("request");
// var bolt = require('@slack/bolt');

// populate environment variables locally.
require('dotenv').config()

// var expressReceiver = new bolt.ExpressReceiver({
//   signingSecret: `${process.env.SLACK_SIGNING_SECRET}`,
//   processBeforeResponse: true
// });

// var app = new bolt.App({
//   signingSecret: `${process.env.SLACK_SIGNING_SECRET}`,
//   token: `${process.env.SLACK_BOT_TOKEN}`,
//   receiver: expressReceiver
// });

var URL = "https://adoring-keller-21f535.netlify.app";


exports.handler = async function (event, context, callback) {

  // get the arguments from the notification
  var payload = JSON.parse(event.body);

  if (payload && payload.type && payload.type === 'url_verification') {
    return {
      statusCode: 200,
      body: payload.challenge
    };
  }

  // prepare call to the Slack API
  var slackURL = process.env.SLACK_WEBHOOK_URL
  var slackPayload = {
    "text": "New comment on " + URL,
    "attachments": [
      {
        "fallback": "New comment on the comment example site",
        "color": "#444",
        "author_name": payload.data.email,
        "title": payload.data.path,
        "title_link": URL + payload.data.path,
        "text": payload.data.comment
      },
      {
        "fallback": "Manage comments on " + URL,
        "callback_id": "comment-action",
        "actions": [
          {
            "type": "button",
            "text": "Approve comment",
            "name": "approve",
            "value": payload.id
          },
          {
            "type": "button",
            "style": "danger",
            "text": "Delete comment",
            "name": "delete",
            "value": payload.id
          }
        ]
      }]
  }

  // app.message(function () {
  //   app.client.chat.postMessage(slackPayload);
  // });

  // const slackEvent = {
  //   body: payload,
  //   ack: function (response) {
  //     return {
  //       statusCode: 200,
  //       body: response ?? ""
  //     };
  //   }
  // };

  // app.processEvent(slackEvent);

  // // post the notification to Slack
  request.post({ url: slackURL, json: slackPayload }, function (err, httpResponse, body) {
    var msg;
    if (err) {
      msg = 'Post to Slack failed:' + err;
    } else {
      msg = 'Post to Slack successful!  Server responded with:' + body;
    }
    callback(null, {
      statusCode: 200,
      body: msg
    })
    return console.log(msg);
  });
};
