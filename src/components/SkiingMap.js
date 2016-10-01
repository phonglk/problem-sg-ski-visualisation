import React, { Component, PropTypes } from 'react';
import hsv2rgb from 'hsv2rgb';
import MapElement from './MapElement';

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

  constructor(props) {
    super();
    this.state = {
      ...this.transformMatrix(props.mapMatrix),
    };
  }

  transformMatrix(mapMatrix) {
    const elements = [];
    let maxHeight = -Infinity;
    let minHeight = Infinity;
    mapMatrix.forEach((row, y) => {
      row.forEach((val, x) => {
        if (val > maxHeight) maxHeight = val;
        else if (val < minHeight) minHeight = val;
        elements.push({
          x,
          y,
          height: val,
        });
      });
    });
    return {
      elements,
      minHeight,
      maxHeight,
    };
  }

  render() {
    const { elements, minHeight, maxHeight } = this.state;
    return (
      <div id="skiing-map">
        <svg width={SVG_WIDTH} height={SVG_HEIGHT} version="1.1" xmlns="http://www.w3.org/2000/svg">
          {elements.map(({ x, y, height }) => {
            // console.log(...heightToHSV);
            const props = {
              key: `${x}-${y}`,
              x, y, height,
              fillColor: `rgb(${hsv2rgb(...heightToHSV(height, minHeight, maxHeight)).join(',')})`,
            };
            return <MapElement {...props} />;
          })
          }
        </svg>
      </div>
    );
  }
}
