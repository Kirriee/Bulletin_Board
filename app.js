const express = require('express')
const app = express ()
const pg = require('pg')
const Sequelize = require ('sequelize')
const bodyParser = require ('body-parser')



var db = new Sequelize ('postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/bulletinboard');

// Testing connection
db
.authenticate()
.then(function(err) {
	console.log('Connection has been established successfully.');
}, function (err) {
	console.log('Unable to connect to the database:', err);
});

//setting view folder
app.set('views','./views');

// setting view engine
app.set('view engine', 'pug');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to ssupport URL-encoded bodies
	extended: false
})); 

app.use(express.static('statics'));

// get requqest index page

app.get("/", function(request, response){
	response.render('addMessage');
});

//get request /messages and sending data along
app.get("/messages", function(request, response){
	Message.findAll()
	.then (function(myMessages){
		console.log(myMessages.dataValues);
		response.render('messages',{key: myMessages});
	})		
	
});

//post request /messages
app.post("/messages", function(request, response){
	Message.create({
		title: request.body.title,
		body: request.body.body
	}).then( function() {
		response.redirect("/messages")
	})
	console.log("ik doe het")
	
	
})

//define the table message

var Message = db.define('message', {
	title: Sequelize.STRING,
	body: Sequelize.STRING,
});

db
    //sync the models
    .sync({force:true})
    .then(function(){
        //then create first message
       return Message.create({
        	title: 'Jane Smith',
        	body: 'This is a test message'
        })
    }).then((message) =>{
    	console.log('message is created')
    })

	//listening to localhost:3000
    app.listen(3000, function() {
    	console.log('server has started');
    });