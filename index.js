const express = require('express')
const fileUpload = require('express-fileupload');
const fs= require('fs-extra');
const ObjectID = require('mongodb').ObjectID;
// var bodyParser = require('body-parser')
var cors = require('cors')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oqtoq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
const port = process.env.PORT|| 5000

// const pass='sVTd1KFcW6DP2AiC'
app.use(express.json())
app.use(cors())
app.use(fileUpload());

app.get('/', (req, res) => {
  res.send('Hello World!')
})





const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const admincollection = client.db("travelinfo").collection("admininfo");
  const servicecollection = client.db("travelinfo").collection("serviceInfo");
  const bookingcollection = client.db("travelinfo").collection("bookinginfo");
  const reviewcollection = client.db("travelinfo").collection("userreview");
  app.post('/addpackage', (req, res) => {
    const file = req.files.file;
    const name = req.body.name;
    const email = req.body.email;
    const description=req.body.description;
    const day=req.body.day;
    const price=req.body.price
    console.log(file,name,email,description,day,price)
    
    const newImg = file.data;
    const encImg = newImg.toString('base64');
 
    var image = {
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encImg, 'base64')
    };
    const data ={
      name:name,
      email:email,
      img:image,
      day:day,
      price:price
    }
    servicecollection.insertOne(data)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
})

app.post('/addadmin',(req,res)=>{
  const admin=req.body
  admincollection .insertOne(admin)
  .then(result=>{
    console.log(result)
    res.send(result.insertedCount>0)
  })
})

app.post('/adminpage',(req,res)=>{
  const email=req.body.email
  admincollection.find({email:email})
  .toArray((err,documents)=>{
    res.send(documents.length>0)
  })
})

app.post('/userreview',(req,res)=>{
  const review=req.body
  reviewcollection.insertOne(review)
  .then((result)=>{
    console.log(result)
    res.send(result.insertedCount>0)
  })
})

app.get('/showreview',(req,res)=>{
  reviewcollection.find()
  .toArray((err,documents)=>{
    res.send(documents)
  })
})

app.post('/bookinginfo',(req,res)=>{
  const booking=req.body
  bookingcollection.insertOne(booking)
  .then((result)=>{
    console.log(result)
    res.send(result.insertedCount>0)
  })
})

app.get('/tourpackage',(req,res)=>{
  servicecollection.find()
  .toArray((err,documents)=>{
    res.send(documents)
  })
})

app.get('/booking/:id',(req,res)=>{
  servicecollection.find({_id: ObjectID(req.body.id)})
  .toArray((err,documents)=>{
    res.send(documents)
  })
})
app.get('/userbooklist',(req,res)=>{
  console.log(req.query.email)
  bookingcollection.find({email:req.query.email})
  .toArray((err,documents)=>{
    res.send(documents)
  })

})

app.get('/adminbooklist',(req,res)=>{
  bookingcollection.find()
  .toArray((err,documents)=>{
    res.send(documents)
  })

})

app.patch('/update/:id',(req,res)=>{
  console.log(req.params.id)
bookingcollection.updateOne({_id: ObjectID(req.params.id)}, 
{
 $set: {status: req.body.status}

})

.then(result=>{
  res.send(result.modifiedCount>0)
  })

})

app.delete('/delete/:id',(req,res)=>{
  servicecollection.deleteOne({_id: ObjectID(req.params.id)})
  .then(result =>{
    console.log(result)
    res.send(result.deletedCount>0)
   })
})

 
});


app.listen(port)
 