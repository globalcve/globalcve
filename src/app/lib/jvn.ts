import Parser from 'rss-parser';

const JVN_FEED_URL = 'https://jvn.jp/rss/jvn.rdf';

export async function fetchJVNFeed() {
  const parser = new Parser({
    customFields: {
      item: ['dc:identifier', 'dc:date', 'title', 'description'],
    },
  });

  const feed = await parser.parseURL(JVN_FEED_URL);

  const results = feed.items.map((item: any) => {
    const rawId = item['dc:identifier'] || '';
    const normalizedId = rawId.startsWith('CVE-') ? rawId : rawId.replace(/^JVN(VU)?#/, '');

    return {
      id: normalizedId,
      title: item.title?.trim() || '',
      description: item.contentSnippet?.trim() || item.description?.trim() || 'No description available from JVN.',
      published: item['dc:date'] || new Date().toISOString(),
      source: 'JVN',
      link: item.link,
    };
  });

  return results;
}
