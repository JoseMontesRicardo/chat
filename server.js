var 	express = require('express'),
	app   = express(),
	server	  = require('http').Server(app),
	io 	  = require('socket.io')(server);

app.get('/', function (req, res){
	res.sendFile(__dirname+'/index.html');
})

io.on('connection', function (socket){
	console.log('socket connect'+socket.id)
	socket.on('message', function (data){
		console.log(socket.id+" DIJO MENSAJE:  "+data)
		io.emit('message', { message: data })
	})
	socket.on('disconnect', function() {
		console.log('un usuario desconectado'+socket.id)
	})
})

server.listen(2000, function(){ console.log('server listen on port 2000') });