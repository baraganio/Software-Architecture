const request = require('supertest');
const axios = require('axios');
const app = require('./gateway-service'); 

let newString='S345_Bs';

afterAll(async () => {
    app.close();
  });

jest.mock('axios');

describe('Gateway Service', () => {
  // Mock responses from external services
  axios.post.mockImplementation((url, data) => {
    if (url.endsWith('/login')) {
      return Promise.resolve({ data: { token: 'mockedToken' } });
    } else if (url.endsWith('/adduser')) {
      return Promise.resolve({ data: { userId: 'mockedUserId' } });
    } else if (url.endsWith('/getregisteredusers')) {
      return Promise.resolve({ data: { username: 'mockedUserName'} });
    } else if (url.endsWith('/addgame')) {
      return Promise.resolve({ data: { game: 'mockedGame'} });
    }
  });

  axios.get.mockImplementation((url, data) => {
    if (url.endsWith('/getregisteredusers')) {
      return Promise.resolve({ data: { username: 'mockedUserName'} });
    } else if (url.endsWith('/getquestionshistory')) {
      return Promise.resolve({ data: [{ question: 'Cual es la capital de España'},
        {question: 'Cual es la capital de Francia'}]});
    } else if (url.endsWith('/getgamehistory/:username')) {
      return Promise.resolve({ data: { game: 'mockedGame'} });
    } else if (url.endsWith('/getScoreBoard')) {
      return Promise.resolve({ data: { scoreboard: 'mockedScoreBoard'} });
    } else if (url.endsWith('/createquestion')) {
      return Promise.resolve({ data: { question: 'mockedQuestion'} });
    } 
  });

  // Test /login endpoint
  it('should forward login request to auth service', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: newString });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBe('mockedToken');
  });

  // Test /adduser endpoint
  it('should forward add user request to user service', async () => {
    const response = await request(app)
      .post('/adduser')
      .send({ username: 'newuser', password: newString });

    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe('mockedUserId');
  });

  // Test /addgame endpoint
  it('should forward get create question request to creation service', async () => {
    const response = await request(app)
      .post('/addgame')
      .send({ question: 'Cual es la capital de España', correctAnswer: 'Madrid',
        userAnswer: 'Madrid'});

    expect(response.statusCode).toBe(200);
    expect(response.body.game).toBe('mockedGame');
  });

  // Test /getgamehistory/:username endpoint
  it('should forward add game to retrieve service', async () => {
    const response = await request(app).get('/getgamehistory/:username');

    expect(response.statusCode).toBe(200);
  });

  // Test /getScoreBoard endpoint
  it('should forward get scoreboard request to retrieve service', async () => {
    const response = await request(app).get('/getScoreBoard');

    expect(response.statusCode).toBe(200);
    expect(response.body.scoreboard).toBe('mockedScoreBoard');
  });

  // Test /createquestion endpoint
  it('should forward get create question request to creation service', async () => {
    const response = await request(app).get('/createquestion');

    expect(response.statusCode).toBe(200);
    expect(response.body.question).toBe('mockedQuestion');
  });

  // Test /getquestionshistory endpoint
  it('should forward get questions history request to retrieve service', async () => {
    const response = await request(app).get('/getquestionshistory');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([{ question: 'Cual es la capital de España'},
      {question: 'Cual es la capital de Francia'}]);
  });

  // Test /getregisteredusers endpoint
  it('should forward get reggistered users request to user service', async () => {
    const response = await request(app).get('/getregisteredusers');

    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe('mockedUserName');
  });
});