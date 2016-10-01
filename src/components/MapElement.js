import React, { Component } from 'react';

const RECT_SIZE = 40;

export default class MapElement extends Component {
  constructor(props) {
    super();
  }
  render() {
    const { x, y, height, fillColor } = this.props;
    const rectProps = {
      width: RECT_SIZE,
      height: RECT_SIZE,
      stroke: 'black',
      strokeWidth: 1,
      x: x * RECT_SIZE,
      y: y * RECT_SIZE,
      fill: fillColor,
    };
    const textProps = {
      x: rectProps.x + ~~(RECT_SIZE / 2),
      y: rectProps.y + ~~(RECT_SIZE / 2),
      textAnchor: 'middle',
      alignmentBaseline: 'middle',
      fontSize: 20,
    };
    return (
      <g>
        <rect {...rectProps} />
        <text {...textProps}>{height}</text>
      </g>
    );
  }
}
