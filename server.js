require('babel-register')({
	presets: ['react']
})

var express = require('express')
var app = express()
var React = require('react')
var ReactDOMServer = require('react-dom/server')
var Component = require('./Component.jsx')

var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');

var COMMENTS_FILE = path.join(__dirname, 'comments.json');
const url = '/api/comments'
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(request, respone){
	var props = {title: 'Comment Box'}
	var html = ReactDOMServer.renderToString(
		React.createElement(Component, props)
	)
	respone.send(html)
})

app.get(url, function(req, res) {
  fs.readFile(COMMENTS_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    var comments = JSON.parse(data) 
    res.json(comments);
  });
});

app.post(url, function(req, res) {
  fs.readFile(COMMENTS_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    var comments = JSON.parse(data);
    var newComment = {
      id: req.body.id,
      author: req.body.author,
      message: req.body.message,
    };
    comments.push(newComment);
    fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 4), function(err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      res.json(comments);
    });
  });
});

app.put(url, function(req, res) {
  fs.readFile(COMMENTS_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    var comments = JSON.parse(data);
    var deleteComment = {
      id: req.body.id,
      author: req.body.author,
      message: req.body.message,
    };
  
    for (var i in comments) {
      if (comments[i].id === deleteComment.id) {
          comments.splice(i, 1); 
      }
    } 
    fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 4), function(err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      res.json(comments);
    });
  });
});

var PORT = 3900
app.listen(PORT, function(){
	console.log('http://localhost:' + PORT)
})
