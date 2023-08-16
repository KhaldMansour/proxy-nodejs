const express = require('express');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const proxyURL = 'https://dummyjson.com/products'


// Create an Express app
const app = express();
app.use(bodyParser.json());
app.use(express.json());



// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/products', async (req, res) => {  // Log the request being proxied
  console.log(`Proxying request to: ${req.url}`);
  
  // Forward the request to the target server and send the response back
  try {
    response = await fetch(proxyURL + '?limit=5')
    .then(res => res.json());
    res.writeHead(200, { 'Content-Type': 'application/json' });
    
    res.end(JSON.stringify({"data" : response}));
    // Forward the response body
  } catch (error) {
    console.error('Error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({error : 'proxy error'}));
  }
});

app.get('/products/:id', async (req, res) => {  // Log the request being proxied
  console.log(`Proxying request to: ${req.url}`);
  const productId = req.params.id; 
  
  //Forward the request to the target server and send the response back
  try {
    response = await fetch(proxyURL + '/' + productId)
    .then(res => res.json());
    res.writeHead(200, { 'Content-Type': 'application/json' });
    
    res.end(JSON.stringify({"data" : response}));
    // Forward the response body
  } catch (error) {
    console.error('Error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({error : 'proxy error'}));
  }
});

app.post('/products', async (req, res) => {  // Log the request being proxied
  console.log(`Proxying request to: ${req.url}`);

  //Forward the request to the target server and send the response back
  try {
    response = await fetch(proxyURL + '/add' , {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: req.body.title,
        /* other product data */
      })
    })
    .then(res => res.json())
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({"data" : response}));
    // Forward the response body
  } catch (error) {
    console.error('Error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({error : 'proxy error'}));
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
