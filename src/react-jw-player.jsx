import React, { Component } from 'react';

import createEventHandlers from './create-event-handlers';
import getCurriedOnLoad from './helpers/get-curried-on-load';
import getPlayerOpts from './helpers/get-player-opts';
import initialize from './helpers/initialize';
import installPlayerScript from './helpers/install-player-script';

import defaultProps from './default-props';
import propTypes from './prop-types';

const displayName = 'ReactJWPlayer';

class ReactJWPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adHasPlayed: false,
      hasPlayed: false,
      hasFired: {},
    };
    this.eventHandlers = createEventHandlers(this);
    this.uniqueScriptId = 'jw-player-script';
    this._initialize = this._initialize.bind(this);
  }
  componentDidMount() {
    const isJWPlayerScriptLoaded = !!window.jwplayer;
    if (isJWPlayerScriptLoaded) {
      console.log('hasPlayed', this.state.hasPlayed);
    	this._initialize();
      return;
    }

    const existingScript = document.getElementById(this.uniqueScriptId);

    if (!existingScript) {
      installPlayerScript({
        context: document,
        onLoadCallback: this._initialize,
        scriptSrc: this.props.playerScript,
        uniqueScriptId: this.uniqueScriptId,
      });
    } else {
      existingScript.onload = getCurriedOnLoad(existingScript, this._initialize);
    }
  }

	componentWillReceiveProps() {
  	console.log('update');
	}
  _initialize() {
    const component = this;
    const player = window.jwplayer(this.props.playerId);
    const playerOpts = getPlayerOpts(this.props);
	  console.log('load', this.props.playlist, this.state.hasPlayed);
	  if (this.state.hasPlayed) {

	  	if (this.props.playlist) {

			  player.load(this.props.playlist);
		  } else if (this.props.file) {
			  player.load([{ file: this.props.file }]);
		  }
	  } else {
		  initialize({ component, player, playerOpts });
	  }

  }
  render() {
    return (
      <div className={this.props.className} id={this.props.playerId} />
    );
  }
}

ReactJWPlayer.defaultProps = defaultProps;
ReactJWPlayer.displayName = displayName;
ReactJWPlayer.propTypes = propTypes;
export default ReactJWPlayer;
