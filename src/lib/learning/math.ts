export function jointStats(weights: number[]) {
  const total = weights.reduce((a, b) => a + b, 0);
  if (
    weights.length !== 4 ||
    weights.some((w) => !Number.isFinite(w) || w < 0) ||
    total <= 0
  )
    return null;
  const p = weights.map((w) => w / total);
  const rows = [p[0] + p[1], p[2] + p[3]],
    cols = [p[0] + p[2], p[1] + p[3]];
  const covariance = p[3] - rows[1] * cols[1];
  const varianceX = rows[1] * (1 - rows[1]),
    varianceY = cols[1] * (1 - cols[1]);
  return {
    p,
    rows,
    cols,
    covariance,
    varianceX,
    varianceY,
    correlation:
      varianceX > 0 && varianceY > 0
        ? covariance / Math.sqrt(varianceX * varianceY)
        : null,
    independent: p.every(
      (value, i) =>
        Math.abs(value - rows[Math.floor(i / 2)] * cols[i % 2]) < 1e-10,
    ),
  };
}
export function payment(
  loss: number,
  deductible: number,
  share: number,
  cap: number,
  inflation: number,
) {
  return Math.min(
    share * Math.max(loss * (1 + inflation) - deductible, 0),
    cap,
  );
}
export function moments(values: number[], probabilities: number[]) {
  const mean = values.reduce((s, x, i) => s + x * probabilities[i], 0);
  const second = values.reduce((s, x, i) => s + x * x * probabilities[i], 0);
  const variance = Math.max(0, second - mean * mean);
  return { mean, variance, sd: Math.sqrt(variance) };
}
