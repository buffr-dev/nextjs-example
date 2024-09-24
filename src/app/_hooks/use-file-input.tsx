"use client";

import { ChangeEventHandler, useCallback, useEffect, useState } from "react";

export function useFileInput(initialDataURL?: string | null) {
  const [dataURL, setDataURL] = useState(initialDataURL);
  const [file, setFile] = useState<File | null>(null);

  const onInputChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      if (!e.target.files) return;

      const currentFile = e.target.files[0];

      setFile(currentFile);
      setDataURL(URL.createObjectURL(currentFile));
    },
    []
  );

  const clear = useCallback(() => {
    setDataURL(null);
    setFile(null);
  }, []);

  useEffect(() => {
    setDataURL(initialDataURL);
    // todo do something with file here?
  }, [initialDataURL]);

  console.log("INITIAL URL", initialDataURL);
  return { file, dataURL, onInputChange, clear };
}
