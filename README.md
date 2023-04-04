# Sociality.io SDK quickstart
This Quickstart is intended to demonstrate multiple Sociality.io SDK endpoints by using `Node.js` on the backend part. In this quickstart, you’ll learn:

- How Sociality.io SDK works without writing a line of code
- How your users will be connected to your app
- How to `GET` accounts, their posts and post details

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

Copy `.env.example` to a new file called `.env` and fill out the environment variables inside.

Remember:

- Your `SOCIALITYIO_SDK_CLIENT_ID` and `SOCIALITYIO_SDK_CLIENT_SECRET` must be filled out.
- You can get your Client ID and secrets from the dashboard: [https://sdk.sociality.io/dashboard](https://sdk.sociality.io/dashboard)

> REMINDER: `.env` files are handy for local development purposes. But you shouldn’t run a production application using an environment file with secrets in it.
>

## 3. Be sure your redirect URL is set
Your callback function URL is set as `http://localhost:3000/callback/` as default on your dashboard, but you can change it if necessary: [https://sdk.sociality.io/dashboard](https://sdk.sociality.io/dashboard)

Add your callback function URL to your `redirect` field of your Sociality.io SDK app.

## 4. Run the Quickstart

### Pre-requisites

- Your environment variables populated in `.env`
- [npm](https://www.npmjs.com/get-npm)

### Running the backend

```bash
$ npm install
$ node app.js
```

That’s it!
The quickstart is now running on [http://localhost:3000](http://localhost:3000/).
