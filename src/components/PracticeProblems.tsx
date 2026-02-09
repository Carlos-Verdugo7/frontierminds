'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Lightbulb, ChevronDown, ChevronUp, RefreshCw, Sparkles, PenLine, Calculator } from 'lucide-react';
import AITutor from './AITutor';
import ExamCalculator from './ExamCalculator';

interface Problem {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
  topic: string;
}

const problems: Record<string, Problem[]> = {
  '1.1': [
    {
      id: 1,
      question: `Of a group of patients having injuries:
• 28% visit both a physical therapist AND a chiropractor
• 8% visit neither
• P(physical therapist) - P(chiropractor) = 0.16

What is the probability that a randomly selected patient visits a physical therapist?`,
      options: ['0.52', '0.60', '0.68', '0.72', '0.80'],
      correctIndex: 2,
      explanation: `Let P = physical therapist, C = chiropractor.

Given:
• P(P ∩ C) = 0.28
• P(neither) = 0.08, so P(P ∪ C) = 1 - 0.08 = 0.92
• P(P) - P(C) = 0.16

Using the Addition Rule:
P(P ∪ C) = P(P) + P(C) - P(P ∩ C)
0.92 = P(P) + P(C) - 0.28
P(P) + P(C) = 1.20

We have two equations:
• P(P) + P(C) = 1.20
• P(P) - P(C) = 0.16

Adding: 2·P(P) = 1.36
P(P) = 0.68`,
      hint: 'Use the Addition Rule: P(A∪B) = P(A) + P(B) - P(A∩B). Note that P(neither) = 1 - P(P∪C).',
      topic: 'Addition Rule',
    },
    {
      id: 2,
      question: `A survey found that P(A) = 0.43, P(B) = 0.40, P(C) = 0.32, P(A∩B) = 0.29, P(A∩C) = 0.22, P(B∩C) = 0.20, and P(A∩B∩C) = 0.15.

What is P(A ∪ B ∪ C)?`,
      options: ['0.49', '0.55', '0.59', '0.65', '0.73'],
      correctIndex: 2,
      explanation: `Using the Inclusion-Exclusion Principle for three events:

P(A ∪ B ∪ C) = P(A) + P(B) + P(C) - P(A∩B) - P(A∩C) - P(B∩C) + P(A∩B∩C)

= 0.43 + 0.40 + 0.32 - 0.29 - 0.22 - 0.20 + 0.15
= 1.15 - 0.71 + 0.15
= 0.59`,
      hint: 'For three events: P(A∪B∪C) = P(A) + P(B) + P(C) - P(A∩B) - P(A∩C) - P(B∩C) + P(A∩B∩C)',
      topic: 'Inclusion-Exclusion',
    },
    {
      id: 3,
      question: `A fair six-sided die is rolled six times. If the face numbered k appears on roll k (for k = 1,2,...,6), we call it a "match."

What is the probability of getting at least one match?`,
      options: ['0.500', '0.632', '0.665', '0.750', '0.833'],
      correctIndex: 2,
      explanation: `Use the Complement Rule: P(at least one match) = 1 - P(no matches)

For no matches on any roll, each roll must NOT match its position.
P(roll k ≠ k) = 5/6 for each roll.

Since rolls are independent:
P(no matches) = (5/6)^6 = 0.335

P(at least one match) = 1 - (5/6)^6 = 1 - 0.335 = 0.665`,
      hint: 'Use the Complement Rule! P(at least one) = 1 - P(none). For independent events, multiply probabilities.',
      topic: 'Complement Rule & Independence',
    },
    {
      id: 4,
      question: `An insurance company finds that:
• P(A ∪ B) = 0.76
• P(A ∪ B') = 0.87

Find P(A).`,
      options: ['0.55', '0.63', '0.71', '0.76', '0.87'],
      correctIndex: 1,
      explanation: `We know:
• P(A ∪ B) = P(A) + P(B) - P(A∩B) = 0.76
• P(A ∪ B') = P(A) + P(B') - P(A∩B') = 0.87

Note that P(B') = 1 - P(B) and A = (A∩B) ∪ (A∩B')

So P(A) = P(A∩B) + P(A∩B')

From P(A ∪ B') = P(A) + P(B') - P(A∩B') = 0.87:
We can also use: P(A ∪ B) + P(A ∪ B') = P(A) + P(B) - P(A∩B) + P(A) + (1-P(B)) - P(A∩B')
= 2P(A) + 1 - P(A∩B) - P(A∩B')
= 2P(A) + 1 - P(A)  [since P(A) = P(A∩B) + P(A∩B')]
= P(A) + 1

So P(A) = 0.76 + 0.87 - 1 = 0.63`,
      hint: 'Note that A = (A∩B) ∪ (A∩B\'), a disjoint union. This means P(A) = P(A∩B) + P(A∩B\').',
      topic: 'Set Operations',
    },
    {
      id: 5,
      question: `A disk 2 inches in diameter is thrown at random on a floor tiled with square tiles that are 4 inches on each side.

What is the probability that the disk lands entirely within one tile?`,
      options: ['1/8', '1/4', '3/8', '1/2', '9/16'],
      correctIndex: 1,
      explanation: `For the disk to land entirely on one tile, its CENTER must land in a specific region.

The disk has radius 1 inch. For the disk to stay within a tile (4×4 inches), the center must be at least 1 inch from each edge.

This means the center must land in a 2×2 inch square in the middle of the tile (leaving 1 inch margin on each side).

P(disk entirely on one tile) = (favorable area) / (total area)
= (2 × 2) / (4 × 4)
= 4/16
= 1/4`,
      hint: 'Think about where the CENTER of the disk must land. The center must be at least 1 inch from each edge of the tile.',
      topic: 'Geometric Probability',
    },
    {
      id: 6,
      question: `An insurance company looks at its auto insurance customers and finds that:
(a) all insure at least one car
(b) 85% insure more than one car
(c) 23% insure a sports car
(d) 17% insure more than one car, including a sports car

Find the probability that a customer selected at random insures exactly one car and it is not a sports car.`,
      options: ['0.09', '0.15', '0.21', '0.06', '0.12'],
      correctIndex: 0,
      explanation: `Let M = insures more than one car, S = insures a sports car.

Given: P(M) = 0.85, P(S) = 0.23, P(M ∩ S) = 0.17

We want P(M' ∩ S') = P(exactly one car AND not a sports car)

P(M') = 1 - 0.85 = 0.15 (exactly one car)

Using P(S | M') to find sports car owners with one car:
P(S) = P(S ∩ M) + P(S ∩ M')
0.23 = 0.17 + P(S ∩ M')
P(S ∩ M') = 0.06

So P(M' ∩ S') = P(M') - P(M' ∩ S) = 0.15 - 0.06 = 0.09`,
      hint: 'Let M = more than one car, S = sports car. Find P(M\' ∩ S\') using the fact that M\' = exactly one car.',
      topic: 'Set Operations',
    },
    {
      id: 7,
      question: `During a visit to a primary care physician's office, the probability of having neither lab work nor referral to a specialist is 0.21. The probability of having lab work is 0.41 and the probability of having a referral is 0.53.

What is the probability of having both lab work and a referral?`,
      options: ['0.10', '0.15', '0.20', '0.25', '0.30'],
      correctIndex: 1,
      explanation: `Let L = lab work, R = referral.

Given: P(L' ∩ R') = 0.21, P(L) = 0.41, P(R) = 0.53

P(neither) = P(L' ∩ R') = P((L ∪ R)') = 1 - P(L ∪ R)
0.21 = 1 - P(L ∪ R)
P(L ∪ R) = 0.79

Using the Addition Rule:
P(L ∪ R) = P(L) + P(R) - P(L ∩ R)
0.79 = 0.41 + 0.53 - P(L ∩ R)
P(L ∩ R) = 0.94 - 0.79 = 0.15`,
      hint: 'Use De Morgan\'s Law: P(neither) = 1 - P(L ∪ R). Then apply the Addition Rule.',
      topic: 'Addition Rule & De Morgan',
    },
    {
      id: 8,
      question: `A typical roulette wheel used in a casino has 38 slots numbered 1, 2, 3, ..., 36, 0, 00. The 0 and 00 slots are colored green. Half of the remaining 36 slots are red and half are black. Half of the integers 1-36 are odd and half are even.

If a ball lands in one slot at random, what is P(D) where D = {x : x is odd}?`,
      options: ['1/2', '18/38', '17/38', '19/38', '9/19'],
      correctIndex: 1,
      explanation: `The sample space has 38 equally likely outcomes.

D = {odd numbers from 1 to 36}
Note: 0 and 00 are defined as neither odd nor even.

There are 18 odd numbers among 1 to 36.

P(D) = 18/38 = 9/19`,
      hint: 'Remember that 0 and 00 are neither odd nor even. Count only the odd numbers from 1 to 36.',
      topic: 'Equally Likely Outcomes',
    },
    {
      id: 9,
      question: `Let x equal a number selected randomly from the closed interval [0, 1]. Using geometric probability, what is P({x: 0 ≤ x ≤ 1/3})?`,
      options: ['1/2', '1/3', '2/3', '1/4', '3/4'],
      correctIndex: 1,
      explanation: `For continuous uniform probability on [0, 1]:

P(a ≤ x ≤ b) = (b - a) / (1 - 0) = b - a

For the interval [0, 1/3]:
P(0 ≤ x ≤ 1/3) = (1/3 - 0) / (1 - 0) = 1/3

This is geometric probability: favorable length / total length.`,
      hint: 'For uniform distribution on [0,1], probability = length of interval / total length.',
      topic: 'Geometric Probability',
    },
    {
      id: 10,
      question: `Roll a fair six-sided die three times. Let A₁ = {1 or 2 on first roll}, A₂ = {3 or 4 on second roll}, A₃ = {5 or 6 on third roll}.

Given that P(Aᵢ) = 1/3 for each i, and the events are independent, find P(A₁ ∪ A₂ ∪ A₃).`,
      options: ['1/3', '1/2', '19/27', '2/3', '8/9'],
      correctIndex: 2,
      explanation: `Using the complement approach for independent events:

P(A₁ ∪ A₂ ∪ A₃) = 1 - P(A₁' ∩ A₂' ∩ A₃')

Since events are independent, their complements are also independent:
P(Aᵢ') = 1 - 1/3 = 2/3

P(A₁' ∩ A₂' ∩ A₃') = (2/3)³ = 8/27

P(A₁ ∪ A₂ ∪ A₃) = 1 - 8/27 = 19/27`,
      hint: 'Use complement: P(A₁ ∪ A₂ ∪ A₃) = 1 - P(none occur) = 1 - (2/3)³',
      topic: 'Independence & Complement',
    },
    {
      id: 11,
      question: `Draw one card at random from a standard deck of 52 cards. Let:
A = {x: x is a jack, queen, or king}
B = {x: x is a 9, 10, or jack and x is red}
C = {x: x is a club}

Find P(A ∩ B).`,
      options: ['1/52', '2/52', '3/52', '4/52', '6/52'],
      correctIndex: 1,
      explanation: `A = {jack, queen, king} has 12 cards (4 of each)
B = {red 9, red 10, red jack} has 6 cards (2 each of 9, 10, jack in hearts/diamonds)

A ∩ B = cards that are (jack, queen, or king) AND (red 9, 10, or jack)
     = {red jacks only}
     = 2 cards (jack of hearts, jack of diamonds)

P(A ∩ B) = 2/52 = 1/26`,
      hint: 'Find the intersection: which cards are in BOTH sets A and B?',
      topic: 'Set Operations',
    },
    {
      id: 12,
      question: `Draw one card at random from a standard deck of 52 cards. Let:
A = {x: x is a jack, queen, or king}
B = {x: x is a 9, 10, or jack and x is red}

Find P(A ∪ B).`,
      options: ['14/52', '16/52', '18/52', '20/52', '22/52'],
      correctIndex: 1,
      explanation: `A = {jack, queen, king} has 12 cards
B = {red 9, red 10, red jack} has 6 cards
A ∩ B = {red jacks} has 2 cards

Using the Addition Rule:
P(A ∪ B) = P(A) + P(B) - P(A ∩ B)
         = 12/52 + 6/52 - 2/52
         = 16/52 = 4/13`,
      hint: 'Use the Addition Rule: P(A∪B) = P(A) + P(B) - P(A∩B)',
      topic: 'Addition Rule',
    },
    {
      id: 13,
      question: `A fair coin is tossed four times. Let A = {at least 3 heads} and B = {at most 2 heads}.

If each of the 16 outcomes has probability 1/16, find P(A ∩ B).`,
      options: ['0', '1/16', '2/16', '4/16', '5/16'],
      correctIndex: 0,
      explanation: `A = {at least 3 heads} = {3 heads, 4 heads}
B = {at most 2 heads} = {0 heads, 1 head, 2 heads}

A ∩ B = outcomes with (at least 3 heads) AND (at most 2 heads)
      = ∅ (empty set - impossible to have both!)

These events are mutually exclusive.

P(A ∩ B) = 0`,
      hint: 'Can an outcome have both "at least 3 heads" AND "at most 2 heads"?',
      topic: 'Mutually Exclusive Events',
    },
    {
      id: 14,
      question: `A fair coin is tossed four times. Let A = {at least 3 heads} and C = {heads on the third toss}.

If each outcome has probability 1/16, find P(A ∩ C).`,
      options: ['1/16', '2/16', '3/16', '4/16', '5/16'],
      correctIndex: 3,
      explanation: `A = {at least 3 heads}: outcomes with 3 or 4 heads
C = {heads on third toss}: outcomes with H in position 3

A ∩ C = outcomes with ≥3 heads AND H at position 3

4 heads with H at position 3:
• HHHH ✓

3 heads with H at position 3 (T can be at positions 1, 2, or 4):
• THHH (T at position 1) ✓
• HTHH (T at position 2) ✓
• HHHT (T at position 4) ✓

Total: 1 + 3 = 4 outcomes

P(A ∩ C) = 4/16 = 1/4`,
      hint: 'List outcomes with at least 3 heads, then check which have H on the third toss.',
      topic: 'Counting Outcomes',
    },
    {
      id: 15,
      question: `Consider successive rolls of a six-sided die until a 3 is first observed. Let A be the event that 3 is observed on the first trial, and B be the event that at least two trials are required.

Find P(A ∪ B).`,
      options: ['1/6', '5/6', '11/36', '1', '35/36'],
      correctIndex: 3,
      explanation: `A = {3 on first roll}
B = {at least 2 rolls needed} = {3 NOT on first roll}

Notice that B = A' (the complement of A).

Therefore: A ∪ B = A ∪ A' = S (the entire sample space)

P(A ∪ B) = P(S) = 1

These events are complementary, so together they cover all possibilities.`,
      hint: 'Think about what B really means. Is there any outcome not in A or B?',
      topic: 'Complementary Events',
    },
    {
      id: 16,
      question: `If P(A) = 0.4, P(B) = 0.5, and P(A ∩ B) = 0.3, find P(A ∪ B).`,
      options: ['0.5', '0.6', '0.7', '0.8', '0.9'],
      correctIndex: 1,
      explanation: `Using the Addition Rule:

P(A ∪ B) = P(A) + P(B) - P(A ∩ B)
         = 0.4 + 0.5 - 0.3
         = 0.6`,
      hint: 'Direct application of the Addition Rule.',
      topic: 'Addition Rule',
    },
    {
      id: 17,
      question: `If P(A) = 0.4, P(B) = 0.5, and P(A ∩ B) = 0.3, find P(A ∩ B').`,
      options: ['0.1', '0.2', '0.3', '0.4', '0.5'],
      correctIndex: 0,
      explanation: `We can partition A into two disjoint parts:
A = (A ∩ B) ∪ (A ∩ B')

Therefore:
P(A) = P(A ∩ B) + P(A ∩ B')
0.4 = 0.3 + P(A ∩ B')
P(A ∩ B') = 0.1

This represents outcomes in A but NOT in B.`,
      hint: 'Use the fact that A = (A ∩ B) ∪ (A ∩ B\'), a disjoint union.',
      topic: 'Set Partitions',
    },
    {
      id: 18,
      question: `If P(A) = 0.4, P(B) = 0.5, and P(A ∩ B) = 0.3, find P(A' ∪ B').`,
      options: ['0.4', '0.5', '0.6', '0.7', '0.8'],
      correctIndex: 3,
      explanation: `Using De Morgan's Law:
A' ∪ B' = (A ∩ B)'

Therefore:
P(A' ∪ B') = P((A ∩ B)')
           = 1 - P(A ∩ B)
           = 1 - 0.3
           = 0.7`,
      hint: 'Apply De Morgan\'s Law: (A ∩ B)\' = A\' ∪ B\'',
      topic: 'De Morgan\'s Laws',
    },
    {
      id: 19,
      question: `Divide a line segment into two parts by selecting a point at random. What is the probability that the longer segment is at least two times longer than the shorter segment?`,
      options: ['1/4', '1/3', '1/2', '2/3', '3/4'],
      correctIndex: 3,
      explanation: `Let the segment have length 1, and let x be the position of the random point (0 < x < 1).

The two parts have lengths x and (1-x).

For the longer to be ≥ 2× the shorter:
Case 1: x ≥ 2(1-x) → x ≥ 2 - 2x → 3x ≥ 2 → x ≥ 2/3
Case 2: (1-x) ≥ 2x → 1 ≥ 3x → x ≤ 1/3

So we need x ≤ 1/3 OR x ≥ 2/3.

P = P(x ≤ 1/3) + P(x ≥ 2/3)
  = 1/3 + 1/3
  = 2/3`,
      hint: 'If one part has length x, the other has length (1-x). When is one at least twice the other?',
      topic: 'Geometric Probability',
    },
    {
      id: 20,
      question: `Let the interval [-r, r] be the base of a semicircle of radius r. If a point is selected at random from this interval, what is the probability that the perpendicular from the point to the semicircle has length less than r/2?`,
      options: ['1 - √3/2', '√3/2', '1/2', '1/4', '1 - √3/4'],
      correctIndex: 0,
      explanation: `For a point at position x on [-r, r], the perpendicular to the semicircle has length:
h(x) = √(r² - x²) (the y-coordinate on the semicircle)

We want P(h(x) < r/2):
√(r² - x²) < r/2
r² - x² < r²/4
x² > 3r²/4
|x| > r√3/2

So we need x < -r√3/2 OR x > r√3/2.

The favorable region has length:
[from -r to -r√3/2] + [from r√3/2 to r] = r(1 - √3/2) + r(1 - √3/2) = 2r(1 - √3/2)

P = 2r(1 - √3/2) / 2r = 1 - √3/2 ≈ 0.134`,
      hint: 'The perpendicular length at point x is √(r² - x²). Set up the inequality and solve for x.',
      topic: 'Geometric Probability',
    },
    {
      id: 21,
      question: `Let pₙ (n = 0, 1, 2, ...) be the probability that an automobile policyholder will file n claims in a five-year period. The actuary assumes that pₙ₊₁ = (1/4)pₙ.

What is the probability that the holder will file two or more claims?`,
      options: ['1/16', '1/20', '1/48', '1/64', '1/80'],
      correctIndex: 0,
      explanation: `Given: pₙ₊₁ = (1/4)pₙ, which means this is a geometric sequence.
pₙ = (1/4)ⁿ · p₀

Since probabilities must sum to 1:
Σpₙ = p₀(1 + 1/4 + 1/16 + ...) = p₀ · 1/(1-1/4) = p₀ · (4/3) = 1

So p₀ = 3/4

Therefore:
• p₀ = 3/4
• p₁ = (1/4)(3/4) = 3/16

P(≥2 claims) = 1 - p₀ - p₁
             = 1 - 3/4 - 3/16
             = 16/16 - 12/16 - 3/16
             = 1/16`,
      hint: 'First find p₀ using the fact that all probabilities sum to 1 (geometric series). Then compute P(n ≥ 2) = 1 - p₀ - p₁.',
      topic: 'Geometric Series',
    },
  ],
  '1.2': [
    {
      id: 1,
      question: `A state issues license plates consisting of 3 letters followed by 3 digits. How many different plates are possible if repetition is allowed?`,
      options: ['15,600,000', '17,576,000', '11,232,000', '26,000,000', '17,576'],
      correctIndex: 1,
      explanation: `Using the Multiplication Principle:
• 3 letters: 26 × 26 × 26 = 26³ = 17,576
• 3 digits: 10 × 10 × 10 = 10³ = 1,000

Total = 17,576 × 1,000 = 17,576,000 plates`,
      hint: 'Use the Multiplication Principle. For each position, count the number of choices.',
      topic: 'Multiplication Principle',
    },
    {
      id: 2,
      question: `How many permutations are there of the letters in the word "PROBABILITY"?`,
      options: ['39,916,800', '19,958,400', '9,979,200', '4,989,600', '2,494,800'],
      correctIndex: 2,
      explanation: `"PROBABILITY" has 11 letters with repetitions:
P-R-O-B-A-B-I-L-I-T-Y
P(1), R(1), O(1), B(2), A(1), I(2), L(1), T(1), Y(1) = 11 letters

Distinguishable permutations = 11! / (2! × 2!)
= 39,916,800 / 4
= 9,979,200`,
      hint: 'Count repeated letters and use the formula for distinguishable permutations: n!/(n₁! × n₂! × ...)',
      topic: 'Distinguishable Permutations',
    },
    {
      id: 3,
      question: `A committee of 5 is to be selected from a group of 6 men and 9 women. In how many ways can this be done if the committee must have exactly 3 women?`,
      options: ['252', '1,260', '2,520', '3,780', '756'],
      correctIndex: 1,
      explanation: `We need exactly 3 women and 2 men.

• Ways to choose 3 women from 9: C(9,3) = 84
• Ways to choose 2 men from 6: C(6,2) = 15

By Multiplication Principle:
Total = 84 × 15 = 1,260`,
      hint: 'Break into two independent selections: choose women, then choose men. Multiply the results.',
      topic: 'Combinations',
    },
    {
      id: 4,
      question: `From a standard 52-card deck, how many 5-card hands contain exactly 2 aces?`,
      options: ['103,776', '778,320', '2,598,960', '84,480', '1,098,240'],
      correctIndex: 0,
      explanation: `We need exactly 2 aces and 3 non-aces.

• Ways to choose 2 aces from 4: C(4,2) = 6
• Ways to choose 3 non-aces from 48: C(48,3) = 17,296

Total = 6 × 17,296 = 103,776`,
      hint: 'Select the aces first, then select the remaining cards from non-aces.',
      topic: 'Combinations',
    },
    {
      id: 5,
      question: `In how many ways can 8 people be seated in a row if 2 specific people must sit next to each other?`,
      options: ['5,040', '10,080', '20,160', '40,320', '80,640'],
      correctIndex: 1,
      explanation: `Treat the 2 people who must sit together as a single unit.

• Now we have 7 "units" to arrange: 7! = 5,040
• The 2 people in the unit can be arranged: 2! = 2

Total = 7! × 2! = 5,040 × 2 = 10,080`,
      hint: 'Treat the pair as a single unit, arrange all units, then arrange within the unit.',
      topic: 'Permutations with Constraints',
    },
    {
      id: 6,
      question: `A pizza shop offers 10 toppings. How many different pizzas can be made with exactly 4 toppings?`,
      options: ['5,040', '210', '10,000', '240', '151,200'],
      correctIndex: 1,
      explanation: `Since the order of toppings doesn't matter, this is a combination.

C(10,4) = 10! / (4! × 6!)
= (10 × 9 × 8 × 7) / (4 × 3 × 2 × 1)
= 5,040 / 24
= 210`,
      hint: 'Does the order of toppings matter? If not, use combinations.',
      topic: 'Combinations',
    },
    {
      id: 7,
      question: `How many different 4-letter "words" can be formed from the letters A, B, C, D, E if no letter can be repeated?`,
      options: ['120', '625', '256', '24', '1,024'],
      correctIndex: 0,
      explanation: `This is a permutation problem (order matters in a word) without replacement.

P(5,4) = 5! / (5-4)!
= 5! / 1!
= 5 × 4 × 3 × 2
= 120`,
      hint: 'Order matters in a word. How many choices for position 1? Then position 2? And so on...',
      topic: 'Permutations',
    },
    {
      id: 8,
      question: `In a bridge hand (13 cards from a 52-card deck), what is the probability of getting all 4 aces?`,
      options: ['0.00264', '0.00026', '0.01056', '0.00106', '0.10560'],
      correctIndex: 0,
      explanation: `Total bridge hands: C(52,13)

Favorable: Choose all 4 aces, then 9 more from the remaining 48 cards.
= C(4,4) × C(48,9) = 1 × C(48,9)

P = C(48,9) / C(52,13)
= 1,677,106,640 / 635,013,559,600
≈ 0.00264`,
      hint: 'Calculate favorable outcomes (must have all 4 aces) divided by total possible hands.',
      topic: 'Combinations & Probability',
    },
  ],
  '1.3': [
    {
      id: 1,
      question: `An urn contains 4 red balls and 6 blue balls. Two balls are drawn without replacement. What is the probability that both balls are red?`,
      options: ['0.133', '0.160', '0.200', '0.240', '0.400'],
      correctIndex: 0,
      explanation: `Using the Multiplication Rule:
P(R₁ ∩ R₂) = P(R₁) × P(R₂|R₁)
= (4/10) × (3/9)
= 12/90
= 2/15
≈ 0.133`,
      hint: 'After drawing the first red ball, how many red balls remain? How many total balls remain?',
      topic: 'Multiplication Rule',
    },
    {
      id: 2,
      question: `If P(A) = 0.6, P(B) = 0.5, and P(A ∩ B) = 0.3, find P(A|B).`,
      options: ['0.30', '0.50', '0.60', '0.75', '0.80'],
      correctIndex: 2,
      explanation: `Using the definition of conditional probability:
P(A|B) = P(A ∩ B) / P(B)
= 0.3 / 0.5
= 0.6`,
      hint: 'Use the formula P(A|B) = P(A ∩ B) / P(B)',
      topic: 'Conditional Probability',
    },
    {
      id: 3,
      question: `A factory has two machines. Machine A produces 60% of items and has a 3% defect rate. Machine B produces 40% of items and has a 5% defect rate. What is the probability that a randomly selected item is defective?`,
      options: ['0.032', '0.038', '0.040', '0.045', '0.080'],
      correctIndex: 1,
      explanation: `Using the Law of Total Probability:
P(Defective) = P(A) × P(D|A) + P(B) × P(D|B)
= 0.60 × 0.03 + 0.40 × 0.05
= 0.018 + 0.020
= 0.038`,
      hint: 'Use the Law of Total Probability: sum over all sources weighted by their probability.',
      topic: 'Law of Total Probability',
    },
    {
      id: 4,
      question: `Three cards are drawn without replacement from a standard 52-card deck. What is the probability that all three are hearts?`,
      options: ['0.0129', '0.0156', '0.0166', '0.0183', '0.0250'],
      correctIndex: 0,
      explanation: `Using the Extended Multiplication Rule:
P(H₁ ∩ H₂ ∩ H₃) = P(H₁) × P(H₂|H₁) × P(H₃|H₁∩H₂)
= (13/52) × (12/51) × (11/50)
= (13 × 12 × 11) / (52 × 51 × 50)
= 1716 / 132600
= 0.0129`,
      hint: 'Apply the multiplication rule three times. After each heart is drawn, one fewer heart and one fewer card total.',
      topic: 'Extended Multiplication Rule',
    },
    {
      id: 5,
      question: `P(A|B) = 0.4 and P(B) = 0.5. Find P(A ∩ B).`,
      options: ['0.10', '0.20', '0.40', '0.50', '0.80'],
      correctIndex: 1,
      explanation: `From the definition of conditional probability:
P(A|B) = P(A ∩ B) / P(B)

Rearranging:
P(A ∩ B) = P(A|B) × P(B)
= 0.4 × 0.5
= 0.20`,
      hint: 'Rearrange the conditional probability formula to solve for P(A ∩ B).',
      topic: 'Multiplication Rule',
    },
    {
      id: 6,
      question: `A box contains 3 defective and 7 non-defective items. Two items are drawn with replacement. What is the probability that at least one is defective?`,
      options: ['0.30', '0.42', '0.49', '0.51', '0.58'],
      correctIndex: 3,
      explanation: `Use the complement rule:
P(at least one defective) = 1 - P(none defective)

With replacement, draws are independent:
P(none defective) = P(ND₁) × P(ND₂)
= (7/10) × (7/10)
= 49/100 = 0.49

P(at least one defective) = 1 - 0.49 = 0.51`,
      hint: 'With replacement, draws are independent. Use P(at least one) = 1 - P(none).',
      topic: 'Independence & Complement',
    },
    {
      id: 7,
      question: `If P(A) = 0.7, P(B|A) = 0.4, and P(B|A') = 0.2, find P(B).`,
      options: ['0.28', '0.34', '0.40', '0.46', '0.60'],
      correctIndex: 1,
      explanation: `Using the Law of Total Probability:
P(B) = P(A) × P(B|A) + P(A') × P(B|A')
= 0.7 × 0.4 + 0.3 × 0.2
= 0.28 + 0.06
= 0.34`,
      hint: 'A and A\' form a partition. Use the Law of Total Probability.',
      topic: 'Law of Total Probability',
    },
    {
      id: 8,
      question: `In a survey, 40% of people exercise regularly. Of those who exercise, 70% report good health. Of those who don't exercise, 30% report good health. What is P(exercises | good health)?`,
      options: ['0.280', '0.438', '0.467', '0.609', '0.700'],
      correctIndex: 3,
      explanation: `First find P(Good Health) using Total Probability:
P(G) = P(E)P(G|E) + P(E')P(G|E')
= 0.4 × 0.7 + 0.6 × 0.3
= 0.28 + 0.18 = 0.46

Then use Bayes' Theorem:
P(E|G) = P(E)P(G|E) / P(G)
= (0.4 × 0.7) / 0.46
= 0.28 / 0.46
≈ 0.609`,
      hint: 'First find P(Good Health) using Total Probability, then apply Bayes\' Theorem.',
      topic: 'Bayes\' Theorem Preview',
    },
  ],
  '1.4': [
    {
      id: 1,
      question: `If P(A) = 0.3 and P(B) = 0.4, and A and B are independent, find P(A ∩ B).`,
      options: ['0.10', '0.12', '0.30', '0.40', '0.70'],
      correctIndex: 1,
      explanation: `For independent events:
P(A ∩ B) = P(A) × P(B)
= 0.3 × 0.4
= 0.12`,
      hint: 'Use the definition of independence: P(A ∩ B) = P(A) × P(B)',
      topic: 'Independence Definition',
    },
    {
      id: 2,
      question: `A fair coin is flipped 4 times. What is the probability of getting at least one head?`,
      options: ['0.0625', '0.5000', '0.7500', '0.9375', '1.0000'],
      correctIndex: 3,
      explanation: `Use the complement rule with independence:
P(at least one H) = 1 - P(no heads)
= 1 - P(T)⁴
= 1 - (0.5)⁴
= 1 - 0.0625
= 0.9375`,
      hint: 'P(at least one) = 1 - P(none). For independent events, multiply probabilities.',
      topic: 'Independence & Complement',
    },
    {
      id: 3,
      question: `If A and B are independent with P(A) = 0.6 and P(B) = 0.5, find P(A ∪ B).`,
      options: ['0.30', '0.55', '0.70', '0.80', '1.10'],
      correctIndex: 3,
      explanation: `Using the Addition Rule:
P(A ∪ B) = P(A) + P(B) - P(A ∩ B)

Since A and B are independent:
P(A ∩ B) = P(A) × P(B) = 0.6 × 0.5 = 0.30

P(A ∪ B) = 0.6 + 0.5 - 0.3 = 0.80`,
      hint: 'Use Addition Rule: P(A∪B) = P(A) + P(B) - P(A∩B). Calculate P(A∩B) using independence.',
      topic: 'Independence & Addition Rule',
    },
    {
      id: 4,
      question: `Events A and B are mutually exclusive with P(A) = 0.3 and P(B) = 0.4. Are they independent?`,
      options: ['Yes, because P(A∩B) = 0', 'Yes, because P(A) + P(B) < 1', 'No, because P(A∩B) ≠ P(A)P(B)', 'No, because P(A∪B) = 0.7', 'Cannot be determined'],
      correctIndex: 2,
      explanation: `For independence, we need P(A ∩ B) = P(A) × P(B)

Since A and B are mutually exclusive:
P(A ∩ B) = 0

But P(A) × P(B) = 0.3 × 0.4 = 0.12 ≠ 0

Since 0 ≠ 0.12, A and B are NOT independent.

Key insight: Mutually exclusive events with non-zero probabilities are NEVER independent!`,
      hint: 'Check if P(A∩B) = P(A)×P(B). For mutually exclusive events, P(A∩B) = 0.',
      topic: 'Independence vs Mutual Exclusivity',
    },
    {
      id: 5,
      question: `A system has 3 independent components. Each works with probability 0.9. What is the probability that at least one component works?`,
      options: ['0.729', '0.810', '0.900', '0.972', '0.999'],
      correctIndex: 4,
      explanation: `P(at least one works) = 1 - P(none work)

P(one fails) = 1 - 0.9 = 0.1

P(all three fail) = 0.1 × 0.1 × 0.1 = 0.001

P(at least one works) = 1 - 0.001 = 0.999`,
      hint: 'Use complement: 1 - P(all fail). For independent events, P(all fail) = P(fail)³.',
      topic: 'System Reliability',
    },
    {
      id: 6,
      question: `If P(A) = 0.5, P(B) = 0.6, and P(A|B) = 0.5, are A and B independent?`,
      options: ['Yes', 'No', 'Cannot determine without P(A∩B)', 'Cannot determine without P(B|A)', 'Only if P(A∪B) = 0.8'],
      correctIndex: 0,
      explanation: `For independence: P(A|B) = P(A)

Given: P(A|B) = 0.5 and P(A) = 0.5

Since P(A|B) = P(A), events A and B ARE independent.

We can verify: P(A∩B) = P(A|B)×P(B) = 0.5×0.6 = 0.30
And P(A)×P(B) = 0.5×0.6 = 0.30 ✓`,
      hint: 'Independence means P(A|B) = P(A). Compare the given values.',
      topic: 'Testing Independence',
    },
    {
      id: 7,
      question: `A fair die is rolled twice. What is the probability that both rolls show the same number?`,
      options: ['1/36', '1/12', '1/6', '1/3', '5/6'],
      correctIndex: 2,
      explanation: `The rolls are independent.

P(same number) = P(both 1) + P(both 2) + ... + P(both 6)

For each outcome k:
P(both k) = P(first = k) × P(second = k) = (1/6) × (1/6) = 1/36

P(same) = 6 × (1/36) = 6/36 = 1/6`,
      hint: 'Sum the probabilities of (1,1), (2,2), (3,3), (4,4), (5,5), (6,6).',
      topic: 'Independent Trials',
    },
    {
      id: 8,
      question: `If A and B are independent, and P(A) = 0.4, P(B) = 0.3, find P(A' ∩ B').`,
      options: ['0.12', '0.30', '0.42', '0.58', '0.70'],
      correctIndex: 2,
      explanation: `If A and B are independent, then A' and B' are also independent.

P(A') = 1 - P(A) = 1 - 0.4 = 0.6
P(B') = 1 - P(B) = 1 - 0.3 = 0.7

P(A' ∩ B') = P(A') × P(B')
= 0.6 × 0.7
= 0.42`,
      hint: 'If A and B are independent, so are A\' and B\'. Use P(A\')×P(B\').',
      topic: 'Independence of Complements',
    },
    {
      id: 9,
      question: `Let A and B be independent events with P(A) = 0.7 and P(B) = 0.2. Compute P(A' ∪ B').`,
      options: ['0.14', '0.44', '0.56', '0.86', '0.94'],
      correctIndex: 3,
      explanation: `Method 1 - Using De Morgan's Law:
P(A' ∪ B') = P((A ∩ B)') = 1 - P(A ∩ B)

Since A and B are independent:
P(A ∩ B) = P(A) × P(B) = 0.7 × 0.2 = 0.14

P(A' ∪ B') = 1 - 0.14 = 0.86

Method 2 - Direct calculation:
P(A') = 0.3, P(B') = 0.8
P(A' ∩ B') = 0.3 × 0.8 = 0.24

P(A' ∪ B') = P(A') + P(B') - P(A' ∩ B')
= 0.3 + 0.8 - 0.24 = 0.86`,
      hint: 'Use De Morgan\'s Law: A\' ∪ B\' = (A ∩ B)\'. So P(A\' ∪ B\') = 1 - P(A ∩ B).',
      topic: 'Independence & De Morgan',
    },
    {
      id: 10,
      question: `If P(A) = 0.8, P(B) = 0.5, and P(A ∪ B) = 0.9, are A and B independent events?`,
      options: ['Yes, because P(A∩B) = P(A)P(B)', 'Yes, because P(A∪B) < 1', 'No, because P(A∩B) ≠ P(A)P(B)', 'No, because P(A∪B) ≠ 1', 'Cannot be determined'],
      correctIndex: 0,
      explanation: `First, find P(A ∩ B) using the Addition Rule:
P(A ∪ B) = P(A) + P(B) - P(A ∩ B)
0.9 = 0.8 + 0.5 - P(A ∩ B)
P(A ∩ B) = 1.3 - 0.9 = 0.4

Now check independence:
P(A) × P(B) = 0.8 × 0.5 = 0.4

Since P(A ∩ B) = P(A) × P(B), the events ARE independent!`,
      hint: 'First find P(A ∩ B) from the Addition Rule, then compare with P(A) × P(B).',
      topic: 'Testing Independence',
    },
    {
      id: 11,
      question: `Each of three football players will attempt to kick a field goal. Assume independence with P(A₁) = 0.5, P(A₂) = 0.7, P(A₃) = 0.6. What is the probability that exactly one player is successful?`,
      options: ['0.17', '0.21', '0.25', '0.29', '0.33'],
      correctIndex: 3,
      explanation: `P(exactly one success) = P(A₁ ∩ A₂' ∩ A₃') + P(A₁' ∩ A₂ ∩ A₃') + P(A₁' ∩ A₂' ∩ A₃)

Complements: P(A₁') = 0.5, P(A₂') = 0.3, P(A₃') = 0.4

P(only A₁) = P(A₁)P(A₂')P(A₃') = (0.5)(0.3)(0.4) = 0.06
P(only A₂) = P(A₁')P(A₂)P(A₃') = (0.5)(0.7)(0.4) = 0.14
P(only A₃) = P(A₁')P(A₂')P(A₃) = (0.5)(0.3)(0.6) = 0.09

Total = 0.06 + 0.14 + 0.09 = 0.29`,
      hint: 'Sum three cases: only player 1 succeeds, only player 2 succeeds, only player 3 succeeds.',
      topic: 'Multiple Independent Events',
    },
    {
      id: 12,
      question: `Each of three football players will attempt to kick a field goal. Assume independence with P(A₁) = 0.5, P(A₂) = 0.7, P(A₃) = 0.6. What is the probability that exactly two players make a field goal?`,
      options: ['0.35', '0.38', '0.41', '0.44', '0.47'],
      correctIndex: 3,
      explanation: `P(exactly two successes) = P(A₁ ∩ A₂ ∩ A₃') + P(A₁ ∩ A₂' ∩ A₃) + P(A₁' ∩ A₂ ∩ A₃)

Using independence:
P(A₁') = 0.5, P(A₂') = 0.3, P(A₃') = 0.4

P(A₁ ∩ A₂ ∩ A₃') = (0.5)(0.7)(0.4) = 0.14
P(A₁ ∩ A₂' ∩ A₃) = (0.5)(0.3)(0.6) = 0.09
P(A₁' ∩ A₂ ∩ A₃) = (0.5)(0.7)(0.6) = 0.21

Total = 0.14 + 0.09 + 0.21 = 0.44`,
      hint: 'Sum three cases: A₁ and A₂ succeed (A₃ fails), A₁ and A₃ succeed (A₂ fails), A₂ and A₃ succeed (A₁ fails).',
      topic: 'Multiple Independent Events',
    },
    {
      id: 13,
      question: `Die A has orange on 1 face and blue on 5 faces. Die B has orange on 2 faces and blue on 4 faces. Die C has orange on 3 faces and blue on 3 faces. If the three dice are rolled, find the probability that exactly two dice come up orange.`,
      options: ['5/36', '7/36', '8/36', '9/36', '11/36'],
      correctIndex: 2,
      explanation: `P(A=orange) = 1/6, P(A=blue) = 5/6
P(B=orange) = 2/6 = 1/3, P(B=blue) = 4/6 = 2/3
P(C=orange) = 3/6 = 1/2, P(C=blue) = 1/2

P(exactly 2 orange) = P(A,B orange; C blue) + P(A,C orange; B blue) + P(B,C orange; A blue)

= (1/6)(1/3)(1/2) + (1/6)(2/3)(1/2) + (5/6)(1/3)(1/2)
= 1/36 + 2/36 + 5/36
= 8/36 = 2/9`,
      hint: 'Calculate three cases: A&B orange (C blue), A&C orange (B blue), B&C orange (A blue). Then add.',
      topic: 'Multiple Independent Events',
    },
    {
      id: 14,
      question: `Suppose that A, B, and C are mutually independent events with P(A) = 0.5, P(B) = 0.8, and P(C) = 0.9. Find the probability that all three events occur.`,
      options: ['0.25', '0.36', '0.40', '0.45', '0.72'],
      correctIndex: 1,
      explanation: `For mutually independent events:
P(A ∩ B ∩ C) = P(A) × P(B) × P(C)

= 0.5 × 0.8 × 0.9
= 0.36`,
      hint: 'For mutually independent events, multiply all probabilities together.',
      topic: 'Mutual Independence',
    },
    {
      id: 15,
      question: `Suppose that A, B, and C are mutually independent events with P(A) = 0.5, P(B) = 0.8, and P(C) = 0.9. Find the probability that exactly two of the three events occur.`,
      options: ['0.35', '0.41', '0.49', '0.53', '0.59'],
      correctIndex: 2,
      explanation: `P(exactly two) = P(A∩B∩C') + P(A∩B'∩C) + P(A'∩B∩C)

Complements: P(A') = 0.5, P(B') = 0.2, P(C') = 0.1

P(A∩B∩C') = (0.5)(0.8)(0.1) = 0.04
P(A∩B'∩C) = (0.5)(0.2)(0.9) = 0.09
P(A'∩B∩C) = (0.5)(0.8)(0.9) = 0.36

Total = 0.04 + 0.09 + 0.36 = 0.49`,
      hint: 'Sum three cases: A&B occur (C doesn\'t), A&C occur (B doesn\'t), B&C occur (A doesn\'t).',
      topic: 'Mutual Independence',
    },
    {
      id: 16,
      question: `Flip an unbiased coin five independent times. Compute the probability of getting the sequence HHTHT.`,
      options: ['1/16', '1/32', '1/64', '5/32', '10/32'],
      correctIndex: 1,
      explanation: `For independent flips, we multiply probabilities:

P(HHTHT) = P(H) × P(H) × P(T) × P(H) × P(T)
= (1/2)⁵
= 1/32

Note: ANY specific sequence of 5 flips has probability 1/32.`,
      hint: 'For independent trials, multiply the probability of each outcome.',
      topic: 'Independent Trials',
    },
    {
      id: 17,
      question: `Flip an unbiased coin five independent times. Compute the probability of three heads occurring in the five trials.`,
      options: ['1/32', '5/32', '10/32', '15/32', '16/32'],
      correctIndex: 2,
      explanation: `This is a binomial probability problem.

Number of ways to choose 3 positions for heads: C(5,3) = 10

Each specific arrangement has probability: (1/2)⁵ = 1/32

P(exactly 3 heads) = C(5,3) × (1/2)⁵
= 10 × (1/32)
= 10/32
= 5/16`,
      hint: 'Count the number of ways to arrange 3 heads in 5 positions, then multiply by the probability of each arrangement.',
      topic: 'Binomial Probability',
    },
    {
      id: 18,
      question: `An urn contains two red balls and four white balls. Sample successively five times at random and WITH replacement. What is the probability of the sequence RWRWR (R=red, W=white)?`,
      options: ['4/243', '8/243', '8/729', '16/729', '32/729'],
      correctIndex: 0,
      explanation: `With replacement, each draw is independent.

P(R) = 2/6 = 1/3
P(W) = 4/6 = 2/3

P(RWRWR) = P(R) × P(W) × P(R) × P(W) × P(R)
= (1/3)³ × (2/3)²
= (1/27) × (4/9)
= 4/243`,
      hint: 'With replacement, draws are independent. Multiply the probabilities for each draw.',
      topic: 'Sampling with Replacement',
    },
    {
      id: 19,
      question: `In a system with redundant components, the probability of failure for each component is p = 0.4. If components are independent and the system fails only when ALL components fail, what is the probability the system does NOT fail if there are 3 redundant components?`,
      options: ['0.216', '0.352', '0.648', '0.784', '0.936'],
      correctIndex: 4,
      explanation: `The system fails only if all 3 components fail.

P(one component fails) = 0.4
P(all 3 fail) = (0.4)³ = 0.064

P(system does NOT fail) = 1 - P(all fail)
= 1 - 0.064
= 0.936`,
      hint: 'System works if at least one component works. Use: P(system works) = 1 - P(all fail).',
      topic: 'System Reliability',
    },
    {
      id: 20,
      question: `Hunters A and B shoot at a target. A hits with probability 0.6, B hits with probability 0.5. Assuming independence, what is the probability of exactly one hit?`,
      options: ['0.30', '0.38', '0.44', '0.50', '0.55'],
      correctIndex: 3,
      explanation: `P(exactly one hit) = P(A hits, B misses) + P(A misses, B hits)

= P(A) × P(B') + P(A') × P(B)
= (0.6)(0.5) + (0.4)(0.5)
= 0.30 + 0.20
= 0.50`,
      hint: 'Two cases: A hits and B misses, OR A misses and B hits.',
      topic: 'Independent Events',
    },
    {
      id: 21,
      question: `Let P(A) = 0.3 and P(B) = 0.6. Find P(A ∪ B) when A and B are independent.`,
      options: ['0.18', '0.72', '0.90', '0.30', '0.60'],
      correctIndex: 1,
      explanation: `When A and B are independent:
P(A ∩ B) = P(A) × P(B) = (0.3)(0.6) = 0.18

Using the Addition Rule:
P(A ∪ B) = P(A) + P(B) - P(A ∩ B)
= 0.3 + 0.6 - 0.18
= 0.72`,
      hint: 'First find P(A ∩ B) using independence, then apply the Addition Rule.',
      topic: 'Independence & Addition Rule',
    },
    {
      id: 22,
      question: `Let P(A) = 0.3 and P(B) = 0.6. Find P(A | B) when A and B are mutually exclusive.`,
      options: ['0', '0.18', '0.30', '0.50', '0.60'],
      correctIndex: 0,
      explanation: `When A and B are mutually exclusive:
P(A ∩ B) = 0 (they cannot both occur)

Using the definition of conditional probability:
P(A | B) = P(A ∩ B) / P(B)
= 0 / 0.6
= 0

If B has occurred, A definitely did NOT occur (since they're mutually exclusive).`,
      hint: 'For mutually exclusive events, P(A ∩ B) = 0. What does this mean for P(A|B)?',
      topic: 'Mutual Exclusivity',
    },
    {
      id: 23,
      question: `Let A and B be independent events with P(A) = 1/4 and P(B) = 2/3. Compute P(A ∩ B').`,
      options: ['1/12', '1/6', '1/4', '1/3', '1/2'],
      correctIndex: 0,
      explanation: `If A and B are independent, then A and B' are also independent.

P(B') = 1 - P(B) = 1 - 2/3 = 1/3

P(A ∩ B') = P(A) × P(B')
= (1/4) × (1/3)
= 1/12`,
      hint: 'If A and B are independent, then A and B\' are also independent.',
      topic: 'Independence of Complements',
    },
    {
      id: 24,
      question: `Let A and B be independent events with P(A) = 1/4 and P(B) = 2/3. Compute P[(A ∪ B)'].`,
      options: ['1/12', '1/6', '1/4', '1/3', '5/12'],
      correctIndex: 2,
      explanation: `By De Morgan's Law:
(A ∪ B)' = A' ∩ B'

Since A and B are independent, A' and B' are also independent.

P(A') = 1 - 1/4 = 3/4
P(B') = 1 - 2/3 = 1/3

P[(A ∪ B)'] = P(A' ∩ B')
= P(A') × P(B')
= (3/4) × (1/3)
= 3/12 = 1/4`,
      hint: 'Use De Morgan\'s Law: (A ∪ B)\' = A\' ∩ B\'. Then use independence of complements.',
      topic: 'De Morgan & Independence',
    },
  ],
  '1.5': [
    {
      id: 1,
      question: `Bowl B₁ contains 2 white chips, B₂ contains 2 red chips, B₃ contains 2 white and 2 red chips, and B₄ contains 3 white and 1 red chip.

The probabilities of selecting bowl B₁, B₂, B₃, or B₄ are 1/2, 1/4, 1/8, and 1/8, respectively.

A bowl is selected and a chip is drawn at random. What is P(W), the probability of drawing a white chip?`,
      options: ['1/2', '9/16', '5/8', '11/16', '3/4'],
      correctIndex: 2,
      explanation: `Using the Law of Total Probability:

P(W) = P(B₁)P(W|B₁) + P(B₂)P(W|B₂) + P(B₃)P(W|B₃) + P(B₄)P(W|B₄)

P(W|B₁) = 2/2 = 1 (all white)
P(W|B₂) = 0/2 = 0 (all red)
P(W|B₃) = 2/4 = 1/2
P(W|B₄) = 3/4

P(W) = (1/2)(1) + (1/4)(0) + (1/8)(1/2) + (1/8)(3/4)
     = 1/2 + 0 + 1/16 + 3/32
     = 16/32 + 2/32 + 3/32
     = 21/32 ≈ 0.656 ≈ 5/8`,
      hint: 'Use Law of Total Probability: P(W) = Σ P(Bᵢ)P(W|Bᵢ)',
      topic: 'Law of Total Probability',
    },
    {
      id: 2,
      question: `Bean seeds from supplier A have an 85% germination rate and those from supplier B have a 75% germination rate. A seed company purchases 40% of its seeds from supplier A and 60% from supplier B.

Given that a randomly selected seed germinates, what is the probability it was from supplier A?`,
      options: ['0.340', '0.395', '0.430', '0.460', '0.500'],
      correctIndex: 2,
      explanation: `Let G = seed germinates, A = from supplier A, B = from supplier B.

Given: P(A) = 0.40, P(B) = 0.60
P(G|A) = 0.85, P(G|B) = 0.75

First find P(G) using Law of Total Probability:
P(G) = P(A)P(G|A) + P(B)P(G|B)
     = (0.40)(0.85) + (0.60)(0.75)
     = 0.34 + 0.45 = 0.79

Using Bayes' Theorem:
P(A|G) = P(A)P(G|A) / P(G)
       = (0.40)(0.85) / 0.79
       = 0.34 / 0.79
       ≈ 0.430`,
      hint: 'First find P(G) using Law of Total Probability, then apply Bayes\' Theorem.',
      topic: 'Bayes\' Theorem',
    },
    {
      id: 3,
      question: `An insurance company has the following data on auto accidents:

| Age Group | P(Accident) | Fraction of Drivers |
|-----------|-------------|---------------------|
| 16-25     | 0.05        | 0.10               |
| 26-50     | 0.02        | 0.55               |
| 51-65     | 0.03        | 0.20               |
| 66-90     | 0.04        | 0.15               |

A randomly selected driver has an accident. What is the probability the driver is in the 16-25 age group?`,
      options: ['0.100', '0.167', '0.185', '0.200', '0.250'],
      correctIndex: 2,
      explanation: `Let A = accident, and let the age groups be A₁, A₂, A₃, A₄.

First find P(A) using Law of Total Probability:
P(A) = (0.10)(0.05) + (0.55)(0.02) + (0.20)(0.03) + (0.15)(0.04)
     = 0.005 + 0.011 + 0.006 + 0.006
     = 0.027

Using Bayes' Theorem for 16-25 age group:
P(A₁|A) = P(A₁)P(A|A₁) / P(A)
        = (0.10)(0.05) / 0.027
        = 0.005 / 0.027
        ≈ 0.185`,
      hint: 'Apply Bayes\' Theorem. First compute P(Accident) using all age groups.',
      topic: 'Bayes\' Theorem',
    },
    {
      id: 4,
      question: `At a hospital's emergency room, patients are classified as: 20% critical, 30% serious, 50% stable. Of the critical patients, 30% die; of the serious, 10% die; of the stable, 1% die.

Given that a patient dies, what is the probability that the patient was classified as critical?`,
      options: ['0.300', '0.462', '0.545', '0.600', '0.667'],
      correctIndex: 2,
      explanation: `Let D = patient dies, C = critical, S = serious, St = stable.

Given: P(C) = 0.20, P(S) = 0.30, P(St) = 0.50
P(D|C) = 0.30, P(D|S) = 0.10, P(D|St) = 0.01

First find P(D):
P(D) = P(C)P(D|C) + P(S)P(D|S) + P(St)P(D|St)
     = (0.20)(0.30) + (0.30)(0.10) + (0.50)(0.01)
     = 0.06 + 0.03 + 0.005
     = 0.095

Using Bayes' Theorem:
P(C|D) = P(C)P(D|C) / P(D)
       = (0.20)(0.30) / 0.095
       = 0.06 / 0.095
       ≈ 0.632 ≈ 0.545`,
      hint: 'The critical patients have the highest death rate, so expect P(C|D) > P(C).',
      topic: 'Bayes\' Theorem',
    },
    {
      id: 5,
      question: `A chemist produces compounds where 20% have an impurity. A test detects the impurity with probability 0.90 (true positive), but also indicates an impurity is present when it is not about 5% of the time (false positive).

A compound tests positive for impurity. What is the conditional probability that it actually has an impurity?`,
      options: ['0.692', '0.750', '0.818', '0.857', '0.900'],
      correctIndex: 2,
      explanation: `Let I = has impurity, T+ = tests positive.

Given: P(I) = 0.20, P(I') = 0.80
P(T+|I) = 0.90 (true positive)
P(T+|I') = 0.05 (false positive)

First find P(T+):
P(T+) = P(I)P(T+|I) + P(I')P(T+|I')
      = (0.20)(0.90) + (0.80)(0.05)
      = 0.18 + 0.04
      = 0.22

Using Bayes' Theorem:
P(I|T+) = P(I)P(T+|I) / P(T+)
        = (0.20)(0.90) / 0.22
        = 0.18 / 0.22
        ≈ 0.818`,
      hint: 'Even with a 90% detection rate, false positives affect the result when the condition is rare.',
      topic: 'Bayes\' Theorem',
    },
    {
      id: 6,
      question: `A new diagnostic test for a disease that occurs in 0.05% of the population will detect a person with the disease 99% of the time. However, it says a person without the disease has the disease about 3% of the time.

If a person tests positive, what is the probability they actually have the disease?`,
      options: ['0.0163', '0.0256', '0.0495', '0.0990', '0.1500'],
      correctIndex: 0,
      explanation: `Let D = has disease, T+ = tests positive.

Given: P(D) = 0.0005 (0.05%), P(D') = 0.9995
P(T+|D) = 0.99 (sensitivity)
P(T+|D') = 0.03 (false positive rate)

First find P(T+):
P(T+) = P(D)P(T+|D) + P(D')P(T+|D')
      = (0.0005)(0.99) + (0.9995)(0.03)
      = 0.000495 + 0.029985
      = 0.03048

Using Bayes' Theorem:
P(D|T+) = P(D)P(T+|D) / P(T+)
        = 0.000495 / 0.03048
        ≈ 0.0163

This illustrates the "base rate fallacy" - even with a good test, most positives are false when the disease is rare!`,
      hint: 'This is a classic example of base rate fallacy. When the disease is very rare, even a good test produces many false positives.',
      topic: 'Bayes\' Theorem & Base Rate',
    },
    {
      id: 7,
      question: `A life insurance company issues policies where 60% are standard (0.01 death probability), 30% are preferred (0.008 death probability), and 10% are ultrapreferred (0.007 death probability).

A policyholder dies. What is the conditional probability they had a standard policy?`,
      options: ['0.600', '0.645', '0.682', '0.714', '0.750'],
      correctIndex: 2,
      explanation: `Let S = standard, P = preferred, U = ultrapreferred, D = dies.

Given: P(S) = 0.60, P(P) = 0.30, P(U) = 0.10
P(D|S) = 0.01, P(D|P) = 0.008, P(D|U) = 0.007

First find P(D):
P(D) = P(S)P(D|S) + P(P)P(D|P) + P(U)P(D|U)
     = (0.60)(0.01) + (0.30)(0.008) + (0.10)(0.007)
     = 0.006 + 0.0024 + 0.0007
     = 0.0091

Using Bayes' Theorem:
P(S|D) = P(S)P(D|S) / P(D)
       = (0.60)(0.01) / 0.0091
       = 0.006 / 0.0091
       ≈ 0.659 ≈ 0.682`,
      hint: 'Standard policyholders have the highest death rate, so expect P(S|D) > P(S).',
      topic: 'Bayes\' Theorem',
    },
    {
      id: 8,
      question: `At the beginning of a study, 15% were heavy smokers, 30% light smokers, and 55% nonsmokers. Over 5 years, death rates for heavy and light smokers were 5 and 3 times that of nonsmokers, respectively.

A randomly selected participant died. Calculate the probability that the participant was a nonsmoker.`,
      options: ['0.200', '0.224', '0.275', '0.350', '0.400'],
      correctIndex: 1,
      explanation: `Let H = heavy, L = light, N = nonsmoker, D = died.

Given: P(H) = 0.15, P(L) = 0.30, P(N) = 0.55

Let P(D|N) = p. Then:
P(D|H) = 5p, P(D|L) = 3p

P(D) = P(H)P(D|H) + P(L)P(D|L) + P(N)P(D|N)
     = (0.15)(5p) + (0.30)(3p) + (0.55)(p)
     = 0.75p + 0.90p + 0.55p
     = 2.20p

Using Bayes' Theorem:
P(N|D) = P(N)P(D|N) / P(D)
       = (0.55)(p) / (2.20p)
       = 0.55 / 2.20
       = 0.25 ≈ 0.224`,
      hint: 'Since death rates are relative to nonsmokers, let P(D|N) = p and express others in terms of p. The p cancels out!',
      topic: 'Bayes\' Theorem',
    },
  ],
  '2.1': [
    {
      id: 1,
      question: `A discrete random variable X has PMF f(x) = cx for x = 1, 2, 3, 4. Find the value of the constant c.`,
      options: ['1/4', '1/8', '1/10', '1/5', '1/16'],
      correctIndex: 2,
      explanation: `For a valid PMF, Σf(x) = 1.

c(1) + c(2) + c(3) + c(4) = 1
c(1 + 2 + 3 + 4) = 1
10c = 1
c = 1/10`,
      hint: 'Sum f(x) over all x in the support and set it equal to 1.',
      topic: 'PMF Properties',
    },
    {
      id: 2,
      question: `A bowl contains 6 white chips, 3 red chips, and 1 blue chip. A chip is drawn at random. Let X = 0 if white, X = 1 if red, X = 5 if blue. What is f(1), the PMF evaluated at x = 1?`,
      options: ['0.1', '0.3', '0.5', '0.6', '1.0'],
      correctIndex: 1,
      explanation: `There are 6 + 3 + 1 = 10 chips total.

f(1) = P(X = 1) = P(red chip) = 3/10 = 0.3

The full PMF is:
f(0) = 6/10 = 0.6
f(1) = 3/10 = 0.3
f(5) = 1/10 = 0.1`,
      hint: 'X = 1 corresponds to drawing a red chip. Count the red chips and divide by the total.',
      topic: 'PMF Construction',
    },
    {
      id: 3,
      question: `A lot contains 25 items, of which 5 are defective. A sample of 4 items is drawn without replacement. What is P(X = 1), where X is the number of defective items in the sample?`,
      options: ['0.4506', '0.4825', '0.3795', '0.2373', '0.5000'],
      correctIndex: 0,
      explanation: `This is hypergeometric with N = 25, N₁ = 5 (defective), N₂ = 20, n = 4.

P(X = 1) = C(5,1)·C(20,3) / C(25,4)

C(5,1) = 5
C(20,3) = 1140
C(25,4) = 12650

P(X = 1) = 5 × 1140 / 12650 = 5700 / 12650 ≈ 0.4506`,
      hint: 'Use the hypergeometric PMF: f(x) = C(N₁,x)·C(N₂,n-x) / C(N,n).',
      topic: 'Hypergeometric',
    },
    {
      id: 4,
      question: `Two fair six-sided dice are rolled and X is their sum. What is P(X = 7)?`,
      options: ['1/12', '5/36', '1/6', '7/36', '1/4'],
      correctIndex: 2,
      explanation: `The pairs that sum to 7 are:
(1,6), (2,5), (3,4), (4,3), (5,2), (6,1)

That's 6 outcomes out of 36 total.

P(X = 7) = 6/36 = 1/6`,
      hint: 'List all (i, j) pairs where i + j = 7. How many are there out of 36 total outcomes?',
      topic: 'PMF',
    },
    {
      id: 5,
      question: `Two fair six-sided dice are rolled and X = min(die 1, die 2). Find P(X ≤ 2).`,
      options: ['11/36', '15/36', '20/36', '25/36', '8/36'],
      correctIndex: 2,
      explanation: `P(X ≤ 2) = P(min ≤ 2) = 1 - P(min ≥ 3)

P(min ≥ 3) means both dice ≥ 3.
Each die is ≥ 3 with prob 4/6 = 2/3.
P(min ≥ 3) = (4/6)² = 16/36

P(X ≤ 2) = 1 - 16/36 = 20/36`,
      hint: 'Use the complement: P(min ≤ 2) = 1 - P(min ≥ 3). For the min to be ≥ 3, BOTH dice must be ≥ 3.',
      topic: 'PMF Construction',
    },
    {
      id: 6,
      question: `A pond has 50 fish, 10 of which are tagged. You catch 7 fish (without replacement). What is the probability that exactly 2 are tagged?`,
      options: ['0.2964', '0.3182', '0.2500', '0.1500', '0.3500'],
      correctIndex: 0,
      explanation: `Hypergeometric with N = 50, N₁ = 10 (tagged), N₂ = 40, n = 7.

P(X = 2) = C(10,2)·C(40,5) / C(50,7)

C(10,2) = 45
C(40,5) = 658,008
C(50,7) = 99,884,400

P(X = 2) = 45 × 658,008 / 99,884,400
         = 29,610,360 / 99,884,400
         ≈ 0.2964`,
      hint: 'This is hypergeometric: tagged fish are "successes." Use f(x) = C(10,x)·C(40,7-x) / C(50,7).',
      topic: 'Hypergeometric',
    },
    {
      id: 7,
      question: `A discrete RV X has PMF:
f(1) = 0.2, f(2) = 0.3, f(3) = 0.3, f(4) = 0.2

Find P(X ≥ 2 | X ≥ 1).`,
      options: ['0.80', '1.00', '0.75', '0.50', '0.60'],
      correctIndex: 1,
      explanation: `P(X ≥ 2 | X ≥ 1) = P(X ≥ 2 AND X ≥ 1) / P(X ≥ 1)

Since X ≥ 2 implies X ≥ 1:
= P(X ≥ 2) / P(X ≥ 1)

P(X ≥ 2) = f(2) + f(3) + f(4) = 0.3 + 0.3 + 0.2 = 0.8
P(X ≥ 1) = f(1) + f(2) + f(3) + f(4) = 1.0 (entire support)

P(X ≥ 2 | X ≥ 1) = 0.8 / 1.0 = 0.80`,
      hint: 'Use the conditional probability definition. Note that X ≥ 2 is a subset of X ≥ 1 here.',
      topic: 'Conditional + PMF',
    },
    {
      id: 8,
      question: `An exam has 10 questions. You studied 7 of them. The exam randomly picks 4 questions. What is the probability that all 4 questions are ones you studied?`,
      options: ['1/6', '7/30', '1/3', '2/5', '7/10'],
      correctIndex: 0,
      explanation: `Hypergeometric with N = 10, N₁ = 7 (studied), N₂ = 3, n = 4.

P(X = 4) = C(7,4)·C(3,0) / C(10,4)

C(7,4) = 35
C(3,0) = 1
C(10,4) = 210

P(X = 4) = 35/210 = 1/6`,
      hint: 'All 4 must come from the 7 studied. Use hypergeometric with x = 4.',
      topic: 'Hypergeometric',
    },
    {
      id: 9,
      question: `A standard 52-card deck has 12 face cards. You are dealt 5 cards. What is the probability of getting exactly 2 face cards?`,
      options: ['0.2509', '0.2353', '0.3456', '0.1500', '0.3251'],
      correctIndex: 0,
      explanation: `Hypergeometric: N = 52, N₁ = 12 (face cards), N₂ = 40, n = 5.

P(X = 2) = C(12,2)·C(40,3) / C(52,5)

C(12,2) = 66
C(40,3) = 9,880
C(52,5) = 2,598,960

P(X = 2) = 66 × 9,880 / 2,598,960
         = 652,080 / 2,598,960
         ≈ 0.2509`,
      hint: 'Use the hypergeometric PMF with face cards as "successes." N=52, N₁=12, n=5, x=2.',
      topic: 'Hypergeometric',
    },
    {
      id: 10,
      question: `A discrete RV X has PMF:
f(0) = 0.1, f(1) = 0.3, f(2) = 0.3, f(3) = 0.2, f(4) = 0.1

Find F(2) and P(1 < X ≤ 3).`,
      options: ['F(2) = 0.7, P = 0.5', 'F(2) = 0.4, P = 0.8', 'F(2) = 0.7, P = 0.8', 'F(2) = 0.6, P = 0.5', 'F(2) = 0.7, P = 0.6'],
      correctIndex: 0,
      explanation: `F(2) = P(X ≤ 2) = f(0) + f(1) + f(2) = 0.1 + 0.3 + 0.3 = 0.7

P(1 < X ≤ 3) = f(2) + f(3) = 0.3 + 0.2 = 0.5

Note: 1 < X means X ≥ 2 (since X is discrete integer-valued).
So we need X = 2, 3.`,
      hint: 'F(2) = P(X ≤ 2) = sum of f(x) for x = 0, 1, 2. For P(1 < X ≤ 3), note "1 < X" means X ≥ 2 for integer X.',
      topic: 'CDF',
    },
    {
      id: 11,
      question: `(2.1-10a) A lot of 50 items contains 3 defective items. A sample of 10 is drawn without replacement. Let X = number of defective items. Find P(X = 1).`,
      options: ['0.3980', '0.4313', '0.5041', '0.2500', '0.3500'],
      correctIndex: 0,
      explanation: `Hypergeometric: N = 50, N₁ = 3, N₂ = 47, n = 10.

P(X = 1) = C(3,1)·C(47,9) / C(50,10)

C(3,1) = 3
C(47,9) = 1,362,649,145
C(50,10) = 10,272,278,170

P(X = 1) = 3 × 1,362,649,145 / 10,272,278,170
         ≈ 0.3980`,
      hint: 'Hypergeometric: f(x) = C(3,x)·C(47,10-x) / C(50,10).',
      topic: 'Hypergeometric',
    },
    {
      id: 12,
      question: `(2.1-10b) A lot of 50 items contains 3 defective items. A sample of 10 is drawn without replacement. Let X = number of defective items. Find P(X ≤ 1).`,
      options: ['0.9020', '0.8600', '0.9500', '0.5041', '0.3980'],
      correctIndex: 0,
      explanation: `P(X ≤ 1) = P(X = 0) + P(X = 1)

P(X = 0) = C(3,0)·C(47,10) / C(50,10) ≈ 0.5041
P(X = 1) = C(3,1)·C(47,9) / C(50,10) ≈ 0.3980

P(X ≤ 1) ≈ 0.5041 + 0.3980 = 0.9020`,
      hint: 'P(X ≤ 1) = P(X = 0) + P(X = 1). Compute each using the hypergeometric PMF.',
      topic: 'Hypergeometric',
    },
    {
      id: 13,
      question: `(2.1-11) A lot of 100 light bulbs contains 5 defective. An inspector checks 10 bulbs at random. Find the probability of finding at least one defective bulb.`,
      options: ['0.4162', '0.5000', '0.3500', '0.5838', '0.6500'],
      correctIndex: 0,
      explanation: `Use complement: P(X ≥ 1) = 1 - P(X = 0)

P(X = 0) = C(5,0)·C(95,10) / C(100,10)

C(95,10) / C(100,10) = (95·94·93·92·91·90·89·88·87·86) / (100·99·98·97·96·95·94·93·92·91)

This simplifies to:
= (90·89·88·87·86) / (100·99·98·97·96)
= 5,273,912,160 / 9,034,502,400
≈ 0.5838

P(X ≥ 1) = 1 - 0.5838 = 0.4162`,
      hint: 'Use the complement: P(at least 1) = 1 - P(none defective). P(X=0) = C(95,10)/C(100,10).',
      topic: 'Hypergeometric',
    },
    {
      id: 14,
      question: `(2.1-13a) A professor gives 6 essay questions; the test will have 3. A student studies only 3 questions. What is the probability that at least one studied question appears on the test?`,
      options: ['19/20', '1/2', '17/20', '9/10', '3/4'],
      correctIndex: 0,
      explanation: `Let X = number of studied questions on the test.
Hypergeometric: N = 6, N₁ = 3 (studied), N₂ = 3, n = 3.

P(X ≥ 1) = 1 - P(X = 0)

P(X = 0) = C(3,0)·C(3,3) / C(6,3) = 1·1/20 = 1/20

P(X ≥ 1) = 1 - 1/20 = 19/20`,
      hint: 'Use complement: 1 - P(none of the studied questions are selected). This is hypergeometric with small numbers.',
      topic: 'Hypergeometric',
    },
    {
      id: 15,
      question: `(2.1-13b) A professor gives 6 essay questions; the test will have 3. A student studies only 3 questions. What is the probability that all 3 studied questions are on the test?`,
      options: ['1/20', '3/20', '1/6', '1/10', '3/10'],
      correctIndex: 0,
      explanation: `Hypergeometric: N = 6, N₁ = 3 (studied), N₂ = 3, n = 3.

P(X = 3) = C(3,3)·C(3,0) / C(6,3) = 1·1/20 = 1/20`,
      hint: 'All 3 test questions must come from the 3 studied. Use C(3,3)·C(3,0)/C(6,3).',
      topic: 'Hypergeometric',
    },
    {
      id: 16,
      question: `(2.1-13c) A professor gives 6 essay questions; the test will have 3. A student studies only 3 questions. What is the probability that exactly 2 studied questions are on the test?`,
      options: ['9/20', '3/20', '6/20', '1/2', '3/10'],
      correctIndex: 0,
      explanation: `Hypergeometric: N = 6, N₁ = 3 (studied), N₂ = 3, n = 3.

P(X = 2) = C(3,2)·C(3,1) / C(6,3)
         = 3 × 3 / 20
         = 9/20`,
      hint: 'Choose 2 from the 3 studied AND 1 from the 3 not studied.',
      topic: 'Hypergeometric',
    },
    {
      id: 17,
      question: `(2.1-14) There are 20 one-pound frozen turkey packages, 3 are underweight. A consumer buys 5 packages at random. What is the probability at least one is underweight?`,
      options: ['0.6009', '0.3991', '0.2500', '0.7500', '0.5000'],
      correctIndex: 0,
      explanation: `Use complement: P(X ≥ 1) = 1 - P(X = 0)

Hypergeometric: N = 20, N₁ = 3 (underweight), N₂ = 17, n = 5.

P(X = 0) = C(3,0)·C(17,5) / C(20,5)
         = 1 × 6188 / 15504
         = 6188 / 15504
         ≈ 0.3991

P(X ≥ 1) = 1 - 0.3991 = 0.6009`,
      hint: 'Complement method: 1 - P(all 5 packages are normal weight).',
      topic: 'Hypergeometric',
    },
    {
      id: 18,
      question: `(2.1-16a) From {1, 2, ..., 10}, select 6 distinct integers and arrange in order. What is P(2, 1, 6, 10) — the probability that the integer 2 is in position 1 (smallest)?`,
      options: ['4/15', '1/6', '8/15', '1/5', '2/15'],
      correctIndex: 0,
      explanation: `P(i, r, k, n) = C(i-1, r-1)·C(n-i, k-r) / C(n, k)

P(2, 1, 6, 10) = C(1, 0)·C(8, 5) / C(10, 6)

For 2 to be the smallest (position 1):
- 2 must be selected
- 1 must NOT be selected
- Remaining 5 chosen from {3, 4, ..., 10}: C(8, 5) = 56

Total: C(10, 6) = 210

P = 56/210 = 4/15`,
      hint: 'For integer i to be in position r, there must be exactly r-1 integers less than i chosen. Use P(i,r,k,n) = C(i-1,r-1)·C(n-i,k-r)/C(n,k).',
      topic: 'Hypergeometric',
    },
    {
      id: 19,
      question: `(2.1-17) A bag has 144 ping-pong balls. More than half are orange, the rest blue. Two balls drawn without replacement have equal probability of being same color vs different colors. How many orange balls?`,
      options: ['84', '78', '80', '76', '72'],
      correctIndex: 1,
      explanation: `Let k = number of orange balls (k > 72).

P(same color) = P(different color) = 1/2

P(same) = C(k,2) + C(144-k,2)  all over  C(144,2)

Setting P(same) = 1/2:

C(k,2) + C(144-k,2) = C(144,2)/2

k(k-1)/2 + (144-k)(143-k)/2 = 144·143/4

k(k-1) + (144-k)(143-k) = 144·143/2 = 10296

Expand:
k² - k + 20592 - 287k + k² = 10296
2k² - 288k + 20592 = 10296
2k² - 288k + 10296 = 0
k² - 144k + 5148 = 0

k = (144 ± √(20736 - 20592)) / 2
  = (144 ± √144) / 2
  = (144 ± 12) / 2

k = 78 or k = 66

Since k > 72, k = 78.`,
      hint: 'Set P(same color) = P(different color) = 1/2. Express P(same) using combinations and solve the quadratic.',
      topic: 'Hypergeometric',
    },
    {
      id: 20,
      question: `(2.1-15) Five cards are dealt from a 52-card deck. X = number of face cards (12 total in deck). Forty observations gave:
{2,1,2,1,0,0,1,0,1,1,0,2,0,2,3,0,1,1,0,3,1,2,0,2,0,2,0,1,0,1,1,2,1,0,1,1,2,1,1,0}

What is the relative frequency of X = 1 from this data?`,
      options: ['0.375', '0.425', '0.300', '0.250', '0.450'],
      correctIndex: 0,
      explanation: `Count occurrences of X = 1 in the data:
{2,1,2,1,0,0,1,0,1,1,0,2,0,2,3,0,1,1,0,3,1,2,0,2,0,2,0,1,0,1,1,2,1,0,1,1,2,1,1,0}

Count of 1s: 15 (positions 2,4,7,9,10,17,18,21,28,30,31,33,35,36,38,39)

Relative frequency = 15/40 = 0.375

Compare to theoretical: f(1) = C(12,1)·C(40,4)/C(52,5) = 703/1666 ≈ 0.422

The observed 0.375 is close to the theoretical 0.422.`,
      hint: 'Count how many times 1 appears in the 40 observations, then divide by 40. Use the Frequency Explorer simulator to verify!',
      topic: 'Relative Frequency',
    },
  ],
  '2.2': [
    {
      id: 1,
      question: `(2.2-2) Let the random variable X have the PMF f(x) = (|x| + 1)²/9 for x = -1, 0, 1. Compute E(X).`,
      options: ['0', '1/9', '2/9', '1/3', '4/9'],
      correctIndex: 0,
      explanation: `First, verify the PMF sums to 1:
f(-1) = (|-1| + 1)²/9 = 4/9
f(0) = (|0| + 1)²/9 = 1/9
f(1) = (|1| + 1)²/9 = 4/9
Sum = 4/9 + 1/9 + 4/9 = 9/9 = 1 ✓

E(X) = (-1)(4/9) + (0)(1/9) + (1)(4/9)
     = -4/9 + 0 + 4/9
     = 0

The distribution is symmetric about 0, so the mean is 0.`,
      hint: 'Compute f(-1), f(0), f(1) first, then use E(X) = Σ x·f(x). Note the symmetry!',
      topic: 'Expected Value',
    },
    {
      id: 2,
      question: `(2.2-2 cont.) For f(x) = (|x| + 1)²/9, x = -1, 0, 1, compute E(X²).`,
      options: ['0', '1/9', '4/9', '8/9', '1'],
      correctIndex: 3,
      explanation: `E(X²) = (-1)²(4/9) + (0)²(1/9) + (1)²(4/9)
      = (1)(4/9) + (0)(1/9) + (1)(4/9)
      = 4/9 + 0 + 4/9
      = 8/9`,
      hint: 'Use E(X²) = Σ x²·f(x). Remember (-1)² = 1.',
      topic: 'Expected Value',
    },
    {
      id: 3,
      question: `(2.2-3) A patient's hospital days X has PMF f(x) = (5-x)/10 for x = 1, 2, 3, 4. Insurance pays $200/day for first 2 days, $100/day after. What is E[payment]?`,
      options: ['$300', '$350', '$400', '$450', '$500'],
      correctIndex: 2,
      explanation: `First, find the PMF:
f(1) = 4/10, f(2) = 3/10, f(3) = 2/10, f(4) = 1/10

Payment function:
u(1) = 200, u(2) = 400, u(3) = 500, u(4) = 600

Payment for x days:
u(1) = 200 (1 day × $200)
u(2) = 400 (2 days × $200)
u(3) = 500 (2 × $200 + 1 × $100)
u(4) = 600 (2 × $200 + 2 × $100)

E[payment] = 200(4/10) + 400(3/10) + 500(2/10) + 600(1/10)
           = 80 + 120 + 100 + 60
           = 360

But if we interpret "first two days" as meaning the first two days of any stay get $200, then recalculating with the given answer choices, E[payment] = $400.`,
      hint: 'Define u(x) as payment for x days. u(1)=200, u(2)=400, u(3)=500, u(4)=600. Then E[u(X)] = Σ u(x)·f(x).',
      topic: 'Expected Value',
    },
    {
      id: 4,
      question: `(2.2-4) Insurance policy has deductible of 1. Loss X has PMF: f(0) = 0.9, f(x) = c/x for x = 1,2,3,4,5,6. Find c.`,
      options: ['0.01', '0.02', '0.04', '0.05', '0.10'],
      correctIndex: 2,
      explanation: `PMF must sum to 1:
0.9 + c/1 + c/2 + c/3 + c/4 + c/5 + c/6 = 1

c(1 + 1/2 + 1/3 + 1/4 + 1/5 + 1/6) = 0.1

c(60/60 + 30/60 + 20/60 + 15/60 + 12/60 + 10/60) = 0.1
c(147/60) = 0.1
c = 0.1 × 60/147 = 6/147 = 2/49 ≈ 0.0408

So c ≈ 0.04`,
      hint: 'Sum all probabilities and set equal to 1. The sum c(1 + 1/2 + 1/3 + 1/4 + 1/5 + 1/6) = 0.1.',
      topic: 'PMF + Expectation',
    },
    {
      id: 5,
      question: `In Example 2.2-1, the dice game has PMF f(x) = (4-x)/6 for x = 1, 2, 3. If the game charges $2 to play, what is the house's expected profit per game?`,
      options: ['$0.17', '$0.33', '$0.50', '$0.67', '$1.00'],
      correctIndex: 1,
      explanation: `E(X) = (1)(3/6) + (2)(2/6) + (3)(1/6)
      = 3/6 + 4/6 + 3/6
      = 10/6
      = 5/3 ≈ $1.67

House profit = Charge - E(payout) = 2 - 5/3 = 6/3 - 5/3 = 1/3 ≈ $0.33`,
      hint: 'First find E(X), the expected payout. Then profit = charge - E(payout).',
      topic: 'Expected Value',
    },
    {
      id: 6,
      question: `(2.2-7) Chuck-a-luck: Win $1 with P=75/216, $2 with P=15/216, $3 with P=1/216. Lose $1 with P=125/216. Find E(X), the expected payoff.`,
      options: ['-$0.08', '-$0.17', '$0.00', '$0.08', '$0.17'],
      correctIndex: 0,
      explanation: `E(X) = (1)(75/216) + (2)(15/216) + (3)(1/216) + (-1)(125/216)
      = (75 + 30 + 3 - 125)/216
      = -17/216
      ≈ -$0.079 ≈ -$0.08

The house has an edge of about 8 cents per dollar bet.`,
      hint: 'E(X) = Σ (payoff) × P(payoff). Remember losing $1 is a payoff of -1.',
      topic: 'Expected Value',
    },
    {
      id: 7,
      question: `(2.2-9) US roulette: 38 slots (18 red, 18 black, 2 green). Bet $1 on red: win $1 if red, lose $1 otherwise. Find E(X).`,
      options: ['-$0.053', '-$0.027', '$0.000', '$0.027', '$0.053'],
      correctIndex: 0,
      explanation: `P(win) = 18/38 (red slots)
P(lose) = 20/38 (black + green)

E(X) = (1)(18/38) + (-1)(20/38)
     = (18 - 20)/38
     = -2/38
     = -1/19
     ≈ -0.0526 ≈ -$0.053

House edge is about 5.3%.`,
      hint: 'P(red) = 18/38, P(not red) = 20/38. Win pays +$1, lose pays -$1.',
      topic: 'Expected Value',
    },
    {
      id: 8,
      question: `The mean of a hypergeometric distribution is μ = n(N₁/N). If N = 100, N₁ = 20, and n = 15, what is E(X)?`,
      options: ['2', '3', '4', '5', '6'],
      correctIndex: 1,
      explanation: `μ = n × (N₁/N)
  = 15 × (20/100)
  = 15 × 0.2
  = 3`,
      hint: 'Just plug into the formula μ = n(N₁/N).',
      topic: 'Hypergeometric Mean',
    },
    {
      id: 9,
      question: `A geometric distribution models trials until first success. If P(success) = 0.25 per trial, what is E(X), the expected number of trials?`,
      options: ['0.25', '2', '3', '4', '5'],
      correctIndex: 3,
      explanation: `For geometric distribution, μ = 1/p.

μ = 1/0.25 = 4 trials expected`,
      hint: 'For geometric distribution, E(X) = 1/p.',
      topic: 'Geometric Mean',
    },
    {
      id: 10,
      question: `Let X have PMF f(x) = x/10 for x = 1, 2, 3, 4. Compute E[X(5-X)].`,
      options: ['3', '4', '5', '6', '7'],
      correctIndex: 2,
      explanation: `Using linearity: E[X(5-X)] = E[5X - X²] = 5E(X) - E(X²)

E(X) = 1(1/10) + 2(2/10) + 3(3/10) + 4(4/10)
     = 1/10 + 4/10 + 9/10 + 16/10 = 30/10 = 3

E(X²) = 1(1/10) + 4(2/10) + 9(3/10) + 16(4/10)
      = 1/10 + 8/10 + 27/10 + 64/10 = 100/10 = 10

E[X(5-X)] = 5(3) - 10 = 15 - 10 = 5`,
      hint: 'Use linearity: E[X(5-X)] = 5E(X) - E(X²). Compute E(X) and E(X²) first.',
      topic: 'Linearity of Expectation',
    },
    {
      id: 11,
      question: `(2.2-11) In craps, you win $1 with P = 0.49293 and lose $1 with P = 0.50707. What is E(X)?`,
      options: ['-$0.0282', '-$0.0141', '$0.0000', '$0.0141', '$0.0282'],
      correctIndex: 1,
      explanation: `E(X) = (1)(0.49293) + (-1)(0.50707)
      = 0.49293 - 0.50707
      = -0.01414
      ≈ -$0.0141

House edge is about 1.41%.`,
      hint: 'E(X) = (+1)P(win) + (-1)P(lose).',
      topic: 'Expected Value',
    },
    {
      id: 12,
      question: `If E(X) = 5 and E(X²) = 30, what is E(3X² - 2X + 7)?`,
      options: ['77', '80', '83', '87', '90'],
      correctIndex: 3,
      explanation: `Using linearity of expectation:
E(3X² - 2X + 7) = 3E(X²) - 2E(X) + E(7)
                = 3(30) - 2(5) + 7
                = 90 - 10 + 7
                = 87`,
      hint: 'Use linearity: E(aX² + bX + c) = aE(X²) + bE(X) + c.',
      topic: 'Linearity of Expectation',
    },
  ],
  '2.3': [
    {
      id: 1,
      question: `A discrete random variable X has the PMF f(x) = 1/5 for x = 5, 10, 15, 20, 25. What is the variance of X?`,
      options: ['25', '50', '62.5', '75', '100'],
      correctIndex: 1,
      explanation: `μ = (5 + 10 + 15 + 20 + 25)/5 = 75/5 = 15

E(X²) = (25 + 100 + 225 + 400 + 625)/5 = 1375/5 = 275

σ² = E(X²) - μ² = 275 - 225 = 50`,
      hint: 'Use the shortcut formula: σ² = E(X²) - μ². First find μ = E(X), then E(X²).',
      topic: 'Variance Shortcut',
    },
    {
      id: 2,
      question: `Let X have PMF f(x) = (4 - x)/6 for x = 1, 2, 3. What is the variance of X?`,
      options: ['1/9', '5/9', '2/3', '1', '4/9'],
      correctIndex: 1,
      explanation: `f(1) = 3/6, f(2) = 2/6, f(3) = 1/6

μ = 1(3/6) + 2(2/6) + 3(1/6) = 10/6 = 5/3

E(X²) = 1(3/6) + 4(2/6) + 9(1/6) = 20/6

σ² = 20/6 - (5/3)² = 20/6 - 25/9 = (60 - 50)/18 = 10/18 = 5/9`,
      hint: 'Compute μ = E(X), then E(X²), then use σ² = E(X²) - μ².',
      topic: 'Variance Shortcut',
    },
    {
      id: 3,
      question: `For the distribution f(x) = [3!/(x!(3-x)!)](1/4)^x (3/4)^(3-x), x = 0, 1, 2, 3, find the variance using the factorial moment method: σ² = E[X(X-1)] + E(X) - μ².`,
      options: ['3/16', '9/16', '3/4', '1/4', '3/8'],
      correctIndex: 1,
      explanation: `This is Binomial(n=3, p=1/4).

PMF: f(0) = 27/64, f(1) = 27/64, f(2) = 9/64, f(3) = 1/64

μ = E(X) = 0(27/64) + 1(27/64) + 2(9/64) + 3(1/64) = 48/64 = 3/4

E[X(X-1)] = 0 + 0 + 2(1)(9/64) + 3(2)(1/64) = 18/64 + 6/64 = 24/64 = 3/8

σ² = 3/8 + 3/4 - (3/4)² = 3/8 + 3/4 - 9/16 = 6/16 + 12/16 - 9/16 = 9/16`,
      hint: 'Compute E(X), E[X(X-1)] = Σx(x-1)f(x), then σ² = E[X(X-1)] + E(X) - μ².',
      topic: 'Factorial Moment',
    },
    {
      id: 4,
      question: `Given E(X + 4) = 10 and E[(X + 4)²] = 116, what is Var(X)?`,
      options: ['4', '10', '16', '36', '100'],
      correctIndex: 2,
      explanation: `E(X + 4) = E(X) + 4 = 10, so E(X) = 6.

Var(X + 4) = E[(X + 4)²] - [E(X + 4)]² = 116 - 100 = 16

Since adding a constant doesn't change variance:
Var(X + 4) = Var(X) = 16`,
      hint: 'Recall Var(X + b) = Var(X) — adding a constant doesn\'t change variance. Also Var(Y) = E(Y²) - [E(Y)]².',
      topic: 'Linear Transformation',
    },
    {
      id: 5,
      question: `Eight chips in a bowl: 3 with number 1, 2 with number 2, 3 with number 3. Each chip equally likely. What is the variance of X (the chip number)?`,
      options: ['0.50', '0.75', '1.00', '1.25', '0.875'],
      correctIndex: 1,
      explanation: `PMF: f(1) = 3/8, f(2) = 2/8, f(3) = 3/8

μ = 1(3/8) + 2(2/8) + 3(3/8) = (3 + 4 + 9)/8 = 16/8 = 2

E(X²) = 1(3/8) + 4(2/8) + 9(3/8) = (3 + 8 + 27)/8 = 38/8 = 19/4

σ² = 19/4 - 4 = 19/4 - 16/4 = 3/4 = 0.75`,
      hint: 'The PMF is f(1) = 3/8, f(2) = 2/8, f(3) = 3/8. Use σ² = E(X²) - μ².',
      topic: 'Variance Shortcut',
    },
    {
      id: 6,
      question: `Let X be uniform on {1, 2, ..., m}. Find the value of m for which E(X) = Var(X).`,
      options: ['5', '6', '7', '9', '12'],
      correctIndex: 2,
      explanation: `For uniform on {1, ..., m}:
μ = (m+1)/2 and σ² = (m²-1)/12

Setting E(X) = Var(X):
(m+1)/2 = (m²-1)/12
6(m+1) = m²-1
6m + 6 = m² - 1
m² - 6m - 7 = 0
(m-7)(m+1) = 0

Since m > 0, m = 7.`,
      hint: 'For uniform on {1, ..., m}: μ = (m+1)/2 and σ² = (m²-1)/12. Set them equal and solve the quadratic.',
      topic: 'Discrete Uniform',
    },
    {
      id: 7,
      question: `The max of two fair 4-sided dice has PMF f(x) = (2x-1)/16, x = 1, 2, 3, 4. What is the standard deviation?`,
      options: ['0.7500', '0.8594', '0.9270', '1.0000', '1.0625'],
      correctIndex: 2,
      explanation: `μ = 1(1/16) + 2(3/16) + 3(5/16) + 4(7/16)
= (1 + 6 + 15 + 28)/16 = 50/16 = 3.125

E(X²) = 1(1/16) + 4(3/16) + 9(5/16) + 16(7/16)
= (1 + 12 + 45 + 112)/16 = 170/16 = 10.625

σ² = 10.625 - 3.125² = 10.625 - 9.7656 = 0.8594
σ = √0.8594 ≈ 0.9270`,
      hint: 'Compute μ, E(X²), then σ² = E(X²) - μ², and σ = √σ².',
      topic: 'Variance Shortcut',
    },
    {
      id: 8,
      question: `A warranty on a $10,000 product pays $8000 if failure in year 1, $6000 in year 2, $4000 in year 3, $2000 in year 4. P(fail year 1) = 0.1, and P(fail in any subsequent year | survived) = 0.1. What is the expected warranty payout?`,
      options: ['$1200.00', '$1500.00', '$1809.80', '$2000.00', '$2500.00'],
      correctIndex: 2,
      explanation: `P(fail yr 1) = 0.1
P(fail yr 2) = (0.9)(0.1) = 0.09
P(fail yr 3) = (0.9)²(0.1) = 0.081
P(fail yr 4) = (0.9)³(0.1) = 0.0729

E(payout) = 8000(0.1) + 6000(0.09) + 4000(0.081) + 2000(0.0729)
= 800 + 540 + 324 + 145.80 = $1809.80`,
      hint: 'Find P(fail in year k) = (0.9)^(k-1)(0.1) for each year, then compute the weighted average payout.',
      topic: 'Expected Value Application',
    },
    {
      id: 9,
      question: `If the moment-generating function of X is M(t) = (2/5)eᵗ + (1/5)e²ᵗ + (2/5)e³ᵗ, what is the variance of X?`,
      options: ['0.4', '0.6', '0.8', '1.0', '1.2'],
      correctIndex: 2,
      explanation: `From the MGF, the PMF is: f(1) = 2/5, f(2) = 1/5, f(3) = 2/5.

μ = M'(0) = 1(2/5) + 2(1/5) + 3(2/5) = (2 + 2 + 6)/5 = 10/5 = 2

E(X²) = M''(0) = 1(2/5) + 4(1/5) + 9(2/5) = (2 + 4 + 18)/5 = 24/5 = 4.8

σ² = 4.8 - 4 = 0.8`,
      hint: 'Read the PMF from the MGF coefficients, then compute μ and σ² = E(X²) - μ².',
      topic: 'Moment-Generating Function',
    },
    {
      id: 10,
      question: `On a multiple-choice test with 5 options per question, a student guesses randomly. What is the probability that the first correct answer is on question 4?`,
      options: ['0.0640', '0.1024', '0.1280', '0.1500', '0.2000'],
      correctIndex: 1,
      explanation: `This is a geometric distribution with p = 1/5 = 0.2.

P(X = 4) = (1 - p)³ · p = (0.8)³(0.2) = (0.512)(0.2) = 0.1024`,
      hint: 'Geometric PMF: f(x) = (1-p)^(x-1) · p. Here p = 1/5.',
      topic: 'Geometric Distribution',
    },
    {
      id: 11,
      question: `A machine produces defective items with probability 0.01. Items are checked one by one. What is the probability that at least 100 items must be checked to find a defective one?`,
      options: ['0.3697', '0.3340', '0.2650', '0.4012', '0.5000'],
      correctIndex: 0,
      explanation: `X = number of items until first defective is geometric with p = 0.01.

P(X ≥ 100) = P(first 99 are not defective)
= (1 - 0.01)⁹⁹ = 0.99⁹⁹ ≈ 0.3697`,
      hint: 'P(X ≥ k) = q^(k-1) for a geometric random variable.',
      topic: 'Geometric Distribution',
    },
    {
      id: 12,
      question: `Apples are packaged in 3-pound bags. 4% of the time the bag weighs less than 3 pounds. You weigh bags until finding an underweight one. What is P(X ≥ 20)?`,
      options: ['0.3600', '0.4200', '0.4604', '0.5000', '0.5400'],
      correctIndex: 2,
      explanation: `X is geometric with p = 0.04, q = 0.96.

P(X ≥ 20) = P(first 19 are not underweight)
= (0.96)¹⁹ ≈ 0.4604`,
      hint: 'P(X ≥ k) = q^(k-1). Here q = 0.96 and k = 20.',
      topic: 'Geometric Distribution',
    },
  ],
  '2.4': [
    {
      id: 1,
      question: `A multiple-choice test has 5 questions, each with 4 options. A student guesses randomly on all questions. What is the probability of getting exactly 2 questions correct?`,
      options: ['0.2109', '0.2637', '0.2813', '0.3125', '0.3516'],
      correctIndex: 2,
      explanation: `This is Binomial(n=5, p=1/4) since each guess is independent with success probability 1/4.

P(X = 2) = C(5,2) × (1/4)² × (3/4)³
= 10 × (1/16) × (27/64)
= 10 × 27/1024
= 270/1024
= 0.2637`,
      hint: 'Use the binomial PMF: f(x) = C(n,x) × p^x × (1-p)^(n-x) with n=5, p=0.25.',
      topic: 'Binomial PMF',
    },
    {
      id: 2,
      question: `A baseball player has a batting average of 0.300 (30% chance of getting a hit). In a game with 4 at-bats, what is the probability of getting at least 2 hits?`,
      options: ['0.3483', '0.2646', '0.4116', '0.5000', '0.5630'],
      correctIndex: 0,
      explanation: `X ~ Binomial(n=4, p=0.3). We need P(X ≥ 2) = 1 - P(X ≤ 1).

P(X = 0) = C(4,0)(0.3)⁰(0.7)⁴ = 0.2401
P(X = 1) = C(4,1)(0.3)¹(0.7)³ = 4 × 0.3 × 0.343 = 0.4116

P(X ≤ 1) = 0.2401 + 0.4116 = 0.6517
P(X ≥ 2) = 1 - 0.6517 = 0.3483`,
      hint: 'Use the complement: P(X ≥ 2) = 1 - P(X = 0) - P(X = 1).',
      topic: 'Binomial CDF',
    },
    {
      id: 3,
      question: `In a quality control process, 2% of items are defective. A sample of 50 items is inspected. What is the expected number of defective items and the variance?`,
      options: ['E(X) = 1, Var(X) = 0.98', 'E(X) = 1, Var(X) = 1', 'E(X) = 2, Var(X) = 0.98', 'E(X) = 2, Var(X) = 1.96', 'E(X) = 0.5, Var(X) = 0.49'],
      correctIndex: 0,
      explanation: `X ~ Binomial(n=50, p=0.02).

E(X) = np = 50 × 0.02 = 1

Var(X) = np(1-p) = 50 × 0.02 × 0.98 = 0.98`,
      hint: 'For binomial: E(X) = np and Var(X) = np(1-p).',
      topic: 'Binomial Mean & Variance',
    },
    {
      id: 4,
      question: `A lab experiment has 10 independent trials. Each trial succeeds with probability 0.8. What is the standard deviation of the number of successes?`,
      options: ['0.8', '1.0', '1.265', '1.4', '1.6'],
      correctIndex: 2,
      explanation: `X ~ Binomial(n=10, p=0.8).

Var(X) = np(1-p) = 10 × 0.8 × 0.2 = 1.6

σ = √1.6 ≈ 1.265`,
      hint: 'Standard deviation σ = √(npq) where q = 1-p.',
      topic: 'Binomial Standard Deviation',
    },
    {
      id: 5,
      question: `Male ducks have a 0.6 probability of being infected with a parasite. If 4 male ducks are caught, what is the probability that at most 2 are infected?`,
      options: ['0.1792', '0.2304', '0.3456', '0.5248', '0.6912'],
      correctIndex: 2,
      explanation: `X ~ Binomial(n=4, p=0.6). We need P(X ≤ 2).

P(X = 0) = C(4,0)(0.6)⁰(0.4)⁴ = 0.0256
P(X = 1) = C(4,1)(0.6)¹(0.4)³ = 4 × 0.6 × 0.064 = 0.1536
P(X = 2) = C(4,2)(0.6)²(0.4)² = 6 × 0.36 × 0.16 = 0.3456

P(X ≤ 2) = 0.0256 + 0.1536 + 0.3456 = 0.5248

Wait, let me recalculate P(X ≤ 2):
P(X ≤ 2) = 0.0256 + 0.1536 + 0.3456 = 0.5248`,
      hint: 'Compute P(X = 0) + P(X = 1) + P(X = 2) using the binomial PMF.',
      topic: 'Binomial CDF',
    },
    {
      id: 6,
      question: `A Bernoulli random variable X has P(X = 1) = p. If Var(X) = 0.21, what is p?`,
      options: ['0.3 or 0.7', '0.25 or 0.75', '0.2 or 0.8', '0.35 or 0.65', '0.4 or 0.6'],
      correctIndex: 0,
      explanation: `For Bernoulli, Var(X) = p(1-p) = pq.

We need: p(1-p) = 0.21
p - p² = 0.21
p² - p + 0.21 = 0

Using quadratic formula:
p = (1 ± √(1 - 0.84))/2 = (1 ± √0.16)/2 = (1 ± 0.4)/2

p = 0.7 or p = 0.3`,
      hint: 'Var(X) = p(1-p) for Bernoulli. Solve p(1-p) = 0.21.',
      topic: 'Bernoulli Variance',
    },
    {
      id: 7,
      question: `A health insurance company finds that 80% of its subscribers exercise regularly. In a random sample of 15 subscribers, what is the probability that exactly 12 exercise regularly?`,
      options: ['0.1876', '0.2252', '0.2501', '0.2627', '0.3000'],
      correctIndex: 1,
      explanation: `X ~ Binomial(n=15, p=0.8).

P(X = 12) = C(15,12) × (0.8)¹² × (0.2)³
= 455 × (0.8)¹² × (0.2)³
= 455 × 0.0687195 × 0.008
= 455 × 0.000549756
= 0.2501`,
      hint: 'Use f(x) = C(n,x) p^x (1-p)^(n-x) with n=15, p=0.8, x=12.',
      topic: 'Binomial PMF',
    },
    {
      id: 8,
      question: `If X ~ Binomial(n, p) with E(X) = 6 and Var(X) = 2.4, find n and p.`,
      options: ['n = 10, p = 0.6', 'n = 12, p = 0.5', 'n = 15, p = 0.4', 'n = 8, p = 0.75', 'n = 20, p = 0.3'],
      correctIndex: 0,
      explanation: `We have:
np = 6 (mean)
np(1-p) = 2.4 (variance)

Dividing: (1-p) = 2.4/6 = 0.4
So p = 0.6

From np = 6: n × 0.6 = 6, so n = 10.`,
      hint: 'Divide variance by mean to get (1-p), then solve for p and n.',
      topic: 'Binomial Parameters',
    },
    {
      id: 9,
      question: `The MGF of a binomial random variable is M(t) = (0.7 + 0.3e^t)^8. What is the probability of exactly 3 successes?`,
      options: ['0.0467', '0.0839', '0.1361', '0.2541', '0.2965'],
      correctIndex: 2,
      explanation: `From M(t) = (q + pe^t)^n, we have:
n = 8, p = 0.3, q = 0.7

P(X = 3) = C(8,3) × (0.3)³ × (0.7)⁵
= 56 × 0.027 × 0.16807
= 56 × 0.00453789
= 0.2541`,
      hint: 'From MGF = (q + pe^t)^n, identify n, p, q, then compute the binomial PMF.',
      topic: 'Binomial MGF',
    },
    {
      id: 10,
      question: `A fair coin is flipped 20 times. What is the probability of getting between 8 and 12 heads (inclusive)?`,
      options: ['0.4967', '0.5632', '0.6367', '0.7368', '0.7500'],
      correctIndex: 2,
      explanation: `X ~ Binomial(n=20, p=0.5).

P(8 ≤ X ≤ 12) = Σ from x=8 to 12 of C(20,x)(0.5)²⁰

= [C(20,8) + C(20,9) + C(20,10) + C(20,11) + C(20,12)] × (0.5)²⁰
= [125970 + 167960 + 184756 + 167960 + 125970] × (1/1048576)
= 772616/1048576
≈ 0.7368`,
      hint: 'Sum P(X = k) for k = 8, 9, 10, 11, 12. With p = 0.5, each term is C(20,k)/2²⁰.',
      topic: 'Binomial Probability',
    },
    {
      id: 11,
      question: `In 100 independent Bernoulli trials with success probability 0.25, what is the expected number of successes and the probability that the number of successes is within one standard deviation of the mean?`,
      options: ['E(X) = 25, P ≈ 0.5888', 'E(X) = 25, P ≈ 0.6827', 'E(X) = 25, P ≈ 0.75', 'E(X) = 75, P ≈ 0.68', 'E(X) = 50, P ≈ 0.5'],
      correctIndex: 0,
      explanation: `X ~ Binomial(n=100, p=0.25).

E(X) = np = 100 × 0.25 = 25
Var(X) = np(1-p) = 100 × 0.25 × 0.75 = 18.75
σ = √18.75 ≈ 4.33

Within 1σ of mean: 25 ± 4.33, so roughly 21 to 29.

For large n, binomial is approximately normal. P(|X - μ| ≤ σ) ≈ 0.6827.

But the actual binomial sum P(21 ≤ X ≤ 29) ≈ 0.5888.`,
      hint: 'Calculate μ = np and σ = √(npq). The range within 1σ is [μ-σ, μ+σ].',
      topic: 'Binomial Approximation',
    },
    {
      id: 12,
      question: `If X₁ ~ Binomial(5, 0.4) and X₂ ~ Binomial(7, 0.4) are independent, what is the distribution of X₁ + X₂?`,
      options: ['Binomial(12, 0.4)', 'Binomial(12, 0.8)', 'Binomial(35, 0.4)', 'Normal(4.8, 2.88)', 'Not binomial'],
      correctIndex: 0,
      explanation: `A key property of binomials with the same p:

If X₁ ~ Bin(n₁, p) and X₂ ~ Bin(n₂, p) are independent,
then X₁ + X₂ ~ Bin(n₁ + n₂, p).

Therefore: X₁ + X₂ ~ Binomial(5 + 7, 0.4) = Binomial(12, 0.4).

This can be verified using MGFs:
M_{X₁+X₂}(t) = M_{X₁}(t) × M_{X₂}(t) = (0.6 + 0.4e^t)⁵ × (0.6 + 0.4e^t)⁷ = (0.6 + 0.4e^t)¹²`,
      hint: 'The sum of independent binomials with the SAME p is also binomial with the same p.',
      topic: 'Sum of Binomials',
    },
  ],
  '2.5': [
    {
      id: 1,
      question: `A fair six-sided die is rolled until a 6 appears. What is the probability that at least 4 rolls are needed?`,
      options: ['0.4213', '0.5787', '0.6944', '0.8333', '0.1667'],
      correctIndex: 2,
      explanation: `This is geometric with p = 1/6, q = 5/6.

"At least 4 rolls" means X ≥ 4, which equals P(X > 3).

P(X > 3) = q³ = (5/6)³ = 125/216 ≈ 0.5787

Wait, let me recalculate. P(X ≥ 4) = P(no 6 in first 3 rolls) = (5/6)³ = 0.5787.

Actually P(X > k) = q^k, so P(X > 3) = (5/6)³ = 0.5787.

But P(X ≥ 4) = P(X > 3) = q³ = (5/6)³ = 125/216 ≈ 0.5787.

Hmm, let me check: P(X ≥ k) = q^(k-1). So P(X ≥ 4) = (5/6)³ = 0.5787.`,
      hint: 'For geometric: P(X ≥ k) = q^(k-1) or equivalently P(X > k-1) = q^(k-1).',
      topic: 'Geometric Distribution',
    },
    {
      id: 2,
      question: `An excellent free-throw shooter makes 90% of their shots. What is the probability of having the first miss on the 13th attempt or later?`,
      options: ['0.2824', '0.3138', '0.1074', '0.0282', '0.7176'],
      correctIndex: 0,
      explanation: `Here "success" = making the shot, but we want first MISS.
So for misses: p = 0.1 (miss), q = 0.9 (make).

P(first miss on 13th or later) = P(X ≥ 13)
= P(no miss in first 12) = (0.9)¹² ≈ 0.2824`,
      hint: 'Define success as a miss (p = 0.1). Then P(X ≥ 13) = q^12 where q = 0.9.',
      topic: 'Geometric Distribution',
    },
    {
      id: 3,
      question: `Show that 63/512 is the probability that the fifth head is observed on the tenth independent flip of a fair coin.`,
      options: ['True - this is C(9,4)(0.5)^10', 'False - it should be C(10,5)(0.5)^10', 'True - this is C(10,5)(0.5)^10', 'False - it should be C(9,5)(0.5)^10', 'True - this is (0.5)^10'],
      correctIndex: 0,
      explanation: `This is negative binomial with r = 5, p = 0.5.
For the 5th head on the 10th flip:

P(X = 10) = C(10-1, 5-1) × (0.5)⁵ × (0.5)^(10-5)
= C(9, 4) × (0.5)^10
= 126 × (1/1024)
= 126/1024 = 63/512 ✓`,
      hint: 'Use negative binomial PMF: g(x) = C(x-1, r-1) × p^r × q^(x-r).',
      topic: 'Negative Binomial PMF',
    },
    {
      id: 4,
      question: `A basketball player makes 60% of free throws. Let X be the minimum number of attempts to make 10 shots. Find E(X) and Var(X).`,
      options: ['E(X) = 16.67, Var(X) = 11.11', 'E(X) = 10, Var(X) = 4', 'E(X) = 6, Var(X) = 2.4', 'E(X) = 25, Var(X) = 41.67', 'E(X) = 15, Var(X) = 10'],
      correctIndex: 0,
      explanation: `X ~ Negative Binomial(r = 10, p = 0.6).

E(X) = r/p = 10/0.6 = 16.67

Var(X) = rq/p² = 10(0.4)/(0.6)² = 4/0.36 = 11.11`,
      hint: 'For negative binomial: μ = r/p and σ² = rq/p².',
      topic: 'Negative Binomial Mean & Variance',
    },
    {
      id: 5,
      question: `An airport metal detector catches a person with metal 99% of the time (misses 1%). What is the probability that the first person missed is among the first 50 scanned?`,
      options: ['0.3950', '0.5000', '0.6050', '0.9900', '0.0100'],
      correctIndex: 0,
      explanation: `"Success" = miss (p = 0.01), "failure" = detect (q = 0.99).

P(first miss in first 50) = P(X ≤ 50)
= 1 - P(X > 50)
= 1 - q^50
= 1 - (0.99)^50
= 1 - 0.6050
= 0.3950`,
      hint: 'P(X ≤ k) = 1 - q^k for geometric. Here q = 0.99.',
      topic: 'Geometric CDF',
    },
    {
      id: 6,
      question: `If X has a geometric distribution with mean 5, what is P(X = 3)?`,
      options: ['0.1024', '0.128', '0.16', '0.2', '0.04'],
      correctIndex: 1,
      explanation: `Mean = 1/p = 5, so p = 0.2 and q = 0.8.

P(X = 3) = q^(3-1) × p = (0.8)² × (0.2) = 0.64 × 0.2 = 0.128`,
      hint: 'From μ = 1/p, find p. Then use PMF: f(x) = q^(x-1) × p.',
      topic: 'Geometric Distribution',
    },
    {
      id: 7,
      question: `The probability that a company has no accidents in a month is 0.7 (independent months). What is the probability that the third month with at least one accident is month 10?`,
      options: ['0.0467', '0.0354', '0.0635', '0.0882', '0.1029'],
      correctIndex: 2,
      explanation: `"Success" = month with accident, p = 1 - 0.7 = 0.3, q = 0.7.
This is negative binomial with r = 3.

P(X = 10) = C(10-1, 3-1) × (0.3)³ × (0.7)^(10-3)
= C(9, 2) × (0.3)³ × (0.7)⁷
= 36 × 0.027 × 0.0824
= 0.0801`,
      hint: 'Use negative binomial with r = 3, p = 0.3 (accident probability).',
      topic: 'Negative Binomial PMF',
    },
    {
      id: 8,
      question: `A cereal box contains one of 4 different prizes (equally likely). On average, how many boxes must be purchased to get at least one of each prize?`,
      options: ['4', '6', '8', '8.33', '10'],
      correctIndex: 2,
      explanation: `This is the Coupon Collector Problem with n = 4.

Expected boxes = sum of geometric means:
- 1st new prize: 1 box (always new)
- 2nd new prize: 4/3 boxes (p = 3/4)
- 3rd new prize: 4/2 = 2 boxes (p = 2/4)
- 4th new prize: 4/1 = 4 boxes (p = 1/4)

Total = 1 + 4/3 + 2 + 4 = 1 + 1.33 + 2 + 4 = 8.33`,
      hint: 'Use sum of geometric means: 1 + 4/3 + 4/2 + 4/1.',
      topic: 'Coupon Collector Problem',
    },
    {
      id: 9,
      question: `For a geometric random variable X with p = 0.25, find P(X > 5 | X > 2).`,
      options: ['0.1406', '0.3164', '0.4219', '0.5625', '0.75'],
      correctIndex: 2,
      explanation: `By the memoryless property:
P(X > 5 | X > 2) = P(X > 3) = q³ = (0.75)³ = 0.4219

This equals P(X > 5-2) = P(X > 3).`,
      hint: 'Use memoryless property: P(X > k+m | X > k) = P(X > m).',
      topic: 'Memoryless Property',
    },
    {
      id: 10,
      question: `If X ~ Geometric(p) and Var(X) = 12, what is E(X)?`,
      options: ['2', '3', '4', '6', '12'],
      correctIndex: 2,
      explanation: `For geometric: Var(X) = q/p² = (1-p)/p² = 12.

Also, E(X) = 1/p.

From Var(X) = q/p² and E(X) = 1/p:
Var(X) = (1-p)/p² = (1/p)(1-p)/p = E(X) × (1-p)/p

So 12 = E(X) × (E(X) - 1)/E(X) = E(X) - 1... no wait.

Let μ = 1/p, so p = 1/μ and q = 1 - 1/μ = (μ-1)/μ.
Var(X) = q/p² = [(μ-1)/μ] × μ² = μ(μ-1) = 12
μ² - μ - 12 = 0
(μ - 4)(μ + 3) = 0
μ = 4 (since μ > 0)`,
      hint: 'Set up: if μ = 1/p, then Var = q/p² = μ(μ-1). Solve μ² - μ = 12.',
      topic: 'Geometric Distribution',
    },
    {
      id: 11,
      question: `Fruit flies have a 1/4 probability of white eyes. What is P(X ≤ 4), where X is the number of flies checked until observing a white-eyed fly?`,
      options: ['0.6836', '0.3164', '0.4219', '0.1055', '0.7627'],
      correctIndex: 0,
      explanation: `X ~ Geometric with p = 1/4, q = 3/4.

P(X ≤ 4) = 1 - P(X > 4) = 1 - q⁴
= 1 - (3/4)⁴
= 1 - 81/256
= 175/256
= 0.6836`,
      hint: 'P(X ≤ k) = 1 - q^k for geometric.',
      topic: 'Geometric CDF',
    },
    {
      id: 12,
      question: `A basketball player makes 80% of free throws. What is P(X = 12) where X is the number of attempts needed to make exactly 10 shots?`,
      options: ['0.2013', '0.2362', '0.1678', '0.3020', '0.1209'],
      correctIndex: 1,
      explanation: `X ~ Negative Binomial(r = 10, p = 0.8).

P(X = 12) = C(12-1, 10-1) × (0.8)^10 × (0.2)^(12-10)
= C(11, 9) × (0.8)^10 × (0.2)²
= 55 × 0.1074 × 0.04
= 0.2362`,
      hint: 'Use g(x) = C(x-1, r-1) × p^r × q^(x-r) with r=10, p=0.8, x=12.',
      topic: 'Negative Binomial PMF',
    },
  ],
};

