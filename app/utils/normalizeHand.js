'use strict';

const _ = require('lodash');

const winningHands = require('../configs/WinningHands.json');
// Hand Values
const HIGH_CARD = 0
const ONE_PAIR = 1;
const TWO_PAIR = 2;
const THREE_OF_KIND = 3;
const STRAIGHT = 4;
const FLUSH = 5;
const FULL_HOUSE = 6;
const FOUR_OF_KIND = 7;
const STRAIGHT_FLUSH = 8;

module.exports = hand => {
    // each normalize function returns [A, B, C (, D, E, F)]
    // A = hand score
    // B = high card -> quadruplet
    // C = kicker -> lower of 2 pair
    // D = kicker
    // E = kicker
    // F = kicker

    // example: 10♠, 10♥, 4♦, 4♠, K♥, 7♣, 9♣ => [2, 10, 4, 12] (two pair)

    let flushMemo = {suit: null};

    // find 3 different normalized hands based on different scoring criteria
    let normdHands = [];
    normdHands.push(normalizeBySameVal(hand));
    normdHands.push(normalizeByFlush(hand, flushMemo));
    normdHands.push(normalizeByStraight(hand, flushMemo.suit));

    normdHands.sort((a,b) => {
        return b[0] - a[0];
    });

    // return highest normalized hand
    return normdHands[0];
};

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

        // straight has been found
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
