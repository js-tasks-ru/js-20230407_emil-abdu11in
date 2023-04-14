/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  const omitArrKeys = [...fields];
  return Object.fromEntries(Object.entries(obj).reduce((result, [key, value]) => {
    if (!omitArrKeys.includes(key)) {
      result.push([key, value]);
    }
    return result;
  }, [])
  );
};
