'use strict';

const _ = require('lodash');

let gamePlay = require('../app/utils/gamePlay');
let players;
let community;
let output;

function isFirst (name) {
    return _.findWhere(output, {name: name}).rank === 1;
}

function isSecond (name) {
    return _.findWhere(output, {name: name}).rank === 2;
}

// high card beats lower high card
players = [
    {name:'Marcia', hand:[{qVal: 11, suit: '♦'}, {qVal: 9, suit: '♠'}]},
    {name:'Richard', hand:[{qVal: 5, suit: '♦'}, {qVal: 4, suit: '♥'}]}
];
community = [{qVal: 3, suit: '♠'}, {qVal: 8, suit: '♥'}, {qVal: 12, suit: '♥'}, {qVal: 7, suit: '♣'}, {qVal: 14, suit: '♥'}]
output = gamePlay.getRankedPlayers(players, community);
console.log(isFirst('Marcia') && isSecond('Richard'));

// two flushes (high kicker wins)
players = [
    {name:'Marcia', hand:[{qVal: 11, suit: '♦'}, {qVal: 9, suit: '♠'}]},
    {name:'Richard', hand:[{qVal: 5, suit: '♦'}, {qVal: 4, suit: '♥'}]}
];
community = [{qVal: 3, suit: '♦'}, {qVal: 8, suit: '♦'}, {qVal: 12, suit: '♦'}, {qVal: 7, suit: '♦'}, {qVal: 14, suit: '♥'}]
output = gamePlay.getRankedPlayers(players, community);
console.log(isFirst('Marcia') && isSecond('Richard'));

// straight (with low ace) beats 3 of kind
players = [
    {name:'Marcia', hand:[{qVal: 14, suit: '♦'}, {qVal: 9, suit: '♠'}]},
    {name:'Richard', hand:[{qVal: 5, suit: '♦'}, {qVal: 5, suit: '♥'}]}
];
community = [{qVal: 2, suit: '♠'}, {qVal: 3, suit: '♥'}, {qVal: 4, suit: '♠'}, {qVal: 5, suit: '♣'}, {qVal: 13, suit: '♥'}]
output = gamePlay.getRankedPlayers(players, community);
console.log(isFirst('Marcia') && isSecond('Richard'));

// flush beats straight
players = [
    {name:'Marcia', hand:[{qVal: 6, suit: '♦'}, {qVal: 9, suit: '♦'}]},
    {name:'Richard', hand:[{qVal: 5, suit: '♥'}, {qVal: 8, suit: '♥'}]}
];
community = [{qVal: 6, suit: '♠'}, {qVal: 7, suit: '♦'}, {qVal: 9, suit: '♠'}, {qVal: 5, suit: '♦'}, {qVal: 13, suit: '♦'}]
output = gamePlay.getRankedPlayers(players, community);
console.log(isFirst('Marcia') && isSecond('Richard'));

// straight flush beats flush
players = [
    {name:'Marcia', hand:[{qVal: 2, suit: '♦'}, {qVal: 3, suit: '♦'}]},
    {name:'Richard', hand:[{qVal: 14, suit: '♦'}, {qVal: 13, suit: '♦'}]}
];
community = [{qVal: 4, suit: '♦'}, {qVal: 5, suit: '♦'}, {qVal: 6, suit: '♦'}, {qVal: 2, suit: '♠'}, {qVal: 12, suit: '♠'}]
output = gamePlay.getRankedPlayers(players, community);
console.log(isFirst('Marcia') && isSecond('Richard'));

// higher straight beats lower straight
players = [
    {name:'Marcia', hand:[{qVal: 8, suit: '♥'}, {qVal: 9, suit: '♥'}]},
    {name:'Richard', hand:[{qVal: 3, suit: '♦'}, {qVal: 4, suit: '♦'}]}
];
community = [{qVal: 5, suit: '♠'}, {qVal: 6, suit: '♠'}, {qVal: 7, suit: '♦'}, {qVal: 7, suit: '♣'}, {qVal: 12, suit: '♣'}]
output = gamePlay.getRankedPlayers(players, community);
console.log(isFirst('Marcia') && isSecond('Richard'));

// community flush returns tie when 1 person has low flush kickers and other has 3 of a kind
players = [
    {name:'Marcia', hand:[{qVal: 2, suit: '♦'}, {qVal: 3, suit: '♦'}]},
    {name:'Richard', hand:[{qVal: 11, suit: '♥'}, {qVal: 11, suit: '♣'}]}
];
community = [{qVal: 5, suit: '♦'}, {qVal: 6, suit: '♦'}, {qVal: 9, suit: '♦'}, {qVal: 11, suit: '♦'}, {qVal: 12, suit: '♦'}]
output = gamePlay.getRankedPlayers(players, community);
console.log(isFirst('Marcia') && isFirst('Richard'));

// full house beats flush
players = [
    {name:'Marcia', hand:[{qVal: 2, suit: '♦'}, {qVal: 3, suit: '♦'}]},
    {name:'Richard', hand:[{qVal: 11, suit: '♥'}, {qVal: 11, suit: '♣'}]}
];
community = [{qVal: 5, suit: '♦'}, {qVal: 5, suit: '♣'}, {qVal: 9, suit: '♦'}, {qVal: 11, suit: '♦'}, {qVal: 12, suit: '♦'}]
output = gamePlay.getRankedPlayers(players, community);
console.log(isSecond('Marcia') && isFirst('Richard'));

// high kicker decides 2 equal two-pars
players = [
    {name:'Marcia', hand:[{qVal: 13, suit: '♦'}, {qVal: 4, suit: '♠'}]},
    {name:'Richard', hand:[{qVal: 5, suit: '♦'}, {qVal: 4, suit: '♥'}]}
];
community = [{qVal: 8, suit: '♠'}, {qVal: 8, suit: '♥'}, {qVal: 12, suit: '♥'}, {qVal: 7, suit: '♣'}, {qVal: 10, suit: '♥'}]
output = gamePlay.getRankedPlayers(players, community);
console.log(isFirst('Marcia') && isSecond('Richard'));

// community high kicker results in tie with 2 equal two-pars
players = [
    {name:'Marcia', hand:[{qVal: 7, suit: '♦'}, {qVal: 4, suit: '♠'}]},
    {name:'Richard', hand:[{qVal: 5, suit: '♦'}, {qVal: 4, suit: '♥'}]}
];
community = [{qVal: 8, suit: '♠'}, {qVal: 8, suit: '♥'}, {qVal: 12, suit: '♥'}, {qVal: 4, suit: '♣'}, {qVal: 10, suit: '♥'}]
output = gamePlay.getRankedPlayers(players, community);
console.log(isFirst('Marcia') && isFirst('Richard'));
