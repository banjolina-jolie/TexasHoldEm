'use strict';

const _ = require('lodash');
const winningHands = require('../configs/WinningHands.json');

module.exports = nPlayers => {
    nPlayers.forEach(nPlayer => {
        nPlayer.handType = winningHands[nPlayer.nHand[0]].name;
    });

    let output = [];
    let rank = 1;

    function sortPlayers (players) {
        let winners = extractWinners(players);
        winners.forEach(obj => {
            output.push({ handType: obj.handType, name: obj.name, rank });
        });

        // bump rank by number of winners from previous extractWinners call
        rank += winners.length;

        // filter out players who've been ranked already
        let remainders = nPlayers.filter(player => {
            return !_.findWhere(output, {name: player.name});
        });

        // if there are players who haven't been ranked yet, recurse
        if (remainders.length) {
            sortPlayers(remainders);
        }
    }

    // start sort with all normalized players
    sortPlayers(nPlayers);
    return output;
};

function extractWinners (players) {
    // if only one player is left, that's our winner
    if (players.length === 1) {
        return [{name: players[0].name, handType: players[0].handType}];
    }

    // if we've removed all values from nHand, then it's a tie among all remaining players
    if (!players[0].nHand.length) {
        return players;
    }

    // sort players based on 1st nHand value
    players.sort((a, b) => {
        return b.nHand[0] - a.nHand[0];
    });

    // remove all players with a lower 1st nHand value than the 1st player's 1st nHand value
    let topPlayers = players.filter(player => {
        return player.nHand[0] === players[0].nHand[0];
    });

    // remove 1st nHand value from all players
    topPlayers.forEach(player => {
        player.nHand.shift();
    });

    // recurse with remaining players
    return extractWinners(topPlayers);
}
