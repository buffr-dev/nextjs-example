"use client";

import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { useImageDownloader } from "../_hooks/use-image-downloader";
import { HeadlessFileSelector } from "./headless-file-selector";

interface Props {
  initialURL?: string | null;
}

interface NamedBlob extends Blob {
  name: string;
}

export function ImageInput(props: Props) {
  const [values, setValues] = useState<Blob[]>([]);
  const { blob } = useImageDownloader(props.initialURL);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValues(blob ? [blob] : []);
  }, [blob]);

  const dataURL = useMemo(() => {
    if (!values || values.length === 0) return null;
    // TODO object urls are not released...
    return URL.createObjectURL(values[0]);
  }, [values]);

  return (
    <>
      {dataURL && <img className="size-96 rounded-md" src={dataURL} />}
      <HeadlessFileSelector
        values={values}
        onChangeValues={(newValues) => {
          setValues(newValues);
        }}
        accept="image/*"
        inputName="uploader"
        multiple
      >
        <div
          className={clsx(
            "p-3 cursor-pointer flex items-center justify-center",
            "w-full h-full rounded-md border-dashed border-2 text-foreground",
            "hover:brightness-75 text-foreground mt-6"
          )}
        >
          {!dataURL && <div>Upload</div>}
          {dataURL && <div>Change</div>}
        </div>
      </HeadlessFileSelector>
      <button
        onClick={() => {
          setValues([]);
        }}
      >
        Clear
      </button>
    </>
  );
}
4;
