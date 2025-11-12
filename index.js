const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app = express()
const port = process.env.PORT || 3000

const uri = "mongodb+srv://alaminalif373:zXQTrtLWYIJ0j485@book-shelf.ixjlonr.mongodb.net/?appName=Book-Shelf";


app.use(cors())
app.use(express.json())

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
        await client.connect();


        const myDB = client.db("book-shelf");
        const bookCollection = myDB.collection("books");

        // To find all the books
        app.get('/books', async (req, res) => {
            const cursor = bookCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        // To find a single book
        app.get('/books/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await bookCollection.findOne(query)
            res.send(result)
        })

        // Top Rated 6 Books
        app.get('/topbooks', async (req, res) => {
            const cursor = bookCollection.find().sort({ rating: -1 })
            const result = await cursor.toArray();
            res.send(result)
        })

        //To add a book
        app.post('/books', async (req, res) => {
            const newBook = req.body
            const result = await bookCollection.insertOne(newBook);
            res.send(result);
        })

        // To Update a book
        app.patch('/books/:id', async (req, res) => {
            const id = req.params.id
            const updatedBook = req.body
            const query = { _id: new ObjectId(id) };
            const update = { $set: updatedBook };

            const result = await bookCollection.updateOne(query, update);
            res.send(result)

        })

        // To delete a book
        app.delete('/books/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await bookCollection.deleteOne(query)
            res.send(result);

        })




        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("My server Running")
})


app.listen(port, () => {
    console.log('server is running on ' + port)
})