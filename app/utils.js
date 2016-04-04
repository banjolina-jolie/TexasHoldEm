'use strict';

const _ = require('lodash');

const winningHands = require('./configs/WinningHands.json');
const names = require('./configs/Names.json');

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
    checkForWinner(players, community) {
        // create normalized players
        let nPlayers = players.map(player => {
            return {
                playerName: player.name,
                nHand: normalizeHand(player.hand.concat(community))
            };
        });

        return extractWinner(nPlayers);
    }
};


function normalizeHand (hand) {
    // each normalize function returns [A, B, C (, D, E, F)]
    // A = hand score
    // B = high card -> quadruplet
    // C = kicker -> lower of 2 pair
    // D = kicker
    // E = kicker
    // F = kicker

    // example: 10♠, 10♥, 4♦, 4♠, K♥, 7♣, 9♣ => [2, 10, 4, 12] (two pair)

    let flushMemo = {suit: null};

    let normdHands = [];
    normdHands.push(normalizeBySameVal(hand));
    normdHands.push(normalizeByFlush(hand, flushMemo));
    normdHands.push(normalizeByStraight(hand, flushMemo.suit));

    normdHands.sort((a,b) => {
        return b[0] - a[0];
    });

    // return highest normalized hand
    return normdHands[0];
}

function normalizeBySameVal (hand) {
    let output = [];

    // count how many of each card are present
    let counter = {};
    hand.forEach(card => {
        if (counter[card.qVal]) {
            counter[card.qVal]++;
        } else {
            counter[card.qVal] = 1;
        }
    });

    // define array of unique qVals and their count
    let counterArr = _.map(counter, (count, qVal) => {
        return {qVal: Number(qVal), count};
    });

    // sort counterArr high to low primarily by count and secondarily by quantified value
    counterArr = _.sortBy(counterArr, 'qVal');
    counterArr = _.sortBy(counterArr, 'count');
    counterArr.reverse();

    // 1st element of output array is the score for hand type
    if (counterArr[0].count === 4) {
        output.push(FOUR_OF_KIND);
    } else if (counterArr[0].count === 3) {
        output.push(counterArr[1].count >= 2 ? FULL_HOUSE : THREE_OF_KIND);
    } else if (counterArr[0].count === 2) {
        output.push(counterArr[1].count === 2 ? TWO_PAIR : ONE_PAIR);
    } else {
        output.push(HIGH_CARD);
    }

    // push qVals into output
    // paramsLength ensures that our output accounts for 5 cards instead of 7
    let paramsLength = winningHands[output[0]].params;
    for (var i = 0; i < paramsLength; i++) {
        output.push(Number(counterArr[i].qVal));
    }

    return output;
}


// Check if flush exists
function normalizeByFlush (hand, memo) {
    let output = [];
    let sorted = _.sortBy(hand, 'qVal');
    sorted = _.sortBy(hand, 'suit');

    for (var i = sorted.length-5; i >= 0; i--) {
        let fiveCards = sorted.slice(i, i+5);
        let isFlush = _.every(fiveCards, card => {
            return card.suit === sorted[i].suit;
        });
        if (isFlush) {
            memo.suit = sorted[i].suit; // remember suit for normalizeByStraight
            let output = [FLUSH];
            let toAdd = 4;

            while (toAdd >= 0) {
                output.push(sorted[i+toAdd].qVal);
                toAdd--;
            }

            return output;
        }
    }

    // flush doesn't exist
    return [-1];
}

function removeDups (hand) {
    let memo = {};
    return hand.filter(card => {
        let isDuped = memo[card.qVal];
        memo[card.qVal] = true;
        return !isDuped;
    });
}

function addAcesToStart (hand) {
    let lastCard = _.last(hand);
    if (lastCard.qVal === 14) {
        hand.unshift({qVal: 1, suit: lastCard.suit});
    }
}

// Check for straight
function normalizeByStraight (hand, flushSuit) {
    let output = [];

    let sorted = _.sortBy(hand, 'qVal');

    if (flushSuit) {
        // if there's a flush suit, remove all non-suited cards.
        // we're only looking for a straight flush
        sorted = sorted.filter(card => {
            return card.suit === flushSuit;
        });
    } else {
        // remove duplicates
        sorted = removeDups(sorted);
    }

    // add aces to beginning
    addAcesToStart(sorted);

    // start at end
    for (var i = sorted.length-1; i >= 4; i--) {
        let inSequence = true;
        let diff = 1;

        while (diff < 5 && inSequence) {
            // from sorted[i], check sorted[i-diff]
            inSequence = inSequence && sorted[i-diff].qVal === sorted[i].qVal - diff;
            diff++;
        }

        if (inSequence) {
            if (flushSuit) {
                return [STRAIGHT_FLUSH, sorted[i].qVal];
            } else {
                return [STRAIGHT, sorted[i].qVal];
            }
        }
    }

    // no straight
    return [-1];
}

function extractWinner (players) {
    // if only one player is left, that's our winner
    if (players.length === 1) {
        return players[0].playerName + ' wins';
    }

    // if we've removed all values from nHand, then it's a tie among all remaining players
    if (!players[0].nHand.length) {
        let output = 'Tie between ';
        output += _.pluck(players, 'playerName');
        return output;
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
    return extractWinner(topPlayers);
}
