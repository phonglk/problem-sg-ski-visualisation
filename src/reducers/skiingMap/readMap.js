const defaultTileProps = {
  visited: false,
  nextTiles: [],
};
export default function readMap(mapData) {
  const stateMap = [];
  let maxHeight = -Infinity;
  let minHeight = Infinity;
  mapData.forEach((row, y) => {
    row.forEach((val, x) => {
      if (val > maxHeight) maxHeight = val;
      else if (val < minHeight) minHeight = val;
      stateMap.push({
        x,
        y,
        height: val,
        ...defaultTileProps,
      });
    });
  });
  return {
    stateMap,
    minHeight,
    maxHeight,
  };
}
