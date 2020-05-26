export type Urls = {
  original: string;
  thumbnail: string;
  alt?: string;
  title?: string;
};

export function extractUrls(markdown: string): Urls[] {
  const matches = markdown.matchAll(
    /\[\[?(?:!)\[([^\][]*\[?[^\][]*]?[^\][]*)]\(([^\s]+?)(\s+(["'])(.*?)\4)?\)]\(([^ ]+?)(?: "(.+)")?\)/g
  );
  const images: Urls[] = [];
  for (const match of matches) {
    const [, alt, thumbnail, , , title, original] = match;
    images.push({
      original,
      thumbnail,
      alt,
      title,
    });
  }
  return images;
}
