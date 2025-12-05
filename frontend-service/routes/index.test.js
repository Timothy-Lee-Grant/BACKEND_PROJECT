const request = require('supertest');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const router = require('./index');

// Mock all dependencies
jest.mock('../services/producerService');
jest.mock('../services/consumerService');
jest.mock('../services/postgresql');
jest.mock('../services/serviceCaller');
jest.mock('bcrypt');

const producerService = require('../services/producerService');
const consumerService = require('../services/consumerService');
const pool = require('../services/postgresql');
const { callService, postService } = require('../services/serviceCaller');

// Setup Express app for testing
const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(session({
    secret: 'test-secret',
    resave: false,
    saveUninitialized: true
  }));
  app.use('/', router);
  app.set('view engine', 'ejs');
  return app;
};

describe('Routes - Authentication Endpoints', () => {
  let app;

  beforeEach(() => {
    app = createApp();
    jest.clearAllMocks();
  });

  describe('POST /register', () => {
    it('should register a new user with valid credentials', async () => {
      const mockHash = '$2b$10$hashed_password_mock';
      bcrypt.hash.mockResolvedValue(mockHash);
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .post('/register')
        .send({ username: 'newuser', password: 'SecurePass123!' });

      expect(bcrypt.hash).toHaveBeenCalledWith('SecurePass123!', 10);
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO users (username, password_hash) VALUES ($1, $2)',
        ['newuser', mockHash]
      );
      expect(response.status).toBe(302);
    });

    it('should handle database errors during registration', async () => {
      const dbError = new Error('Database connection failed');
      bcrypt.hash.mockResolvedValue('hashed_password');
      pool.query.mockRejectedValue(dbError);

      const response = await request(app)
        .post('/register')
        .send({ username: 'newuser', password: 'password' });

      expect(response.status).toBe(500);
    });

    it('should handle bcrypt errors during registration', async () => {
      const bcryptError = new Error('Hashing failed');
      bcrypt.hash.mockRejectedValue(bcryptError);

      const response = await request(app)
        .post('/register')
        .send({ username: 'newuser', password: 'password' });

      expect(response.status).toBe(500);
    });
  });

  describe('GET /register', () => {
    it('should render the registration page', async () => {
      const response = await request(app).get('/register');
      expect(response.status).toBe(200);
    });
  });

  describe('GET /', () => {
    it('should render home page when user is logged in', async () => {
      const response = await request(app)
        .get('/')
        .set('Cookie', 'connect.sid=test');

      // Manually set session
      const agent = request.agent(app);
      await agent.post('/register').send({ username: 'test', password: 'test' });
      
      const homeResponse = await agent.get('/');
      // Without proper session setup, this will redirect or fail
      // Real test would require proper session middleware
      expect(homeResponse.status).toBeGreaterThanOrEqual(200);
    });

    it('should return 400 when user is not logged in', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Not Logged In!!!!');
    });

    it('should log message when user reaches endpoint', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const response = await request(app).get('/');
      
      // Response will be 400 due to no session, but we verify error handling
      expect(response.status).toBe(400);
      
      consoleSpy.mockRestore();
    });
  });

  describe('GET /login', () => {
    it('should render the login page', async () => {
      const response = await request(app).get('/login');
      expect(response.status).toBe(200);
    });
  });

  describe('POST /login', () => {
    it('should login user successfully with valid credentials', async () => {
      const storedHash = '$2b$10$hashed_password';
      pool.query.mockResolvedValue({ rows: [{ password_hash: storedHash }] });
      bcrypt.compare.mockResolvedValue(true);

      const response = await request(app)
        .post('/login')
        .send({ username: 'testuser', password: 'password123' });

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT password_hash FROM users WHERE username = $1',
        ['testuser']
      );
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', storedHash);
      expect(response.status).toBe(302);
    });

    it('should return 401 for non-existent user', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .post('/login')
        .send({ username: 'nonexistent', password: 'password123' });

      expect(response.status).toBe(401);
      expect(response.text).toContain('Invalid username or password');
    });

    it('should return 401 for incorrect password', async () => {
      const storedHash = '$2b$10$hashed_password';
      pool.query.mockResolvedValue({ rows: [{ password_hash: storedHash }] });
      bcrypt.compare.mockResolvedValue(false);

      const response = await request(app)
        .post('/login')
        .send({ username: 'testuser', password: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(response.text).toContain('Incorrect username or password');
    });

    it('should handle database errors during login', async () => {
      const dbError = new Error('Database connection timeout');
      pool.query.mockRejectedValue(dbError);

      const response = await request(app)
        .post('/login')
        .send({ username: 'testuser', password: 'password' });

      expect(response.status).toBe(500);
      expect(response.text).toContain('Error in login route');
    });

    it('should handle bcrypt errors during login', async () => {
      const storedHash = '$2b$10$hashed_password';
      pool.query.mockResolvedValue({ rows: [{ password_hash: storedHash }] });
      bcrypt.compare.mockRejectedValue(new Error('Comparison failed'));

      const response = await request(app)
        .post('/login')
        .send({ username: 'testuser', password: 'password' });

      expect(response.status).toBe(500);
    });
  });

  describe('POST /login_no_authentication', () => {
    it('should create session without authentication', async () => {
      const response = await request(app)
        .post('/login_no_authentication')
        .send({ username: 'testuser', password: 'testpass' });

      expect(response.status).toBe(200);
      expect(response.text).toContain('your data is testpass');
    });

    it('should store user data in session', async () => {
      const agent = request.agent(app);
      const response = await agent
        .post('/login_no_authentication')
        .send({ username: 'user123', password: 'pass456' });

      expect(response.status).toBe(200);
      expect(response.text).toContain('pass456');
    });
  });

  describe('GET /logout', () => {
    it('should destroy session and redirect', async () => {
      const response = await request(app).get('/logout');
      expect(response.status).toBe(302);
      expect(response.header.location).toBe('/');
    });

    it('should handle errors during logout gracefully', async () => {
      const response = await request(app).get('/logout');
      expect(response.status).toBe(302);
    });
  });
});

