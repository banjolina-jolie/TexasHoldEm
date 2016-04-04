'use strict';

const _ = require('lodash');
const names = require('../configs/Names.json');

let normalizeHand = require('./normalizeHand');
let rankedPlayers = require('./rankedPlayers');

const suits = [
    {suitName: '♠', color: 'black'},
    {suitName: '♥', color: 'red'},
    {suitName: '♣', color: 'black'},
    {suitName: '♦', color: 'red'}
];

// start with just face cards
let cardValues = [
    {val: 'J', qVal: 11},
    {val: 'Q', qVal: 12},
    {val: 'K', qVal: 13},
    {val: 'A', qVal: 14}
];

// Push non face cards into cardValues
for (var i = 10; i >= 2; i--) {
    cardValues.unshift({val: i, qVal: i});
}

module.exports = {
    buildDeck() {
        let output = [];

        // create a card for each suit and value
        suits.forEach(suit => {
            cardValues.forEach(value => {
                let card = _.extend({}, value);
                card.suit = suit.suitName;
                card.color = suit.color;
                output.push(card);
            });
        });

        return output;
    },
    buildPlayers(N) {
        let output = [];
        for (var i = 0; i < N; i++) {
            output.push({name: names[i], hand: []});
        }
        return output;
    },
    getRankedPlayers(players, community) {
        // window.players = players;
        // window.community = community;
        // create normalized players
        let nPlayers = players.map(player => {
            return {
                name: player.name,
                nHand: normalizeHand(player.hand.concat(community))
            };
        });

        return rankedPlayers(nPlayers);
    }
};
