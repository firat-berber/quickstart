# Sociality.io SDK quickstart
Example project for using Sociality.io SDK.

This Quickstart is intended to demonstrate various products and configurations, featuring multiple Sociality.io SDK endpoints. The sample project was developed based on node.js as the backend.

![Sociality.io SDK quickstart app](/assets/quickstart.jpg)

## 1. Clone the repository
```bash
git clone https://github.com/socialityio/quickstart
cd quickstart
```

## 2. Set up your environment variables

```bash
cp .env.example .env
```

Copy `.env.example` to a new file called `.env` and fill out the environment variables inside. 
`SOCIALITYIO_SDK_CLIENT_ID` and `SOCIALITYIO_SDK_CLIENT_SECRET` must be filled out. 
Get your Sociality.io SDK API keys from the dashboard: https://sdk.sociality.io/dashboard

## 3. Set up your redirect URL
Add the callback function URL `http://localhost:3000/callback/` to the `redirect` field of your Sociality.io SDK app: https://sdk.sociality.io/dashboard

## 4. Run the Quickstart

### Pre-requisites

- Your environment variables populated in `.env`
- [npm](https://www.npmjs.com/get-npm)

### Running the backend

```bash
$ npm install
$ node app.js
```

The quickstart is now running on http://localhost:3000.
