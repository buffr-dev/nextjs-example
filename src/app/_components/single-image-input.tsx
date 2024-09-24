"use client";

import clsx from "clsx";
import { HeadlessFileInput } from "./headless-file-input";
import { useFileInput } from "../_hooks/use-file-input";
import { useImageDownloader } from "../_hooks/use-image-downloader";
import { useRef } from "react";

interface Props {
  initialURL?: string | null;
}
export function SingleImageInput(props: Props) {
  const { blobDataURL } = useImageDownloader(props.initialURL);
  const { dataURL, onInputChange, clear } = useFileInput(blobDataURL);
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      {dataURL && <img className="size-96 rounded-md" src={dataURL} />}
      <HeadlessFileInput
        values={[blobDataURL]}
        onChange={onInputChange}
        accept="image/*"
        inputName="uploader"
        inputRef={inputRef}
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
      </HeadlessFileInput>
      <button
        onClick={() => {
          clear();
          if (inputRef.current) inputRef.current.value = "";
        }}
      >
        Clear
      </button>
    </>
  );
}
4;
