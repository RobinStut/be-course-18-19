const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
var rp = require('request-promise');
var cheerio = require('cheerio');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, "./static")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.get("/", (req, res) => res.render("pages/index"));
app.listen(process.env.PORT || 3000);

// rp('https://festivalfans.nl/agenda/')
//   .then(function (htmlString) {
//     console.log(htmlString);
//     // Process html...
//   })
//   .catch(function (err) {
//     // Crawling failed...
//   });



var options = {
  uri: 'https://festivalfans.nl/agenda/',
  transform: function (body) {
    return cheerio.load(body);
  }
};

rp(options)
  .then(function ($) {
    let counter = 0
    let scrapedFestivalData = []
    $('div.ev2page').children("script").each(function (i, element) {
      var a = $(this).html()

      if (counter < 50) {
        scrapedFestivalData.push(a)
      }
      counter + 1;
    });
    console.log(scrapedFestivalData);


  })
  .catch(function (err) {
    console.log(err);
    // Crawling failed or Cheerio choked...
  });