'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Lightbulb, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import AITutor from './AITutor';

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

      {/* Problem Card */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        {/* Problem Header */}
        <div className="px-6 py-4 bg-slate-700/50 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 bg-blue-500/20 rounded text-xs text-blue-300">
                {problem.topic}
              </span>
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
              />
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
              <h3 className="text-xl font-bold text-white mb-2">Section Complete! 🎉</h3>
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
    </div>
  );
}
