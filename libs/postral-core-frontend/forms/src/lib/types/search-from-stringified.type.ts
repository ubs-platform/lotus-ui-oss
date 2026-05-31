export type SearchFromStringifiedType<T> = {
  [key in keyof T]: string | string[] | undefined;
};
