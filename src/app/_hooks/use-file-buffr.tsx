import { useState } from "react";
import { File } from "buffer";

export interface FileWrapper<T> {
  file: File;
  meta: T;
}

export interface UploadData {
  progress: number;
}
export interface BaseFileMeta {
  uploadProgress: number;
}

async function destroyFile() {}

export function blobToFileWrapper<T>(blob: Blob) {}

export async function urlToFileWrapper<T>(url: string | URL, initalMeta: T) {
  /*
    - Download url to blob
    - Convert blob to File
    - 
  */
}

// TODO user will still need to track dirty images if deferring upload
export function useS3<T>(
  initialFiles: FileWrapper<T>[],
  onAdd: (file: File) => FileWrapper<T>,
  onRemove: (file: File) => FileWrapper<T>
) {
  const [files, setFiles] = useState<FileWrapper<T>[]>(initialFiles);
  const updateFile = (file: File, metaChanges: Partial<T>) => {
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

  async function startDestroy(file: FileWrapper<UploadData>) {}

  const augmentedSetFiles: typeof setFiles = (v) => {
    const newValues = typeof v === "function" ? v(files) : v;
    const removedFiles = files.filter((curr) => !newValues.includes(curr));
    const addedFiles = newValues.filter((curr) => !files.includes(curr));

    setFiles(newValues);
  };

  const addRawFiles = (rawFiles: File[], index?: number) => {
    // TODO auto add dataURL for cleaner client code
    augmentedSetFiles((oldFiles) => [
      ...oldFiles.slice(0, index),
      ...rawFiles.map(onAdd),
      ...oldFiles.slice(index),
    ]);
  };

  return { files, setFiles, addRawFiles };
}
// api/iamge
// sasdf/1/20241006/39j-202k-aisi-kdkdk,
