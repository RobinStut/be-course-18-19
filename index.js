const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
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



app.get("/", async (req, res) => {

  const retreivedData = await retreiveFestivalDataFromDb()

  res.render("pages/index", {
    data: retreivedData
  })
});


app.get("/updateFestivalPreferences/:clientId/:selectedFestivalArray/", async function (req, res) {
  const clientId = req.params.clientId
  console.log(clientId);
  const selectedFestivalArray = req.params.selectedFestivalArray.split(",")
  // var array = string.split(",");
  console.log(selectedFestivalArray);

  function writeData() {
    const dbRefObject = firebase.database().ref().child(`/users/${clientId}/festivalPreferences`)
    dbRefObject.set(selectedFestivalArray);
  }
  writeData()


});


function retreiveFestivalDataFromDb() {
  return firebase.database().ref('/festivalLijst/').once('value').then(function (snapshot) {
    const data = snapshot.val()
    return data
  })
}

const retreivedFestivalData = firebase.database().ref('/festivalLijst/').once('value').then(function (snapshot) {
  const data = snapshot.val()
  return data
}).then(data => {
  let scrapedFestivalData = [Date.now(), ]

  if (Date.now() > (Number(data[0]) + 86400000)) {

    const options = {
      uri: 'https://festivalfans.nl/agenda/',
      transform: function (body) {
        return cheerio.load(body);
      }
    };

    rp(options)
      .then(function ($) {
        $('div.ev2page').children("script").each(function (i, element) {
          const scriptTag = JSON.parse($(this).html())
          console.log('object');
          console.log(scriptTag);

          const rx = /(\d{4})-(\d{2})-(\d{2})T(\d{2}:\d{2}).*/g

          let startDateObj
          const startDate = scriptTag.startDate.replace(rx, (...x) => {
            startDateObj = {
              year: x[1],
              month: x[2],
              day: x[3],
              hour: x[4]
            }
          })

          let endDateObj
          const endDate = scriptTag.endDate.replace(rx, (...x) => {
            endDateObj = {
              year: x[1],
              month: x[2],
              day: x[3],
              hour: x[4]
            }
          })

          const newdata = {
            name: scriptTag.name,
            plaats: scriptTag.location.address.addressLocality,
            adres: scriptTag.location.name,
            startDate: startDateObj,
            endDate: endDateObj,
            image: scriptTag.image
          }

          scrapedFestivalData.push(newdata);
          console.log('objectend');
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
    scrapedFestivalData.push(data)
    console.log('use old data');

  }
})



io.on("connection", async function (socket) {

  const festivalData = await retreiveFestivalDataFromDb()

  socket.emit('festivalData', {
    festivalData: festivalData
  });

});



server.listen(process.env.PORT || 3000);