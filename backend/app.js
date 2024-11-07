import fs from 'node:fs/promises';
import bodyParser from 'body-parser';
import express from 'express';

const app = express();

app.use(express.static('images'));
app.use(bodyParser.json());

// CORS Middleware to handle preflight requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all domains
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS'); // Include OPTIONS for preflight
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // If the request method is OPTIONS, respond with a 200 status to allow the request
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// Fetching all places
app.get('/places', async (req, res) => {
  try {
    const fileContent = await fs.readFile('./data/places.json', 'utf-8');
    const placesData = JSON.parse(fileContent);
    res.status(200).json({ places: placesData });
  } catch (err) {
    res.status(500).json({ message: 'Error reading places data' });
  }
});

// Fetching user-specific places
app.get('/user-places', async (req, res) => {
  try {
    const fileContent = await fs.readFile('./data/user-places.json', 'utf-8');
    const places = JSON.parse(fileContent);
    res.status(200).json({ places });
  } catch (err) {
    res.status(500).json({ message: 'Error reading user places data' });
  }
});

// Updating user-specific places
app.put('/user-places', async (req, res) => {
  const places = req.body.places;
  try {
    await fs.writeFile('./data/user-places.json', JSON.stringify(places));
    res.status(200).json({ message: 'User places updated!' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user places data' });
  }
});

// 404 Error handling
app.use((req, res) => {
  res.status(404).json({ message: '404 - Not Found' });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
