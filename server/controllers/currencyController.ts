import { Request, Response } from 'express';
//import { calculateConversion } from '../utils/convert';
import { convert } from '../services/currencyService';

export const convertAmount = async (req: Request, res: Response) => {
  try {
    const { from, to, amount } = req.body;

    const fromCode = typeof from === 'string' ? from.trim().toUpperCase() : '';
    const toCode = typeof to === 'string' ? to.trim().toUpperCase() : '';
    const currencyCodePattern = /^[A-Z]{3}$/;
    /*
    regular expression (patterni '/'-merkkien välissä), jossa
    ^X --> alkaa X:llä
    X{Y} --> Y kappaletta X:ää
    X$ --> loppuu X:ään

    --> siis patterni on: kolme isoa kirjainta (esim. 'EUR' tai 'USD')
    */

    if (!fromCode || !toCode) {
      res.status(400).json({
        error: 'Body parameters "from" and "to" are required.'
      });
    } else if (!currencyCodePattern.test(fromCode) || !currencyCodePattern.test(toCode)) {
      res.status(400).json({
        error: 'Currency codes must be 3-letter ISO abbreviations (e.g. USD, EUR).'
      });
    } else {
      const parsedAmount = typeof amount === 'number' ? amount : Number(amount);
      if (!Number.isFinite(parsedAmount)) {
        res.status(400).json({
          error: 'Amount must be a valid number.'
        });
      } else if (parsedAmount <= 0) {
        res.status(400).json({
          error: 'Amount must be greater than zero.'
        });
      } else {
        //const data = calculateConversion(amount, 0.9);
        const data = await convert(from, to, amount);
        //res.status(200).json({ "amount": data });
        res.status(200).json(data);
      }
    }
  } catch (e) {
    const err = e as any;
    const status: number = err.status ? err.status : 500;
    const msg: string = err.message;
    res.status(status).json({
      error: msg
    });
  }
}