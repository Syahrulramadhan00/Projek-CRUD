const express = require('express');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const { send } = require('process');

const app = express();
const port = 3000;

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB and start the server
async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error; // Propagate the error for better error handling
  }
}

// CRUD routes

// Create
app.post('/api/mahasiswa', async (req, res) => {
    const { nama, nrp, kelas, semester } = req.body;
  
    try {
      const database = client.db('siswa');
      const collection = database.collection('mahasiswa');
  
      const result = await collection.insertOne({ nama, nrp, kelas, semester });
      
      if (result > 0) {
        res.json(result.ops[0]);
      } else {
        console.error('Error adding data: No document inserted');
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } catch (error) {
      console.error('Error adding data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

// Read
app.get('/api/mahasiswa', async (req, res) => {
  try {
    const database = client.db('siswa');
    const collection = database.collection('mahasiswa');

    const data = await collection.find().toArray();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/mahasiswa/:id', async (req, res) => {
  const { nama, nrp, kelas, semester } = req.body;
  const update = {
    $set :{
      "nama" : nama,
      "nrp" : nrp,
      "kelas" : kelas,
      "semester" : semester
    }
  }
  const id = req.params.id;
  try {
    const database = client.db('siswa');
    const collection = database.collection('mahasiswa');

    const data = await collection.findOneAndUpdate({'_id': new ObjectId(id)}, update, {

      upsert: true // Make this update into an upsert
    });
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update (Modify as needed)
app.get('/api/mahasiswa/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const database = client.db('siswa');
    const collection = database.collection('mahasiswa');

    const data = await collection.findOne({'_id': new ObjectId(id)});
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete (Modify as needed)
app.delete('/api/mahasiswa/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const database = client.db('siswa');
    const collection = database.collection('mahasiswa');

    const data = await collection.deleteOne({'_id': new ObjectId(id)});
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/delete/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const database = client.db('siswa');
    const collection = database.collection('mahasiswa');
    const data = await collection.deleteOne({ '_id': new ObjectId(id) });

    if (data.deletedCount === 1) {
      res.json({ message: 'Document deleted successfully' });
    } else {
      res.status(404).json({ error: 'Document not found' });
    }
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Connect to MongoDB and start the server
(async () => {
  try {
    await connectToDatabase();
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
  }
})();

app.get('/edit/:id', async (req, res) => {
  const id = req.params.id;
  // Implement update logic
  res.sendFile(path.resolve(__dirname + '/pages/edit/index.html'),{send:id})
  
});