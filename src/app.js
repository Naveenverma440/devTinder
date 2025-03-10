const express = require('express');

const app = express();
app.use("/hello",(req, res) => {
    res.send('hello naveen'); 
  })
app.use((req, res) => {
  res.send('hello world'); 
})



app.listen(3001,()=>{
    console.log('listening on port 3001');
});
// app.get('/', (req, res) => {});