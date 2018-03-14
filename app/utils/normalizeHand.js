'use strict';

const _ = require('lodash');
const handValues = require('../configs/Hands.json');

// A normalized hand is an array representation of the best 5 cards a player can use
// The first item is the hand score and the 2nd -> 6th are card qVals

module.exports = sevenCards => {
  /*
    each normalize function returns [A, B (, C, D, E, F)]
    A = hand score
    B = high card, triplet card of THREE_OF_KIND or FULL_HOUSE, high card of straight
    C = kicker, lower pair of TWO_PAIR or FULL_HOUSE
    D = kicker
    E = kicker
    F = kicker

    Examples:
    - Straight: 3♠, 4♥, 5♦, 6♠, 7♥, 4♣, J♣ => [4, 7]
    - Full House: 8♠, 8♥, 8♦, K♣, K♠, 10♥, A♣ => [6, 8, 13]
    - 4 of Kind: Q♠, Q♥, Q♦, Q♣, 4♠, 10♥, A♣ => [7, 12, 14]
    - 2 Pair: 10♠, 10♥, 4♦, 4♠, Q♥, 7♣, 9♣ => [2, 10, 4, 12]
    - 1 Pair: 2♠, 2♥, 5♦, 7♠, 9♥, J♣, 6♣ => [1, 2, 11, 9, 7]
    - Flush: 7♥, 2♥, 9♥, 10♥, 4♥, 10♠, A♣ => [5, 10, 9, 7, 4, 2]
  */

  // keeps track of the suit in case of flush scenario
  let flushMemo = { suit: null };

  // find 3 different normalized hands based on different scoring criteria
  let normdHands = [
    normalizeBySameQVal(sevenCards),
    normalizeByFlush(sevenCards, flushMemo),
    normalizeByStraight(sevenCards, flushMemo.suit)
  ];

  // return normalized hand with highest hand score
  return normdHands.sort((a, b) => b[0] - a[0])[0];
};

// This function checks for FOUR_OF_KIND, FULL_HOUSE, THREE_OF_KIND, TWO_PAIR, and ONE_PAIR
function normalizeBySameQVal(hand) {
  let sortedQVals = _.map(hand, 'qVal')
    .sort((a, b) => a - b)
    .reverse(); // highest qVals first

  // count how many of each card are present
  const counter = _.countBy(sortedQVals);

  // define array of objects containing unique qVal and that qVal's count
  let counts = _.map(counter, (count, qVal) => ({
    qVal: Number(qVal),
    count
  }));

  // sort counts high to low primarily by count and secondarily by quantified value
  counts = _.sortBy(counts, 'qVal');
  counts = _.sortBy(counts, 'count');
  counts.reverse();

  const mainSetQVal = counts[0].qVal;
  const hasSecondSet = counts[1].count >= 2;

  if (counts[0].count === 4) {
    const kicker = _.without(sortedQVals, mainSetQVal)[0];
    return [handValues.FOUR_OF_KIND, mainSetQVal, kicker];
  } else if (counts[0].count === 3) {
    if (hasSecondSet) {
      return [handValues.FULL_HOUSE, mainSetQVal, counts[1].qVal];
    } else {
      const threeOfKindKickers = _.without(sortedQVals, mainSetQVal).slice(
        0,
        2
      );
      return [handValues.THREE_OF_KIND, mainSetQVal].concat(threeOfKindKickers);
    }
  } else if (counts[0].count === 2) {
    if (hasSecondSet) {
      const twoPairKicker = _.without(
        sortedQVals,
        mainSetQVal,
        counts[1].qVal
      )[0];
      return [handValues.TWO_PAIR, mainSetQVal, counts[1].qVal, twoPairKicker];
    } else {
      const onePairKickers = _.without(sortedQVals, mainSetQVal).slice(0, 3);
      return [handValues.ONE_PAIR, mainSetQVal].concat(onePairKickers);
    }
  } else {
    const highCardKickers = _.without(sortedQVals, mainSetQVal).slice(0, 4);
    return [handValues.HIGH_CARD, mainSetQVal].concat(highCardKickers);
  }
}

// This function checks for FLUSH and sets `suit` key on flushMemo
function normalizeByFlush(hand, memo) {
  let sorted = _.sortBy(hand, 'qVal');
  sorted = _.sortBy(hand, 'suit');

  for (let i = sorted.length - 5; i >= 0; i--) {
    const fiveCards = sorted.slice(i, i + 5);
    let isFlush = _.every(fiveCards, card => card.suit === sorted[i].suit);

    if (isFlush) {
      memo.suit = sorted[i].suit; // set global `flushSuit` variable
      return [handValues.FLUSH].concat(fiveCards);
    }
  }

  // flush doesn't exist
  return [-1];
}

// Check for straight & straight flush
function normalizeByStraight(hand, flushSuit) {
  // sort hand by qVal
  let sorted = _.sortBy(hand, 'qVal');

  if (flushSuit) {
    // if there's a flush suit, remove all non-suited cards.
    // we're only looking for a straight flush
    sorted = sorted.filter(card => card.suit === flushSuit);
  } else {
    // only keep one card of each qVal
    sorted = removeDuplicateQVals(sorted);
  }

  // adds an ace with qVal = 1 to index 0 if ace is present in hand
  addAcesToStart(sorted);

  for (let i = sorted.length - 5; i >= 0; i--) {
    let fiveCards = sorted.slice(i, i + 5);
    let isStraight = checkStraight(fiveCards);

    if (isStraight) {
      let handValue = flushSuit
        ? handValues.STRAIGHT_FLUSH
        : handValues.STRAIGHT;
      return [handValue, _.last(fiveCards).qVal];
    }
  }

  // no straight
  return [-1];
}

function checkStraight(cards) {
  for (var i = 0; i < cards.length - 1; i++) {
    let currentCardQVal = cards[i].qVal;
    let nextCardQVal = cards[i + 1].qVal;
    if (currentCardQVal + 1 !== nextCardQVal) {
      return false;
    }
  }
  return true;
}

function removeDuplicateQVals(hand) {
  let memo = {};
  return hand.filter(card => {
    let isDuped = memo[card.qVal];
    memo[card.qVal] = true;
    return !isDuped;
  });
}

// adds an ace with qVal=1 if ace is present in hand
function addAcesToStart(hand) {
  let lastCard = _.last(hand);
  if (lastCard.qVal === 14) {
    hand.unshift({ qVal: 1, suit: lastCard.suit });
  }
}
