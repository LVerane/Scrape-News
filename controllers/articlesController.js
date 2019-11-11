var express = require("express");
var router = express.Router();
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

router.post("/scrape", function(req, res) {
  db.Note.remove({})
    .then(
      db.Article.remove({})
        .then(
          axios.get("https://www.bbc.com/news").then(function(response) {
            var $ = cheerio.load(response.data);

            $("div.gs-c-promo-body").each(function(i, element) {
              var result = {};
              result.headline = $(this)
                .find("h3")
                .html();

              result.summary = $(this)
                .find("p")
                .html();

              result.link =
                "https://www.bbc.com" +
                $(this)
                  .find("a")
                  .attr("href");

              db.Article.create(result)
                // .then(function(dbArticle) {})
                .catch(function(err) {
                  console.log(err);
                });
            });
            res.send("Scrape Complete");
          })
        )
        .catch(err => res.json(err))
    )
    .catch(err => res.json(err));
});

router.get("/", function(req, res) {
  db.Article.find({})
    .populate("note")
    .then(function(dbArticle) {
      console.log(dbArticle);
      res.render("index", { dbArticle });
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.post("/articles/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { note: dbNote._id } },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});
router.delete("/articles/:id", function(req, res) {
  db.Note.deleteOne({ _id: req.params.id })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

module.exports = router;
