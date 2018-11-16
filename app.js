const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const config = require('./config');

let app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 5000;

app.listen(port, (err) => {
    if (err) console.log(err);
    else console.log(`Server listening at ${port}`);
})

app.use('/', homePage);
app.get('/webhook', verify);
app.post('/webhook', handleMessage)


function homePage(req, res) {
    res.send("home")
}

function verify(req, res) {
    if (req.query['hub.verify_token'] === config.VALIDATION_TOKEN) {
        let query = req.query['hub.challenge']
        res.send({ query, message: "verified success!" });
    }
    res.send('Error, wrong validation token ');
}

function handleMessage(req, res) {
    var entries = req.body.entry;
    for (var entry of entries) {
        var messaging = entry.messaging;
        for (var message of messaging) {
            var senderId = message.sender.id;
            if (message.message) {
                if (message.message.text) {
                    var text = message.message.text;
                    sendMessage(senderId, "Hello!! I'm a bot. Your message: " + text);
                }
            }
        }
    }
    res.status(200).send("OK");
}

function sendMessage() {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: config.PAGE_ACCESS_TOKEN,
        },
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