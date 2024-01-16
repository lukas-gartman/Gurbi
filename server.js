require("http").createServer((request, response) => {
  response.end("Hello world!");
}).listen(8080);
