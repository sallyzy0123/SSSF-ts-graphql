type Thumbnail = {
  source: string;
  width: number;
  height: number;
};

type Original = {
  source: string;
  width: number;
  height: number;
};

type Page = {
  pageid: number;
  ns: number;
  title: string;
  thumbnail: Thumbnail;
  original: Original;
};

type Query = {
  pages: Page[];
};

type ImageFromWikipedia = {
  batchcomplete: boolean;
  query: Query;
};

export {ImageFromWikipedia};
