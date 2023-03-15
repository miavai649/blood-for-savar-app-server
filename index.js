const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o9jnfig.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const donorListCollection = client.db('bloodForSavar').collection('donorList')

        app.post('/donor', async (req, res) => {
            const donor = req.body
            const result = await donorListCollection.insertOne(donor)
            res.send(result)
        })

        app.get('/allDonor', async (req, res) => {
            const query = {};
            const allDonor = await donorListCollection.find(query).toArray()
            res.send(allDonor)
        })

        app.delete('/deleteDonor/:id', async (req, res) => {
            const id = req.params.id;
            const o_id = new ObjectId(id)
            const query = {_id: o_id}
            const result = await donorListCollection.deleteOne(query)
            res.send(result)
        })

        app.get('/donor/:id', async (req, res) => {
            const id = req.params.id;
            const o_id = new ObjectId(id);
            const query = { _id: o_id };
            const result = await donorListCollection.find(query).toArray();
            res.send(result)
        })

        app.patch('/update/:id', async (req, res) => {
            const id = req.params.id;
            const o_id = new ObjectId(id);
            const filter = { _id: o_id };
            const updatedDoc = { $set: req.body };
            const result = await donorListCollection.updateOne(filter, updatedDoc);
            res.send(result);
        })

    }
    finally {
        
    }
}

run().catch(console.log)

app.get('/', async (req, res) => {
    res.send('donorList serve connected')
})

app.listen(port, () => console.log(`donorList server is running on ${port}`))