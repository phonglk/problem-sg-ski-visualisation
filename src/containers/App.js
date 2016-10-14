import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as DefaultActions from '../actions/DefaultActions';
// import Counter from '../components/Counter';
// import SkiingMap from '../components/SkiingMap';
// import Footer from '../components/Footer';
import MapSelection from './MapSelection';
import SkiingMap from './SkiingMap';

export class App extends Component {

  shouldComponentUpdate(nextProps) {
    return !_.isEqual(nextProps, this.props);
  }

  componentDidMount() {
    // if(this.props.skiingMap.length === 0) this.props.dispatch(this.props.actions.readMap());
  }

  render() {

    return (
      <div className="main-app-container">
        <div className="main-app-nav">Skiing Problem</div>
        <MapSelection />
        <button onClick={this.props.actions.run}>RUN</button>
        <button onClick={this.props.actions.nextStep}>NEXT</button>
        <SkiingMap />
        <div>Problem: http://geeks.redmart.com/2015/01/07/skiing-in-singapore-a-coding-diversion/</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(DefaultActions, dispatch),
    dispatch,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
