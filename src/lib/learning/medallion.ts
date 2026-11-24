/**
 * Pure, synthetic teaching dataset. No network or AI calls.
 * Bronze is an append-only change log. Status and amount rules are specific
 * to this exercise, not accounting guidance.
 */
export type OrderRecord = {
  order_id: string;
  customer_id: string;
  status: 'completed' | 'pending' | 'refunded';
  amount_usd: number;
  updated_at: string;
  ingested_at: string;
};
export type PipelineOptions = {
  deduplicate: boolean;
  validateAmount: boolean;
  completedOnly: boolean;
};
export type PipelineStage = { name: string; rows: number; amount: number };
export const DEFAULT_PIPELINE: PipelineOptions = {
  deduplicate: true,
  validateAmount: true,
  completedOnly: true,
};
export const orders: readonly OrderRecord[] = [
  { order_id: '1001', customer_id: 'C-1', status: 'completed', amount_usd: 120, updated_at: '2026-11-19T09:00:00Z', ingested_at: '2026-11-19T09:01:00Z' },
  { order_id: '1002', customer_id: 'C-2', status: 'completed', amount_usd: 80, updated_at: '2026-11-19T09:02:00Z', ingested_at: '2026-11-19T09:04:00Z' },
  { order_id: '1002', customer_id: 'C-2', status: 'completed', amount_usd: 90, updated_at: '2026-11-19T11:00:00Z', ingested_at: '2026-11-19T11:02:00Z' },
  { order_id: '1003', customer_id: 'C-3', status: 'pending', amount_usd: 60, updated_at: '2026-11-19T10:00:00Z', ingested_at: '2026-11-19T10:05:00Z' },
  { order_id: '1004', customer_id: 'C-4', status: 'completed', amount_usd: -20, updated_at: '2026-11-19T10:10:00Z', ingested_at: '2026-11-19T10:11:00Z' },
  { order_id: '1005', customer_id: 'C-5', status: 'refunded', amount_usd: 50, updated_at: '2026-11-19T10:20:00Z', ingested_at: '2026-11-19T10:21:00Z' },
  { order_id: '1006', customer_id: 'C-6', status: 'completed', amount_usd: 40, updated_at: '2026-11-19T10:30:00Z', ingested_at: '2026-11-19T10:31:00Z' },
  { order_id: '1007', customer_id: 'C-7', status: 'completed', amount_usd: 30, updated_at: '2026-11-19T10:40:00Z', ingested_at: '2026-11-19T10:41:00Z' },
];

function summary(name: string, rows: readonly OrderRecord[]): PipelineStage {
  return { name, rows: rows.length, amount: rows.reduce((sum, order) => sum + order.amount_usd, 0) };
}

export function currentOrders(rows: readonly OrderRecord[]): OrderRecord[] {
  const latest = new Map<string, OrderRecord>();
  for (const row of rows) {
    const previous = latest.get(row.order_id);
    if (!previous ||
      row.updated_at > previous.updated_at ||
      (row.updated_at === previous.updated_at && row.ingested_at > previous.ingested_at)) {
      latest.set(row.order_id, row);
    }
  }
  return [...latest.values()];
}

export function evaluatePipeline(options: PipelineOptions = DEFAULT_PIPELINE) {
  const bronze = [...orders];
  const current = options.deduplicate ? currentOrders(bronze) : bronze;
  const rejected = options.validateAmount ? current.filter(row => !Number.isFinite(row.amount_usd) || row.amount_usd < 0) : [];
  const silver = options.validateAmount
    ? current.filter(row => Number.isFinite(row.amount_usd) && row.amount_usd >= 0)
    : current;
  const gold = options.completedOnly ? silver.filter(row => row.status === 'completed') : silver;
  const stages = [summary('Bronze · raw versions', bronze),
    summary('Current · latest versions', current),
    summary('Silver · valid orders', silver),
    summary('Gold · qualified orders', gold)];
  return {
    options,
    stages,
    bronze,
    current,
    silver,
    gold,
    rejected,
    revenue: stages[3].amount,
    trusted: options.deduplicate && options.validateAmount && options.completedOnly,
    duplicateVersions: bronze.length - new Set(bronze.map(row => row.order_id)).size,
  };
}
export const ORDER_CSV = [
  'order_id,customer_id,status,amount_usd,updated_at,ingested_at',
  ...orders.map(row => [row.order_id, row.customer_id, row.status, row.amount_usd, row.updated_at, row.ingested_at].join(',')),
].join('\n') + '\n';
