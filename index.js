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

app.get('/', (req, res) => {
  res.send('Hello I am a Database')
})


const port = 5000



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
client.connect(err => {
  const volunteerCollection = client.db("volunteerTasks").collection("volunteerActivities");
  const eventListCollection = client.db("volunteerTasks").collection("eventList");
  
    app.post('/addVolunteerEvent', (req, res) => { 
        const addEvents = req.body;
        console.log(addEvents)
        volunteerCollection.insertOne(addEvents)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

      app.get('/taskEvents', (req, res) => {
        volunteerCollection.find({})
        .toArray((err, documents) => {
          console.log(documents)
          res.send(documents)
      })

      })

    
     app.post('/addEvenRegister', (req, res) => {
      const eventRegister = req.body;
      eventListCollection.insertOne(eventRegister)
          .then(result => {
              res.send(result.insertedCount > 0)
          })
  })

  app.get('/eventRegister/:email', (req, res) => {
    const eventUserEmail = req.params.email;
     eventListCollection.find({ email: eventUserEmail })
        .toArray((err, documents) => {
            res.send(documents)
        })
})



  app.delete('/eventCancel/:id', (req, res) => {
     const id = req.params.id;
      eventListCollection.deleteOne({ _id: objectId(req.params.id) })
        .then((result) => {
            res.send(result.deletedCount > 0)
        })
})


 
 
});


app.listen( process.env.PORT || port);