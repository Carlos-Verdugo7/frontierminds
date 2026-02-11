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
- **Status**: COMPLETED

### Section 2.1: Random Variables of the Discrete Type
- **Status**: COMPLETED
- **Page**: `/src/app/chapter/2/section/1/page.tsx`
- **Components**:
  - `PMFExplorer.tsx` - Interactive PMF builder with histogram, CDF step-function toggle, range calculator
  - `HypergeometricSimulator.tsx` - Hypergeometric distribution simulator with visual pool, draw animation, theoretical vs observed comparison
  - `FrequencyExplorer.tsx` - Data entry tool comparing observed frequencies vs theoretical PMF with overlaid histograms
- **Topics Covered**:
  - What is a Random Variable (mapping outcomes to numbers)
  - Discrete vs Continuous random variables
  - Probability Mass Function (PMF) — definition & properties
  - Building a PMF from scratch (max of two dice example)
  - Cumulative Distribution Function (CDF) — staircase function
  - Discrete Uniform Distribution
  - Hypergeometric Distribution (tagged fish example)
- **Practice Problems** (20 total):
  - PMF normalization constant, PMF construction (chip bowl), Hypergeometric (defective lot)
  - Sum of two dice PMF, Min of two dice PMF, Tagged fish hypergeometric
  - Conditional probability with PMF, Exam questions hypergeometric, Face cards hypergeometric, CDF evaluation
  - Textbook 2.1-10 through 2.1-17: defective lots, light bulbs, essay questions, underweight packages, Michigan Math Prize, ping-pong balls
  - Face cards relative frequency from 40 observations (2.1-15)

### Section 2.2: Mathematical Expectation
- **Status**: COMPLETED
- **Page**: `/src/app/chapter/2/section/2/page.tsx`
- **Components**:
  - `ExpectationCalculator.tsx` - Interactive calculator for E[X], E[X²], E[u(X)] with step-by-step computation, function selector, preset distributions
- **Topics Covered**:
  - Definition of Mathematical Expectation E[u(X)] = Σ u(x)f(x)
  - Mean of X: μ = E(X)
  - Expected value of functions without finding PMF of Y = u(X)
  - Properties of Expectation (Linearity): E(c)=c, E[cu(X)]=cE[u(X)], E[c₁u₁+c₂u₂]=c₁E[u₁]+c₂E[u₂]
  - Mean minimizes E[(X-b)²]
  - Mean of Hypergeometric: μ = n(N₁/N)
  - Geometric distribution PMF and mean: μ = 1/p
- **Practice Problems** (12 total):
  - E(X), E(X²) computation, Hospital insurance payment, PMF constant determination
  - Dice game profit, Chuck-a-luck expected value, US roulette expected value
  - Hypergeometric mean, Geometric mean, Linearity of expectation, Craps expected value

### Section 2.3: Special Mathematical Expectations
- **Status**: COMPLETED
- **Page**: `/src/app/chapter/2/section/3/page.tsx`
- **Components**:
  - `VarianceCalculator.tsx` - Interactive variance/σ²/σ calculator with definition & shortcut methods, SVG histogram with μ/σ markers, MGF display
  - `DistributionComparator.tsx` - Side-by-side distribution comparison with editable PMFs, shared axis histograms, variance/σ ratios, 5 preset scenarios (safe vs risky, tight vs spread, peaked vs flat, shift test, scale test)
- **Topics Covered**:
  - Variance definition: σ² = E[(X - μ)²]
  - Variance shortcut: σ² = E(X²) - μ²
  - Standard deviation σ = √σ²
  - Standard deviation as measure of spread
  - Linear transformation: Var(aX + b) = a²Var(X)
  - Moments and factorial moments
  - Moment-generating function (MGF): M(t) = E(e^tX)
  - MGF uniqueness property
  - Geometric distribution variance: σ² = q/p²
  - Hypergeometric variance: σ² = np(1-p)(N-n)/(N-1)
- **Practice Problems** (12 total):
  - Variance computation (shortcut), PMF variance, factorial moment method
  - Linear transformation (Var(X+4)=Var(X)), chip bowl variance
  - Uniform E(X)=Var(X), max of dice σ, warranty expected value
  - MGF to variance, geometric distribution P(X=k), P(X≥k) problems

### Section 2.4: Binomial Distribution
- **Status**: COMPLETED
- **Page**: `/src/app/chapter/2/section/4/page.tsx`
- **Components**:
  - `BinomialSimulator.tsx` - Interactive simulator with n/p sliders, trial animation, theoretical vs observed PMF, probability calculator
