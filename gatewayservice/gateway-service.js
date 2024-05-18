const express = require('express');
const axios = require('axios');
const cors = require('cors');
const promBundle = require('express-prom-bundle');
//libraries required for OpenAPI-Swagger
const swaggerUi = require('swagger-ui-express'); 
const fs = require("fs")
const YAML = require('yaml')


const app = express();
app.disable('x-powered-by');
const port = 8000;

//const originEndpoint = process.env.REACT_APP_API_ORIGIN_ENDPOINT || 'http://localhost:3000';
const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8002';
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:8001';
const creationServiceUrl = process.env.CREATION_SERVICE_URL || 'http://localhost:8005';
const retrieveServiceUrl = process.env.RETRIEVE_SERVICE_URL || 'http://localhost:8004';

const corsOptions = {
  origin: '*', 
  methods: ['GET', 'POST'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
};

app.use(cors(corsOptions));

app.use(express.json());

//Prometheus configuration
const metricsMiddleware = promBundle({includeMethod: true});
app.use(metricsMiddleware);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'OK' });
});

app.post('/login', async (req, res) => {
  try {
    const authResponse = await axios.post(authServiceUrl+'/login', req.body);
    res.json(authResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.post('/adduser', async (req, res) => {
  try {
    const userResponse = await axios.post(userServiceUrl+'/adduser', req.body);
    res.json(userResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.post('/addgame', async (req, res) => {
  try {
    const userResponse = await axios.post(retrieveServiceUrl+'/addgame', req.body);
    res.json(userResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.get('/getgamehistory/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const userResponse = await axios.get(`${retrieveServiceUrl}/getgamehistory/${username}`);
    res.json(userResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});
app.get('/getScoreBoard', async (req, res) => {
  try {
    const userResponse = await axios.get(`${retrieveServiceUrl}/getScoreBoard`);
    res.json(userResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.get('/createquestion', async (req, res) => {
  try {
    // Create a petition to the URL (le llegará a creation-service.js) with the option /createquestion and the req.body params
    const questionResponse = await axios.get(creationServiceUrl+'/createquestion', req.body);
    // Return a json response with what we obtained on the petition
    res.json(questionResponse.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

app.get('/getquestionshistory', async (req, res) => {
  try {
    // Create a petition to the URL (le llegará a retrieve-service.js) with the option /getgeneratedquestions and the req.body params
    const questionResponse = await axios.get(retrieveServiceUrl+'/getquestionshistory', req.body);
    // Return a json response with what we obtained on the petition
    res.json(questionResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

app.get('/getregisteredusers', async (req, res) => {
  try {
    // Create a petition to the URL (le llegará a retrieve-service.js) with the option /getregisteredusers and the req.body params
    const registeredUsersResponse = await axios.get(userServiceUrl+'/getregisteredusers', req.body);
    // Return a json response with what we obtained on the petition
    res.json(registeredUsersResponse.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.response.data.error });
  }
});

// Read the OpenAPI YAML file synchronously
const openapiPath='./openapi.yaml';
if (fs.existsSync(openapiPath)) {
  const file = fs.readFileSync(openapiPath, 'utf8');

  // Parse the YAML content into a JavaScript object representing the Swagger document
  const swaggerDocument = YAML.parse(file);

  // Serve the Swagger UI documentation at the '/api-doc' endpoint
  // This middleware serves the Swagger UI files and sets up the Swagger UI page
  // It takes the parsed Swagger document as input
  app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  console.log("Not configuring OpenAPI. Configuration file not present.")
}


// Start the gateway service
const server = app.listen(port, () => {
  console.log(`Gateway Service listening at http://localhost:${port}`);
});


module.exports = server
