const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/recordings");

const TextSchema = new mongoose.Schema({
  text: String
});

const TextModel = mongoose.model("texts", TextSchema);

// Handle upload
app.post('/upload', async (req, res) => {
  const { text } = req.body;

  try {
    const result = await TextModel.create({ text });
    console.log('Text inserted successfully');
    res.status(200).send('Text uploaded successfully');
  } catch (err) {
    console.error('Error inserting text:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

// Retrieve texts list
app.get('/texts', async (req, res) => {
  try {
    const texts = await TextModel.find();
    res.status(200).json(texts);
  } catch (err) {
    console.error('Error retrieving texts:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a text
app.delete('/texts/:id', async (req, res) => {
    const id = req.params.id;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send('Invalid ID');
    }
  
    try {
      const text = await TextModel.findById(id);
  
      if (!text) {
        return res.status(404).send('Text not found');
      }
  
      await TextModel.findByIdAndDelete(id);
      console.log('Text deleted successfully');
      res.status(200).send('Text deleted successfully');
    } catch (err) {
      console.error('Error deleting text:', err.message);
      res.status(500).send('Internal Server Error');
    }
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