- **Topics Covered**:
  - Bernoulli trials and Bernoulli distribution
  - Bernoulli mean (μ = p) and variance (σ² = pq)
  - Binomial distribution as sum of Bernoulli trials
  - Binomial PMF: f(x) = C(n,x)p^x(1-p)^(n-x)
  - Binomial mean (μ = np) and variance (σ² = npq)
  - Binomial MGF: M(t) = (q + pe^t)^n
  - Sum of independent binomials with same p
- **Practice Problems** (12 total):
  - Multiple choice guessing, baseball at-bats, quality control
  - Lab experiments, duck infection, Bernoulli variance calculation
  - Health insurance, finding n and p from mean/variance
  - MGF to PMF, coin flip range probability, sum of binomials

### Section 2.5: Negative Binomial Distribution
- **Status**: COMPLETED
- **Page**: `/src/app/chapter/2/section/5/page.tsx`
- **Components**:
  - `NegativeBinomialSimulator.tsx` - Interactive simulator for Geometric (r=1) and Negative Binomial (r>1) with trial animation, theoretical vs observed PMF, probability calculator
- **Topics Covered**:
  - Geometric distribution: trials until first success
  - Geometric PMF: f(x) = p·q^(x-1), x = 1, 2, 3, ...
  - Geometric mean (μ = 1/p) and variance (σ² = q/p²)
  - Geometric CDF shortcuts: P(X > k) = q^k, P(X ≤ k) = 1 - q^k
  - Memoryless property: P(X > k+m | X > k) = P(X > m)
  - Negative Binomial: trials until r successes
  - Negative Binomial PMF: g(x) = C(x-1,r-1)p^r·q^(x-r), x = r, r+1, ...
  - Negative Binomial mean (μ = r/p) and variance (σ² = rq/p²)
  - Coupon Collector Problem application
- **Practice Problems** (12 total):
  - Die rolling until 6, free throw misses, coin flip heads
  - Basketball free throws (negative binomial), metal detector
  - Geometric mean/variance problems, company accidents
  - Cereal prizes (Coupon Collector), memoryless property

### Section 2.6: Poisson Distribution
- **Status**: COMPLETED
- **Page**: `/src/app/chapter/2/section/6/page.tsx`
- **Components**:
  - `PoissonSimulator.tsx` - Interactive Poisson distribution simulator with λ slider, timeline visualization, theoretical vs observed PMF, probability calculator
- **Topics Covered**:
  - Poisson process: counting events in time/space
  - Poisson PMF: f(x) = λ^x × e^(-λ) / x!
  - Key property: Mean = Variance = λ
  - Scaling for different intervals (λt)
  - Sum of independent Poissons
  - Poisson approximation to Binomial (n large, p small)
  - Moment-generating function: M(t) = e^(λ(e^t - 1))
- **Practice Problems** (12 total):
  - Poisson PMF calculations, P(X=0), P(X≥1)
  - Mean=Variance property problems
  - Scaling for different time intervals
  - Sum of Poisson random variables
  - Poisson approximation to Binomial

---

## Chapter 2 Summary
- **Status**: COMPLETED
- **Total Sections**: 6
- **Total Simulators**: 8 (PMFExplorer, HypergeometricSimulator, FrequencyExplorer, ExpectationCalculator, VarianceCalculator, DistributionComparator, BinomialSimulator, NegativeBinomialSimulator, PoissonSimulator)
- **Total Practice Problems**: 80

---

## Chapter 3: Continuous Distributions (Exam Weight: ~25%)
- **Status**: IN PROGRESS

### Section 3.1: Random Variables of the Continuous Type
- **Status**: COMPLETED
- **Page**: `/src/app/chapter/3/section/1/page.tsx`
- **Components**:
  - `ContinuousPDFExplorer.tsx` - Interactive PDF/CDF visualizer with multiple distributions (Uniform, Triangular, Quadratic), probability calculator, and statistics display
- **Topics Covered**:
  - Continuous vs discrete random variables
  - Probability Density Function (PDF) — definition & properties
  - P(X = x) = 0 for continuous RVs
  - Cumulative Distribution Function (CDF)
  - PDF ↔ CDF relationship: f(x) = F'(x)
  - Uniform distribution U(a, b)
  - Mean, variance, MGF for continuous RVs
  - Percentiles and quartiles
