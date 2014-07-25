// server

// setting up with dependencies
var express  = require('express');
var app      = express();
var mongoose = require('mongoose');

// configuration
mongoose.connect('mongodb://localhost/tododb');

app.configure(function() {
	app.use(express.static(__dirname + '/public'));
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
});

// The app will now listen on port 8080
app.listen(8080);
console.log('App is listening on port 8080');

// defining mongo model
var Todo = mongoose.model('Todo', {
	text: String
});

// API routes

// This function handles the get statements i.e. when the client asks for data
app.get('/api/todos', function(req, res) {
	Todo.find(function(err, todos) {
		// if there is an error, it sends the error
		if(err)
			res.send(err);
		// or it sends the data
		res.json(todos);
	});
});

// This function handles post function i.e. when the client sends data (makes a todo)
app.post('/api/todos', function(req, res) {
	// creates a new todo in the mongo database
	Todo.create({
		text: req.body.text,
		done: false
	}, function(err, todos) {
		if(err)
			res.send(err);
		Todo.find(function(err, todos) {
			if(err)
				res.send(err);
			res.json(todos);
		});
	});
});

// This function handles the deleting of todos which is sent from the client
app.delete('/api/todos/:todo_id', function(req, res) {
	// removes the data in db matching the id
	Todo.remove({
		_id: req.params.todo_id
	}, function(err, todo) {
		console.log("I came here");
		if(err)
			res.send(err);
		// finds and sends all todos matching id
		Todo.find(function(err, todos) {
			if(err)
				res.send(err);
			res.json(todos);
		});
	});
});

// Application routes

// This tells the client to open index.html
app.get('*', function(req, res) {
	res.sendfile('./public/index.html');
});