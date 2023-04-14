/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  const pickArrKeys = [...fields];
  return Object.fromEntries(Object.entries(obj).reduce((result, [key, value]) => {
    if (pickArrKeys.includes(key)) {
      result.push([key, value]);
    }
    return result;
  }, [])
  );
};
