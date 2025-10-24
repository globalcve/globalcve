import Parser from 'rss-parser';

const JVN_FEED_URL = 'https://jvndb.jvn.jp/en/rss/jvndb.rdf';

interface JvnItem {
  id: string;
  title: string;
  description: string;
  published: string;
  severity: string;
  link?: string; // ✅ Added for advisory ID matching
}

type CustomJVNItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  contentSnippet?: string;
  description?: string;
  'dc:identifier'?: string;
  'dc:date'?: string;
  'dc:subject'?: string;
};

function inferSeverityFromText(text: string): string {
  const lowered = text.toLowerCase();
  if (lowered.includes('critical')) return 'CRITICAL';
  if (lowered.includes('high')) return 'HIGH';
  if (lowered.includes('medium')) return 'MEDIUM';
  if (lowered.includes('low')) return 'LOW';
  return 'UNKNOWN';
}
export async function fetchJVNFeed(): Promise<JvnItem[]> {
  try {
    const parser: Parser<CustomJVNItem> = new Parser({
      customFields: {
        item: ['dc:identifier', 'dc:date', 'dc:subject'],
      },
    });

    const feed = await parser.parseURL(JVN_FEED_URL);
    const results: JvnItem[] = [];

    for (const item of feed.items) {
      const advisoryId = item.link?.split('/').pop();
      const id = advisoryId || item['dc:identifier'] || item.title || 'JVN-UNKNOWN';
      const published = item['dc:date'] || item.pubDate || new Date().toISOString();
      const description = item.contentSnippet || item.description || 'No description available from JVN.';
      const severity = inferSeverityFromText(item['dc:subject'] || description);

      results.push({
        id,
        title: item.title || '',
        description,
        published,
        severity,
        link: item.link || '', // ✅ Added to support advisory ID matching
      });
    }

    return results;
  } catch (err) {
    console.error('❌ JVN feed fetch failed:', err);
    return [];
  }
}
