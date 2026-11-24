'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, AlertTriangle, RotateCcw, Printer, Download } from 'lucide-react';
import Link from 'next/link';
import {
  DEFAULT_PIPELINE, ORDER_CSV, evaluatePipeline, type PipelineOptions,
} from '@/lib/learning/medallion';

const money = (value: number) => '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function MedallionLab() {
  const [options, setOptions] = useState<PipelineOptions>({ ...DEFAULT_PIPELINE });
  const pipeline = useMemo(() => evaluatePipeline(options), [options]);
  const change = (key: keyof PipelineOptions, value: boolean) =>
    setOptions(previous => ({ ...previous, [key]: value }));
  const gold = pipeline.stages[3];
  const csvUrl = 'data:text/csv;charset=utf-8,' + encodeURIComponent(ORDER_CSV);

  return <div className="space-y-7">
    <section className="rounded-xl border border-slate-300 bg-white p-5 sm:p-7 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[#203ead] font-semibold text-xs tracking-widest">01 / INGESTION</p>
          <h2 className="text-2xl font-semibold mt-1">Eight source rows, seven orders.</h2>
        </div>
        <a className="inline-flex items-center gap-2 rounded-md border border-slate-400 px-4 py-2 text-sm hover:border-[#2548cc]" href={csvUrl} download="fictional-orders.csv"><Download size={16} /> Download sample CSV</a>
      </div>
      <p className="text-slate-600 max-w-3xl">The rows below simulate a source arriving through an ingestion connector. Order 1002 has an updated version. The raw feed also contains one pending order, one refunded order, and one negative amount that violates this exercise&apos;s contract.</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-slate-600"><tr className="border-b border-slate-300"><th scope="col" className="py-3 pr-4">Order ID</th><th scope="col" className="pr-4">Status</th><th scope="col" className="pr-4">Raw amount</th><th scope="col">Source updated (UTC)</th></tr></thead>
          <tbody>{pipeline.bronze.map((record, index) => <tr key={record.order_id + ':' + index} className="border-b border-slate-200"><td className="py-2 pr-4 font-mono">{record.order_id}{record.order_id === '1002' && <span className="ml-2 text-xs text-[#2548cc]">version {index === 1 ? '1' : '2'}</span>}</td><td className="pr-4">{record.status}</td><td className={'pr-4 tabular-nums ' + (record.amount_usd < 0 ? 'text-red-700 font-medium' : '')}>{money(record.amount_usd)}</td><td className="font-mono text-xs text-slate-600">{record.updated_at.replace('T', ' ').slice(0, 16)}</td></tr>)}</tbody>
        </table>
      </div>
      <p className="text-xs text-slate-500">All records are synthetic. The exercise assumes one latest version per order, nonnegative order amounts, and completed orders only for the final revenue metric.</p>
    </section>

    <section className="rounded-xl border border-indigo-200 bg-indigo-50 p-5 sm:p-7 space-y-4">
      <p className="text-[#203ead] font-semibold text-xs tracking-widest">02 / CHANGE THE PIPELINE</p>
      <h2 className="text-2xl font-semibold">What happens if you skip a data quality rule?</h2>
      <p className="text-slate-700">Turn a rule off to simulate a common AI-generated SQL mistake. Notice how an apparently plausible revenue figure can change.</p>
      <fieldset className="grid gap-3 sm:grid-cols-3">
        <legend className="sr-only">Transformation and business rules</legend>
        {([
          ['deduplicate', 'Keep the latest update', 'One row per order ID'],
          ['validateAmount', 'Validate amounts', 'Quarantine negative values'],
          ['completedOnly', 'Completed orders only', 'Exclude pending and refunded'],
        ] as const).map(([key, title, detail]) => <label key={key} className="flex cursor-pointer gap-3 rounded-lg bg-white border border-indigo-200 p-4">
          <input type="checkbox" className="mt-1 h-4 w-4 accent-[#2548cc]" checked={options[key]} onChange={e => change(key, e.target.checked)} />
          <span><strong className="block font-semibold">{title}</strong><small className="block text-slate-600 mt-1">{detail}</small></span>
        </label>)}
      </fieldset>
      <button type="button" className="inline-flex gap-2 items-center text-sm text-[#203ead] underline underline-offset-4" onClick={() => setOptions({ ...DEFAULT_PIPELINE })}><RotateCcw size={16} /> Restore the verified definition</button>
    </section>

    <section className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4" aria-label="Pipeline stage counts">
        {pipeline.stages.map((stage, index) => <div key={stage.name} className="border border-slate-300 rounded-lg p-4 bg-white">
          <p className="text-[#203ead] text-xs font-semibold">0{index + 1}</p>
          <h3 className="font-semibold mt-2 text-sm">{stage.name}</h3>
          <p className="text-3xl font-semibold mt-3 tabular-nums">{stage.rows}</p>
          <p className="text-xs text-slate-600 mt-1">rows · sum {money(stage.amount)}</p>
        </div>)}
      </div>
      <div role="status" aria-live="polite" className={'flex flex-wrap gap-4 items-center border rounded-xl p-5 sm:p-7 ' + (pipeline.trusted ? 'border-emerald-300 bg-emerald-50' : 'border-amber-300 bg-amber-50')}>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{pipeline.trusted ? 'Verified practice definition applied' : 'Definition changed — this is not the verified revenue metric'}</p>
          <p className="text-4xl font-semibold tracking-tight mt-1 tabular-nums">{money(pipeline.revenue)}</p>
          <p className="text-sm text-slate-700 mt-2">{gold.rows} qualifying rows · {pipeline.rejected.length} quarantined rows</p>
          <p className="text-sm text-slate-700 mt-2">{pipeline.trusted ? 'Four current, valid completed orders produce $280.00.' : 'Compare with the verified baseline: four completed orders worth $280.00. Re-enable all rules to reconcile.'}</p>
        </div>
        {pipeline.trusted ? <CheckCircle2 aria-label="Verified definition" size={32} className="text-emerald-800" /> : <AlertTriangle aria-label="Unverified definition" size={32} className="text-amber-800" />}
      </div>
    </section>

    <section className="rounded-xl border border-slate-300 bg-white p-5 sm:p-7 space-y-4">
      <p className="text-[#203ead] text-xs font-semibold tracking-widest">03 / RECONCILE, THEN REPORT</p>
      <h2 className="text-2xl font-semibold">Audit the Gold result</h2>
      <p className="text-slate-600">A PDF or dashboard should quote this documented Gold definition and never use the raw $450.00 sum as completed revenue.</p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead><tr className="border-b border-slate-300 text-slate-600"><th scope="col" className="py-2">Gold order</th><th scope="col">Status</th><th scope="col" className="text-right">Included amount</th></tr></thead>
          <tbody>{pipeline.gold.map((record, index) => <tr className="border-b border-slate-200" key={record.order_id + ':' + index}><td className="py-3 font-mono">{record.order_id}</td><td>{record.status}</td><td className="text-right tabular-nums">{money(record.amount_usd)}</td></tr>)}</tbody>
          <tfoot><tr className="font-semibold"><td className="pt-3" colSpan={2}>Simulated total</td><td className="text-right pt-3">{money(pipeline.revenue)}</td></tr></tfoot>
        </table>
      </div>
      <div className="rounded-lg bg-slate-100 p-4 text-sm space-y-2">
        <p><strong>Verified report input:</strong> 4 completed orders; $280.00 revenue (fictional). Do not infer growth or geographic trends from this sample.</p>
        <p><strong>Quarantine:</strong> {pipeline.rejected.length ? pipeline.rejected.map(x => x.order_id + ' (negative amount)').join(', ') : 'No rows rejected by the current settings.'}</p>
        <p><strong>AI audit task:</strong> Ask Claude or Codex to trace why raw totals differ, identify untested rules, and refrain from inventing trends.</p>
      </div>
      <div className="flex gap-3 flex-wrap print:hidden">
        <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 bg-[#2548cc] text-white rounded-lg px-4 py-3 text-sm font-semibold"><Printer size={17} /> Print / Save as PDF</button>
        <Link href="/courses/data-engineering/chapter/2/section/3" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-medium">Study the Gold SQL <ArrowRight size={17} /></Link>
      </div>
      <p className="text-xs text-slate-500">Printing uses your browser&apos;s built-in PDF option. It does not call AI or upload data. Print only after the verified definition is enabled; the result remains a fictional training report.</p>
    </section>
  </div>;
}
