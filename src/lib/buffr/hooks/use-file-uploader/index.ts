import { useState } from "react";
import { uploadFileWithProgress } from "../../utils/upload-file-with-progress";
import { useFileInput } from "..//use-file-input";
import { useFileDrop } from "../use-file-drop";

export interface FileWrapper<T> {
  file: File;
  meta: T;
}

export interface UploadData {
  progress: number;
}

async function destroyFile() {}

// TODO user will still need to track dirty images if deferring upload
export function useFileUploader(
  presignUrlAction: (file: File) => Promise<{ url: string }>
) {
  const [files, setFiles] = useState<FileWrapper<UploadData>[]>([]);

  const addRawFiles = (rawFiles: File[], index?: number) => {
    // TODO auto add dataURL for cleaner client code
    const newFiles = rawFiles.map((file) => ({ file, meta: { progress: 0 } }));
    augmentedSetFiles((oldFiles) => [
      ...oldFiles.slice(0, index),
      ...newFiles,
      ...oldFiles.slice(index),
    ]);
  };

  const inputProps = useFileInput(files, addRawFiles);
  const fileDropProps = useFileDrop(addRawFiles);

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

  async function startUploadHelper(wrappedFile: FileWrapper<UploadData>) {
    const formData = new FormData();
    formData.append("file", wrappedFile.file);
    const { url } = await presignUrlAction(wrappedFile.file);

    uploadFileWithProgress(url, formData, (progress: number) => {
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
    removedFiles.forEach(startDestroy);
    addedFiles.forEach(startUpload);
  };

  return {
    files,
    setFiles,
    startUpload,
    propPartials: { inputProps, fileDropProps },
  };
}
