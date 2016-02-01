var express = require('express');
var app = express();
var fs = require('fs');
app.use(express.static('public'));
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});

app.get('/listUsers', function (req, res) {
  fs.readFile(__dirname + '/' + 'users.json', 'utf8', function(err, data) {
    if(err) {
      return console.error(err)
    }
    res.send(data)
  });
})

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/' + 'index.html');
})

app.post('/data', urlencodedParser, function(req, res) {

//  var response = {};
//  response["msg"] = req.body.data; // = '{"msg": "OKasdfas"}';
//  res.end(JSON.stringify(response));
  var request =  require('request')
  var host = 'localhost'
  var port = 7474
  var httpUrlForTransaction = 'http://' + host + ':' + port + '/db/data/transaction/commit';

  function runCypherQuery(query, params, callback) {
  request.post({
      uri: httpUrlForTransaction,
      json: {statements: [{statement: query, parameters: params}]},
      auth:{user:'neo4j', pass:'password'},
      resultDataContents:['row', 'graph']
    },
    function (err, body) {
      callback(err, body);
    })
  }

  runCypherQuery(
// 'match(p:Person {name:"Joe Pantoliano"})-[r]-n return p,r,n ', 
 'match path=(p:Person {name:"Joe Pantoliano"})-[r]-n return p,n,r,labels(p), labels(n)',
    {name: req.body.data
    }, 
    function (err, resp) {
      if (err) {
        console.log(err);
      } 
      else {
//        console.log(JSON.stringify(resp));
        //console.log(resp)
        res.end(JSON.stringify(resp))
      }  
    }); 
})

  var server = app.listen(8081,'192.168.93.24', function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("%s:%s", host, port);
})

