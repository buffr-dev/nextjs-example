import { useCallback, useState } from "react";
import { uploadFileWithProgress } from "../../utils/upload-file-with-progress";
import { useFileInput } from "../use-file-input";
import { useFileDrop } from "../use-file-drop";
import { generatePresignedS3Url } from "../../actions/generate-presigned-s3-url";
import match from "mime-match";

export interface FileWrapper<T> {
  file: File;
  uploadProgress: number;
  source: "initial" | "input";
  meta: T;
}

interface FileUploadConfigPartialOverride<T> {
  authAction?: () => Promise<void>;
  s3KeyGenerator?: (file: File) => string;
  uploadPresignAction?: never;
}

interface FileUploadConfigFullOverride<T> {
  authAction: never;
  s3KeyGenerator: never;
  uploadPresignAction?: (
    formData: FormData
  ) => Promise<{ url: string; headers?: { [key: string]: string } }>;
}

export function useFileUploaderWithMeta<T>(
  initialFiles: FileWrapper<T>[],
  initialMeta: T | ((file: File) => T),
  config?: FileUploadConfigPartialOverride<T> | FileUploadConfigFullOverride<T>
) {
  const [files, setFiles] = useState<FileWrapper<T>[]>(initialFiles);
  const [removedFiles, setRemovedFiles] = useState<FileWrapper<T>[]>([]);

  const augmentedSetFiles: typeof setFiles = useCallback(
    (v) => {
      const newValues = typeof v === "function" ? v(files) : v;
      const newlyRemovedFiles = files.filter(
        (curr) => !newValues.includes(curr)
      );

      setRemovedFiles((r) => [...r, ...newlyRemovedFiles]);
      setFiles(newValues);
    },
    [files, setRemovedFiles, setFiles]
  );

  const addRawFiles = (rawFiles: File[], index?: number) => {
    const filteredFiles = rawFiles.filter((f) => {
      const acceptSetting = inputProps.ref.current?.accept;
      if (!acceptSetting) return true;
      return match(f.type, inputProps.ref.current?.accept);
    });

    const newFiles: FileWrapper<T>[] = filteredFiles.map((file) => ({
      file,
      meta: initialMeta instanceof Function ? initialMeta(file) : initialMeta,
      source: "input",
      uploadProgress: 0,
    }));

    const sliceIndex = index === undefined ? files.length : index;
    augmentedSetFiles((oldFiles) => [
      ...oldFiles.slice(0, sliceIndex),
      ...newFiles,
      ...oldFiles.slice(sliceIndex),
    ]);
  };

  const inputProps = useFileInput(files, addRawFiles);
  const dropzoneProps = useFileDrop(addRawFiles);

  const updateFile = useCallback(
    (file: File, changes: (f: FileWrapper<T>) => FileWrapper<T>) => {
      setFiles((oldFiles) =>
        oldFiles.map((curr) => {
          if (curr.file === file) {
            return changes(curr);
          }

          return curr;
        })
      );
    },
    []
  );

  const updateFileMeta = useCallback(
    (file: File, metaChanges: Partial<T>) => {
      updateFile(file, (f) => ({ ...f, meta: { ...f.meta, ...metaChanges } }));
    },
    [updateFile]
  );

  const uploadFile = useCallback(
    async (wrappedFile: FileWrapper<T>) => {
      const overrideConfig =
        (config && "uploadPresignAction" in config && config) || null;
      // todo grab upload custom configs for auth and keyname to generate presign endpoint
      const presignAction =
        overrideConfig?.uploadPresignAction || generatePresignedS3Url;

      //todo surround w try/catch?
      const presignData = new FormData();
      presignData.append("file", wrappedFile.file);
      const { url, headers } = await presignAction(presignData);

      const uploadData = new FormData();

      if (headers) {
        Object.entries(headers).forEach(([k, v]) => {
          uploadData.append(k, v);
        });
      }

      uploadData.append("file", wrappedFile.file);
      uploadFileWithProgress(url, uploadData, (uploadProgress: number) => {
        updateFile(wrappedFile.file, (f) => ({ ...f, uploadProgress }));
      });
    },
    [config, updateFile]
  );

  const uploadAll = useCallback(async () => {
    files.filter((f) => f.uploadProgress === 0).forEach(uploadFile);
  }, [files, uploadFile]);

  return {
    files,
    setFiles: augmentedSetFiles,
    removedFiles,
    uploadFile,
    updateFileMeta,
    uploadAll,
    propPartials: { inputProps, dropzoneProps },
  };
}

export function useFileUploader(
  initialFiles: FileWrapper<any>[],
  config?:
    | FileUploadConfigPartialOverride<any>
    | FileUploadConfigFullOverride<any>
) {
  return useFileUploaderWithMeta<any>(initialFiles, {}, config);
}
