/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (!string || size === 0) {
    return '';
  }

  if (!size) {
    return string;
  }

  let counter = 1;

  const trim = (item, index, arr) => {
    const isPrevEqualCurrent = arr[index - 1] === arr[index];

    if (isPrevEqualCurrent && counter < size) {
      counter++;
      return item;
    } 

    if (!isPrevEqualCurrent) {
      counter = 1;
      return item;
    }
  };

  return string
    .split('')
    .map(trim)
    .join('')
    .trim('');
}

console.log(trimSymbols('xxxaxxx', 2));
