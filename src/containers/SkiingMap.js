import React, { Component, PropTypes } from 'react';
import hsv2rgb from 'hsv2rgb';
import { connect } from 'react-redux';

import MapElement from '../components/MapElement';
import { RECT_SIZE, STROKE_SIZE } from '../constants';

const SVG_WIDTH = 300;
const SVG_HEIGHT = 300;

function heightToHSV(height, minHeight, maxHeight) {
  const relVal = ((height - minHeight) / (maxHeight - minHeight)) * 100;
  return [
    Math.floor((100 - relVal) * 120 / 100), // h
    Math.abs(relVal - 50) / 50, // s
    1, // v
  ];
}

function getCenterOfTile(point) {
  const x = point.x * (RECT_SIZE + STROKE_SIZE / 2) + RECT_SIZE / 2 + STROKE_SIZE;
  const y = point.y * (RECT_SIZE + STROKE_SIZE / 2) + RECT_SIZE / 2 + STROKE_SIZE;
  return { x, y };
}

function tilesToPath(idxes, stateMap) {
  return 'M' + idxes.map((idx) => {
    const point = stateMap[idx];
    const x = point.x * (RECT_SIZE) + RECT_SIZE / 2;
    const y = point.y * (RECT_SIZE) + RECT_SIZE / 2;
    return `${x} ${y}`;
  }).join(' L ');
}

export class SkiingMap extends Component {
  render() {
    const { stateMap, minHeight, maxHeight,
      currentIdx, processingStack,
    } = this.props;
    // const visualPaths = paths.map((idxes) => {
    //   return 'M' + idxes.map((idx) => {
    //     const point = stateMap[idx];
    //     const x = point.x * (RECT_SIZE) + RECT_SIZE / 2;
    //     const y = point.y * (RECT_SIZE) + RECT_SIZE / 2;
    //     return `${x} ${y}`;
    //   }).join(' L ');
    // });
    const connections = stateMap.reduce((prev, cur, idx) => {
      if (cur.nextTiles.length > 0) cur.nextTiles.forEach((nId) => {
        prev.push([idx, nId]);
      });
      return prev;
    }, []);
    // const connectionVisual = connections.map((idxes) => tilesToPath(idxes, stateMap));
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
        <svg width={SVG_WIDTH} height={SVG_HEIGHT} version="1.1" xmlns="http://www.w3.org/2000/svg">
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
              // visited,
              // processingPathsIdx: processingPaths.indexOf(i),
            };
            return <MapElement {...props} />;
          })
          }
          {connectionVisual.map((path) => (
            <path key={path} d={path} stroke="transparent" fill="transparent" strokeWidth="1" key={path} markerMid="url(#arrow)"/>
          ))}
        </svg>
      </div>
    );
  }
}

SkiingMap.propTypes = {
  stateMap: PropTypes.array.isRequired,
};

export default connect(
  (state) => state.skiingMap,
  (dispatch) => ({
    dispatch,
  })
)(SkiingMap);
