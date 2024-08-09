const { Client } = require('pg');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

// Details for connection to pgSQL datbaase
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'fridge',
    password: 'password',
    port: 5432,
    statement_timeout: 5000,
});

client.connect((err) =>{
  if(err){
    console.log("Failed to connect to db");
  }
  else{
    console.log("connected to db");
  }
});

app.use(express.json());

// Get all items in fridge
app.get('/fridge', async (req, res) => {
    try {
      const result = await client.query('SELECT * FROM fridge');
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching data:', err.stack);
      res.status(500).send('Error fetching data');
    }
});

// Delete a given item 
app.delete('/fridge/:id', async (req, res) => {
  let { id } = req.params;
  console.log('DELETE request received for id:', id); 
  id = parseInt(id, 10);

  if (isNaN(id)) {
    console.log('Invalid id provided:', id);
    return res.status(400).send("Invalid ID");
  }

  try {
      const result = await client.query("DELETE FROM fridge WHERE id = $1", [id]);
      if (result.rowCount > 0) {
          res.status(200).send("Item deleted successfully");
          console.log('Sucessfully deleted item with id:', id)
      } else {
          res.status(404).send("Item not found");
      }
  } catch (err) {
      console.log('An error occurred whilst attempting to delete an item', err.stack);
      res.status(500).send("Error deleting item");
  }
});

app.post('/fridge', async(req, res) => {
  
  const { name } = req.body;
  console.log("received insert request for item named:",name);
  const defaultQuantity = 1;
  try {
    const result = await client.query("INSERT INTO fridge (name, quantity) VALUES ($1, $2) RETURNING *", [name, defaultQuantity]);
    res.status(201).json(result.rows[0]);
  }
  catch(err){
    console.log("An error occurred while trying to insert a new item", err.message);
    res.status(500).send("Error inserting item");
  }
});

app.put('/fridge/:id', async(req, res) => {
  let { id } = req.params;
  console.log('Edit quantity request received for id:', id); 
  id = parseInt(id, 10);

  if (isNaN(id)) {
    console.log('Invalid id provided:', id);
    return res.status(400).send("Invalid ID");
  }

  const { quantity } = req.body;

  try {
      await client.query("UPDATE fridge SET quantity = $1 WHERE id = $2", [quantity, id]);
      res.status(200).send("Quantity updated successfully");
  } catch (error) {
      console.error("Error updating quantity:", error);
      res.status(500).send("Error updating quantity");
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
