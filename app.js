const express = require('express');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const Handlebars = require("handlebars");
require('dotenv').config();

const port = process.env.PORT || 3000;
const socialityio_sdk_uri = process.env.SOCIALITYIO_sdk_URI || "https://sdk.sociality.io";
const socialityio_sdk_client_id = process.env.SOCIALITYIO_SDK_CLIENT_ID;
const socialityio_sdk_client_secret = process.env.SOCIALITYIO_SDK_CLIENT_SECRET;

//The URL of the quickstart project
let app_url = 'http://localhost:' + port;

// This should correspond to a unique id for the current user in your database.
// Typically, this will be a user ID number from your application.
// Personally identifiable information, such as an email address or phone number, should not be used here.
let CLIENT_USER_ID = 'unique_client_user_id';

// We store the access_token in memory - in production, store it as encrypted in a secure persistent data store by
let ACCESS_TOKEN = null;

// Start up the server
const app = express();


// Create a session token with configs which we can then use to initialize Sociality.io SDK client-side.
async function getSessionToken() {
    try {
        let response = await axios({
            url: socialityio_sdk_uri + '/v1/token/session',
            method: 'post',
            data: {
                client_id: socialityio_sdk_client_id,
                client_secret: socialityio_sdk_client_secret,
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

// Get the access token of the given CLIENT_USER_ID
async function getAccessToken() {
    try {
        let response = await axios({
            url: socialityio_sdk_uri + '/v1/token/access',
            method: 'post',
            data: {
                client_id: socialityio_sdk_client_id,
                client_secret: socialityio_sdk_client_secret,
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

// Fetch the connected social media accounts.
async function getAccounts() {
    try {
        let response = await axios({
            url: socialityio_sdk_uri + '/v1/accounts',
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

// Fetch the the account by the given id
async function getAccount(account_id) {
    console.log('getAccount function ', account_id);
    try {
        let response = await axios({
            url: socialityio_sdk_uri + '/v1/accounts/' + account_id,
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + ACCESS_TOKEN
            }
         })
         console.log('getAccount response.data', response.data);
         return response.data;
     }
     catch (err) {
         console.error(err);
     }
}

// Fetch the latest posts of the given social media account.
async function getPosts(account_id) {
    console.log('getPosts function ', account_id);
    try {
        let response = await axios({
            url: socialityio_sdk_uri + '/v1/posts',
            method: 'get',
            data: {
                account_id: [account_id],
                skip: 0,
                limit: 5,
                // status: ['READY', 'IN_PROGRESS', 'PUBLISHED', 'FAILURE']
                // type: ['TEXT', 'IMAGE', 'VIDEO', 'CAROUSEL', 'LINK', 'REELS', 'STORY', 'POLL', 'DOCUMENT']
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + ACCESS_TOKEN
            }
         })
         console.log('getPosts response.data', response.data);
         return response.data;
     }
     catch (err) {
         console.error(err);
     }
}

// Fetch the the post by the given id
async function getPost(post_id) {
    console.log('getPost function ', post_id);
    try {
        let response = await axios({
            url: socialityio_sdk_uri + '/v1/posts/' + post_id,
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + ACCESS_TOKEN
            }
         })
         console.log('getPost response.data', response.data);
         return response.data;
     }
     catch (err) {
         console.error(err);
     }
}

// Internal function for rendering views
function view(filename, params = null) {
    var template = Handlebars.compile(fs.readFileSync(path.join(__dirname, '/views/' + filename), 'utf8'));
    return template(params);
    
}

// Returns the home page of the quickstart app
app.get('/', (req, res) => {
    res.send(view('index.html', {
        app_url: app_url,
    }));
});

// Returns the session link for redirecting the user to the SDK UI.
// The session link is valid for 10 mins. 
app.get('/session', (req, res) => {
    var data =  getSessionToken().then(data => {
        console.log('/session ', data);
        res.setHeader('Content-Type', 'application/json');
        res.send({
            session_link: data.session_link
        });
    });
});

// When the user completed the social media integration, this function will be called.
// Don't forget to add the callback function URL `http://localhost:3000/callback/` to the `redirect` field of your Sociality.io SDK app.
app.get('/callback', (req, res) => {
    var data =  getAccessToken().then(data => {
        console.log('/callback ', data);
        ACCESS_TOKEN = data.access_token;

        var data_accounts = getAccounts().then(data_accounts => {
            console.log('/callback getAccounts', data_accounts);
            var account = data_accounts.data[0];
            var data_posts = getPosts(account.id).then(data_posts => {
                res.send(view('dashboard.html', {
                    ACCESS_TOKEN: ACCESS_TOKEN,
                    CLIENT_USER_ID: CLIENT_USER_ID,
                    app_url: app_url,
                    accounts: data_accounts.data,
                    account: account,
                    posts: data_posts.data,
                }));
            });
        });
        
    });
});

// Returns the social media accounts of the connected user
app.get('/accounts', (req, res) => {
    var data =  getAccounts().then(data => {
        console.log('/accounts ', data);
        res.send(view('accounts.html', data));
    });
});

// Returns the account of the given id
app.get('/account', (req, res) => {
    var account_id = req.query.account_id;
    var data =  getAccount(account_id).then(data => {
        console.log('/account ', data);
        res.send(view('json.html', { json: JSON.stringify(data, null, 2)}));
    });
});

// Returns the social media posts of the selected social media accounts
app.get('/posts', (req, res) => {
    var account_id = req.query.account_id;
    console.log('/posts account_id ', account_id);
    var data =  getPosts(account_id).then(data => {
        console.log('/posts ', data);
        res.send(view('posts.html', data));
    });
});

// Returns the post of the given id
app.get('/post', (req, res) => {
    var post_id = req.query.post_id;
    var data =  getPost(post_id).then(data => {
        console.log('/post ', data);
        res.send(view('json.html', { json: JSON.stringify(data, null, 2)}));
    });
});


app.listen(port);
console.log('Server started at: ' + port);