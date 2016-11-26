var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

mongoose.connect('mongodb://root:root@waffle.modulusmongo.net:27017/mOxiw8ux');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(methodOverride());

// model
var Todo = mongoose.model('Todo', {
	text : String
});

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

// front-end page
app.get('*', function(request, response) {
	response.sendfile('./public/index.html');
});


// ===================== Listen
app.listen(8081);
console.log("App listening on port 80");
