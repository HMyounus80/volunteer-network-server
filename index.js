const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nhrx7.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}))




const port = 5000



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
client.connect(err => {
  const volunteerActivities = client.db("volunteerTasks").collection("volunteerActivities");
  const addEvents = client.db("volunteerTasks").collection("addEvents");
  
  app.post('/addEvent', (req, res) => {
      const eventOrder = req.body;
      console.log(eventOrder)
      addEvents.insertOne(eventOrder)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
  })

  app.get('/taskEvents', (req, res) => {
    addEvents.find({email: req.query.email})
   .toArray((err, documents) => {
     console.log(documents)
     res.send(documents)
   })
  })

  app.delete('event-cancel', (req, res) => {
    addEvents.deleteOne({_id:ObjectId(req.headers.id)})
    .then(result => {
      res.send(result.deletedCount > 0)
    })
  })



 
});


app.listen(process.env.PORT || port);