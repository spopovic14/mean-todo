console.log("Start");

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

console.log("Done with var setup");

mongoose.connect('mongodb://root:root@waffle.modulusmongo.net:27017/mOxiw8ux');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(methodOverride());

console.log("Done with basic setup");

// model
var Todo = mongoose.model('Todo', {
	text : String
});

console.log("Done with model setup");

// routes
app.get('/api/todos', function(request, response) {
	Todo.find(function(err, data) {
		if(err) {
			response.send(err);
		}
		
		response.json(data);
	});
});

app.post('/api/todos', function(request, response) {
	Todo.create({
		text : request.body.text,
		done : false
	}, function(err, todo) {
		if(err) {
			response.send(err);
		}
		
		Todo.find(function(err, data) {
			if(err) {
				response.send(err);
			}
			
			response.json(data);
		});
	});
});

app.delete('/api/todos/:todo_id', function(request, response) {
	Todo.remove({
		_id : request.params.todo_id
	}, function(err, todo) {
		if(err) {
			response.send(err);
		}
		
		Todo.find(function(err, data) {
			if(err) {
				response.send(err);
			}
			
			response.json(data);
		});
	});
});

console.log("Done with routes");

// front-end page
app.get('/', function(request, response) {
	response.sendfile('./public/index.html');
});

app.get('*', function(request, response) {
	response.sendfile('./public/index.html');
});

console.log("Done with GET for / and *");


// ===================== Listen
app.listen(80);
console.log("App listening on port 80");
