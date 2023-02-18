const express = require('express');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const port = process.env.PORT;
const socialityio_connect_uri = process.env.SOCIALITYIO_CONNECT_URI;
const socialityio_connect_client_id = process.env.SOCIALITYIO_CONNECT_CLIENT_ID;
const socialityio_connect_client_secret = process.env.SOCIALITYIO_CONNECT_CLIENT_SECRET;

let CLIENT_USER_ID = 'unique_client_user_id';
// We store the access_token in memory - in production, store it in a secure persistent data store
let ACCESS_TOKEN = null;

const app = express();


async function getSessionToken() {
    try {
        let response = await axios({
             url: socialityio_connect_uri + '/v1/token/session',
             method: 'post',
             data: {
                client_id: socialityio_connect_client_id,
                client_secret: socialityio_connect_client_secret,
                client_user_id: CLIENT_USER_ID
            },
             headers: {
                'Content-Type': 'application/json'
            }
         })
         console.log('getSessionToken response.data', response.data);
         return response.data;
     }
     catch (err) {
         console.error(err);
     }
}

async function getAccessToken() {
    try {
        let response = await axios({
             url: socialityio_connect_uri + '/v1/token/access',
             method: 'post',
             data: {
                client_id: socialityio_connect_client_id,
                client_secret: socialityio_connect_client_secret,
                client_user_id: CLIENT_USER_ID
            },
             headers: {
                'Content-Type': 'application/json'
            }
         })
         console.log('getAccessToken response.data', response.data);
         return response.data;
     }
     catch (err) {
         console.error(err);
     }
}

async function getAccounts() {
    try {
        let response = await axios({
             url: socialityio_connect_uri + '/v1/accounts',
             method: 'get',
             headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + ACCESS_TOKEN
            }
         })
         console.log('getAccounts response.data', response.data);
         return response.data;
     }
     catch (err) {
         console.error(err);
     }
}


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/link', (req, res) => {
    var data =  getSessionToken().then(data => {
        console.log('/link ', data);
        res.setHeader('Content-Type', 'application/json');
        res.send({
            session_link: data.session_link
        });
    });
});

app.get('/callback', (req, res) => {
    var data =  getAccessToken().then(data => {
        console.log('/callback ', data);
        ACCESS_TOKEN = data.access_token;
        console.log('/callback ACCESS_TOKEN', ACCESS_TOKEN);
        res.sendFile(path.join(__dirname, '/dashboard.html'));
    });
});

app.get('/accounts', (req, res) => {
    var data =  getAccounts().then(data => {
        console.log('/accounts ', data);
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    });
});


app.listen(port);
console.log('Server started at: ' + port);