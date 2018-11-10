
var express = require('express');
var app = express();
var path = require('path');
var { spawn } = require('child_process');
var { StringDecoder } = require('string_decoder');

app.get("/RUN", (request, response) => {
  //console.log(request, response);
  let q = request.query.q.trim();
  if (! q.startsWith('[')) {
    q = JSON.stringify(q.split(' '));
  }
  q = JSON.parse(q);
  console.log(request.query.q, "->", q);

  let pr = spawn(q[0], q.slice(1));
  let res = '';

  let decoder = new StringDecoder('utf8');

  pr.stdout.on('data', (data) => {
    //response.setHeader('Content-Type', 'text/html');
    response.setHeader('Content-Type', 'text/plain');
    //console.log(data, data.toString('utf8'));
    res += decoder.write(data);
    //console.log(data, data.toString('utf8'), res);
  });
  pr.stdout.on('close', (code) => {
    console.log(res);
    response.send(res);
  });
});

app.use(express.static(path.join(__dirname, 'static')));

app.listen(13579);
console.log('Listening on http://localhost:13579');
