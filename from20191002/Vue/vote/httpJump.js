const http = require('http')
http.createServer((req,res)=>{
  var url = "https://" + req.headers['host'] + req.url
  console.log("[跳转]:",url)
  res.writeHead(301,{'Location':url})
  res.end()
}).listen(80,()=>{
  console.log("listening HTTP 80")
})