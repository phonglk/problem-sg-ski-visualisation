import React, { Component } from 'react';

const RECT_SIZE = 40;

export default class MapElement extends Component {
  constructor(props) {
    super();
  }
  render() {
    const { x, y, height, fillColor, isCurrent, queueIndex } = this.props;
    const rectProps = {
      width: RECT_SIZE,
      height: RECT_SIZE,
      stroke: fillColor,
      strokeWidth: 3,
      strokeOpacity: 1,
      x: x * (RECT_SIZE + 3),
      y: y * (RECT_SIZE + 3),
      fill: fillColor,
    };
    const textProps = {
      x: rectProps.x + ~~(RECT_SIZE / 2),
      y: rectProps.y + ~~(RECT_SIZE / 2),
      textAnchor: 'middle',
      alignmentBaseline: 'middle',
      fontSize: 18,
    };
    if (isCurrent) {
      Object.assign(rectProps, {
        stroke: 'green',
        strokeOpacity: 1,
      });
      Object.assign(textProps, {
        fontSize: 22,
      });
    }
    const elements = [
      <rect {...rectProps} />,
      <text {...textProps}>{height}</text>,
    ];
    if (queueIndex > -1) {
      const queueTextProps = {
        x: rectProps.x + RECT_SIZE - 10,
        y: rectProps.y + RECT_SIZE - 6,
        textAnchor: 'right',
        alignmentBaseline: 'middle',
        fontSize: 12,
      };
      elements.push(<text {...queueTextProps}>{queueIndex}</text>);
    }
    return (
      <g>{elements}</g>
    );
  }
}
