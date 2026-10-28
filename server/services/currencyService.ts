import { calculateConversion } from "../utils/convert";

const FRANKFURTER_API = process.env.FRANKFURTER_API || 'https://api.frankfurter.app/latest';

export const convert = async (from: string, to: string, amount: number) => {
  try {
    const { rate } = await fetchRate(from, to);
    const result = calculateConversion(amount, rate);
    return { amount: result }
  } catch (e) {
    throw Error(e instanceof Error ? e.message : 'Error calculating conversion.');
  }
}

const fetchRate = async (from: string, to: string) => {
  const response = await fetch(`${FRANKFURTER_API}?from=${from}&to=${to}`);

  if (!response.ok) {
    throw new Error('Error retrieving exchange rate.');
  }

  const data = await response.json();
  const rate = data.rates?.[to]; //equivalent to: const rate = data['rates']?.[to]
  /*
  if rates is null or undefined -> rate = undefined
  else -> rate = data['rates'][to] //to is a variable string, e.g. 'SEK' or 'EUR'

  (*) to access an object's property using a variable, must use bracket notation instead of dot notation
  */

  if (typeof rate !== 'number') throw Error("Exchange rate is not a number.");

  return { rate: rate }
}