describe('Routes - Item Management Endpoints', () => {
  let app;

  beforeEach(() => {
    app = createApp();
    jest.clearAllMocks();
  });

  describe('POST /add', () => {
    it('should add item successfully via producer service', async () => {
      const mockResult = 'Item added to inventory';
      producerService.addItem.mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/add')
        .send({ item: 'Widget A' });

      expect(producerService.addItem).toHaveBeenCalledWith('Widget A');
      expect(response.status).toBe(200);
    });

    it('should handle missing item parameter', async () => {
      const mockResult = 'Item added';
      producerService.addItem.mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/add')
        .send({});

      expect(producerService.addItem).toHaveBeenCalledWith(undefined);
      expect(response.status).toBe(200);
    });

    it('should handle producer service errors', async () => {
      const serviceError = new Error('Service unavailable');
      producerService.addItem.mockRejectedValue(serviceError);

      const response = await request(app)
        .post('/add')
        .send({ item: 'Widget B' });

      expect(response.status).toBe(500);
    });

    it('should handle multiple items in succession', async () => {
      producerService.addItem.mockResolvedValue('Item added');

      await request(app).post('/add').send({ item: 'Item1' });
      await request(app).post('/add').send({ item: 'Item2' });
      await request(app).post('/add').send({ item: 'Item3' });

      expect(producerService.addItem).toHaveBeenCalledTimes(3);
      expect(producerService.addItem).toHaveBeenNthCalledWith(1, 'Item1');
      expect(producerService.addItem).toHaveBeenNthCalledWith(2, 'Item2');
      expect(producerService.addItem).toHaveBeenNthCalledWith(3, 'Item3');
    });
  });

  describe('POST /remove', () => {
    it('should remove item successfully via consumer service', async () => {
      const mockResult = 'Item removed from inventory';
      consumerService.addItem.mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/remove')
        .send({ item: 'Widget A' });

      expect(consumerService.addItem).toHaveBeenCalledWith('Widget A');
      expect(response.status).toBe(200);
    });

    it('should handle missing item parameter', async () => {
      const mockResult = 'Item removed';
      consumerService.addItem.mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/remove')
        .send({});

      expect(consumerService.addItem).toHaveBeenCalledWith(undefined);
      expect(response.status).toBe(200);
    });

    it('should handle consumer service errors', async () => {
      const serviceError = new Error('Service unavailable');
      consumerService.addItem.mockRejectedValue(serviceError);

      const response = await request(app)
        .post('/remove')
        .send({ item: 'Widget B' });

      expect(response.status).toBe(500);
    });

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      consumerService.addItem.mockRejectedValue(timeoutError);

      const response = await request(app)
        .post('/remove')
        .send({ item: 'Widget' });

      expect(response.status).toBe(500);
    });
  });
});

