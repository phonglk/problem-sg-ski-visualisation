import React, { Component } from 'react';
import { RECT_SIZE, STROKE_SIZE } from '../constants';

export default class MapElement extends Component {
  constructor(props) {
    super();
  }
  render() {
    const { x, y, height, fillColor, isCurrent, path,
      queueIndex, visited, processingPathsIdx } = this.props;
    const rectProps = {
      width: RECT_SIZE,
      height: RECT_SIZE,
      stroke: fillColor,
      strokeWidth: STROKE_SIZE,
      strokeOpacity: 1,
      x: x * (RECT_SIZE + STROKE_SIZE),
      y: y * (RECT_SIZE + STROKE_SIZE),
      fill: fillColor,
    };
    const textProps = {
      x: rectProps.x + ~~(RECT_SIZE / 2),
      y: rectProps.y + ~~(RECT_SIZE / 2),
      textAnchor: 'middle',
      alignmentBaseline: 'middle',
      fontSize: 18,
    };
    let elements = [];
    if (visited) {
      const checkTextProps = {
        x: rectProps.x + RECT_SIZE - 10,
        y: rectProps.y + 8,
        textAnchor: 'right',
        alignmentBaseline: 'middle',
        fontSize: 12,
        fill: 'green',
      };
      elements.push(<text {...checkTextProps}>✓</text>);
    }

    if (isCurrent) {
      Object.assign(rectProps, {
        stroke: 'green',
        strokeOpacity: 1,
      });
      Object.assign(textProps, {
        fontSize: 22,
      });
    }

    elements = [<rect {...rectProps} />, <text {...textProps}>{height}</text>].concat(elements);
    return (
      <g>{elements}</g>
    );
  }
}
