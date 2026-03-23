export interface Workspace {
  id: string;
  name: string;
  logo: string | null;
  currency_code: string;
  settings: {
    timezone: string;
    language: string;
  };
}
