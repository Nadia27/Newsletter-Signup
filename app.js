// jshint esversion:6

const express = require('express'); // Server
const bodyParser = require('body-parser'); // middleware: parse incoming requests
const request = require('request'); // allows http requests


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
    url: 'https://us20.api.mailchimp.com/3.0/lists/7b80bdeb6f',
    method: 'POST',
    headers: {
      'Authorization': 'nadia 52e6735406006ddc48c04467fc3bda4b-us20'
    },
    body: jsonData
  }

  request(options, (error, response, body) => {
    if(error) {
      console.log(error);
    } else {
      console.log(response.statusCode);
    }
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// 52e6735406006ddc48c04467fc3bda4b-us20

// 7b80bdeb6f
