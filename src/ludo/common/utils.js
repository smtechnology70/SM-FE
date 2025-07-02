export const mapByProperty = (array, property) => {
  const map = {};
  array.forEach((obj) => {
    const key = obj[property];
    map[key] = obj;
  });
  return map;
};

export const flatArray = (arr) => arr.reduce((acc, val) => acc.concat(val), []);

export const shuffleArray = (array) => {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};
