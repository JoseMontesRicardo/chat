var 	express = require('express'),
	app   = express(),
	server	  = require('http').Server(app),
	io 	  = require('socket.io')(server),
	_ 	  = require('underscore');

var usuarios = []

app.get('/', function (req, res){
	res.sendFile(__dirname+'/index.html');
})

io.on('connection', function (socket){
	console.log('socket connect'+socket.id)
	socket.on('adduser', function (data){
		usuarios.push({name: data, id: socket.id})
		console.log("numero de usuario: "+usuarios.length)
	})
	socket.on('message', function (data){
		var sockets = io.sockets.sockets
		var nameUser;
		usuarios.forEach(function(user){
			if (user.id == socket.id)
			{
				nameUser = user.name
			}
		});
		console.log(nameUser+"  DIJO MENSAJE:  "+data)
		sockets.forEach(function(sock){
			if (sock.id != socket.id){
				sock.emit('message', { name:nameUser, message: data })
			}
		});
	})
	socket.on('disconnect', function() {
		usuarios.forEach(function(user){
			if (user.id == socket.id){
				usuarios = _.without(usuarios, user)
			}
		});
		console.log("numero de usuarios"+usuarios.length)
		console.log('un usuario desconectado'+socket.id)
	})
})

server.listen(2000, function(){ console.log('server listen on port 2000') });