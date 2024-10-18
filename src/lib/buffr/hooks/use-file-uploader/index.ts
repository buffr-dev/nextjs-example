import { useCallback, useState } from "react";
import { uploadFileWithProgress } from "../../utils/upload-file-with-progress";
import { useFileInput } from "../use-file-input";
import { useFileDrop } from "../use-file-drop";
import { generatePresignedS3Url } from "../../actions/generate-presigned-s3-url";
import match from "mime-match";

export interface FileWrapper<T = any> {
  _id: string;
  file: File;
  uploadProgress: number;
  source: "initial" | "input";
  meta: T;
}

interface FileUploadConfigPartialOverride<T = any> {
  append?: boolean;
  authAction?: () => Promise<void>;
  s3KeyGenerator?: (file: File) => string;
  uploadPresignAction?: never;
}

interface PresignOutput {
  url: string;
  headers?: { [key: string]: string };
}

interface FileUploadConfigFullOverride<T = any> {
  append?: boolean;
  authAction: never;
  s3KeyGenerator: never;
  uploadPresignAction?: (formData: FormData) => Promise<PresignOutput>;
}

type FileUploadConfig<T> =
  | FileUploadConfigPartialOverride<T>
  | FileUploadConfigFullOverride<T>;

let fileWrapperSequence = 0;

export function useFileUploaderWithMeta<T>(
  initialFiles: FileWrapper<T>[],
  initialMeta: T | ((file: File) => T),
  config?: FileUploadConfig<T>
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
      _id: (fileWrapperSequence++).toString(),
      file,
      meta: initialMeta instanceof Function ? initialMeta(file) : initialMeta,
      source: "input",
      uploadProgress: 0,
    }));

    const sliceIndex = index === undefined ? files.length : index;
    if (config?.append) {
      augmentedSetFiles((oldFiles) => [
        ...oldFiles.slice(0, sliceIndex),
        ...newFiles,
        ...oldFiles.slice(sliceIndex),
      ]);
    } else {
      // By default, overwrite current file set when input changes.
      augmentedSetFiles(newFiles);
    }
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

      if (config?.authAction) {
        await config.authAction();
      }

      //todo surround w try/catch?
      const presignData = new FormData();
      presignData.append("file", wrappedFile.file);

      let presignOutput: PresignOutput;
      if (overrideConfig?.uploadPresignAction) {
        presignOutput = await overrideConfig.uploadPresignAction(presignData);
      } else {
        const customKey =
          config?.s3KeyGenerator && config?.s3KeyGenerator(wrappedFile.file);
        presignOutput = await generatePresignedS3Url(presignData, customKey);
      }

      const uploadData = new FormData();
      if (presignOutput.headers) {
        Object.entries(presignOutput.headers).forEach(([k, v]) => {
          uploadData.append(k, v);
        });
      }

      uploadData.append("file", wrappedFile.file);
      uploadFileWithProgress(
        presignOutput.url,
        uploadData,
        (uploadProgress: number) => {
          updateFile(wrappedFile.file, (f) => ({ ...f, uploadProgress }));
        }
      );
    },
    [
      config?.authAction,
      config?.s3KeyGenerator,
      config?.uploadPresignAction,
      updateFile,
    ]
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
  initialFiles: FileWrapper[],
  config?: FileUploadConfigPartialOverride | FileUploadConfigFullOverride
) {
  return useFileUploaderWithMeta(initialFiles, {}, config);
}
