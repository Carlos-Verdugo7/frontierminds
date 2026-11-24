import UscisGuide from '@/components/community/UscisGuide';
import { pageMetadata } from '@/lib/page-metadata';

export const metadata = pageMetadata({
  path: '/comunidad/uscis',
  locale: 'es_US',
  title: 'Cómo usar USCIS en español | Consultar un caso, cuenta y avisos',
  description: 'Aprende gratis a consultar el estatus de USCIS, usar myUSCIS, entender los tiempos de procesamiento, interpretar avisos y proteger tus datos con ejercicios sin información real.',
});

export default function UscisPage() {
  return <UscisGuide />;
}
