import { dollars, type PricedContract } from '@/lib/learning/loss-lab';
import styles from './lab.module.css';

// Each full bar is the same dollar scale. The text table exposes the exact amounts.
export default function LossChart({ contract }: { contract: PricedContract }) {
  const maxLoss = Math.max(...contract.rows.map(row => row.loss));
  return <figure className={styles.figure}>
    <figcaption>Payment by loss size</figcaption>
    <div className={styles.legend}><span><i />Insurer pays</span><span><i />Loss left over</span></div>
    <table className={styles.bars}>
      <thead><tr><th scope="col">Loss</th><th scope="col">Share of losses</th><th scope="col"><span className="sr-only">Payment breakdown</span></th><th scope="col">Insurer pays</th></tr></thead>
      <tbody>{contract.rows.map(row => <tr key={row.loss}>
        <th scope="row">{dollars(row.loss)}</th><td>{Math.round(row.probability * 100)}%</td>
        <td aria-hidden="true"><div className={styles.track}><div className={styles.gross} style={{ width: (row.loss / maxLoss * 100) + '%' }}><div className={styles.paid} style={{ width: (row.paid / row.loss * 100) + '%' }} /></div></div></td>
        <td>{dollars(row.paid)}</td>
      </tr>)}</tbody>
    </table>
  </figure>;
}
