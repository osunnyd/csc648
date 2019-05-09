var express = require('express');
var router = express.Router();
var db = require('../db');
const {ensureAuthenticated} = require('../config/auth.js');
var app = express();
app.set('view engine', 'ejs');

router.get('/', ensureAuthenticated ,userdashfnc, (req, res) => {
    var searchResult = req.searchResult;
        // Tells node to render this ejs file named user 
        res.render('userdash', {
            // Ejs variables being passed into user.ejs
            searchResult: searchResult,
            searchTerm: req.searchTerm,
            searchCategory: req.query.category
        });
    });

// Search function works for rendering the page first time
function userdashfnc (req, res, next) {
	var searchTerm = req.query.search;
    var searchCategory = req.query.category;
    let query = null;
    if(req.user != undefined) {
        console.log("User ID is: " + req.user[0].id);
        query = `SELECT * FROM post where user_id= ${req.user[0].id}`;
    }
    
    
    db.query(query, (err, result) => {
        if (err){
            req.searchResult = "Cannot find result";
            req.searchTerm = "Cannot find search term";
        }
        req.searchResult = result;
        req.searchTerm = searchTerm;
        req.searchCategory = searchCategory;
         next();
    });  
}

module.exports = router;
