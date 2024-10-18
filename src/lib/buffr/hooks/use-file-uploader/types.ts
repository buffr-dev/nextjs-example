export interface FileWrapper<T = any> {
  _id: string;
  file: File;
  uploadProgress: number;
  source: "initial" | "input";
  meta: T;
}

export interface PresignOutput {
  url: string;
  headers?: { [key: string]: string };
}

interface FileUploadConfigPartialOverride<T = any> {
  append?: boolean;
  authAction?: () => Promise<void>;
  s3KeyGenerator?: (file: FileWrapper<T>) => string;
  uploadPresignAction?: never;
}

interface FileUploadConfigFullOverride {
  append?: boolean;
  authAction: never;
  s3KeyGenerator: never;
  uploadPresignAction?: (formData: FormData) => Promise<PresignOutput>;
}

export type FileUploadConfig<T = any> =
  | FileUploadConfigPartialOverride<T>
  | FileUploadConfigFullOverride;
