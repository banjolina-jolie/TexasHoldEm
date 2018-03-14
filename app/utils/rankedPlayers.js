'use strict';

const _ = require('lodash');
const winningHands = require('../configs/WinningHands.json');

module.exports = nPlayers => {
  // set handType on each player to be shown in UI
  nPlayers.forEach(nPlayer => {
    nPlayer.handType = winningHands[nPlayer.nHand[0]].name;
  });

  let output = [];
  let rank = 1;

  function sortPlayers(players) {
    // return if no players left to sort
    if (!players.length) {
      return;
    }

    // create temp nHand so that original nHand doesn't change during extractWinners
    players.forEach(player => {
      player.tempNHand = player.nHand.slice();
    });

    let winners = extractWinners(players);
    winners.forEach(obj => {
      output.push({ handType: obj.handType, name: obj.name, rank });
    });

    // bump rank by number of winners from previous extractWinners call
    rank += winners.length;

    // filter out players who've been ranked already
    players = players.filter(player => {
      return !_.findWhere(output, { name: player.name });
    });

    // sort remaining players
    sortPlayers(players);
  }

  // start sort with all normalized players
  sortPlayers(nPlayers);
  return output;
};

function extractWinners(players) {
  // if only one player is left, that's our winner
  if (players.length === 1) {
    return [{ name: players[0].name, handType: players[0].handType }];
  }

  // if we've removed all values from nHand, then it's a tie among all remaining players
  if (!players[0].tempNHand.length) {
    return players;
  }

  // sort players based on 1st nHand value
  players.sort((a, b) => {
    return b.tempNHand[0] - a.tempNHand[0];
  });

  // remove all players with a lower 1st nHand value than the 1st player's 1st nHand value
  let topPlayers = players.filter(player => {
    return player.tempNHand[0] === players[0].tempNHand[0];
  });

  // remove 1st nHand value from all players
  topPlayers.forEach(player => {
    player.tempNHand.shift();
  });

  // recurse with remaining players
  return extractWinners(topPlayers);
}