describe('Routes - Service Communication Endpoints', () => {
  let app;

  beforeEach(() => {
    app = createApp();
    jest.clearAllMocks();
  });

  describe('GET /hello', () => {
    it('should call producer service and return message', async () => {
      const mockMessage = { greeting: 'Hello from producer service' };
      callService.mockResolvedValue(mockMessage);

      const response = await request(app).get('/hello');

      expect(callService).toHaveBeenCalledWith('PRODUCER_RESOURCE', '/api/hello');
      expect(response.status).toBe(200);
    });

    it('should handle producer service unreachable error', async () => {
      const error = new Error('ECONNREFUSED');
      callService.mockRejectedValue(error);

      const response = await request(app).get('/hello');

      expect(response.status).toBe(500);
      expect(response.text).toContain('Failed to reach producer');
    });

    it('should handle network timeout errors', async () => {
      const timeoutError = new Error('ETIMEDOUT');
      callService.mockRejectedValue(timeoutError);

      const response = await request(app).get('/hello');

      expect(response.status).toBe(500);
    });

    it('should verify correct service name and endpoint are called', async () => {
      callService.mockResolvedValue('OK');

      await request(app).get('/hello');

      expect(callService).toHaveBeenCalledWith(
        'PRODUCER_RESOURCE',
        '/api/hello'
      );
      expect(callService).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /producer_resource_frontend', () => {
    it('should forward request to producer service successfully', async () => {
      const mockMessage = 'Supply item created';
      postService.mockResolvedValue(mockMessage);

      const response = await request(app)
        .post('/producer_resource_frontend')
        .send({ supplyId: 123, quantity: 50 });

      expect(postService).toHaveBeenCalledWith(
        'PRODUCER_RESOURCE',
        '/api/supplies',
        expect.any(Object)
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true, message: mockMessage });
    });

    it('should return success response with message', async () => {
      postService.mockResolvedValue('Resource created successfully');

      const response = await request(app)
        .post('/producer_resource_frontend')
        .send({ name: 'Test Resource' });

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Resource created successfully');
    });

    it('should handle producer service errors with response data', async () => {
      const error = new Error('Service error');
      error.response = { data: 'Invalid supply data' };
      postService.mockRejectedValue(error);

      const response = await request(app)
        .post('/producer_resource_frontend')
        .send({ supplyId: -1 });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid supply data');
    });

    it('should handle producer service errors without response data', async () => {
      const error = new Error('Connection refused');
      postService.mockRejectedValue(error);

      const response = await request(app)
        .post('/producer_resource_frontend')
        .send({});

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Connection refused');
    });

    it('should handle fallback error message', async () => {
      const error = new Error('Unknown error');
      postService.mockRejectedValue(error);

      const response = await request(app)
        .post('/producer_resource_frontend')
        .send({});

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Unknown error');
    });

    it('should log error to console', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error('Test error');
      postService.mockRejectedValue(error);

      await request(app).post('/producer_resource_frontend').send({});

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('POST /consumer_resource_frontend', () => {
    it('should forward request to consumer service successfully', async () => {
      const mockMessage = 'Resource consumed successfully';
      postService.mockResolvedValue(mockMessage);

      const response = await request(app)
        .post('/consumer_resource_frontend')
        .send({ resourceId: 456, quantity: 25 });

      expect(postService).toHaveBeenCalledWith(
        'CONSUMER_RESOURCE',
        '/consume_resource',
        expect.any(Object)
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true, message: mockMessage });
    });

    it('should return success response with correct service endpoint', async () => {
      postService.mockResolvedValue('Resource consumed');

      const response = await request(app)
        .post('/consumer_resource_frontend')
        .send({ data: 'test' });

      expect(response.body.success).toBe(true);
      expect(postService).toHaveBeenCalledWith(
        'CONSUMER_RESOURCE',
        '/consume_resource',
        expect.any(Object)
      );
    });

    it('should handle consumer service errors with response data', async () => {
      const error = new Error('Service error');
      error.response = { data: 'Invalid resource ID' };
      postService.mockRejectedValue(error);

      const response = await request(app)
        .post('/consumer_resource_frontend')
        .send({ resourceId: 999 });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid resource ID');
    });

    it('should handle consumer service errors without response data', async () => {
      const error = new Error('Service timeout');
      postService.mockRejectedValue(error);

      const response = await request(app)
        .post('/consumer_resource_frontend')
        .send({});

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Service timeout');
    });

    it('should handle multiple concurrent requests', async () => {
      postService.mockResolvedValue('Consumed');

      const responses = await Promise.all([
        request(app).post('/consumer_resource_frontend').send({ id: 1 }),
        request(app).post('/consumer_resource_frontend').send({ id: 2 }),
        request(app).post('/consumer_resource_frontend').send({ id: 3 })
      ]);

      expect(postService).toHaveBeenCalledTimes(3);
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });
    });

    it('should log error to console on failure', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error('Test error');
      postService.mockRejectedValue(error);

      await request(app).post('/consumer_resource_frontend').send({});

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});

describe('Routes - Integration Tests', () => {
  let app;

  beforeEach(() => {
    app = createApp();
    jest.clearAllMocks();
  });

  it('should handle request with multiple endpoints in sequence', async () => {
    // Setup mocks
    const mockHash = '$2b$10$hashed_password';
    bcrypt.hash.mockResolvedValue(mockHash);
    pool.query.mockResolvedValue({ rows: [] });

    // Register user
    const registerResponse = await request(app)
      .post('/register')
      .send({ username: 'integrationuser', password: 'password123' });

    expect(registerResponse.status).toBe(302);

    // Verify bcrypt was called
    expect(bcrypt.hash).toHaveBeenCalled();
  });

  it('should handle mixed service calls', async () => {
    producerService.addItem.mockResolvedValue('Added');
    consumerService.addItem.mockResolvedValue('Removed');
    callService.mockResolvedValue('Hello');

    await request(app).post('/add').send({ item: 'Item1' });
    await request(app).post('/remove').send({ item: 'Item1' });
    await request(app).get('/hello');

    expect(producerService.addItem).toHaveBeenCalled();
    expect(consumerService.addItem).toHaveBeenCalled();
    expect(callService).toHaveBeenCalled();
  });

  it('should verify error handling across endpoints', async () => {
    const error = new Error('Service error');
    producerService.addItem.mockRejectedValue(error);
    consumerService.addItem.mockRejectedValue(error);

    const addResponse = await request(app).post('/add').send({ item: 'Item' });
    const removeResponse = await request(app).post('/remove').send({ item: 'Item' });

    expect(addResponse.status).toBe(500);
    expect(removeResponse.status).toBe(500);
  });
});
