const express=require('express');
const app = express();
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;
require('dotenv').config();
const cors=require('cors');
const port = process.env.PORT || 5000;

// middle ware 

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lcqhx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){

    try{
        await client.connect();
        const database=client.db('geniusMechanic');
        const serviceCollection=database.collection('services');

        app.get('/services',async(req,res)=>{
            const cursor= await serviceCollection.find({}).toArray();
            // const result= await cursor.toArray();
            res.send(cursor); 
        });

        app.get('/services/:id',async(req,res)=>{
            const id=req.params.id;
            const result= await serviceCollection.findOne({_id:ObjectId(id)});
            res.json(result);
        });

        app.post('/addServices',async(req,res)=>{
            // console.log(req.body);
            const data=req.body;
            const result=await serviceCollection.insertOne(data);
            res.json(result);
        });

        app.delete('/delete/:id',async(req,res)=>{
            const id = req.params.id;
            const query= {_id:ObjectId(id)};
            const result = await serviceCollection.deleteOne(query);
            res.json(result);
        })


    }

    finally{

    }

}
run().catch(console.dir);
app.get('/',(req,res)=>{
    res.send('The server is running')
});

app.listen(port,()=>{
    console.log('the server is running on port : ', port)
})
