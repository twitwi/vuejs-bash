
var express = require('express');
var app = express();
var path = require('path');
var { spawn } = require('child_process');

app.get("/RUN", (request, response) => {
  //console.log(request, response);
  let q = request.query.q.trim();
  if (! q.startsWith('[')) {
    q = JSON.stringify(q.split(' '));
  }
  q = JSON.parse(q);
  console.log(request.query.q, "->", q);

  let pr = spawn(q[0], q.slice(1));
  let res = null;
  pr.stdout.on('data', (data) => {
    //response.setHeader('Content-Type', 'text/html');
    console.log(data)
    if (res == null) {
      res = data;
    } else {
      res += data;
    }
  });
  pr.stdout.on('close', (code) => {
    if (res == null) {
      response.send('');
    } else {
      response.send(res.toString('utf-8'));
    }
  });
});

app.use(express.static(path.join(__dirname, 'static')));

app.listen(13579);
console.log('Listening on http://localhost:13579');
