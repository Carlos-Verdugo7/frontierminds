import { moments, payment } from './math';

export const lossPortfolio = [
  { loss: 250, probability: 0.4 },
  { loss: 750, probability: 0.3 },
  { loss: 1500, probability: 0.2 },
  { loss: 3000, probability: 0.1 },
] as const;

export const startingContract = { deductible: 500, cap: 1500 };
export function readDeductible(value?: string | string[]) {
  if (typeof value !== 'string' || !/^\d{1,4}$/.test(value)) return startingContract.deductible;
  const amount = Number(value);
  return amount <= 3000 && amount % 250 === 0 ? amount : startingContract.deductible;
}
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
const wholeCurrency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
export function dollars(value: number) {
  const rounded = Math.round(value * 100) / 100 || 0;
  return Number.isInteger(rounded) ? wholeCurrency.format(rounded) : currency.format(rounded);
}

export function priceContract(deductible: number, cap: number) {
  const rows = lossPortfolio.map(({ loss, probability }) => ({
    loss, probability, paid: payment(loss, deductible, 1, cap, 0),
  }));
  const mean = moments(rows.map(row => row.paid), rows.map(row => row.probability)).mean;
  const paidProbability = rows.reduce((sum, row) => sum + (row.paid > 0 ? row.probability : 0), 0);
  return { rows, mean, paidProbability, meanWhenPaid: paidProbability ? mean / paidProbability : null };
}

export type PricedContract = ReturnType<typeof priceContract>;
// Fit ordinary least squares on the three other severities, treating each training row equally.
export function predictHeldOut(contract: PricedContract, heldOutLoss: number) {
  const training = contract.rows.filter(row => row.loss !== heldOutLoss);
  const meanLoss = training.reduce((sum, row) => sum + row.loss, 0) / training.length;
  const meanPaid = training.reduce((sum, row) => sum + row.paid, 0) / training.length;
  const cross = training.reduce((sum, row) => sum + (row.loss - meanLoss) * (row.paid - meanPaid), 0);
  const squares = training.reduce((sum, row) => sum + (row.loss - meanLoss) ** 2, 0);
  return meanPaid + cross / squares * (heldOutLoss - meanLoss);
}

export type AuditFinding = 'matches' | 'overstates' | 'undefined';

export function auditFinding(contract: PricedContract): AuditFinding {
  if (contract.meanWhenPaid === null) return 'undefined';
  return contract.rows.every(row => row.paid > 0) ? 'matches' : 'overstates';
}

// Use the same sequence of losses for both contracts and for every change to the controls.
export function sampleContracts(deductible: number, cap: number, count: number, seed: number) {
  let state = seed >>> 0;
  const contract = priceContract(deductible, cap);
  const baseline = priceContract(0, cap);
  let cumulative = 0;
  const cutoffs = contract.rows.map(row => (cumulative += row.probability));
  cutoffs[cutoffs.length - 1] = 1;
  let total = 0;
  let baselineTotal = 0;
  for (let draw = 0; draw < count; draw++) {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    const uniform = state / 4294967296;
    const index = cutoffs.findIndex(cutoff => uniform < cutoff);
    total += contract.rows[index].paid;
    baselineTotal += baseline.rows[index].paid;
  }
  return { mean: total / count, baselineMean: baselineTotal / count, reduction: (baselineTotal - total) / count };
}
