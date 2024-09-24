import { ChangeEventHandler, useCallback, useEffect, useRef } from "react";
import {
  HeadlessFileInput,
  HeadlessFileInputProps,
} from "./headless-file-input";

interface HeadlessFileSelectorProps extends HeadlessFileInputProps {
  values: Blob[];
  onChangeValues: (values: Blob[]) => void;
}

export function HeadlessFileSelector({
  values,
  onChangeValues,
  ...props
}: HeadlessFileSelectorProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    // Deterministically clear file input after values change.
    // Forces developer to submit images through alternative path to standard form submission.
    // If form submission workflow is needed, use HeadlessFileInput instead.
    inputRef.current.value = "";
  }, [values]);

  const onInputChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const fileList = e.target.files;
      if (!fileList) {
        onChangeValues([]);
        return;
      }

      let values: Blob[] = [];
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList.item(i);
        if (file) {
          values.push(file);
        }
      }

      onChangeValues(values);
    },
    []
  );

  return (
    <HeadlessFileInput
      inputRef={inputRef}
      onChange={onInputChange}
      {...props}
    />
  );
}
