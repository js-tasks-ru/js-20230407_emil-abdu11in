/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const directions = {
    asc: 1,
    desc: -1,
  };

  const direction = directions[param];
  const langArr = ['ru', 'en'];
  const compareOptions = { caseFirst: 'upper'};

  if (!direction) {
    throw new Error(`Unknow param: ${param}`);
  }

  const compareStrings = (a, b) => {
    return direction * a.localeCompare(b, langArr, compareOptions);
  };

  return [...arr].sort(compareStrings);
}
