export type FetchPageResult = {
  html: string;
  status: number;
  responseTimeMs: number;
  finalUrl: string;
};

export const fetchPage = async (url: string): Promise<FetchPageResult> => {
  const start = Date.now();
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      'user-agent': 'ConversionLint/0.1 (+https://github.com/ericjokl/conversionlint)',
    },
  });

  const html = await response.text();

  return {
    html,
    status: response.status,
    responseTimeMs: Date.now() - start,
    finalUrl: response.url,
  };
};
