import type { Lesson } from '@/lib/learning/types';
export const lessons: Lesson[] = [
  {
    id: '0.1',
    title: 'Calculus & notation readiness',
    summary: 'Refresh the tools that probability calculations depend on.',
    group: 'foundation',
    minutes: 20,
    objectives: [
      'Interpret sums, derivatives, and definite integrals.',
      'Use a short diagnostic to choose what to review.',
    ],
    blocks: [
      {
        title: 'Read the notation',
        body: 'Σ adds terms; ∫ adds density over an interval. P(X ≤ x) is a cumulative probability, not a density. Keep the random variable X separate from a possible value x.',
      },
      {
        title: 'Differentiate and integrate',
        body: 'For n ≠ −1, the antiderivative of xⁿ is xⁿ⁺¹/(n+1). Evaluate a definite integral by subtracting the antiderivative at its lower endpoint from its value at the upper endpoint. The derivative of e^(ax) is a·e^(ax).',
      },
      {
        title: 'Series and probability',
        body: 'For |r| < 1, 1 + r + r² + … = 1/(1−r). This often normalizes a probability mass function. A probability distribution must have nonnegative masses or density, with total probability one.',
      },
    ],
    example: {
      question: 'A density is f(x)=c x² on 0<x<2. Find c.',
      solution:
        'Integrate c x² from 0 to 2: c·8/3=1, so c=3/8. The density may exceed one at a point; its total area must equal one.',
    },
    lab: [
      'Try the questions before reviewing the formulas.',
      'If integration is difficult, redo the worked example with support 0<x<3. You should obtain c=1/9.',
      'If the series question is difficult, write out its first four terms.',
    ],
    problems: [
      {
        id: 1,
        question: 'What is ∫₀¹ 3x² dx?',
        options: ['0', '1/3', '1', '3', 'Undefined'],
        correctIndex: 2,
        explanation: 'The antiderivative is x³. At the endpoints: 1³−0³=1.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Integration',
      },
      {
        id: 2,
        question: 'What is d(e^(−2x))/dx?',
        options: ['e^(−2x)', '−e^(−2x)', '2e^(−2x)', '−2e^(−2x)', '−2x'],
        correctIndex: 3,
        explanation:
          'The chain rule contributes the derivative of −2x, which is −2.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Differentiation',
      },
      {
        id: 3,
        question: 'Find Σ from k=0 to infinity of (1/4)^k.',
        options: ['1/4', '3/4', '1', '4/3', '4'],
        correctIndex: 3,
        explanation: 'This is a geometric series: 1/(1−1/4)=4/3.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Geometric series',
      },
    ],
    formula: '∫ₐᵇ f(x) dx = F(b) − F(a), where F′ = f',
  },
  {
    id: '4.1',
    title: 'Joint probability tables',
    summary:
      'Describe two random variables together before looking at either alone.',
    group: 'multivariate',
    minutes: 20,
    objectives: [
      'Validate a joint PMF.',
      'Compute event probabilities and a joint CDF.',
    ],
    blocks: [
      {
        title: 'Read a cell',
        body: 'A joint mass p(x,y) is the probability that X=x AND Y=y. Each cell is nonnegative; all cells sum to one. A row or column label is a value, not an event probability.',
      },
      {
        title: 'Combine cells',
        body: 'For an event such as X+Y≤1, enumerate the pairs that satisfy the inequality, then add their masses. Distinct pairs are mutually exclusive.',
      },
      {
        title: 'Joint CDF',
        body: 'F(a,b)=P(X≤a,Y≤b). Sum only the cells meeting BOTH cutoffs. To obtain P(X>a,Y>b), use 1−F_X(a)−F_Y(b)+F(a,b).',
      },
    ],
    example: {
      question:
        'For rows X=0,1 and columns Y=0,1, let the table be [[0.1,0.2],[0.3,0.4]]. Find P(X+Y=1).',
      solution:
        'The qualifying cells are (0,1) and (1,0): 0.2+0.3=0.5. Do not include (1,1), which has sum 2.',
    },
    lab: [
      'In the explorer, select X=1 and Y=1. Compare the joint cell to its two marginals.',
      'Set all four weights to 1 and see the independent table.',
      'Restore weights 1,2,3,4 and explain why its entries are dependent.',
    ],
    problems: [
      {
        id: 1,
        question: 'Using [[0.1,0.2],[0.3,0.4]], what is F(0,1)?',
        options: ['0.1', '0.2', '0.3', '0.4', '0.7'],
        correctIndex: 2,
        explanation:
          'X≤0 selects row 0; Y≤1 includes both columns. Add 0.1+0.2=0.3.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Joint CDF',
      },
      {
        id: 2,
        question: 'Which table is a valid joint PMF?',
        options: [
          '[[0.2,0.2],[0.2,0.2]]',
          '[[0.1,0.2],[0.3,0.4]]',
          '[[−0.1,0.2],[0.4,0.5]]',
          '[[0.4,0.4],[0.4,0.4]]',
          '[[0,0],[0,0]]',
        ],
        correctIndex: 1,
        explanation:
          'Only the second table has nonnegative entries that sum to one.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Joint PMF',
      },
      {
        id: 3,
        question: 'Using [[0.1,0.2],[0.3,0.4]], find P(X=1 or Y=1).',
        options: ['0.4', '0.5', '0.6', '0.7', '0.9'],
        correctIndex: 4,
        explanation: 'Everything except cell (0,0) qualifies: 1−0.1=0.9.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Joint events',
      },
    ],
    simulator: 'joint',
    formula: 'F(a,b) = Σ[x≤a, y≤b] p(x,y)',
  },
  {
    id: '4.2',
    title: 'Marginals & conditional distributions',
    summary: 'Collapse a table or restrict it to the information you know.',
    group: 'multivariate',
    minutes: 20,
    objectives: [
      'Calculate marginal distributions.',
      'Normalize a conditional distribution and test independence.',
    ],
    blocks: [
      {
        title: 'Marginals',
        body: 'Add across a row to obtain p_X(x); add down a column to obtain p_Y(y). You are allowing the other variable to take any of its possible values.',
      },
      {
        title: 'Conditioning',
        body: 'To find p(X=x | Y=y), divide p(x,y) by p_Y(y), provided p_Y(y)>0. Within the selected column, the conditional probabilities sum to one. Conditioning on a zero-probability event is undefined.',
      },
      {
        title: 'Independence',
        body: 'X and Y are independent only if p(x,y)=p_X(x)p_Y(y) for EVERY pair. Finding one mismatch disproves independence. A matching pair by itself does not prove it.',
      },
    ],
    example: {
      question: 'Use [[0.1,0.2],[0.3,0.4]]. Find P(X=1 | Y=0).',
      solution:
        'Column Y=0 has probability 0.1+0.3=0.4. The selected joint mass is 0.3, so the conditional probability is 0.3/0.4=0.75.',
    },
    lab: [
      'Use a column of all zero weights and observe that its conditional probability is undefined.',
      'For weights 1,2,2,4, compare every cell with the product of its row and column marginal.',
    ],
    problems: [
      {
        id: 1,
        question: 'For [[0.1,0.2],[0.3,0.4]], what is P(Y=1)?',
        options: ['0.2', '0.3', '0.4', '0.6', '0.7'],
        correctIndex: 3,
        explanation: 'Add the Y=1 column: 0.2+0.4=0.6.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Marginals',
      },
      {
        id: 2,
        question: 'For the same table, what is P(Y=1 | X=1)?',
        options: ['0.4', '0.6', '4/7', '2/3', '0.7'],
        correctIndex: 2,
        explanation: 'The numerator is 0.4 and row X=1 has mass 0.7: 4/7.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Conditional distributions',
      },
      {
        id: 3,
        question: 'For the same table, are X and Y independent?',
        options: [
          'Yes, because all cells are positive',
          'Yes, because the total is one',
          'No, because 0.1 ≠ 0.3×0.4',
          'No, because X and Y have equal supports',
          'Cannot determine',
        ],
        correctIndex: 2,
        explanation:
          'p(0,0)=0.1 but p_X(0)p_Y(0)=0.3×0.4=0.12. One mismatch is enough.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Independence',
      },
    ],
    simulator: 'joint',
    formula: 'p(x | y) = p(x,y) / p_Y(y)',
  },
  {
    id: '4.3',
    title: 'Conditional moments',
    summary: 'Compute an average or spread inside a restricted population.',
    group: 'multivariate',
    minutes: 20,
    objectives: [
      'Calculate conditional expectation, variance, and standard deviation.',
      'Connect conditional and unconditional expectation.',
    ],
    blocks: [
      {
        title: 'Conditional mean',
        body: 'Treat p(x|y) as a new PMF. Then E[X|Y=y]=Σ x·p(x|y). The conditional mean can change as the observed value y changes.',
      },
      {
        title: 'Conditional spread',
        body: 'Compute E[X²|Y=y], then subtract E[X|Y=y]² to find conditional variance. Its nonnegative square root is the conditional standard deviation.',
      },
      {
        title: 'Average the averages',
        body: 'E[X]=Σ_y E[X|Y=y]p_Y(y). Weight the group means by group probabilities; do not simply average group means unless the groups are equally likely.',
      },
    ],
    example: {
      question: 'Using [[0.1,0.2],[0.3,0.4]], find E[X|Y=0] and Var(X|Y=0).',
      solution:
        'Conditionally X is Bernoulli with P(X=1|Y=0)=0.75. Mean=0.75; second moment=0.75; variance=0.75−0.75²=0.1875.',
    },
    lab: [
      'Select each column in the joint explorer and compute its conditional mean.',
      'Weight those means by the column totals and check that the result equals P(X=1).',
    ],
    problems: [
      {
        id: 1,
        question:
          'A conditional PMF gives P(X=0|Y=2)=0.2 and P(X=3|Y=2)=0.8. Find E[X|Y=2].',
        options: ['0.8', '1.5', '2.4', '3', '3.8'],
        correctIndex: 2,
        explanation: '0×0.2+3×0.8=2.4.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Conditional mean',
      },
      {
        id: 2,
        question: 'For that conditional PMF, find Var(X|Y=2).',
        options: ['0.16', '0.8', '1.44', '2.4', '7.2'],
        correctIndex: 2,
        explanation: 'E[X²|Y=2]=9×0.8=7.2. Subtract 2.4² to obtain 1.44.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Conditional variance',
      },
      {
        id: 3,
        question:
          'Two groups have probabilities 0.3 and 0.7 and conditional means 2 and 6. Find E[X].',
        options: ['3', '4', '4.8', '5.2', '8'],
        correctIndex: 2,
        explanation: '0.3×2+0.7×6=4.8.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Total expectation',
      },
    ],
    simulator: 'joint',
    formula: 'Var(X | Y=y) = E[X² | Y=y] − E[X | Y=y]²',
  },
  {
    id: '4.4',
    title: 'Covariance & correlation',
    summary: 'Measure how two discrete quantities move together.',
    group: 'multivariate',
    minutes: 20,
    objectives: [
      'Calculate E[XY] from a joint table.',
      'Distinguish independence from zero correlation.',
    ],
    blocks: [
      {
        title: 'Covariance',
        body: 'E[XY]=Σ_x Σ_y xy p(x,y). Cov(X,Y)=E[XY]−E[X]E[Y]. A positive value means large values tend to occur together; covariance depends on units.',
      },
      {
        title: 'Correlation',
        body: 'Divide covariance by σ_Xσ_Y to obtain correlation. Its value is between −1 and 1 when both standard deviations are positive. If either variance is zero, correlation is undefined.',
      },
      {
        title: 'A frequent trap',
        body: 'Independence implies zero covariance when the moments exist. Zero covariance does not imply independence: a symmetric X and Y=X² can be uncorrelated while completely related.',
      },
    ],
    example: {
      question: 'For [[0.1,0.2],[0.3,0.4]], compute covariance.',
      solution:
        'E[X]=0.7, E[Y]=0.6, and E[XY]=0.4. Thus covariance=0.4−0.7×0.6=−0.02. Correlation is −0.02/√(0.21×0.24), approximately −0.0891.',
    },
    lab: [
      'Try diagonal-only weights 1,0,0,1. Explain why correlation is 1.',
      'Try 0,1,1,0. Explain why correlation is −1.',
      'Set X constant by zeroing a row. Why is correlation undefined?',
    ],
    problems: [
      {
        id: 1,
        question: 'E[X]=2, E[Y]=3 and E[XY]=7. Find Cov(X,Y).',
        options: ['−1', '0', '1', '6', '7'],
        correctIndex: 2,
        explanation: '7−2×3=1.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Covariance',
      },
      {
        id: 2,
        question: 'Cov(X,Y)=−3, Var(X)=4, Var(Y)=9. Find correlation.',
        options: ['−1', '−0.5', '−0.25', '0.5', '−3'],
        correctIndex: 1,
        explanation: 'Divide by √4×√9=6. Correlation=−3/6=−0.5.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Correlation',
      },
      {
        id: 3,
        question: 'Which statement always holds when second moments exist?',
        options: [
          'Uncorrelated variables are independent',
          'Independent variables have covariance zero',
          'Correlation zero means X=Y',
          'Covariance is always nonnegative',
          'Correlation exists for constant variables',
        ],
        correctIndex: 1,
        explanation:
          'Independence gives E[XY]=E[X]E[Y], hence covariance zero. The converse fails.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Independence and correlation',
      },
    ],
    simulator: 'joint',
    formula: 'Cov(X,Y) = E[XY] − E[X]E[Y]; ρ = Cov(X,Y)/(σ_Xσ_Y)',
  },
  {
    id: '5.1',
    title: 'Sums & linear combinations',
    summary:
      'Combine independent risks without confusing variance and standard deviation.',
    group: 'multivariate',
    minutes: 20,
    objectives: [
      'Compute moments of a weighted sum.',
      'Find a discrete sum distribution and combine independent normals.',
    ],
    blocks: [
      {
        title: 'Moments',
        body: 'E[aX+bY+c]=aE[X]+bE[Y]+c. For independent variables, Var(aX+bY+c)=a²Var(X)+b²Var(Y). Without independence, add 2abCov(X,Y).',
      },
      {
        title: 'Distribution of a discrete sum',
        body: 'For independent discrete X,Y, P(X+Y=s)=Σ_x p_X(x)p_Y(s−x). Enumerate pairs, multiply their probabilities, then add pairs with the same sum.',
      },
      {
        title: 'Normal sums',
        body: 'A linear combination of independent normal variables is normal. Compute its mean and variance first, take the square root for its standard deviation, then standardize. A negative coefficient still contributes a positive squared coefficient to variance.',
      },
    ],
    example: {
      question:
        'Independent X,Y have means 2,3 and variances 4,9. Find moments of Z=2X−Y+5.',
      solution:
        'E[Z]=4−3+5=6. Var(Z)=4×4+9=25, so SD(Z)=5. If X,Y are normal, Z is N(6,25), using variance as the second parameter.',
    },
    lab: [
      'Simulate sums of fair dice with n=2. Why are middle values more likely?',
      'Compare a sum of n dice with its average. Check how the mean and standard deviation scale.',
    ],
    problems: [
      {
        id: 1,
        question:
          'Independent Bernoulli X,Y have success probability 0.5. Find P(X+Y=1).',
        options: ['0.125', '0.25', '0.5', '0.75', '1'],
        correctIndex: 2,
        explanation:
          'The disjoint cases (0,1),(1,0) each have probability 0.25. Total=0.5.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Discrete sums',
      },
      {
        id: 2,
        question: 'Independent X,Y have variances 2 and 3. Find Var(3X−2Y).',
        options: ['0', '5', '12', '18', '30'],
        correctIndex: 4,
        explanation: '3²×2+(−2)²×3=18+12=30.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Linear-combination moments',
      },
      {
        id: 3,
        question:
          'Independent normals have means 10,20 and variances 4,5. What is the distribution of their sum?',
        options: ['N(30,9)', 'N(30,3)', 'N(10,9)', 'N(30,81)', 'Not normal'],
        correctIndex: 0,
        explanation:
          'Means add to 30; variances add to 9. Here N(μ,σ²) uses variance.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Normal sums',
      },
    ],
    simulator: 'sampling',
    formula: 'Var(Σ aᵢXᵢ) = Σ aᵢ²Var(Xᵢ), for independent Xᵢ',
  },
  {
    id: '5.2',
    title: 'Order statistics',
    summary: 'Study the smallest, largest, and ranked observations.',
    group: 'multivariate',
    minutes: 20,
    objectives: [
      'Find distributions of minima and maxima.',
      'Use ranks and the joint density of extreme observations.',
    ],
    blocks: [
      {
        title: 'Minima and maxima',
        body: 'For independent observations with CDFs Fᵢ, P(max≤x)=∏Fᵢ(x); P(min>x)=∏(1−Fᵢ(x)). For identically distributed samples these become F(x)ⁿ and (1−F(x))ⁿ.',
      },
      {
        title: 'The kth observation',
        body: 'For n independent observations with common continuous CDF F, P(X_(k)≤x)=Σ from j=k to n of C(n,j)F(x)^j(1−F(x))^(n−j). Count how many observations fall below x. The kth order statistic from Uniform(0,1) is Beta(k,n+1−k).',
      },
      {
        title: 'Joint order statistics',
        body: 'For an i.i.d. continuous sample with density f, the joint density of minimum u and maximum v is n(n−1)[F(v)−F(u)]^(n−2)f(u)f(v), for u<v. One observation occupies each endpoint and the others lie in between. More generally, the joint density of ranks r<s is n!/[(r−1)!(s−r−1)!(n−s)!] × F(u)^(r−1)[F(v)−F(u)]^(s−r−1)[1−F(v)]^(n−s)f(u)f(v).',
      },
    ],
    example: {
      question:
        'Three independent Uniform(0,1) observations are drawn. Find P(min>0.2 and max≤0.8).',
      solution:
        'Every observation must fall in (0.2,0.8], an interval of probability 0.6. Independence gives 0.6³=0.216.',
    },
    lab: [
      'Choose Uniform(0,1) samples in the simulator. Compare minima and maxima for n=2 and n=10.',
      'Explain why a larger sample tends to produce both a smaller minimum and a larger maximum.',
    ],
    problems: [
      {
        id: 1,
        question:
          'For four independent Uniform(0,1) observations, find P(max≤0.5).',
        options: ['0.5', '0.25', '0.125', '0.0625', '0.9375'],
        correctIndex: 3,
        explanation: 'All four observations must be ≤0.5: 0.5⁴=0.0625.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Maximum',
      },
      {
        id: 2,
        question:
          'For three independent Uniform(0,1) observations, find P(min>0.2).',
        options: ['0.008', '0.2', '0.488', '0.512', '0.8'],
        correctIndex: 3,
        explanation: 'All three exceed 0.2: 0.8³=0.512.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Minimum',
      },
      {
        id: 3,
        question:
          'The second order statistic from five independent Uniform(0,1) observations has which distribution?',
        options: [
          'Beta(2,3)',
          'Beta(2,4)',
          'Beta(2,5)',
          'Beta(4,2)',
          'Uniform(0,1)',
        ],
        correctIndex: 1,
        explanation: 'The kth rank has Beta(k,n+1−k): Beta(2,4).',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Rank distributions',
      },
    ],
    simulator: 'sampling',
    formula: 'P(max≤x)=F(x)ⁿ; P(min>x)=[1−F(x)]ⁿ (i.i.d. sample)',
  },
  {
    id: '5.3',
    title: 'Central Limit Theorem',
    summary:
      'Approximate sums and averages when exact calculations are difficult.',
    group: 'multivariate',
    minutes: 20,
    objectives: [
      'Standardize a sum or average correctly.',
      'Recognize approximation conditions and continuity correction.',
    ],
    blocks: [
      {
        title: 'The approximation',
        body: 'For i.i.d. variables with finite mean μ and finite positive variance σ², a sufficiently large sum is approximately normal with mean nμ and variance nσ². The average has mean μ and variance σ²/n.',
      },
      {
        title: 'Sample size is not a guarantee',
        body: 'There is no universal sample size that makes every tail approximation accurate. Skewness, heavy tails, and how far into the tail you look matter. The finite-variance and independence assumptions are essential.',
      },
      {
        title: 'Discrete boundaries',
        body: 'For integer-valued sums with unit spacing, use a continuity correction: P(S≤k)≈P(N≤k+0.5). For P(S≥k), use k−0.5. Standardize only after adjusting the boundary.',
      },
    ],
    example: {
      question:
        '100 independent claim amounts each have mean 10 and SD 4. Approximate P(total≤1080).',
      solution:
        'The total has mean 1000 and SD √100×4=40. z=(1080−1000)/40=2. Thus the probability is approximately Φ(2)=0.9772. No integer continuity correction is implied for continuous claim amounts.',
    },
    lab: [
      'Simulate means of Uniform(0,1) samples for n=2,10,50. Compare spread.',
      'Check that the predicted standard deviation equals √(1/12n).',
    ],
    problems: [
      {
        id: 1,
        question:
          'For n=64 i.i.d. observations with mean 5 and SD 8, what is the SD of the sample mean?',
        options: ['1', '5', '8', '64', '512'],
        correctIndex: 0,
        explanation: 'σ/√n=8/8=1.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'CLT averages',
      },
      {
        id: 2,
        question: 'For a Binomial(100,0.5), which z approximates P(X≤55)?',
        options: [
          '(55−50)/25',
          '(55.5−50)/5',
          '(54.5−50)/5',
          '(55.5−50)/25',
          '(55−50)/50',
        ],
        correctIndex: 1,
        explanation: 'Mean=50, variance=25, SD=5; use upper boundary 55.5.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Continuity correction',
      },
      {
        id: 3,
        question: 'Which assumption supports the usual i.i.d. CLT?',
        options: [
          'Only identical means',
          'Infinite variance',
          'Finite positive variance',
          'A sample size of exactly 30',
          'Perfect dependence',
        ],
        correctIndex: 2,
        explanation:
          'The usual i.i.d. CLT assumes finite mean and finite positive variance.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'CLT conditions',
      },
    ],
    simulator: 'sampling',
    formula: 'Z = (Sₙ − nμ)/(σ√n); SD(X̄)=σ/√n',
  },
  {
    id: '6.1',
    title: 'Losses, deductibles & limits',
    summary: 'Translate a policy into a payment function.',
    group: 'univariate',
    minutes: 20,
    objectives: [
      'Distinguish loss from payment.',
      'Apply a deductible and a maximum payment.',
    ],
    blocks: [
      {
        title: 'Define the contract',
        body: 'X is the loss. With ordinary deductible d and maximum PAYMENT L, Y=min(max(X−d,0),L). A limit on covered LOSS is a different contract; read the words before choosing a formula.',
      },
      {
        title: 'Piecewise behavior',
        body: 'Below d the insurer pays zero. Between d and d+L the insurer pays X−d. Above d+L the payment is capped at L. Continuous losses can create point masses at payment zero and at the cap.',
      },
      {
        title: 'Per loss vs per payment',
        body: 'E[Y] averages over all losses, including zero payments. E[Y|Y>0] averages only positive payments. If P(Y>0)>0, E[Y|Y>0]=E[Y]/P(Y>0).',
      },
    ],
    example: {
      question:
        'A loss is $900, the ordinary deductible is $200, and the maximum payment is $500. Find payment.',
      solution:
        'The loss after deductible is $700. Capping the PAYMENT at $500 gives Y=$500. The insured bears the remaining $400.',
    },
    lab: [
      'Set deductible 200, insurer share 100%, payment cap 500, and inflation 0% in the calculator.',
      'Try losses of 100,500,1000. Identify which part of the payment function applies.',
    ],
    problems: [
      {
        id: 1,
        question:
          'X=600, ordinary deductible=100, maximum payment=400. Find Y.',
        options: ['100', '300', '400', '500', '600'],
        correctIndex: 2,
        explanation: 'min(max(600−100,0),400)=400.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Payment functions',
      },
      {
        id: 2,
        question: 'E[Y]=60 and P(Y>0)=0.3. Find E[Y|Y>0].',
        options: ['18', '60', '100', '180', '200'],
        correctIndex: 4,
        explanation:
          '60/0.3=200. The numerator already averages over zero payments.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Per loss vs per payment',
      },
      {
        id: 3,
        question:
          'A loss of 80 has an ordinary deductible of 100. What is the insurer payment?',
        options: ['−20', '0', '20', '80', '100'],
        correctIndex: 1,
        explanation:
          'The positive-part rule prevents negative payments: max(80−100,0)=0.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Deductibles',
      },
    ],
    simulator: 'insurance',
    formula: 'Y = min(max(X−d,0),L), where L is maximum payment',
  },
  {
    id: '6.2',
    title: 'Coinsurance & inflation',
    summary: 'Apply policy adjustments in the specified order.',
    group: 'univariate',
    minutes: 20,
    objectives: [
      'Interpret insurer participation percentages.',
      'Distinguish inflation in losses from changes to policy terms.',
    ],
    blocks: [
      {
        title: 'Coinsurance',
        body: 'If the insurer pays fraction c after the deductible, the uncapped payment is c·max(X−d,0). If the policy quotes the insured share instead, convert it to the insurer share first.',
      },
      {
        title: 'Inflation',
        body: 'With loss inflation i, replace X with (1+i)X. Do not automatically inflate deductibles or limits unless the contract says so. Fixed deductibles change the share of losses that generate payments.',
      },
      {
        title: 'Order matters',
        body: 'In this lesson the cap is applied AFTER insurer participation: Y=min(c·max((1+i)X−d,0),L). Capping a covered loss before participation is a different policy. State the convention in every calculation.',
      },
    ],
    example: {
      question:
        'Original loss $1000, inflation 10%, deductible $100, insurer share 80%, maximum payment $700. Find payment.',
      solution:
        'Inflated loss=$1100. Subtract deductible to get $1000; multiply by 0.8 to get $800; apply the final payment cap to obtain $700.',
    },
    lab: [
      'Use the calculator with the example values.',
      'Remove the effect of the cap by setting it to 2000. Payment should become 800.',
      'Increase inflation while keeping the deductible fixed and observe when payment reaches the cap.',
    ],
    problems: [
      {
        id: 1,
        question:
          'Loss=1000, deductible=200, insurer pays 75%, no binding cap. Find payment.',
        options: ['150', '200', '600', '750', '800'],
        correctIndex: 2,
        explanation: '0.75×(1000−200)=600.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Coinsurance',
      },
      {
        id: 2,
        question:
          'Loss=500 before 20% inflation; fixed deductible=100 and insurer share=100%. No binding cap. Find payment.',
        options: ['380', '400', '480', '500', '600'],
        correctIndex: 3,
        explanation:
          'Inflate the loss first: 500×1.2=600. Subtract 100 to get 500.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Inflation',
      },
      {
        id: 3,
        question:
          'If the insured pays 20% of the amount after deductible, what insurer share should you use?',
        options: ['0.2', '0.5', '0.8', '1', '1.2'],
        correctIndex: 2,
        explanation: 'Insurer and insured shares add to one: 1−0.2=0.8.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Policy interpretation',
      },
    ],
    simulator: 'insurance',
    formula: 'Y = min(c·max((1+i)X−d,0),L)',
  },
  {
    id: '6.3',
    title: 'Payment moments & risk',
    summary:
      'Calculate the average and variability of what the insurer actually pays.',
    group: 'univariate',
    minutes: 20,
    objectives: [
      'Calculate payment mean, variance, and standard deviation.',
      'Compare loss and payment moments, including coefficient of variation.',
    ],
    blocks: [
      {
        title: 'Transform first',
        body: 'For discrete losses, list each loss x, its probability, and its payment g(x). Then E[Y]=Σg(x)p(x) and E[Y²]=Σg(x)²p(x). Distinct losses may produce the same payment.',
      },
      {
        title: 'Continuous losses',
        body: 'Integrate g(x)f(x) for the first moment and g(x)²f(x) for the second. Split the integral at the deductible and cap thresholds. Alternatively, for nonnegative Y, E[Y]=∫₀∞P(Y>y)dy.',
      },
      {
        title: 'Summarize spread',
        body: 'Var(Y)=E[Y²]−E[Y]² and SD(Y)=√Var(Y). For positive mean, CV(Y)=SD(Y)/E[Y]. Deductibles and caps are nonlinear, so you cannot generally subtract a deductible from the mean or leave the loss variance unchanged.',
      },
    ],
    example: {
      question:
        'Losses 0,100,300 have probabilities 0.5,0.3,0.2. Deductible=100; no binding cap. Find payment moments.',
      solution:
        'Payments are 0,0,200. E[Y]=40; E[Y²]=8000; Var(Y)=8000−1600=6400; SD(Y)=80; CV=2. Payment occurs with probability 0.2, so mean per positive payment=200.',
    },
    lab: [
      'Write a three-row loss/payment table for the example.',
      'Apply a maximum payment of 100. Recalculate mean=20 and variance=1600.',
      'Explain why the loss mean of 90 does not imply a negative payment mean after a 100 deductible.',
    ],
    problems: [
      {
        id: 1,
        question:
          'Payments are 0 with probability 0.8 and 100 with probability 0.2. Find E[Y].',
        options: ['10', '20', '40', '80', '100'],
        correctIndex: 1,
        explanation: '0×0.8+100×0.2=20.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Payment expectation',
      },
      {
        id: 2,
        question: 'For the same payment distribution, find Var(Y).',
        options: ['20', '400', '1600', '2000', '10000'],
        correctIndex: 2,
        explanation: 'E[Y²]=2000 and E[Y]²=400, so variance=1600.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Payment variance',
      },
      {
        id: 3,
        question:
          'Mean payment=20 and variance=1600. Find coefficient of variation.',
        options: ['0.5', '1', '2', '4', '80'],
        correctIndex: 2,
        explanation: 'SD=40; CV=40/20=2.',
        hint: 'Start by identifying what is given and what you need to find.',
        topic: 'Coefficient of variation',
      },
    ],
    simulator: 'insurance',
    formula: 'E[Y]=Σg(x)p(x); Var(Y)=E[Y²]−E[Y]²; CV=SD(Y)/E[Y]',
  },
];
