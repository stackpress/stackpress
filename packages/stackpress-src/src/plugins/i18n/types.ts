export type Scalar = string | number | boolean | null | undefined;

export type Language = {
  label: string,
  translations: Record<string, string>
};

export type Languages = Record<string, Language>;

export type LanguageConfig = {
  languages: Record<string, {
    label: string,
    translations: Record<string, string>
  }>
};