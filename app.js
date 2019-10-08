// jshint esversion:6

const express = require('express'); // Server
const bodyParser = require('body-parser'); // middleware: parse incoming requests
const request = require('request'); // allows http requests

const config = require('./config.js');

const myKey = config.MAILCHIMP_API_KEY;
const myList = config.MAILCHIMP_AUDIENCE_ID;


const app = express();


// serve static files i.e. css, images
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req, res) => {
  var firstName = req.body.firstname;
  var lastName  = req.body.lastname;
  var email = req.body.email;

  var data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  var jsonData = JSON.stringify(data);

  var options = {
    url: 'https://us20.api.mailchimp.com/3.0/lists/' + myList,
    method: 'POST',
    headers: {
      'Authorization': 'nadia ' + myKey
    },
    //body: jsonData
  }

  request(options, (error, response, body) => {
    if(error) {
      res.sendFile(__dirname + '/failure.html');
    } else {
      if(response.statusCode === 200) {
        res.sendFile(__dirname + '/success.html');
      } else {
        res.sendFile(__dirname + '/failure.html');
      }

    }
  });
});

app.post('/failure', (req, res) => {
  res.redirect('/');
})



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
