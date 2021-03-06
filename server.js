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
  res.sendFile(__dirname + '/' + 'index3.html');
})
app.get('/index2.html', function(req, res) {
  res.sendFile(__dirname + '/' + 'index2.html');
})


app.post('/loadall', urlencodedParser, function(req, res) {
  var query ='match (p)-[r]-(n) return p,r,n limit 2'
  runQuery1(req, res, query)
});

//app.post('/loadall', urlencodedParser, function(req, res) {
function runQuery1( req, res, query) {
  console.log(query)
//  var response = {};
//  response["msg"] = req.body.data; // = '{"msg": "OKasdfas"}';
//  res.end(JSON.stringify(response));
/*
  var request =  require('request')
  var host = 'localhost'
  var port = 7474
  var httpUrlForTransaction = 'http://' + host + ':' + port + '/db/data/transaction/commit';

  function runCypherQuery(query, params, callback) {
  request.post({
      uri: httpUrlForTransaction,
      json: {statements: [{statement: query, parameters: params, resultDataContents:['graph'],includeStats:false  }]},
      auth:{user:'neo4j', pass:'password'}
    },
    function (err, body) {
      callback(err, body);
    })
  }
*/
  runCypherQuery(
// 'match(p:Person {name:"Joe Pantoliano"})-[r]-n return p,r,n ',
    query,
    {params: req.body
    },
    function (err, resp) {
      if (err) {
        console.log(err);
      }
      else {
        //console.log(JSON.stringify(resp));
        var nodes = {}
        var edges = {}

        //console.log(resp)
        resp.body.results[0].data.forEach( function(data) {
          data.graph.nodes.forEach( function(node) {
            if ( node.id in nodes) {
              // do nothing
            }
            else {
              nodes[node.id] = {data: node.properties}
              nodes[node.id].data.id = node.id
              nodes[node.id].data.labels = node.labels

              var labels = node.labels

              for( var i in node.labels) {
                //console.log(label)
                console.log(labels[i])
                var label = labels[i]
                nodes[node.id].data[ label] = 'true'

//                nodes[node.id].data.labels[label] = "true";
              }

//              nodes[node.id].position = {'x':100, 'y':100}

            }
          })
          data.graph.relationships.forEach( function(edge) {
            if (edge.id in edges) {
              // do nothing
            }
            else {
              edges[edge.id] = {data: edge.properties}
              edges[edge.id].data.id = edge.id
              edges[edge.id].data.labels = edge.type
              edges[edge.id].data.source = edge.startNode
              edges[edge.id].data.target = edge.endNode
            }
          })
        })
        var r = {elements: [] }
        for( var i in nodes) {
          r.elements.push(nodes[i])
        }
        for( var i in edges) {
          r.elements.push(edges[i])
        }
        console.log( JSON.stringify(r))
        console.log( JSON.stringify(edges))
        res.end(JSON.stringify(r))

     }
    });
  } // end loadall


  app.post('/neighbour', urlencodedParser, function(req, res) {
    var query ='match (p)-[r]-(n) where id(p)=toInt({id}) return p,r,n'
    runQuery1(req, res, query)
  })

  function runCypherQuery(query, params, callback) {
    var request =  require('request')
    var host = 'localhost'
    var port = 7474
    var httpUrlForTransaction = 'http://' + host + ':' + port + '/db/data/transaction/commit';

    console.log(params)

    request.post(
      {
        uri: httpUrlForTransaction,
        json: {statements: [{statement: query, parameters: params.params, resultDataContents:['graph'],includeStats:false  }]},
        auth:{user:'neo4j', pass:'password'}
      },
      function (err, body) {
        callback(err, body);
      }
    )
  } // end runCypherQuery

  var server = app.listen(8081,'0.0.0.0', function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("%s:%s", host, port);
})
