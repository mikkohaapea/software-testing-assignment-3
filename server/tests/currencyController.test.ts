import { describe, expect, test, vi } from 'vitest';
import { convertAmount } from '../controllers/currencyController';
import * as currencyService from '../services/currencyService'
import type { Request } from 'express';

vi.mock('../services/currencyService');

const createMockResponse = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnThis();
  res.json = vi.fn();
  return res;
};

describe('currencyController.convertAmount', () => {
  test('Return conversion with valid request', async () => {
    const req = { 
      body: {
        from: 'EUR',
        to: 'SEK',
        amount: 10
      }
    } as Request;
    const res = createMockResponse();

    const payload = { amount: 9 };
    vi.mocked(currencyService.convert).mockResolvedValue(payload);

    await convertAmount(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ amount: 9 });
    expect(currencyService.convert).toHaveBeenCalledWith('EUR', 'SEK', 10);
  });

  test('Return 400 for invalid currency code', async () => {
    const req = {
      body: {
        from: 'EU',
        to: 'SEK',
        amount: 10
      }
    } as Request;
    const res = createMockResponse();

    await convertAmount(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Currency codes must be 3-letter ISO abbreviations (e.g. USD, EUR).' });
  });

  test('Return 400 for missing request body parameters (from/to)', async () => {
    const req = {
      body: {
        from: 'EUR',
        amount: 10
      }
    } as Request;
    const res = createMockResponse();

    await convertAmount(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Body parameters "from" and "to" are required.'
    })
  });

  test('Return 400 for invalid (non-number) amount value', async () => {
    const req = {
      body: {
        from: 'EUR',
        to: 'USD',
        amount: "aaaaaa"
      }
    } as Request;
    const res = createMockResponse();

    await convertAmount(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Amount must be a valid number.'
    });
  });

  test('Return 400 for missing request body parameters (amount)', async () => {
    const req = {
      body: {
        from: 'EUR',
        to: 'USD'
      }
    } as Request;
    const res = createMockResponse();

    await convertAmount(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Amount must be a valid number.'
    });
  });

  test('Return 400 for negative amount value', async () => {
    const req = {
      body: {
        from: 'EUR',
        to: 'USD',
        amount: -50
      }
    } as Request;
    const res = createMockResponse();

    await convertAmount(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Amount must be greater than zero.'
    });
  });

  test('Return 500(?) for missing request body', async () => {
    const req = {} as Request;
    const res = createMockResponse();

    await convertAmount(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});