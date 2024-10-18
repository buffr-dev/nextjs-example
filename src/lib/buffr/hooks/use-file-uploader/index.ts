import { useState } from "react";
import { uploadFileWithProgress } from "../../utils/upload-file-with-progress";
import { useFileInput } from "../use-file-input";
import { useFileDrop } from "../use-file-drop";
import { generatePresignedS3Url } from "../../actions/generate-presigned-s3-url";
import match from "mime-match";

export interface FileWrapper<T> {
  file: File;
  meta: T;
}

export interface UploadData {
  progress: number;
}

interface FileUploadConfigPartialOverride {
  authAction?: () => Promise<void>;
  s3KeyGenerator?: (file: File) => string;
  uploadPresignAction?: never;
}

interface FileUploadConfigFullOverride {
  authAction: never;
  s3KeyGenerator: never;
  uploadPresignAction?: (
    formData: FormData
  ) => Promise<{ url: string; headers?: { [key: string]: string } }>;
}

// todo make this type better somehow

// TODO user will still need to track dirty images if deferring upload
// maybe just a set of removedFiles AND ability to updateFile(file: FileWrapper) -- if allowing FileWrapper customization will need an onAdd callback
export function useFileUploader(
  config?: FileUploadConfigPartialOverride | FileUploadConfigFullOverride
) {
  const [files, setFiles] = useState<FileWrapper<UploadData>[]>([]);

  const addRawFiles = (rawFiles: File[], index?: number) => {
    // TODO auto add dataURL for cleaner client code
    const filteredFiles = rawFiles.filter((f) => {
      const acceptSetting = inputProps.ref.current?.accept;
      if (!acceptSetting) return true;
      return match(f.type, inputProps.ref.current?.accept);
    });
    const newFiles = filteredFiles.map((file) => ({
      file,
      meta: { progress: 0 },
    }));
    augmentedSetFiles((oldFiles) => [
      ...oldFiles.slice(0, index),
      ...newFiles,
      ...oldFiles.slice(index),
    ]);
  };

  const inputProps = useFileInput(files, addRawFiles);
  const dropzoneProps = useFileDrop(addRawFiles);

  const updateFile = (file: File, metaChanges: Partial<UploadData>) => {
    setFiles((oldFiles) =>
      oldFiles.map((curr) => {
        if (curr.file === file) {
          return {
            file,
            meta: { ...curr.meta, ...metaChanges },
          };
        }

        return curr;
      })
    );
  };

  // by default, replace since that's what html input does.

  async function startUploadHelper(wrappedFile: FileWrapper<UploadData>) {
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
    uploadFileWithProgress(url, uploadData, (progress: number) => {
      updateFile(wrappedFile.file, { progress });
    });
  }

  async function startUpload() {
    startUploadHelper(files[0]);
  }

  async function startDestroy(file: FileWrapper<UploadData>) {}

  const augmentedSetFiles: typeof setFiles = (v) => {
    const newValues = typeof v === "function" ? v(files) : v;
    const removedFiles = files.filter((curr) => !newValues.includes(curr));
    const addedFiles = newValues.filter((curr) => !files.includes(curr));

    setFiles(newValues);
  };

  return {
    files,
    setFiles,
    startUpload,
    propPartials: { inputProps, dropzoneProps },
  };
}
