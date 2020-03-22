var express = require("express")
var bodyParser = require('body-parser');
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var dburl = 'mongodb+srv://test:test@mongo-node-7o3il.mongodb.net/test?retryWrites=true&w=majority'

var Message = mongoose.model('Message',{
    name : String,
    message : String
})

app.get('/messages', (req,res)=>{
    Message.find({},(err,messages)=>{
        res.send(messages)
    }).sort({_id:1})
})

app.post('/messages', (req,res)=>{
    var message = new Message(req.body)
    message.save((err)=>{
        if(err)
            sendStatus(500)
            io.emit('message',req.body)
            res.sendStatus(200)
    })

})

io.on("connection",(socket)=>{
    console.log("user connected")
})

mongoose.connect(dburl,(err)=>{
    console.log("mongodb connected successful")
})

var PORT = process.env.PORT || 5000

var server = http.listen(PORT, () =>{
    console.log("Server is listening on port", server.address().port)
})
