const APP_SECRET = 'f8fe27169d1328156aea4c22b8634de3';
const VALIDATION_TOKEN = 'tokenn';
const PAGE_ACCESS_TOKEN = 'EAAEwKzAEQqwBAFOrrsygQE1OIcZBP1F4okVR2WeJiDXt82a6AmQ4aRp11UH42gZAlq5DKzLoBGqOzZBfsm9iBmGi65DvFGcHUuGVN5Xr3KtYaF1eZCG7dWdfQdk8H9zyVZCgA5arkACUPr8ZAIFJODqIZBFHTwZAE9b53s6Wn5lEdgZDZD';

const bodyParser = require('body-parser');
const express = require('express');
const app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));
var request = require("request");

app.get('/', (req, res) => {
    res.send("Home page. Server running okay.");
});

app.get('/webhook', function (req, res) { // Đây là path để validate tooken bên app facebook gửi qua
    if (req.query['hub.verify_token'] === VALIDATION_TOKEN) {
        let q = req.query['hub.challenge'];
        res.send({ q, message: 'ok' });
    }
    res.send('Error, wrong validation token');
});

app.post('/webhook/', function (req, res) { // Phần sử lý tin nhắn của người dùng gửi đến
    var entries = req.body.entry;
    for (var entry of entries) {
        var messaging = entry.messaging;
        for (var message of messaging) {
            var senderId = message.sender.id;
            if (message.message) {
                if (message.message.text) {
                    var text = message.message.text;
                    sendMessage(senderId, "Hello!! I'm a bot. Your message: " + text);
                    console.log('ok roi');
                }
            }
        }
    }
    res.status(200).send("OK");
});

// Đây là function dùng api của facebook để gửi tin nhắn
function sendMessage(senderId, message) {
    request({
        url: `https://graph.facebook.com/v2.6/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
        method: 'POST',
        json: {
            recipient: {
                id: senderId
            },
            message: {
                text: message
            },
        }
    });
}

app.set('port', process.env.PORT || 5000);
app.set('ip', process.env.IP || "0.0.0.0");

server.listen(app.get('port'), app.get('ip'), function () {
    console.log("Chat bot server listening at %s:%d ", app.get('ip'), app.get('port'));
});