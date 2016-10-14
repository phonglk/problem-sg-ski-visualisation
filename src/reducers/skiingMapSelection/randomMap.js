function randomRange(min, max) {
  return Math.round(Math.random() * (max - min)) + min;
}
export default function randomMap() {
  const sizeRange = [5, 10];
  const size = randomRange(...sizeRange);
  const map = [];
  for (let i = 0; i < size; i++) {
    map[i] = [];
    for (let j = 0; j < size; j++) {
      map[i][j] = randomRange(1, size*size);
    }
  }
  return map;
}
