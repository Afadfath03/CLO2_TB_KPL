const request = require('supertest');
const express = require('express');
const taskController = require('../middleware/taskController');

// Mock db.js
jest.mock('../db', () => ({
  query: jest.fn()
}));

const db = require('../db');

const app = express();
app.get('/tasks', taskController.getTasks);

describe('GET /tasks - sorting', () => {
  it('should sort tasks by "name" in descending order', async () => {
    const mockTasks = [
      { id: 2, name: 'Zeta', status: 'done' },
      { id: 1, name: 'Alpha', status: 'pending' }
    ];

    db.query.mockResolvedValue([mockTasks]);

    const res = await request(app).get('/tasks?sortBy=name&order=desc');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockTasks);
    expect(db.query).toHaveBeenCalledWith(
      'SELECT * FROM tasks ORDER BY `name` DESC'
    );
  });

  it('should use default sort if invalid field is given', async () => {
    const mockTasks = [
      { id: 1, name: 'Alpha', status: 'pending' }
    ];

    db.query.mockResolvedValue([mockTasks]);

    const res = await request(app).get('/tasks?sortBy=invalidField&order=asc');

    expect(res.statusCode).toBe(200);
    expect(db.query).toHaveBeenCalledWith(
      'SELECT * FROM tasks ORDER BY `status` ASC'
    );
  });
});
