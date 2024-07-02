const express = require ("express") 
const cors = require ("cors") 
const { MongoClient, ServerApiVersion, ObjectId  } = require('mongodb');
require('dotenv').config()
const app = express() ; 
const port = process.env.PORT || 5000 ;

// const corsConfig = {
//   origin: ["http://localhost:5173"],
//   credentials: true,
// };
// app.use(cors(corsConfig));




app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4dm99p5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect(); 


    const spotCollection = client.db('spotDB').collection('spot') 
    const countriesCollection = client.db('spotDB').collection('countries')

 // viewDetails

   
  // countries api 
  app.get('/countries' , async (req,res)=> { 

    const cursor = countriesCollection.find() ;
    const result = await cursor.toArray() ; 
    res.send(result)

  }) 
   

  // addspot api 


    app.get('/addSpot' , async (req,res)=> { 

      const cursor = spotCollection.find() ;
      const result = await cursor.toArray() ; 
      res.send(result)

    }) 


    app.get('/addSpot/email', async(req , res)=> {
      const email = req.query.email ;
      const filter = {user_email:email}
      const result = await spotCollection.find(filter).toArray() ;
      res.send(result) 

    } ) 

    app.get('/addSpot/:id' , async(req , res)=> {
      const id = req.params.id ; 
      const filter = {_id : new ObjectId(id)}
      const result = await spotCollection.findOne(filter) 
      res.send(result)
     }) 




     //country details
     app.get('/countries/:country', async (req, res) => {
      const country = req.params.country;
      const filter = { country_name: country };
      const result = await spotCollection.find(filter).toArray();
      res.send(result);
  });
  

     //myList
     app.post('/addSpot', async (req, res) => {
      const newSpot = req.body;
      newSpot.user_email = req.body.user_email; // Assign user email to spot
      console.log(newSpot);
      const result = await spotCollection.insertOne(newSpot);
      res.send(result);
  });
  

   
    app.post('/addSpot' , async (req , res)=> {
      const newSpot = req.body ;
      console.log(newSpot)
      const result = await spotCollection.insertOne(newSpot)
      res.send(result)
    }) 

    //delete 

    app.delete('/addSpot/:id', async(req , res) => {
       const id = req.params.id 
       const query = { _id : new ObjectId(id)}
       const result = await spotCollection.deleteOne(query) 
       res.send(result)
    } )
 
  // update 
  app.put('/addSpot/:id' , async(req , res)=> {
    const updatedSpot = req.body 
    const id = req.params.id 
    const filter = {_id : new ObjectId(id)}
    const option = { upsert: true } 
    const spot = { 
      $set : { 
        image:updatedSpot.image , tourists_spot_name:updatedSpot.image , country_name:updatedSpot.country_name , location:updatedSpot.location , short_description:updatedSpot.short_description , average_cost:updatedSpot.average_cost , seasonality:updatedSpot.seasonality , travel_time:updatedSpot.travel_time , total_visitors_per_year:updatedSpot.total_visitors_per_year , user_email:updatedSpot.user_email , user_name:updatedSpot.user_name
       }
     } 

     const result = await spotCollection.updateOne(filter,spot,option)
     res.send(result)
    
  })



  // user related apis 
  app.get("/userSpots", async (req, res) => {
    // Get user ID from request body
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "User ID not provided" });
    }

    try {
      // Fetch spots belonging to the user
      const spots = await spotCollection.find({ userId }).toArray();
      res.json(spots);
    } catch (error) {
      console.error("Error fetching user spots:", error);
      res.status(500).json({ error: "Failed to fetch user spots" });
    }
  });



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/' , (req , res) => {
    res.send("Simple Crud is running")
}) 

app.listen(port , () => {
    console.log(`simple crud is running on the port ,  ${port}` )
})





