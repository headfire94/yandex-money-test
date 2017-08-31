import MyError, { NOT_TEXT_ERROR } from './errors';

/**
 * count words in text
 * exclude first and last white-space and multiply white-space between words
 * @param {string} text
 * @returns {Number}
 */
export const countWords = (text) => {
  if (typeof text !== 'string') throw new MyError(NOT_TEXT_ERROR);
  const trimmedText = text.trim();
  if (!trimmedText) return 0;
  return trimmedText.split(/\s+/).length;
};

/**
 * Count sum of numbers in text string
 * @param {string} str
 * @returns {number}
 */
export const countSumOfStringNumbers = (str) => {
  if (typeof str !== 'string') throw new MyError(NOT_TEXT_ERROR);
  return str.split('').reduce((prev, next) => {
    const number = parseInt(next, 10);
    if (Number.isInteger(number)) {
      return prev + number;
    }
    return prev;
  }, 0);
};