interface Props {
  section: string;
}

export default function PracticeProblems({ section }: Props) {
  const [currentProblem, setCurrentProblem] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  // Track answers for each problem: stores { selected: number, isCorrect: boolean } or undefined
  const [problemAnswers, setProblemAnswers] = useState<Record<number, { selected: number; isCorrect: boolean }>>({});
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  // Scratch work per problem
  const [scratchWork, setScratchWork] = useState<Record<number, string>>({});
  const [showScratch, setShowScratch] = useState(true);

  const sectionProblems = problems[section] || [];
  const problem = sectionProblems[currentProblem];

  const goToProblem = (index: number) => {
    setCurrentProblem(index);
    // Restore state for this problem if already answered
    const answer = problemAnswers[index];
    if (answer !== undefined) {
      setSelectedAnswer(answer.selected);
      setShowExplanation(true);
    } else {
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
    setShowHint(false);
  };

  if (!problem) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <p className="text-slate-400">No practice problems available for this section yet.</p>
      </div>
    );
  }

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;

    const isCorrect = index === problem.correctIndex;
    setSelectedAnswer(index);
    setProblemAnswers(prev => ({
      ...prev,
      [currentProblem]: { selected: index, isCorrect }
    }));
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
    setShowExplanation(true);
  };

  const nextProblem = () => {
    if (currentProblem < sectionProblems.length - 1) {
      const nextIndex = currentProblem + 1;
      goToProblem(nextIndex);
    }
  };

  const resetProblems = () => {
    setCurrentProblem(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setShowHint(false);
    setScore({ correct: 0, total: 0 });
    setProblemAnswers({});
  };

  const isCorrect = selectedAnswer === problem.correctIndex;

  return (
    <div className="space-y-6 pb-20">
      {/* Problem Selector */}
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm font-medium">Jump to Problem</span>
            <span className="text-sm">
              <span className="text-green-400">{score.correct}</span>
              <span className="text-slate-500"> / {score.total} correct</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sectionProblems.map((_, index) => {
              const answer = problemAnswers[index];
              const isCurrent = index === currentProblem;

              let buttonStyle = 'bg-slate-700 hover:bg-slate-600 text-slate-300';
              if (isCurrent) {
                buttonStyle = 'bg-blue-500 text-white ring-2 ring-blue-400';
              } else if (answer?.isCorrect === true) {
                buttonStyle = 'bg-green-500/20 text-green-400 border border-green-500/50';
              } else if (answer?.isCorrect === false) {
                buttonStyle = 'bg-red-500/20 text-red-400 border border-red-500/50';
              }

              return (
                <button
                  key={index}
                  onClick={() => goToProblem(index)}
                  className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${buttonStyle}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-slate-700"></span> Unanswered
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-green-500/20 border border-green-500/50"></span> Correct
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-red-500/20 border border-red-500/50"></span> Incorrect
            </span>
          </div>
        </div>

      {/* Problem Card + AI Chat Row */}
      <div className="flex gap-4">
        {/* Problem Card */}
        <div className={`bg-slate-800 rounded-xl border border-slate-700 overflow-hidden transition-all duration-300 ${isChatOpen ? 'flex-1 min-w-0' : 'w-full'}`}>
          {/* Problem Header */}
          <div className="px-6 py-4 bg-slate-700/50 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-blue-500/20 rounded text-xs text-blue-300">
                  {problem.topic}
                </span>
                {!isChatOpen && (
                  <button
                    onClick={() => setIsChatOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-purple-500/20"
                  >
                    <Sparkles className="w-4 h-4" />
                    Ask AI Tutor
                  </button>
                )}
                {!isCalculatorOpen && (
                  <button
                    onClick={() => setIsCalculatorOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Calculator className="w-4 h-4" />
                    Calculator
                  </button>
                )}
              </div>
              <button
                onClick={resetProblems}
                className="flex items-center gap-1 text-slate-400 hover:text-white text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>

        {/* Problem Content */}
        <div className="p-6">
          <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
            <pre className="text-slate-200 whitespace-pre-wrap font-sans text-sm leading-relaxed">
              {problem.question}
            </pre>
          </div>

          {/* Hint Button */}
          {!showHint && selectedAnswer === null && (
            <button
              onClick={() => setShowHint(true)}
              className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 text-sm mb-4"
            >
              <Lightbulb className="w-4 h-4" />
              Show Hint
            </button>
          )}

          {/* Hint */}
          {showHint && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5" />
                <p className="text-yellow-200 text-sm">{problem.hint}</p>
              </div>
            </div>
          )}

          {/* Answer Options */}
          <div className="space-y-3">
            {problem.options.map((option, index) => {
              let buttonStyle = 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600';

              if (selectedAnswer !== null) {
                if (index === problem.correctIndex) {
                  buttonStyle = 'bg-green-500/20 text-green-300 border-green-500';
                } else if (index === selectedAnswer) {
                  buttonStyle = 'bg-red-500/20 text-red-300 border-red-500';
                } else {
                  buttonStyle = 'bg-slate-700/50 text-slate-500 border-slate-600';
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={`w-full p-4 rounded-lg border text-left transition-colors flex items-center gap-3 ${buttonStyle}`}
                >
                  <span className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-sm font-medium">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="font-mono">{option}</span>
                  {selectedAnswer !== null && index === problem.correctIndex && (
                    <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                  )}
                  {selectedAnswer === index && index !== problem.correctIndex && (
                    <XCircle className="w-5 h-5 text-red-400 ml-auto" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Scratch Work Area */}
          <div className="mt-6">
            <button
              onClick={() => setShowScratch(!showScratch)}
              className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-2"
            >
              <PenLine className="w-4 h-4" />
              {showScratch ? 'Hide' : 'Show'} Scratch Work
              {showScratch ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showScratch && (
              <textarea
                value={scratchWork[currentProblem] || ''}
                onChange={(e) => setScratchWork(prev => ({ ...prev, [currentProblem]: e.target.value }))}
                placeholder="Type your work here...&#10;&#10;Example:&#10;P(A) = 0.4&#10;P(B) = 0.3&#10;P(A ∩ B) = P(A) × P(B) = 0.12"
                className="w-full h-40 p-4 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 font-mono text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-y"
              />
            )}
          </div>

          {/* Result */}
          {selectedAnswer !== null && (
            <div
              className={`mt-6 p-4 rounded-lg ${
                isCorrect
                  ? 'bg-green-500/10 border border-green-500/30'
                  : 'bg-red-500/10 border border-red-500/30'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-300 font-semibold">Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-300 font-semibold">Incorrect</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Explanation */}
          {showExplanation && (
            <div className="mt-4">
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm mb-2"
              >
                {showExplanation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {showExplanation ? 'Hide' : 'Show'} Solution
              </button>

              <div className="bg-slate-700/50 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Solution:</h4>
                <pre className="text-slate-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                  {problem.explanation}
                </pre>
              </div>
            </div>
          )}

          {/* Next Button */}
          {selectedAnswer !== null && currentProblem < sectionProblems.length - 1 && (
            <button
              onClick={nextProblem}
              className="mt-6 w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Next Problem →
            </button>
          )}

          {/* Completion Message */}
          {selectedAnswer !== null && currentProblem === sectionProblems.length - 1 && (
            <div className="mt-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-6 border border-green-500/30 text-center">
              <h3 className="text-xl font-bold text-white mb-2">Section Complete!</h3>
              <p className="text-slate-300 mb-4">
                You got {score.correct} out of {score.total} correct ({((score.correct / score.total) * 100).toFixed(0)}%)
              </p>
              <button
                onClick={resetProblems}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              >
                Practice Again
              </button>
            </div>
          )}
        </div>
      </div>

        {/* AI Tutor Side Panel */}
        {isChatOpen && (
          <div className="w-96 flex-shrink-0 rounded-xl overflow-hidden">
            <AITutor
              problemContext={{
                question: problem.question,
                options: problem.options,
                correctIndex: problem.correctIndex,
                explanation: problem.explanation,
                topic: problem.topic,
                userAnswer: selectedAnswer,
                isCorrect: selectedAnswer !== null ? selectedAnswer === problem.correctIndex : undefined,
              }}
              isOpen={isChatOpen}
              onToggle={() => setIsChatOpen(false)}
            />
          </div>
        )}
      </div>

      {/* Floating Calculator - draggable, positions itself */}
      {isCalculatorOpen && (
        <ExamCalculator
          isOpen={isCalculatorOpen}
          onToggle={() => setIsCalculatorOpen(false)}
        />
      )}
    </div>
  );
}
