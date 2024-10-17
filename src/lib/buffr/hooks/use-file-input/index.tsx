import { ChangeEventHandler, useCallback, useEffect, useRef } from "react";

export function useFileInput(files: any[], onChange: (files: File[]) => void) {
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
      onChange(Array.from(e.target.files || []));
    },
    []
  );

  return {
    onChange: onInputChange,
    ref: inputRef,
  };
}
