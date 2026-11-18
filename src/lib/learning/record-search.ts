type SearchRecord = { id: string; source: string; body: string };
const stopWords = new Set('a an and are as at be by can for from has i in is it me my of on or the to was we what when will with you your'.split(' '));

function wordCounts(text: string) {
  const counts = new Map<string, number>();
  for (const word of text.toLowerCase().match(/[a-z0-9]+/g) ?? []) {
    if (!stopWords.has(word)) counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return counts;
}

// TF-IDF cosine similarity over the case's own record vocabulary.
export function rankRecords(records: SearchRecord[], query: string) {
  const documents = records.map(record => wordCounts([record.id, record.source, record.body].join(' ')));
  const frequency = new Map<string, number>();
  for (const document of documents) {
    for (const term of document.keys()) frequency.set(term, (frequency.get(term) ?? 0) + 1);
  }
  function vector(counts: Map<string, number>) {
    const weights = new Map<string, number>();
    let sumSquares = 0;
    for (const [term, count] of counts) {
      const documentsWithTerm = frequency.get(term);
      if (!documentsWithTerm) continue;
      const weight = count * (1 + Math.log((1 + documents.length) / (1 + documentsWithTerm)));
      weights.set(term, weight);
      sumSquares += weight * weight;
    }
    return { weights, norm: Math.sqrt(sumSquares) };
  }
  const queryVector = vector(wordCounts(query));
  if (!queryVector.norm) return [];
  return documents.map((document, index) => {
    const { weights, norm } = vector(document);
    const matches = [...queryVector.weights.keys()].filter(term => weights.has(term));
    const dot = matches.reduce((sum, term) => sum + queryVector.weights.get(term)! * weights.get(term)!, 0);
    return { id: records[index].id, matches, score: norm ? dot / (norm * queryVector.norm) : 0 };
  }).filter(hit => hit.score > 0).sort((a, b) => b.score - a.score);
}
