import {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export function useFileController(initialFiles?: File[]) {
  const [files, setFiles] = useState<File[]>(initialFiles || []);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    // Deterministically clear file input after values change.
    // Forces developer to submit images through alternative path to standard form submission.
    // If form submission workflow is needed, use HeadlessFileInput instead.
    inputRef.current.value = "";
  }, [files]);

  const onInputChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const fileList = e.currentTarget.files;
      if (!fileList) {
        setFiles([]);
        return;
      }

      let values: File[] = [];
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList.item(i);
        if (file) {
          values.push(file);
        }
      }
      console.log(values);
      setFiles(values);
    },
    []
  );

  return { files, setFiles, onInputChange, inputRef };
}
