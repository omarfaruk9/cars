const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');
const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// connet with mongodb 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kctig.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri);

async function run() {
    try {
        await client.connect();

        const database = client.db('CarShop');
        const serviceCollection = database.collection('services');
        const odersCollection = database.collection('oders');
        const reviewsCollection = database.collection('reviews');
        const usersCollection = database.collection('users');

        // ADD SERVICE 
        app.post('/service', async (req, res) => {
            const service = req.body;
            // console.log('hit the post');
            const result = await serviceCollection.insertOne(service);
            // console.log(result);
            res.json(result)
        });

        // GET SERVICES 
        app.get('/services', async (req, res) => {
            const query = serviceCollection.find({});
            const service = await query.toArray();
            res.json(service);
        });

        // GET SINGLE SERVICE 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.json(service);
        });

        // ADD USERS 
        app.post('/oders', async (req, res) => {
            const query = req.body;
            const result = await odersCollection.insertOne(query);
            res.json(result);
        });

        // GET ALL ODERS
        app.get('/alloders', async (req, res) => {
            const query = odersCollection.find({});
            const result = await query.toArray();
            res.json(result);
        })

        // GET MY ODERS 
        app.get('/myOders/:email', async (req, res) => {
            const userEmail = req.params.email;
            const query = { email: userEmail };
            const result = await odersCollection.find(query).toArray();
            // console.log(user);
            res.json(result)
        });

        // Add reviews
        app.post('/reviews', async (req, res) => {
            const query = req.body;
            const result = await reviewsCollection.insertOne(query);
            res.json(result);
        });

        // GET ALL Revies
        app.get('/reviews', async (req, res) => {
            const query = reviewsCollection.find({});
            const result = await query.toArray();
            res.json(result);
        })

        // ODER DELETE 
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await serviceCollection.deleteOne(query);
            res.json(result);
        });

        // delte my Oders from users
        app.delete('/delteoders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await odersCollection.deleteOne(query);
            res.json(result);
        })

        app.delete('/admindeleteoders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await odersCollection(query);
            res.json(result)
        })
        // sut
        app.put('/alloders/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: "true"
                },
            };
            const result = await odersCollection.updateOne(filter, updateDoc, options);
            // console.log("update", result);
            res.send(result)
        })

        // add user 
        app.post('/users', async (req, res) => {
            const query = req.body;
            console.log(query);
            const result = await usersCollection.insertOne(query);
            console.log(result);
            res.json(result);
        })

        // make admin 
        app.put('/makeadmin/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            const doc = {
                $set: {
                    role: "admin"
                }
            }
            const result = await usersCollection.updateOne(filter, doc);
            res.json(result);
        })

        // get admin 
        app.get('/admin/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email);
            const query = { email: email };
            const filter = await usersCollection.findOne(query);
            console.log(filter);
            let admin;
            if (filter?.role == "admin") {
                admin = true;
            }
            else {
                admin = false;
            }
            console.log(admin);
            res.json({ result: admin })
        })



    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('form car shop server')
});

app.listen(port, () => {
    console.log("listing port", port);
})