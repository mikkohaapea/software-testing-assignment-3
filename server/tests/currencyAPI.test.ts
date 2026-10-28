import { describe, expect, test } from 'vitest';
import request from 'supertest';
import { app } from '../index';

describe('Currency API', () => {
  test('POST /api/convert/amount returns converted amount', async () => {
    const response = await request(app)
      .post('/api/convert/amount')
      .send({
        from: 'EUR',
        to: 'USD',
        amount: 100
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('amount');
    expect(typeof response.body.amount).toBe('number');
  });

  test('POST /api/convert/amount returns 400 for invalid currency code', async () => {
    const response = await request(app)
      .post('/api/convert/amount')
      .send({
      from: 'INVALID',
      to: 'USD',
      amount: 100
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  test('POST /api/convert/amount returns 400 for invalid (non-number) currency amount', async () => {
    const response = await request(app)
      .post('/api/convert/amount')
      .send({
        from: 'USD',
        to: 'GBP',
        amount: 'fifteen'
      });
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    //expect(response.body.error).toBe('Amount must be a valid number.');
  });

  test('POST /api/convert/amount returns 400 for missing currency code parameter(s)', async () => {
    const response = await request(app)
      .post('/api/convert/amount')
      .send({
        to: 'EUR',
        amount: 20
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    //expect(response.body.error).toBe('Body parameters "from" and "to" are required.');
  });

  test('POST /api/convert/amount returns 400 for missing currency amount parameter', async () => {
    //TODO
    const response = await request(app)
      .post('/api/convert/amount')
      .send({
        from: 'USD',
        to: 'EUR'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    //expect(response.body.error).toBe('Amount must be a valid number.');
  });

  test('GET /api/convert/amount returns 404 (only POST route implemented)', async () => {
    const response = await request(app)
      .get('/api/convert/amount')
      .send();
    
    expect(response.status).toBe(404);
  });
});
