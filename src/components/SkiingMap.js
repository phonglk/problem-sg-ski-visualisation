import React, { Component, PropTypes } from 'react';
import hsv2rgb from 'hsv2rgb';
import MapElement from './MapElement';
import { RECT_SIZE } from '../constants';

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

export default class SkiingMap extends Component {
  static propTypes = {
    mapMatrix: PropTypes.array.isRequired,
  }

  render() {
    const { mapMatrix, minHeight, maxHeight, currentIndex, processingStacks, processingPaths, paths } = this.props;
    const visualPaths = paths.map((idxes) => {
      return 'M' + idxes.map((idx) => {
        const point = mapMatrix[idx];
        const x = point.x * (RECT_SIZE) + RECT_SIZE / 2;
        const y = point.y * (RECT_SIZE) + RECT_SIZE / 2;
        return `${x} ${y}`;
      }).join(' L ');
    });
    console.log('visualPaths', visualPaths);
    return (
      <div id="skiing-map">
        <svg width={SVG_WIDTH} height={SVG_HEIGHT} version="1.1" xmlns="http://www.w3.org/2000/svg">
          {mapMatrix.map(({ x, y, height, visited, path }, i) => {
            // console.log(...heightToHSV);
            const props = {
              key: `${x}-${y}`,
              x, y, height, path,
              fillColor: `rgb(${hsv2rgb(...heightToHSV(height, minHeight, maxHeight)).join(',')})`,
              isCurrent: i === currentIndex,
              queueIndex: processingStacks.indexOf(i),
              visited,
              processingPathsIdx: processingPaths.indexOf(i),
            };
            return <MapElement {...props} />;
          })
          }
          {visualPaths.map(path => (
            <path d={path} stroke="blue" fill="transparent" stroke-width="3" />
          ))}
        </svg>
      </div>
    );
  }
}
