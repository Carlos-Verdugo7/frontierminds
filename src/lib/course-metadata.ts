import { guideIndex } from './guide-index';
import { pageMetadata } from './page-metadata';

export function courseMetadata(path: string) {
  const entry = guideIndex.find(item => item.path === path);
  if (!entry) return {};
  const name = entry.area === 'exam-p' ? 'Exam P' : 'Salesforce';
  const title = entry.title.includes(name) ? entry.title : entry.title + ' · ' + name;
  return pageMetadata({ path: entry.path, title, description: entry.detail, locale: 'en_US' });
}
