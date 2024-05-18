const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcrypt');
const User = require('./auth-model');

let mongoServer;
let app;

let newString='aW5o32_5f';
let newString2='32_dOp7';

//test user
const user = {
  username: 'testuser',
  password: newString,
};

const user2 = {
  username: 'testuser',
  password: newString2,
};

async function addUser(user){
  const newUser = new User({
    username: user.username,
    password: await bcrypt.hash(user.password, 10),
  });

  await newUser.save();
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  app = require('./auth-service'); 
  //Load database with initial conditions
  await addUser(user);
});

afterAll(async () => {
  app.close();
  await mongoServer.stop();
});

describe('Auth Service', () => {
  it('Should perform a login operation /login', async () => {
    const response = await request(app).post('/login').send(user);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'testuser');
  });

  it('Should perform a fail login operation du to incorrect answer /login', async () => {
    const response = await request(app).post('/login').send(user2);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Invalid credentials');
  });

  it('Should perform a server error due to missing value /login', async () => {
    const response = await request(app).post('/login')
    .send(user3 = {
      username: 'testuser',
    });
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Internal Server Error');
  });
  
});
