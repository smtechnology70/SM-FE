export function generateBoxes() {
  const totalBoxes = 49;
  const zeroCount = Math.floor(totalBoxes * 0.3); // ≈15
  const nonZeroCount = totalBoxes - zeroCount;

  const zeroes = Array(zeroCount).fill(0);
  const numbers = new Set();
  while (numbers.size < nonZeroCount) {
    numbers.add(Math.floor(Math.random() * 1000) + 1); // unique numbers
  }

  const allValues = [...zeroes, ...Array.from(numbers)];

  // Shuffle the values
  for (let i = allValues.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allValues[i], allValues[j]] = [allValues[j], allValues[i]];
  }

  return allValues.map((value, index) => ({
    id: index,
    value,
    revealed: false,
  }));
}
