type RecursivePartial<T> = {
  [P in keyof T]?:
  T[P] extends (infer U)[] ? RecursivePartial<U>[] :
    T[P] extends object ? RecursivePartial<T[P]> :
      T[P];
};

type FileFilterConfig = {
  and?: [FileFilterConfig],
  or?: [FileFilterConfig],
  not?: FileFilterConfig,

  endsWith?: string,
  startsWith?: string,
  contains?: string
};

export type FileFilterConfigType = RecursivePartial<FileFilterConfig>;

export type FileFilterConfigKey = keyof FileFilterConfig;
