'use strict';
let _ = require('lodash');
let React = require('react/addons');
let utils = require('../utils');
let HAND_SIZE = 2;

function freshState(playerCount) {
    let deck = _.shuffle(utils.buildDeck());
    let players = utils.buildPlayers(playerCount);
    let gameState = 0;
    let communityCards = [];
    let winner = '';

    return { deck, players, gameState, communityCards, winner };
}


let TexasHoldEmView = React.createClass({

    getInitialState() {
        return freshState(2);
    },

    componentDidUpdate() {
        if (this.state.gameState === 4 && !this.state.winner) {
            this._selectWinner();
        }
    },

    render() {
        return (
            <div>
                <h2>Texas Hold 'em</h2>
                <div className="controls">
                    <label>Players</label>
                    <input type="number" min="2" max="6" value={this.state.players.length} onChange={this._playerCountChanged} />
                    { this.renderButton() }
                    <span className="winner">{this.state.winner}</span>
                </div>


                <div className="players">
                    { this.state.players.map(this.renderPlayer) }
                </div>
                <div className="community">
                    <div>Community</div>
                    { this.state.communityCards.map(this.renderCard) }
                </div>


            </div>
        );
    },

    renderButton() {
        let buttonStates = [
            [this._dealHands, 'Deal'],
            [this._dealCommunity(3), 'Flop'],
            [this._dealCommunity(1), 'Turn'],
            [this._dealCommunity(1), 'River'],
            [this._resetGame, 'Reset']
        ];
        let state = buttonStates[this.state.gameState];
        return (<button onClick={state[0]}>{state[1]}</button>);
    },

    renderPlayer(player) {
        return (
            <div className="player">
                <div className="player-name">
                    {player.name}
                </div>
                {player.hand.map(this.renderCard)}
            </div>
        );
    },

    renderCard(card) {
        let classes = 'card ';
        classes += card.color;
        return (
            <span className={classes}>{card.val} {card.suit}</span>
        );

    },

    _dealHands() {
        let players = this.state.players;
        let deck = this.state.deck;
        let cardsToDeal = HAND_SIZE;

        while (cardsToDeal) {
            players.forEach(player => {
                player.hand.push(deck.shift());
            });
            cardsToDeal--;
        }

        this.setState({deck, players, gameState: 1});
    },

    _dealCommunity(N) {
        return e => {
            let communityCards = this.state.communityCards;
            let deck = this.state.deck;
            let gameState = ++this.state.gameState;

            while (N) {
                communityCards.push(deck.shift());
                N--;
            }

            this.setState({deck, communityCards, gameState});
        }
    },

    _playerCountChanged(e) {
        let count = e.target.value;
        this.setState(freshState(count));
    },

    _resetGame() {
        let playerCount = this.state.players.length;
        this.setState(freshState(playerCount));
    },

    _selectWinner() {
        let winner = utils.checkForWinner(this.state.players, this.state.communityCards);
        this.setState({winner});
    }

});

module.exports = TexasHoldEmView;
