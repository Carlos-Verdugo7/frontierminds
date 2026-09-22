'use client';
import { useState } from 'react';
import { jointStats, payment, moments } from '@/lib/learning/math';
const panel = 'rounded-xl border border-slate-700 bg-slate-900 p-5 space-y-5';
const control = 'rounded-lg border border-slate-600 bg-slate-950 p-2 w-full';
const button = 'rounded-lg bg-teal-300 text-slate-950 px-4 py-2 font-semibold';
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-800 p-4">
      <dt className="text-sm text-slate-400">{label}</dt>
      <dd className="text-xl text-teal-200 mt-1">{value}</dd>
    </div>
  );
}
export function JointExplorer() {
  const [weights, setWeights] = useState([1, 2, 3, 4]);
  const [row, setRow] = useState(1);
  const [col, setCol] = useState(1);
  const stats = jointStats(weights);
  const conditional =
    stats && stats.cols[col] > 0
      ? stats.p[row * 2 + col] / stats.cols[col]
      : null;
  return (
    <section className={panel} aria-label="Joint probability explorer">
      <h3 className="text-2xl font-semibold">A table you can reason with</h3>
      <p className="text-slate-300">
        Edit nonnegative weights. The explorer divides each weight by the total
        to create a probability table. Select a row and column to inspect an
        event.
      </p>
      <div className="flex flex-wrap gap-3">
        {[
          [1, 2, 3, 4],
          [1, 1, 1, 1],
          [1, 0, 0, 1],
          [0, 1, 1, 0],
        ].map((preset, i) => (
          <button
            className="border border-slate-600 rounded-lg px-3 py-2"
            key={i}
            onClick={() => setWeights(preset)}
          >
            {
              ['Dependent', 'Independent', 'Move together', 'Move oppositely'][
                i
              ]
            }
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-center">
          <caption className="text-left text-sm text-slate-400 mb-3">
            X labels rows; Y labels columns. Each cell shows its editable weight
            and normalized probability.
          </caption>
          <thead>
            <tr>
              <th scope="col">X / Y</th>
              {[0, 1].map((y) => (
                <th scope="col" key={y}>
                  <button
                    aria-pressed={col === y}
                    className={`p-3 rounded ${col === y ? 'bg-teal-950 text-teal-200' : ''}`}
                    onClick={() => setCol(y)}
                  >
                    Y = {y}
                  </button>
                </th>
              ))}
              <th scope="col">P(X=x)</th>
            </tr>
          </thead>
          <tbody>
            {[0, 1].map((x) => (
              <tr key={x}>
                <th scope="row">
                  <button
                    aria-pressed={row === x}
                    onClick={() => setRow(x)}
                    className={`p-3 rounded ${row === x ? 'bg-teal-950 text-teal-200' : ''}`}
                  >
                    X = {x}
                  </button>
                </th>
                {[0, 1].map((y) => (
                  <td
                    key={y}
                    className={`p-3 border border-slate-700 ${x === row && y === col ? 'bg-teal-950' : 'bg-slate-800'}`}
                  >
                    <input
                      type="number"
                      min="0"
                      step="1"
                      aria-label={`Weight X=${x}, Y=${y}`}
                      className={control + ' max-w-28'}
                      value={weights[x * 2 + y]}
                      onChange={(e) =>
                        setWeights(
                          weights.map((v, i) =>
                            i === x * 2 + y
                              ? Math.max(0, Number(e.target.value) || 0)
                              : v,
                          ),
                        )
                      }
                    />
                    <p className="mt-2">
                      p = {stats?.p[x * 2 + y].toFixed(4) ?? '—'}
                    </p>
                  </td>
                ))}
                <td>{stats?.rows[x].toFixed(4) ?? '—'}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" className="py-4">
                P(Y=y)
              </th>
              {[0, 1].map((y) => (
                <td key={y}>{stats?.cols[y].toFixed(4) ?? '—'}</td>
              ))}
              <td>{stats ? '1.0000' : '—'}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      {!stats ? (
        <p role="alert" className="text-amber-300">
          At least one weight must be positive.
        </p>
      ) : (
        <>
          <dl
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3"
            aria-live="polite"
          >
            <Metric
              label={`P(X=${row}, Y=${col})`}
              value={stats.p[row * 2 + col].toFixed(4)}
            />
            <Metric
              label={`P(X=${row} | Y=${col})`}
              value={
                conditional === null ? 'Undefined' : conditional.toFixed(4)
              }
            />
            <Metric label="Covariance" value={stats.covariance.toFixed(4)} />
            <Metric
              label="Correlation"
              value={
                stats.correlation === null
                  ? 'Undefined'
                  : stats.correlation.toFixed(4)
              }
            />
            <Metric
              label={`E[X | Y=${col}]`}
              value={
                stats.cols[col] > 0
                  ? (stats.p[2 + col] / stats.cols[col]).toFixed(4)
                  : 'Undefined'
              }
            />
            <Metric
              label="Independent?"
              value={
                stats.independent
                  ? 'Yes — every cell factors'
                  : 'No — at least one cell differs'
              }
            />
          </dl>
          <p className="text-sm text-slate-300">
            Conditioning on Y={col}: divide the selected cell by the column
            total {stats.cols[col].toFixed(4)}. A zero column has no defined
            conditional distribution.
          </p>
        </>
      )}
    </section>
  );
}
type Mode = 'sum' | 'mean' | 'min' | 'max';
export function SamplingExplorer() {
  const [n, setN] = useState(5);
  const [distribution, setDistribution] = useState('uniform');
  const [mode, setMode] = useState<Mode>('mean');
  const [samples, setSamples] = useState<number[]>([]);
  const run = () => {
    const batch = Array.from({ length: 1000 }, () => {
      const values = Array.from({ length: n }, () =>
        distribution === 'uniform'
          ? Math.random()
          : 1 + Math.floor(Math.random() * 6),
      );
      return mode === 'min'
        ? Math.min(...values)
        : mode === 'max'
          ? Math.max(...values)
          : values.reduce((a, b) => a + b, 0) / (mode === 'mean' ? n : 1);
    });
    setSamples((old) => [...old, ...batch].slice(-10000));
  };
  const low = distribution === 'uniform' ? 0 : mode === 'sum' ? n : 1;
  const high =
    distribution === 'uniform'
      ? mode === 'sum'
        ? n
        : 1
      : mode === 'sum'
        ? 6 * n
        : 6;
  const bins = Array.from({ length: 20 }, () => 0);
  for (const x of samples)
    bins[Math.min(19, Math.floor(((x - low) / (high - low)) * 20))]++;
  const max = Math.max(1, ...bins);
  const empirical = samples.length
    ? moments(
        samples,
        samples.map(() => 1 / samples.length),
      )
    : null;
  const baseMean = distribution === 'uniform' ? 0.5 : 3.5,
    baseVariance = distribution === 'uniform' ? 1 / 12 : 35 / 12;
  return (
    <section className={panel}>
      <h3 className="text-2xl font-semibold">
        From observations to a distribution
      </h3>
      <div className="grid sm:grid-cols-3 gap-4">
        <label>
          Source
          <select
            className={control}
            value={distribution}
            onChange={(e) => {
              setDistribution(e.target.value);
              setSamples([]);
            }}
          >
            <option value="uniform">Uniform(0,1)</option>
            <option value="dice">Fair six-sided die</option>
          </select>
        </label>
        <label>
          Statistic
          <select
            className={control}
            value={mode}
            onChange={(e) => {
              setMode(e.target.value as Mode);
              setSamples([]);
            }}
          >
            {['sum', 'mean', 'min', 'max'].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label>
          Observations per sample: {n}
          <input
            className="w-full"
            type="range"
            min="1"
            max="50"
            value={n}
            onChange={(e) => {
              setN(Number(e.target.value));
              setSamples([]);
            }}
          />
        </label>
      </div>
      <div className="flex flex-wrap gap-3">
        <button className={button} onClick={run}>
          Simulate 1,000 samples
        </button>
        <button
          className="border border-slate-600 rounded-lg px-4 py-2"
          onClick={() => setSamples([])}
        >
          Clear samples
        </button>
      </div>
      <p className="text-slate-400 text-sm">
        Each sample draws {n} independent observations and records their {mode}.
        Up to 10,000 recent sample statistics are retained.
      </p>
      <svg
        viewBox="0 0 640 220"
        role="img"
        aria-label={`Histogram of ${samples.length} simulated sample ${mode} values`}
        className="w-full bg-slate-950 rounded-xl"
      >
        <line x1="30" y1="185" x2="620" y2="185" stroke="#64748b" />
        {bins.map((count, i) => (
          <rect
            key={i}
            x={31 + i * 29}
            y={185 - (155 * count) / max}
            width="26"
            height={(155 * count) / max}
            fill="#5eead4"
          >
            <title>
              {count} samples in bin {i + 1}
            </title>
          </rect>
        ))}
        <text x="30" y="208" fill="#cbd5e1">
          {low}
        </text>
        <text x="580" y="208" fill="#cbd5e1">
          {high}
        </text>
        {!samples.length && (
          <text x="150" y="90" fill="#94a3b8">
            Run a simulation to populate the histogram.
          </text>
        )}
      </svg>
      <dl className="grid sm:grid-cols-2 gap-3" aria-live="polite">
        <Metric
          label={`${samples.length} samples · observed mean`}
          value={empirical?.mean.toFixed(4) ?? '—'}
        />
        <Metric
          label="Observed standard deviation"
          value={empirical?.sd.toFixed(4) ?? '—'}
        />
        {(mode === 'sum' || mode === 'mean') && (
          <>
            <Metric
              label="Theoretical mean"
              value={(baseMean * (mode === 'sum' ? n : 1)).toFixed(4)}
            />
            <Metric
              label="Theoretical standard deviation"
              value={Math.sqrt(
                baseVariance * (mode === 'sum' ? n : 1 / n),
              ).toFixed(4)}
            />
          </>
        )}
      </dl>
      <p className="text-sm text-slate-400">
        Simulation estimates vary. They illustrate the formulas and do not
        replace exact calculations.
      </p>
    </section>
  );
}
export function InsuranceExplorer() {
  const [loss, setLoss] = useState(1000),
    [deductible, setDeductible] = useState(200),
    [share, setShare] = useState(80),
    [cap, setCap] = useState(700),
    [inflation, setInflation] = useState(10);
  const calculate = (x: number) =>
    payment(x, deductible, share / 100, cap, inflation / 100);
  const xs = [0, 500, 2000],
    ps = [0.5, 0.3, 0.2],
    ys = xs.map(calculate),
    stats = moments(ys, ps),
    lossStats = moments(
      xs.map((x) => x * (1 + inflation / 100)),
      ps,
    );
  const points = Array.from(
    { length: 101 },
    (_, i) => `${30 + i * 5.7},${185 - (calculate(i * 30) / 3300) * 155}`,
  ).join(' ');
  return (
    <section className={panel}>
      <h3 className="text-2xl font-semibold">From loss to payment</h3>
      <p className="text-slate-300">
        Inflate the loss, subtract the fixed ordinary deductible, apply the
        insurer share, then cap the final payment. This calculator uses a
        maximum payment, not a maximum covered loss.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Original loss', value: loss, set: setLoss, max: 3000 },
          {
            label: 'Deductible',
            value: deductible,
            set: setDeductible,
            max: 2000,
          },
          { label: 'Insurer share (%)', value: share, set: setShare, max: 100 },
          { label: 'Maximum payment', value: cap, set: setCap, max: 3000 },
          {
            label: 'Loss inflation (%)',
            value: inflation,
            set: setInflation,
            max: 50,
          },
        ].map((c) => (
          <label key={c.label}>
            {c.label}
            <input
              className={control}
              type="number"
              min="0"
              max={c.max}
              value={c.value}
              onChange={(e) =>
                c.set(Math.min(c.max, Math.max(0, Number(e.target.value) || 0)))
              }
            />
          </label>
        ))}
      </div>
      <dl className="grid sm:grid-cols-3 gap-3" aria-live="polite">
        <Metric
          label="Inflated loss"
          value={(loss * (1 + inflation / 100)).toFixed(2)}
        />
        <Metric label="Insurer payment" value={calculate(loss).toFixed(2)} />
        <Metric
          label="Insured retains"
          value={(loss * (1 + inflation / 100) - calculate(loss)).toFixed(2)}
        />
      </dl>
      <svg
        viewBox="0 0 640 225"
        role="img"
        aria-label="Payment curve: original loss 0 to 3000 on horizontal axis, payment 0 to 3300 on vertical axis"
        className="w-full bg-slate-950 rounded-xl"
      >
        <path d="M30 25 V185 H600" stroke="#64748b" fill="none" />
        <polyline
          points={points}
          fill="none"
          stroke="#5eead4"
          strokeWidth="3"
        />
        <text x="35" y="20" fill="#cbd5e1">
          Payment (0–3300)
        </text>
        <text x="30" y="210" fill="#cbd5e1">
          0
        </text>
        <text x="430" y="210" fill="#cbd5e1">
          Original loss → 3000
        </text>
      </svg>
      <h4 className="text-lg font-semibold">A small portfolio</h4>
      <p className="text-sm text-slate-300">
        Original losses 0, 500, and 2,000 have probabilities 0.5, 0.3, and 0.2.
        The policy above produces payments{' '}
        {ys.map((y) => y.toFixed(2)).join(', ')}.
      </p>
      <dl className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Metric
          label="Expected inflated loss"
          value={lossStats.mean.toFixed(2)}
        />
        <Metric label="Expected payment" value={stats.mean.toFixed(2)} />
        <Metric label="Payment variance" value={stats.variance.toFixed(2)} />
        <Metric label="Payment SD" value={stats.sd.toFixed(2)} />
      </dl>
    </section>
  );
}
export function SalesforceExplorer() {
  const [priority, setPriority] = useState('Normal'),
    [vip, setVip] = useState(false);
  const high = priority === 'High',
    escalate = high || vip;
  return (
    <section className={panel}>
      <h3 className="text-2xl font-semibold">Case-routing decision lab</h3>
      <p className="text-slate-300">
        Policy: route to Escalations when priority is High OR the customer is
        VIP. This is a local simulation; it does not connect to a Salesforce
        org.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <label>
          Case priority
          <select
            className={control}
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>Normal</option>
            <option>High</option>
          </select>
        </label>
        <label className="flex gap-3 items-center">
          <input
            type="checkbox"
            checked={vip}
            onChange={(e) => setVip(e.target.checked)}
          />
          Customer is VIP
        </label>
      </div>
      <div className="rounded-lg bg-slate-950 p-5" aria-live="polite">
        <p>
          High priority: {String(high)} · VIP: {String(vip)}
        </p>
        <p className="text-2xl text-teal-200 mt-3">
          {escalate ? 'Escalations' : 'Standard Support'}
        </p>
        <p className="mt-2 text-slate-400">
          {escalate
            ? 'At least one condition is true.'
            : 'Both conditions are false, so use the default outcome.'}
        </p>
      </div>
      <table className="w-full text-left text-sm">
        <caption className="text-left mb-3 font-semibold">
          Acceptance-test matrix
        </caption>
        <thead>
          <tr>
            <th scope="col">High?</th>
            <th scope="col">VIP?</th>
            <th scope="col">Expected queue</th>
          </tr>
        </thead>
        <tbody>
          {[
            [false, false],
            [false, true],
            [true, false],
            [true, true],
          ].map(([a, b], i) => (
            <tr key={i} className="border-t border-slate-700">
              <td className="py-3">{String(a)}</td>
              <td>{String(b)}</td>
              <td>{a || b ? 'Escalations' : 'Standard Support'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
