export interface Config {
  site: {
    name: string;
    tagline: string;
    url: string;
    defaultTheme: 'dark' | 'light';
    version: string;
    buildDate: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
    author: string;
    ogImage: string;
  };
  analytics: {
    provider: string;
    id: string;
  };
  email: {
    address: string;
    service: string;
  };
}
