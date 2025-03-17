const express = require('express');
const {adminAuth} = require('./middlewares/auth');

const app = express();
// app.use("/",(req, res) => {
//   res.send('naveen'); 
// })
// app.use("/hello",(req, res) => {
//     res.send('hello naveen'); 
//   })

  app.use("/admin", adminAuth
)
// app.use((req, res) => {
//   res.send('hello world'); 
// })

// app.get('/user', (req, res) => {
//   res.send({"name":"naveen","age":23});
// })

// app.get('/user/:userId/:userName', (req, res) => {
//   console.log(req.params);
//   res.send({"name":"naveen","age":23});
// })

app.get('/admin/getalldata', (req, res) => {
  console.log(req.query);
  res.send({"name":"naveen","age":23});
})


app.post('/admin/deleteuser', (req, res) => {
  res.send("data saved");
})

app.listen(3001,()=>{
    console.log('listening on port 3001');
});
// app.get('/', (req, res) => {});