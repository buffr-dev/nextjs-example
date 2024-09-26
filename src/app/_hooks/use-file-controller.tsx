import {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface RequestState {
  progress?: number;
  error?: string;
}

interface FileWrapper<T> {
  file: File;
  origin: "local" | "remote";
  meta: T;
}

interface FileUpload<T> extends FileWrapper<T> {
  origin: "local";
  upload: RequestState;
}

interface FileDownload<T> extends FileWrapper<T> {
  origin: "remote";
  download: RequestState;
}

// onAppendfiles() {
//  setFiles(() => [files, ])
// }

// canAddFile() {
// }
// canRemoveFile()
// new FileWrapper(blob: Blob, metadata: T)
// Then comes the requirement of updating progress number (aka FileWroapper.meta.uploadProgress using setState within an array somehow)
// const { files: T[], appendFiles(T[] => void), removeFiles(T[] => void), inputProps: Props, dropTargetProps: Props } = useFileController([new FileWrapper(blob: Blob, metadata: T)], { didAddFiles, didRemoveFiles })
// <input {...inputProps} />
// <div {...dropTargetProps} />
// <button submit={saveServerFunction} />
// export function useFileCtl(
//   didAddFiles: (files: FileWrapper[]) => FileWrapper[],
//   onRemoveFiles: (files: FileWrapper[]) => FileWrapper[]

// ) {
//   return {
//     // inputProps
//     // dropTargetProps
//   };
// }
//

// const [files, setFiles] = useState([])
// const didAddFiles = (newFiles: File[]) => {
//    setFiles([...files, ...newFiles])
//    uploadFiles(p => setFiles(...updatedwithprogress?))
// }
// const didRemoveFiles = (removeFiles: File[]) => {
//   scheduleDestroy(remfiles)
// }

// the only way files are added can be encapsulated in the hook
// files should be able to be REARRANGED external to hook
// the only way files are removed is external to hook
// When files are added, the dev should be able to specify can add and didAdd (upload)
// Should be easy to track metadata along with files...this might be able to be separate from useFileController

// { downloads, downloadStates } = useIdDownloader -- fairly easy
// = { files, setFiles, inputProps, dropProps } = useFileController(downloads, { didAdd, didRemove })
// { uploadToBuffr(file: File, ...): TempId, {uploadState: TempId => {} } }= useFileUploader()

// const { inputProps, dropTargetProps } = useFileInput(files, addFiles)
// const { inputProps, dropTargetProps } = useFileInput({ didAddFiles, didRemoveFiles }) // optional callbacks take raw file objects... I originally wanted to clear input every time files changed for safety but not required, but why would i ever call remove
//
// useFileInputContext

export function useFileController(
  initialFiles: File[],
  options?: { append?: boolean }
) {
  const [files, setFiles] = useState<File[]>(initialFiles || []);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    // Deterministically clear file input after values change.
    // Forces developer to submit images through alternative path to standard form submission.
    // If form submission workflow is needed, use HeadlessFileInput instead.
    inputRef.current.value = "";
  }, [files]);
  // Need some way to process changing images... AHHAHHHSDFH
  // ids of deleted -> delete object call
  // (old, new) => processedBatch
  // addFiles([FileObject], { replace: true })
  // setFiles()
  //
  // strategy: 'append', 'replace'
  function appendFiles(newFiles: File[]) {
    setFiles((oldFiles) => [...oldFiles, ...newFiles]);
  }

  const onInputChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const fileList = e.currentTarget.files || [];
      const newFiles = Array.from(fileList);
      if (options?.append) {
        appendFiles(newFiles);
      } else {
        setFiles(newFiles);
      }
    },
    []
  );

  return {
    files,
    setFiles,
    appendFiles, // -> call onAdd callback for all?
    // removeFiles, -> call onRemove callback for each removed
    // replaceFiles, -> call onAdd and onRemove callback
    inputProps: { onChange: onInputChange, ref: inputRef },
  };
}
