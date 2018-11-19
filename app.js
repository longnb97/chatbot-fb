const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const config = require('./config');

let app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000))

app.listen(app.get('port'), (err) => {
    if (err) console.log(err);
    else console.log(`Server listening at ${app.get('port')}`);
})

app.get('/', homePage);
app.get('/webhook', verify);
app.post('/webhook', handleMessage)


function homePage(req, res) {
    res.send("Home Page")
}

function verify(req, res) {
    if (req.query['hub.verify_token'] === config.VALIDATION_TOKEN) {
        let query = req.query['hub.challenge']
        let sendData = { query, message: "verified success!" }
        res.send(sendData);
    }
    res.send('Error, wrong validation toke');
}

function handleMessage(req, res) {
    let messaging_events = req.body.entry[0].messaging
    console.log('//////////////////////////////////');
    console.log(JSON.stringify(req.body))
    console.log('//////////////////////////////////');
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        if (event.message && event.message.text) {
            let text = event.message.text
            sendTextMessage(sender, "Tin nhan :  " + text)
        }
        if (event.postback) {
            let text = JSON.stringify(event.postback)
            sendTextMessage(sender, "Postback: " + text.substring(0, 200), config.PAGE_ACCESS_TOKEN)
            continue
        }
    }
    res.sendStatus(200);
}

function sendTextMessage(sender, text) {
    let messageData = { text: text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: config.PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: sender },
            message: messageData,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

setInterval(function(){
    request({'https://chatbotbylong.hero'})
},1000*60*20)

// {
//     object: "page",
//     entry: [{
//         id: "2121424721411473",
//         time: 1542364825835,
//         messaging: [{
//             sender: {
//                 id: "2012290585495564"
//             },
//             recipient: {
//                 id: "2121424721411473"
//             },
//             timestamp: 1542364821509,
//             message: {
//                 mid: "OQjUPE7X3O_iB062K4Mo0ehHPOUOrrDMWwSQuVdpooRc5hYylA6LZhLJEEGwX7z5mcwJnfoWQtAy7Zvgw4obZw",
//                 seq: 1591505,
//                 text: "a",
//                 nlp: {
//                     entities: {
//                     }
//                 }
//             }
//         }]
//     }]
// }