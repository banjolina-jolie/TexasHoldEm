'use strict';

const _ = require('lodash');

let gamePlay = require('../app/utils/gamePlay');
let players;
let community;
let output;

function isRank (name, rank) {
    return _.findWhere(output, {name: name}).rank === rank;
}

function isFirst (name) {
    return isRank(name, 1);
}

function isSecond (name) {
    return isRank(name, 2);
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

players = [
    {
        name: "Richard", // 444KJ 1
        hand: [{qVal: 7, suit:'♠'}, {qVal: 4, suit: '♥'}]
    },
    {
        name: "Alice", // 444KJ 1
        hand: [{qVal: 6, suit:'♣'}, {qVal: 4, suit: '♦'}]
    },
    {
        name: "Marcia", // KK44A 3
        hand: [{qVal: 13, suit:'♥'}, {qVal: 14, suit: '♠'}]
    },
    {
        name: "Eric", // KK44J 4
        hand: [{qVal: 8, suit:'♠'}, {qVal: 13, suit: '♠'}]
    },
    {
        name: "Rita", // KK44J 4
        hand: [{qVal: 10, suit:'♦'}, {qVal: 13, suit: '♣'}]
    },
    {
        name: "Brandon", // JJ44K 6
        hand: [{qVal: 11, suit:'♦'}, {qVal: 12, suit: '♥'}]
    },
    {
        name: "Eduardo", // JJ44K 6
        hand: [{qVal: 11, suit:'♣'}, {qVal: 3, suit: '♥'}]
    },
    {
        name: "Lance", // JJ44K 6
        hand: [{qVal: 7, suit:'♦'}, {qVal: 11, suit: '♠'}]
    },
    {
        name: "Theresa", // 5544K 9
        hand: [{qVal: 5, suit:'♦'}, {qVal: 6, suit: '♠'}]
    },
    {
        name: "Cameron", // 5544K 9
        hand: [{qVal: 5, suit:'♣'}, {qVal: 8, suit: '♣'}]
    },
    {
        name: "Jason", // 44AKQ 11
        hand: [{qVal: 12, suit:'♦'}, {qVal: 14, suit: '♥'}]
    },
    {
        name: "David", // 44AKJ 12
        hand: [{qVal: 10, suit:'♠'}, {qVal: 14, suit: '♦'}]
    },
    {
        name: "Michael", // 44KQJ 13
        hand: [{qVal: 12, suit:'♣'}, {qVal: 10, suit: '♥'}]
    },
    {
        name: "Frances", // 44KJ10 14
        hand: [{qVal: 10, suit:'♣'}, {qVal: 2, suit: '♦'}]
    },
    {
        name: "Cassandra", // 44KJ9 15
        hand: [{qVal: 2, suit:'♣'}, {qVal: 9, suit: '♦'}]
    },
    {
        name: "Caitlin", // 44KJ9 15
        hand: [{qVal: 9, suit:'♥'}, {qVal: 6, suit: '♥'}]
    },
    {
        name: "Leo", // 44KJ9 15
        hand: [{qVal: 2, suit:'♥'}, {qVal: 9, suit: '♠'}]
    },
    {
        name: "Lucy", // 44KJ9 15
        hand: [{qVal: 9, suit:'♣'}, {qVal: 3, suit: '♠'}]
    },
    {
        name: "Sara", // 44KJ7 19
        hand: [{qVal: 7, suit:'♣'}, {qVal: 3, suit: '♦'}]
    },
    {
        name: "Peter", // 44KJ6 20
        hand: [{qVal: 3, suit:'♣'}, {qVal: 6, suit: '♦'}]
    },
]

community = [{qVal: 4, suit: '♣'}, {qVal: 11, suit: '♥'}, {qVal: 5, suit: '♥'}, {qVal: 13, suit: '♦'}, {qVal: 4, suit: '♠'}]
output = gamePlay.getRankedPlayers(players, community);

console.log(isRank("Richard", 1));
console.log(isRank("Alice", 1));
console.log(isRank("Marcia", 3));
console.log(isRank("Eric", 4));
console.log(isRank("Rita", 4));
console.log(isRank("Brandon", 6));
console.log(isRank("Eduardo", 6));
console.log(isRank("Lance", 6));
console.log(isRank("Theresa", 9));
console.log(isRank("Cameron", 9));
console.log(isRank("Jason", 11));
console.log(isRank("David", 12));
console.log(isRank("Michael", 13));
console.log(isRank("Frances", 14));
console.log(isRank("Cassandra", 15));
console.log(isRank("Caitlin", 15));
console.log(isRank("Leo", 15));
console.log(isRank("Lucy", 15));
console.log(isRank("Sara", 19));
console.log(isRank("Peter", 20));
