const express = require('express')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => console.log('💬 server on port', PORT))

const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'public')))

let socketConnected = new Set()

io.on('connection', onConnected)

function onConnected(socket){
    socketConnected.add(socket.id)

    io.emit('clients-total', socketConnected.size)

    socket.on('disconnect', () => {
        socketConnected.delete(socket.id)
        io.emit('clients-total', socketConnected.size)
    })

    socket.on('message', (data) => {
        socket.broadcast.emit('chat-message', data)
    })

    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data)
    })
}

