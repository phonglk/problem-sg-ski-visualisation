import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import Select from 'react-select';
import { selectMap } from '../actions/DefaultActions';

class MapSelection extends Component {
  constructor(props) {
    super(props);
    this.onChange = (option) => this.props.dispatch(selectMap(option.value));
  }
  render() {
    const { options, selected, dispatch } = this.props;
    const onChange = this.onChange;
    return (
      <div className="map-select__container">
        <div className="map-select__label">Map:</div>
        <div className="map-select__select-wrapper">
          <Select
            value={selected}
            options={options.map((opt) => ({ value: opt, label: opt }))}
            onChange={onChange}
          />
        </div>
      </div>
    );
  }
}

MapSelection.propTypes = {
  dispatch: PropTypes.func,
};

export default connect(
  (state) => state.skiingMapSelection,
  (dispatch) => ({
    dispatch,
  })
)(MapSelection);
