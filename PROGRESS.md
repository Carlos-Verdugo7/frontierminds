# Exam P Trainer - Development Progress

This file tracks what has been built and what still needs to be completed.
Use this to understand the current state of the project across AI sessions.

## Project Overview
- **Goal**: Interactive learning app for Actuary Exam P preparation
- **Textbook**: Hogg's "Probability and Statistical Inference" 10th Edition
- **Tech Stack**: Next.js 14+, TypeScript, Tailwind CSS, React
- **Location**: `/Users/joseverdugo7/Learning/exam-p-trainer`

---

## Chapter 1: Probability (Exam Weight: ~15%)

### Section 1.1: Properties of Probability
- **Status**: COMPLETED
- **Page**: `/src/app/chapter/1/section/1/page.tsx`
- **Components**:
  - `DiceSimulator.tsx` - Interactive dice rolling with experimental vs theoretical probability
  - `VennDiagram.tsx` - Interactive Venn diagram with set operations
  - `GeometricProbabilitySimulator.tsx` - Disk landing on tiles simulator (Example 1.1-2)
  - `PracticeProblems.tsx` - 10 Exam P-style problems (expanded from 5)
- **Topics Covered**:
  - Sample spaces and events
  - Axioms of probability
  - Addition Rule: P(A∪B) = P(A) + P(B) - P(A∩B)
  - Complement Rule: P(A') = 1 - P(A)
  - Inclusion-Exclusion for 3 events
  - Geometric Probability (area-based)
- **Practice Problems** (21 total):
  - Addition Rule, Inclusion-Exclusion, Complement Rule, Set Operations, Geometric Probability
  - Card deck problems (A∩B, A∪B), Coin toss outcomes, Mutually exclusive events
  - Complementary events, De Morgan's Laws, Set partitions
  - Line segment geometric probability, Semicircle geometric probability
  - Insurance claims (geometric series)

### Section 1.2: Methods of Enumeration
- **Status**: COMPLETED
- **Page**: `/src/app/chapter/1/section/2/page.tsx`
- **Components**:
  - `CountingSimulator.tsx` - Calculator for factorial, permutations, combinations, multinomial
  - `PascalsTriangle.tsx` - Interactive Pascal's Triangle explorer
- **Topics Covered**:
  - Multiplication Principle
  - Factorials (n!)
  - Permutations P(n,r)
  - Combinations C(n,r)
  - Sampling with/without replacement
  - Distinguishable permutations
  - Multinomial coefficients
- **Practice Problems**: 8 problems (license plates, PROBABILITY permutations, committees, poker hands, seating, pizza toppings, word formation, bridge hands)

### Section 1.3: Conditional Probability
- **Status**: COMPLETED
- **Page**: `/src/app/chapter/1/section/3/page.tsx`
- **Components**:
  - `TreeDiagramSimulator.tsx` - Interactive tree diagram with scenarios (Medical Test, Urn Problem, Quality Control)
- **Topics Covered**:
  - Definition: P(A|B) = P(A∩B) / P(B)
  - Multiplication Rule: P(A∩B) = P(A|B) × P(B)
  - Extended Multiplication Rule for multiple events
  - Tree diagrams with joint/marginal probabilities
  - Law of Total Probability
- **Practice Problems**: 8 problems (drawing without replacement, conditional probability calculations, factory defects, etc.)

### Section 1.4: Independent Events
- **Status**: COMPLETED
- **Page**: `/src/app/chapter/1/section/4/page.tsx`
- **Components**:
  - `IndependenceChecker.tsx` - Interactive tool to test independence with visual comparison
- **Topics Covered**:
  - Definition of independence: P(A∩B) = P(A) × P(B)
  - Equivalent condition: P(A|B) = P(A)
  - Independence vs Mutual Exclusivity (exam trap!)
  - Independence of complements
  - Mutual vs Pairwise independence
- **Practice Problems**: 8 problems (coin flips, system reliability, testing independence, etc.)

### Section 1.5: Bayes' Theorem
- **Status**: COMPLETED
- **Page**: `/src/app/chapter/1/section/5/page.tsx`
- **Components**:
  - `BayesCalculator.tsx` - Interactive Bayes calculator with scenarios (Medical Test, Spam Filter, Quality Control, Rare Event)
- **Topics Covered**:
  - Law of Total Probability (review)
  - Bayes' Theorem formula
  - Prior vs Posterior probability
  - Base Rate Fallacy
  - Multiple Hypotheses
  - Sensitivity, Specificity, PPV, NPV
- **Practice Problems** (8 total from textbook exercises):
  - Bowl/chips Bayes problem, Bean seeds conditional, Auto accidents by age
  - ER patient classification, Chemist impurity test, Rare disease diagnostic (base rate fallacy)
  - Life insurance policies, Smokers study

---

## Chapter 2: Discrete Distributions (Exam Weight: ~20%)
- **Status**: NOT STARTED
- **Sections**:
  - 2.1: Random Variables of the Discrete Type
  - 2.2: Mathematical Expectation
  - 2.3: Special Mathematical Expectations
  - 2.4: Binomial Distribution
  - 2.5: Negative Binomial Distribution
  - 2.6: Poisson Distribution

---

## Chapter 3: Continuous Distributions (Exam Weight: ~25%)
- **Status**: NOT STARTED
- **Sections**:
  - 3.1: Random Variables of the Continuous Type
  - 3.2: Mathematical Expectation
  - 3.3: Special Distributions (Uniform, Exponential, Gamma, Normal)

---

## Chapter 4: Bivariate Distributions (Exam Weight: ~20%)
- **Status**: NOT STARTED
- **Sections**:
  - 4.1: Bivariate Distributions
  - 4.2: Correlation Coefficient
  - 4.3: Conditional Distributions
  - 4.4: Bivariate Normal Distribution

---

## Chapter 5: Distributions of Functions (Exam Weight: ~20%)
- **Status**: NOT STARTED
- **Sections**:
  - 5.1: Functions of One Random Variable
  - 5.2: Transformations
  - 5.3: Moment-Generating Function Technique

---

## Shared Components

| Component | Status | Location | Description |
|-----------|--------|----------|-------------|
| DiceSimulator | DONE | `/src/components/DiceSimulator.tsx` | Dice rolling with probability tracking |
| VennDiagram | DONE | `/src/components/VennDiagram.tsx` | Interactive set operations |
| GeometricProbabilitySimulator | DONE | `/src/components/GeometricProbabilitySimulator.tsx` | Disk/tiles Monte Carlo simulator |
| PracticeProblems | DONE | `/src/components/PracticeProblems.tsx` | Problems for Sections 1.1, 1.5 |
| CountingSimulator | DONE | `/src/components/CountingSimulator.tsx` | Factorial/Perm/Comb calculator |
| PascalsTriangle | DONE | `/src/components/PascalsTriangle.tsx` | Interactive Pascal's Triangle |
| TreeDiagramSimulator | DONE | `/src/components/TreeDiagramSimulator.tsx` | Tree diagram for conditional prob |
| IndependenceChecker | DONE | `/src/components/IndependenceChecker.tsx` | Tool to check event independence |
| BayesCalculator | DONE | `/src/components/BayesCalculator.tsx` | Bayes' theorem calculator |
| ExamCalculator | DONE | `/src/components/ExamCalculator.tsx` | Draggable TI-30X style scientific calculator with keyboard support, parentheses (stack-based), memory, nCr/nPr, factorial, ln, eˣ. Compact/expanded modes. |

---

## Resources

- **Textbook PDF**: `/Users/joseverdugo7/Learning/probability_and_statitical_inference_tenth_textbook/`
- **Exercise PDF**: `Chapter_1_Exercises.pdf` in same folder
- **Dev Server**: `npm run dev` (usually runs on localhost:3001)

---

## Notes for Future Sessions

1. Each section follows the same structure: Learn tab, Simulate tab, Practice tab
2. Practice problems should be Exam P style (multiple choice, 5 options)
3. Interactive simulators help demonstrate concepts visually
4. The Chapter 1 page (`/chapter/1/page.tsx`) lists all sections - update status there too when sections are completed
5. Run `npm run dev` to start the development server

---

*Last Updated: Added keyboard support and parentheses to ExamCalculator (stack-based paren evaluation, backspace, all key bindings)*
