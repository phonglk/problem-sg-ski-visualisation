import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as DefaultActions from '../actions/DefaultActions';
// import Counter from '../components/Counter';
import SkiingMap from '../components/SkiingMap';
// import Footer from '../components/Footer';

export class App extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    skiingMap: PropTypes.array.isRequired,
  }

  shouldComponentUpdate(nextProps) {
    return !_.isEqual(nextProps, this.props);
  }

  componentDidMount() {
    if(this.props.skiingMap.length === 0) this.props.dispatch(this.props.actions.readMap());
  }

  render() {
    const { actions, skiingMap, minHeight, maxHeight, isStarted,
      isNextStep, pause, stop, resume,
      maxPath, nextIndex, currentIndex, processingStacks, processingPaths } = this.props;
    const mapProps = {
      mapMatrix: skiingMap,
      minHeight,
      maxHeight,
      currentIndex,
      processingStacks,
      processingPaths
    };
    return (
      <div className="main-app-container">
        <div className="main-app-nav">Skiing Problem</div>
        { isStarted ? isNextStep ? (
          <button onClick={() => actions.pause()}>pause</button>
        ) : (
          <button onClick={() => actions.resume()}>resume</button>
        ) : (
          <button onClick={() => actions.start()}>Start</button>
        )}
        { isStarted ? (<button onClick={() => actions.stop()}>stop</button>) : null}
        <SkiingMap {...mapProps}/>
        {/*<Footer />*/}
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
