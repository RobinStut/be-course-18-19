const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const rp = require('request-promise');
const cheerio = require('cheerio');
require('dotenv').config()
require("dotenv-json")();
const apiKey = process.env.apiKey;
const authDomain = process.env.authDomain;
const databaseURL = process.env.databaseURL;
const projectId = process.env.projectId;
const storageBucket = process.env.storageBucket;
const messagingSenderId = process.env.messagingSenderId;
const appId = process.env.appId;
const firebase = require('firebase');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, "./static")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.get("/", (req, res) => res.render("pages/index"));
app.listen(process.env.PORT || 3000);

const admin = require('firebase-admin');

const serviceAccount = require('./static/backend-robinstut-firebase-adminsdk-e7366-9cc3556bac.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://backend-robinstut.firebaseio.com"
});

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  databaseURL: databaseURL,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId
};

firebase.initializeApp(firebaseConfig);

return firebase.database().ref('/festivalLijst/').once('value').then(function (snapshot) {
    const timestamp = snapshot.val()[0]
    return timestamp
  })
  .then(timestampInDb => {
    if (Date.now() > (timestampInDb + 86400000)) {
      // get new data
      let scrapedFestivalData = [Date.now(), ]
      const options = {
        uri: 'https://festivalfans.nl/agenda/',
        transform: function (body) {
          return cheerio.load(body);
        }
      };

      rp(options)
        .then(function ($) {
          $('div.ev2page').children("script").each(function (i, element) {
            const a = JSON.parse($(this).html())
            scrapedFestivalData.push(a)
          });
        })
        .then(write => {
          firebase.database().ref('festivalLijst/').set(scrapedFestivalData);
        })

        .catch(function (err) {
          console.log(err);
        });

    } else {
      //use old data
    }
  })