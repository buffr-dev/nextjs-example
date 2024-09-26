import { useState } from "react";
import { FileWrapper } from "./use-file-manager/types";

interface UploadData {
  progress: number;
}

async function uploadFile(onProgress: () => void) {}

async function destroyFile() {}

export function useFileWizardUploader() {
  const [files, setFiles] = useState<FileWrapper<UploadData>[]>([]);
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

  async function startUpload(wrappedFile: FileWrapper<UploadData>) {
    uploadFile(() => {
      updateFile(wrappedFile.file, { progress: 20 });
    });
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

  const addRawFiles = (rawFiles: File[], index?: number) => {
    const newFiles = rawFiles.map((file) => ({ file, meta: { progress: 0 } }));
    augmentedSetFiles((oldFiles) => [
      ...oldFiles.slice(0, index),
      ...newFiles,
      ...oldFiles.slice(index),
    ]);
  };

  return { files, setFiles, addRawFiles };
}
