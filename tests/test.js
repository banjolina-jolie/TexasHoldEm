'use strict';

let utils = require('../app/utils');
let players;
let community;

/*

function reduceCard (card) {
    let newCard = {};
    newCard.qVal = card.qVal;
    if (card.altVal) {
        newCard.altVal = card.altVal;
    }
    newCard.suit = card.suit;
    return newCard;
}

let stuff = players.map(player => {
    player.hand = player.hand.map(reduceCard);
    return player;
});

let otro = community.map(reduceCard);

console.log(JSON.stringify(stuff))

console.log(JSON.stringify(otro))

*/


// high card
players = [
    {name:'Marcia', hand:[{qVal:11, suit:'♦'}, {qVal:9, suit:'♠'}]},
    {name:'Richard', hand:[{qVal:5, suit:'♦'}, {qVal:4, suit:'♥'}]}
];
community = [{qVal:3, suit:'♠'}, {qVal:8, suit:'♥'}, {qVal:12, suit:'♥'}, {qVal:7, suit:'♣'}, {qVal:14, 'altVal':1, suit:'♥'}]
console.log('high card: ', utils.checkForWinner(players, community) === 'Marcia wins');

// two flushes (high kicker wins)
players = [
    {name:'Marcia', hand:[{qVal:11, suit:'♦'}, {qVal:9, suit:'♠'}]},
    {name:'Richard', hand:[{qVal:5, suit:'♦'}, {qVal:4, suit:'♥'}]}
];
community = [{qVal:3, suit:'♦'}, {qVal:8, suit:'♦'}, {qVal:12, suit:'♦'}, {qVal:7, suit:'♦'}, {qVal:14, 'altVal':1, suit:'♥'}]
console.log('two flushes (high kicker wins): ', utils.checkForWinner(players, community) === 'Marcia wins');

// straight (with low ace) beats 3 of kind
players = [
    {name:'Marcia', hand:[{qVal:14, suit:'♦'}, {qVal:9, suit:'♠'}]},
    {name:'Richard', hand:[{qVal:5, suit:'♦'}, {qVal:5, suit:'♥'}]}
];
community = [{qVal:2, suit:'♠'}, {qVal:3, suit:'♥'}, {qVal:4, suit:'♠'}, {qVal:5, suit:'♣'}, {qVal:13, suit:'♥'}]
console.log('straight beats 3 of kind: ', utils.checkForWinner(players, community) === 'Marcia wins');

// flush beats straight
players = [
    {name:'Marcia', hand:[{qVal:6, suit:'♦'}, {qVal:9, suit:'♦'}]},
    {name:'Richard', hand:[{qVal:5, suit:'♥'}, {qVal:8, suit:'♥'}]}
];
community = [{qVal:6, suit:'♠'}, {qVal:7, suit:'♦'}, {qVal:9, suit:'♠'}, {qVal:5, suit:'♦'}, {qVal:13, suit:'♦'}]
console.log('flush beats straight: ', utils.checkForWinner(players, community) === 'Marcia wins');

// straight flush beats flush
players = [
    {name:'Marcia', hand:[{qVal:2, suit:'♦'}, {qVal:3, suit:'♦'}]},
    {name:'Richard', hand:[{qVal:14, suit:'♦'}, {qVal:13, suit:'♦'}]}
];
community = [{qVal:4, suit:'♦'}, {qVal:5, suit:'♦'}, {qVal:6, suit:'♦'}, {qVal:2, suit:'♠'}, {qVal:12, suit:'♠'}]
console.log('straight flush beats flush: ', utils.checkForWinner(players, community) === 'Marcia wins');

// higher straight beats lower straight
players = [
    {name:'Marcia', hand:[{qVal:8, suit:'♥'}, {qVal:9, suit:'♥'}]},
    {name:'Richard', hand:[{qVal:3, suit:'♦'}, {qVal:4, suit:'♦'}]}
];
community = [{qVal:5, suit:'♠'}, {qVal:6, suit:'♠'}, {qVal:7, suit:'♦'}, {qVal:7, suit:'♣'}, {qVal:12, suit:'♣'}]
console.log('higher straight beats lower straight: ', utils.checkForWinner(players, community) === 'Marcia wins');


