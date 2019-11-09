var express = require("express");
var router = express.Router();
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

// router.get("/", function(req, res) {
// cat.all(function(data) {
//   var hbsObject = {
//     cats: data
//   };

// res.render("index", hbsObject);
// res.render("index");
// });

// A GET route for scraping the echoJS website
router.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://www.bbc.com/news").then(function(response) {
    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(response.data);
    // An empty array to save the data that we'll scrape

    // With cheerio, find each p-tag with the "title" class
    // (i: iterator. element: the current element)
    $("div.gs-c-promo-body").each(function(i, element) {
      // Save the text of the element in a "title" variable
      var result = {};
      result.headline = $(this)
        // .text();
        .find("h3")
        .html();

      // In the currently selected element, look at its child elements (i.e., its a-tags),
      // then save the values for any "href" attributes that the child elements may have
      result.summary = $(this)
        .find("p")
        .html();

      result.link =
        "https://www.bbc.com" +
        $(this)
          .find("a")
          .attr("href");
      // Save these results in an object that we'll push into the results array we defined earlier
      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Log the results once you've looped through each of the elements found with cheerio
    // Send a message to the client
    res.send("Scrape Complete");
  });
});

router.get("/", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.render("index", { dbArticle });
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});
// Route for saving/updating an Article's associated Note
router.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { note: dbNote._id },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});
module.exports = router;
