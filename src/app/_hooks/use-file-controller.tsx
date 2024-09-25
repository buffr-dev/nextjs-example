import {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export function useFileController(
  initialFiles?: File[],
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
    appendFiles,
    inputProps: { onChange: onInputChange, ref: inputRef },
  };
}
