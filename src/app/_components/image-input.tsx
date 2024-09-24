"use client";

import clsx from "clsx";
import { useCallback, useEffect } from "react";
import { useImageDownloader } from "../_hooks/use-image-downloader";
import { HeadlessFileInput } from "./headless-file-input";
import { useFileController } from "../_hooks/use-file-controller";
import {
  buildFileDropHandler,
  ignoreAndPreventDefault,
} from "../_utils/event-handlers";

interface Props {
  initialURL?: string | null;
}

interface NamedBlob extends Blob {
  name: string;
}

export function ImageInput(props: Props) {
  const fileController = useFileController([]);
  const appendFiles = useCallback(
    (files: File[]) => fileController.setFiles((f) => [...f, ...files]),
    []
  );
  const onDrop = useCallback(buildFileDropHandler(appendFiles), []);

  const { blob } = useImageDownloader(props.initialURL);

  useEffect(() => {
    const files = blob
      ? [new File([blob], "initial-blob", { type: blob.type })]
      : [];
    fileController.setFiles(files);
  }, [blob]);

  return (
    <>
      <div className="flex gap-4">
        {fileController.files.map((f) => (
          <img
            key={f.name}
            className="size-32 rounded-md"
            src={URL.createObjectURL(f)}
          />
        ))}
      </div>
      <HeadlessFileInput
        onChange={fileController.onInputChange}
        inputRef={fileController.inputRef}
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
          onDrop={onDrop}
          onDragOver={ignoreAndPreventDefault}
        >
          <div>Upload</div>
        </div>
      </HeadlessFileInput>
      <button
        onClick={() => {
          fileController.setFiles([]);
        }}
      >
        Clear
      </button>
    </>
  );
}
4;