- **Practice Problems** (12 total):
  - Finding constant c for valid PDFs
  - Uniform distribution calculations
  - CDF from PDF
  - Mean and variance calculations
  - Percentile problems

### Section 3.2: Exponential, Gamma, and Chi-Square Distributions
- **Status**: COMPLETED
- **Page**: `/src/app/chapter/3/section/2/page.tsx`
- **Components**:
  - `ExponentialGammaSimulator.tsx` - Interactive explorer for Exponential(λ), Gamma(α,β), and Chi-Square(r) with SVG PDF/CDF visualization, range probability calculator, key properties display
- **Topics Covered**:
  - Poisson-Exponential connection (interarrival times)
  - Exponential PDF, CDF (both θ and λ parameterizations)
  - Exponential mean (θ=1/λ), variance (θ²=1/λ²), MGF
  - Survival function: P(X > x) = e^(-x/θ)
  - Memoryless property: P(X > s+t | X > s) = P(X > t)
  - Gamma function Γ(α): recursive property, Γ(n)=(n-1)!, Γ(1/2)=√π
  - Gamma distribution PDF, parameters (α=shape, β=scale)
  - Gamma mean (αβ), variance (αβ²), MGF, additive property
  - Sum of independent exponentials → Gamma
  - Chi-Square as Gamma(r/2, 2), mean (r), variance (2r)
  - Chi-Square additive property, connection to squared normals
- **Practice Problems** (12 total):
  - Exponential CDF, variance, memoryless property
  - Poisson-exponential interarrival times
  - Gamma function evaluation, Gamma probability (Poisson-Gamma connection)
  - Gamma mean/variance, sum of exponentials
  - Chi-square properties, additive property
  - MGF identification, minimum of exponentials (series system)

### Remaining Sections (NOT STARTED):
  - 3.3: The Normal Distribution
  - 3.4: Additional Models

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
| PMFExplorer | DONE | `/src/components/PMFExplorer.tsx` | Interactive PMF builder with presets, editable table, SVG histogram, CDF step-function, range calculator |
| HypergeometricSimulator | DONE | `/src/components/HypergeometricSimulator.tsx` | Hypergeometric distribution simulator with parameter sliders, visual pool, draw sampling, theoretical vs observed overlay |
| FrequencyExplorer | DONE | `/src/components/FrequencyExplorer.tsx` | Data entry tool comparing observed frequencies vs theoretical PMF with overlaid histograms |
| ExpectationCalculator | DONE | `/src/components/ExpectationCalculator.tsx` | Interactive E[X], E[X²], E[u(X)] calculator with step-by-step computation, function selector, preset distributions |
| VarianceCalculator | DONE | `/src/components/VarianceCalculator.tsx` | Interactive variance/σ²/σ calculator with definition & shortcut methods, SVG histogram with μ/σ markers, MGF display |
| DistributionComparator | DONE | `/src/components/DistributionComparator.tsx` | Side-by-side distribution comparison with editable PMFs, shared axis, variance/σ ratios, 5 scenario presets |
| BinomialSimulator | DONE | `/src/components/BinomialSimulator.tsx` | Binomial distribution simulator with n/p sliders, trial animation, theoretical vs observed PMF overlay, probability calculator P(X=k), P(X≤k), P(X≥k) |
| NegativeBinomialSimulator | DONE | `/src/components/NegativeBinomialSimulator.tsx` | Geometric/Negative Binomial simulator with r/p sliders, trials-until-success animation, memoryless demonstration, P(X=k), P(X>k), P(X≤k) calculator |
| PoissonSimulator | DONE | `/src/components/PoissonSimulator.tsx` | Poisson distribution simulator with λ slider, timeline visualization, theoretical vs observed PMF histogram, P(X=k), P(X≤k), P(X>k) calculator |
| ContinuousPDFExplorer | DONE | `/src/components/ContinuousPDFExplorer.tsx` | Interactive PDF/CDF visualizer with multiple distributions, probability calculator P(a<X<b), statistics display (mean, variance, std dev) |
| ExponentialGammaSimulator | DONE | `/src/components/ExponentialGammaSimulator.tsx` | Interactive Exponential/Gamma/Chi-Square explorer with SVG PDF/CDF curves, range probability calculator, parameter sliders, key properties display |

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

*Last Updated: Chapter 3 in progress — Added Section 3.2 Exponential, Gamma, and Chi-Square Distributions (ExponentialGammaSimulator, 12 practice problems, 10 learn sections covering exponential/gamma/chi-square distributions, memoryless property, gamma function, additive properties)*
