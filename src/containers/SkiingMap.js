import React, { Component, PropTypes } from 'react';
import hsv2rgb from 'hsv2rgb';
import { connect } from 'react-redux';

import MapElement from '../components/MapElement';
import { RECT_SIZE, STROKE_SIZE } from '../constants';

function heightToHSV(height, minHeight, maxHeight) {
  const relVal = ((height - minHeight) / (maxHeight - minHeight)) * 100;
  return [
    Math.floor((100 - relVal) * 120 / 100), // h
    Math.abs(relVal - 50) / 50, // s
    1, // v
  ];
}

function getCenterOfTile(point) {
  const x = point.x * (RECT_SIZE + STROKE_SIZE) + RECT_SIZE / 2;
  const y = point.y * (RECT_SIZE + STROKE_SIZE) + RECT_SIZE / 2;
  return { x, y };
}

function tilesToPath(idxes, stateMap) {
  return 'M' + idxes.map((idx) => {
    const point = stateMap[idx];
    const { x, y } = getCenterOfTile(point);
    return `${x} ${y}`;
  }).join(' L ');
}

function getHeightDiff(paths, stateMap) {
  const start = stateMap[paths[0]];
  const end = stateMap[paths[paths.length - 1]];
  return start.height - end.height;
}

export class SkiingMap extends Component {
  render() {
    const { stateMap, minHeight, maxHeight,
      currentIdx, processingStack, mapHeight, mapWidth
    } = this.props;

    let bestPath = [];
    let _counter = 0;
    const connections = stateMap.reduce((prev, cur, idx) => {

      // build paths
      const stack = [idx];
      const parentRef = {}; // child -> parent
      parentRef[idx] = null;

      while (stack.length > 0) {
        const stackIdx = stack.shift();
        const tile = stateMap[stackIdx];
        if (tile.nextTiles.length > 0) {
          stack.push(...tile.nextTiles);
          tile.nextTiles.forEach((childId) => {
            parentRef[childId] = stackIdx;
          });
        } else {
          // This is a leaf
          let parent = stackIdx;
          const p = [];
          while (parent !== null) {
            _counter++;
            p.unshift(parent);
            parent = parentRef[parent];
          }
          // console.log(p.map((i) => stateMap[i].height).join(' -> '));
          if (p.length > 1 &&
              (p.length > bestPath.length ||
                (p.length === bestPath.length &&
                  getHeightDiff(p, stateMap) > getHeightDiff(bestPath, stateMap)
                )
              )
            ) {
            bestPath = p;
          }
        }
      }

      if (cur.nextTiles.length > 0) cur.nextTiles.forEach((nId) => {
        prev.push([idx, nId]);
      });
      return prev;
    }, []);

    // console.log('counter: ', _counter);

    const paths = {};
    connections.forEach(([start, end]) => {
      const startPath = paths[start];
      //
      if (startPath) return;
      const endPath = paths[end];
      if (typeof endPath !== 'undefined') {
        paths[start] = [end].concat(endPath);
      } else {
        paths[start] = [end];
      }
    });

    const connectionVisual = connections.map(([start, end]) => {
      const s = getCenterOfTile(stateMap[start]);
      const e = getCenterOfTile(stateMap[end]);
      const m = s.x === e.x ? {
        x: s.x,
        y: s.y + (e.y - s.y) / 2,
      } : {
        x: s.x + (e.x - s.x) / 2,
        y: s.y
      };
      return `M${s.x} ${s.y} L ${m.x} ${m.y} L ${e.x} ${e.y}`;
    });
    return (
      <div id="skiing-map">
        <svg
          width={mapWidth * (RECT_SIZE + STROKE_SIZE * 2)}
          height={mapHeight * (RECT_SIZE + STROKE_SIZE * 2)}
          version="1.1" xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
              <marker id="arrow" markerWidth="10" markerHeight="10" refx="0" refy="3" orient="auto" markerUnits="strokeWidth" viewBox="-3 -3 6 6">
                <path d="M-3,-3 L-3,3 L3,0 z" fill="#000" strokeWidth="1" stroke="#fff" />
              </marker>
          </defs>
          {stateMap.map(({ x, y, height, visited, path }, i) => {
            // console.log(...heightToHSV);
            const props = {
              key: `${x}-${y}`,
              x, y, height, path,
              fillColor: `rgb(${hsv2rgb(...heightToHSV(height, minHeight, maxHeight)).join(',')})`,
              isCurrent: i === currentIdx,
              // queueIndex: processingStacks.indexOf(i),
              visited,
              // processingPathsIdx: processingPaths.indexOf(i),
            };
            return <MapElement {...props} />;
          })
          }
          {connectionVisual.map((path) => (
            <path d={path} stroke="transparent" fill="transparent" strokeWidth="1" key={path} markerMid="url(#arrow)"/>
          ))}
          {bestPath.length > 1 ? (
            <path d={tilesToPath(bestPath, stateMap)} stroke="black" fill="transparent" strokeWidth="1" />
          ) : null}
        </svg>
      </div>
    );
  }
}

SkiingMap.propTypes = {
  stateMap: PropTypes.array.isRequired,
};

export default connect(
  (state) => ({
    ...state.skiingMap,
    mapHeight: state.skiingMapSelection.map.length,
    mapWidth: state.skiingMapSelection.map[0].length,
  }),
  (dispatch) => ({
    dispatch,
  })
)(SkiingMap);
