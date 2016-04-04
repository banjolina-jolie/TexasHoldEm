'use strict';

const _ = require('lodash');
const winningHands = require('./configs/WinningHands.json');

const names = ['Marcia', 'Richard', 'Theresa', 'David', 'Alice', 'Brandon'];

const HIGH_CARD = 0
const ONE_PAIR = 1;
const TWO_PAIR = 2;
const THREE_OF_KIND = 3;
const STRAIGHT = 4;
const FLUSH = 5;
const FULL_HOUSE = 6;
const FOUR_OF_KIND = 7;
const STRAIGHT_FLUSH = 8;

const suits = [
    {suitName: '♠', color: 'black'},
    {suitName: '♥', color: 'red'},
    {suitName: '♣', color: 'black'},
    {suitName: '♦', color: 'red'}
];

let values = [
    {val: 'J', qVal: 11},
    {val: 'Q', qVal: 12},
    {val: 'K', qVal: 13},
    {val: 'A', qVal: 14, altVal: 1}
];

// Push non face cards into values
for (var i = 10; i >= 2; i--) {
    values.unshift({val: i, qVal: i});
}


module.exports = {
    buildDeck() {
        let output = [];

        suits.forEach(suit => {
            values.forEach(value => {
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
    checkForWinner(players, community) {
        let nHands = players.map(player => {
            return {
                playerName: player.name,
                nHand: normalizeHand(player.hand.concat(community))
            };
        });
        nHands.sort((a,b) => {
            return b.nHand[0] - a.nHand[0];
        });

        return nHands[0].playerName;
    }
};

function normalizeHand (hand) {
    // return [A, B, C (, D, E, F)]
    // A = hand score
    // B = highest card -> quadruplet
    // C = kicker -> lower of 2 pair
    // D = kicker
    // E = kicker
    // F = kicker
    // example: [2, 10, 4, 12] => 10♠, 10♥, 4♦, 4♠, K♥ (two pair)
    let normdHands = []
    normdHands.push(normalizeBySameVal(hand));
    normdHands.push(normalizeByFlush(hand));
    let hasFlush = normdHands[1] > -1;
    normdHands.push(normalizeByStraight(hand, hasFlush));

    normdHands.sort((a,b) => {
        return b[0] - a[0];
    });

    return normdHands[0];
}

function normalizeBySameVal (hand) {
    let output = [];
    let counter = {};

    hand.forEach(card => {
        if (counter[card.qVal]) {
            counter[card.qVal]++;
        } else {
            counter[card.qVal] = 1;
        }
    });

    let counterArr = _.map(counter, (count, qVal) => {
        return {qVal: Number(qVal), count};
    });

    // sort counterArr high to low primarily by count and secondarily by quantified value
    counterArr = _.sortBy(counterArr, 'qVal');
    counterArr = _.sortBy(counterArr, 'count');
    counterArr.reverse();

    // add hand_score to beginning of output array
    if (counterArr[0].count === 4) {
        output.push(FOUR_OF_KIND);
    } else if (counterArr[0].count === 3) {
        output.push(counterArr[1].count >= 2 ? FULL_HOUSE : THREE_OF_KIND);
    } else if (counterArr[0].count === 2) {
        output.push(counterArr[1].count === 2 ? TWO_PAIR : ONE_PAIR);
    } else {
        output.push(HIGH_CARD);
    }

    // paramsLength ensures that later we only check 5 cards instead of 7
    let paramsLength = winningHands[output[0]].params;
    for (var i = 0; i < paramsLength; i++) {
        output.push(Number(counterArr[i].qVal));
    }

    return output;
}


// Check for flush
function normalizeByFlush (hand) {
    let output = [];
    let sorted = _.sortBy(hand, 'qVal');
    sorted = _.sortBy(hand, 'suit');

    for (var i = 0; i < 3; i++) {
        let fiveCards = sorted.slice(i, i+5);
        let isFlush = _.every(fiveCards, card => {
            return card.suit === sorted[i].suit;
        });
        if (isFlush) {
            return [FLUSH, sorted[i+4].qVal];
        }
    }

    return [-1];
}

// Check for straight
function normalizeByStraight (hand, hasFlush) {
    let output = [];

    let sorted = _.sortBy(hand, 'qVal');

    for (var i = sorted.length-1; i >= 5; i--) {
        let diff = 1;
        let inSequence = true;
        let isFlush = true;

        while (diff < 5 && inSequence) {
            inSequence = inSequence && (sorted[i-diff].qVal === sorted[i].qVal - diff || sorted[i-diff].altVal === sorted[i].qVal - diff);
            isFlush = isFlush && sorted[i-diff].suit === sorted[i].suit;
            diff++;
        }

        if (inSequence) {
            if (isFlush) {
                return [STRAIGHT_FLUSH, sorted[i].qVal];
            } else if (!hasFlush) {
                return [STRAIGHT, sorted[i].qVal];
            }
        }
    }

    return [-1];
}
