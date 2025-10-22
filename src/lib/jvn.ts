import Parser from "rss-parser";

const JVN_FEED_URL = "https://jvndb.jvn.jp/en/rss/jvndb_new_en.rdf";

type JVNItem = {
  id: string;
  title: string;
  description: string;
  published: string;
  source: string;
};

export async function fetchJVNFeed(): Promise<JVNItem[]> {
  const parser = new Parser();
  const feed = await parser.parseURL(JVN_FEED_URL);

  return feed.items.map((item) => {
    const cveMatch = item.title?.match(/CVE-\d{4}-\d{4,}/);
    const cveId = cveMatch?.[0] || "JVN-unknown";

    return {
      id: cveId,
      title: item.title || "No title",
      description: item.contentSnippet?.trim() || "No description",
      published: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
      source: "JVN",
    };
  });
}
