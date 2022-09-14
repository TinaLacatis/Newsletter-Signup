const express = require("express");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public")); // we acces the static documents
app.use(express.urlencoded({extended: true})); //we take the data from our form

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) { //don't forget to have an action="/" and method="POST" in your form
  const firstN = req.body.firstName; //id in HTML is id=firstName
  const lastN = req.body.lastName; //id in HTML is id=lastName
  const eMail = req.body.email; //id in HTML is id=email
  const data = {
    members: [
      {
        email_address: eMail,
        status: "subscribed",
        merge_fields: {
          FNAME: firstN,
          LNAME: lastN
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data); //transform the data into string

  const url = "https://us11.api.mailchimp.com/3.0/lists/4ae726df1c";

  const options = {
    method: "POST",
    auth: "tina:3757cc8b8f88efd79285cd51a4ea7e29-us11"//api key
  };

  const request = https.request(url, options, function(response) {
    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
      // res.send("Successfully subscribed");
    } else {
      res.sendFile(__dirname + "/failure.html");
      // res.send("There was an error with singning up, please try again!");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res){
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.")
});

//api
//3757cc8b8f88efd79285cd51a4ea7e29-us11

//audience id
//4ae726df1c
