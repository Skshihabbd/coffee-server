const express = require("express");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 5003;
const cors = require("cors");
app.use(cors());
app.use(express.json());

// main databse connect server code
console.log(process.env.DB_NAME);
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const uri = "mongodb+srv://process.env.DB_NAME:process.env.DB-PASSWORD@cluster0.pppehle.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.pppehle.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const clientSendCoffee = client.db("coffeDB").collection("coffee");
     const userSendCoffee = client.db("coffeDB").collection("user");
    app.get("/coffee", async (req, res) => {
      const DataFind = clientSendCoffee.find();
      const result = await DataFind.toArray();
      res.send(result);
    });
    app.get('/user',async(req,res)=>{
      const userFind=userSendCoffee.find();
      const result=await userFind.toArray()
      res.send(result)
    })

    app.get("/coffee/:id", async (req, res) => {
      const idd = req.params.id;
      const query = { _id: new ObjectId(idd) };
      const result = await clientSendCoffee.findOne(query);
      res.send(result);
    });

    app.post("/coffee", async (req, res) => {
      const addedCoffee = req.body;
      console.log(addedCoffee);

      const result = await clientSendCoffee.insertOne(addedCoffee);
      console.log(result);
      res.send(result);
    });

    app.post('/user',async(req,res)=>{
const userInfo=req.body;
console.log(userInfo)
const result= await userSendCoffee.insertOne(userInfo)
console.log(result)
res.send(result)

    })

    app.put("/coffee/:id", async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id) };
      const option = { upsert: true };
      const updatedInfo = req.body;
      console.log(updatedInfo,id)
      const cofeeUpdate = {
        $set: {
          name: updatedInfo.name,
          supply: updatedInfo.supply,
          chef: updatedInfo.chef,
          taste: updatedInfo.taste,
          category: updatedInfo.category,
          details: updatedInfo.details,
          photourl: updatedInfo.photourl,
        },
      };

     
      const result= await clientSendCoffee.updateOne(filter,cofeeUpdate,option)
      res.send(result)
    });

    app.patch('/user',async(req,res)=>{
      // const id =req.params.id
      console.log("hittinf")
      const update=req.body 
      console.log(update)
      const filter={email:update.email }
      const updateDoc={
        $set:{
lastLoginDate:update.lastLogintime,
shihab:'11111'
        }
      }
      const result=await userSendCoffee.updateOne(filter,updateDoc)
      res.send(result)
    })

    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await clientSendCoffee.deleteOne(query);
      res.send(result);
    });

app.delete("/user/:id",async(req,res)=>{
const id=req.params.id ;
const query={_id:new ObjectId(id)}
const result= await userSendCoffee.deleteOne(query)
res.send(result)

})
    
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// main databse connect server code

app.get("/", (req, res) => {
  res.send("i create my own server");
});
app.listen(port, (req, res) => {
  console.log(`my port runninng on ${port}`);
});
