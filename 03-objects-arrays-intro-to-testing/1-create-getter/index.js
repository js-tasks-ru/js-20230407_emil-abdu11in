/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(field) {
  const arrKeys = field.split('.');
  return function (obj) {
    const isObjEmpty = !Object.keys(obj).length;
    
    if (isObjEmpty) {return undefined;}

    let result = {...obj};
    for (const key of arrKeys) {
      result = result[key];
    }
    return result;
  };
}

  
const product = {
  category: {
    title: "Goods"
  }
};
  
const getter = createGetter('category.title');
  
console.log(getter(product));

