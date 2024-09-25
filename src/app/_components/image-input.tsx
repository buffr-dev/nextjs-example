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
import { uploadImage } from "../_actions/upload-image";

interface Props {
  initialURL?: string | null;
}

export function ImageInput(props: Props) {
  const fileController = useFileController([], { append: true });

  const onDrop = useCallback(
    buildFileDropHandler(fileController.appendFiles),
    []
  );

  const { blob } = useImageDownloader(props.initialURL);

  // TODO actual file upload?
  // TODO how to know if dirty or needs upload in action?

  useEffect(() => {
    const files = blob
      ? [new File([blob], "initial-blob", { type: blob.type })]
      : [];
    fileController.setFiles(files);
  }, [blob]);

  return (
    <div className="border-2 rounded-md overflow-clip w-full">
      <HeadlessFileInput
        accept="image/*"
        inputName="uploader"
        multiple
        {...fileController.inputProps}
      >
        <div
          className={clsx(
            "flex items-center justify-center",
            "w-full h-[250px] text-foreground",
            "text-foreground relative bg-gray-200",
            "hover:bg-gray-200/80 cursor-pointer"
          )}
          onDrop={onDrop}
          onDragOver={ignoreAndPreventDefault}
        >
          {fileController.files.length > 0 && (
            <div className="flex gap-6 justify-start w-full h-full flex-wrap overflow-y-scroll p-4">
              {fileController.files.map((f, i) => (
                <div className="bg-background p-2 shadow-md shadow-slate-500/50 h-40 relative rounded-sm">
                  <img
                    key={f.name}
                    className=" w-full h-full object-cover"
                    // TODO release object urls
                    src={URL.createObjectURL(f)}
                  />

                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      fileController.setFiles((files) =>
                        files.filter((_, index) => i !== index)
                      );
                    }}
                    className="bg-background cursor-pointer shadow-slate-500/50 shadow-sm hover:bg-gray-100 top-[-10px] right-[-10px] absolute rounded-full size-6 flex items-center text-sm justify-center"
                  >
                    x
                  </div>
                </div>
              ))}
            </div>
          )}
          {fileController.files.length === 0 && (
            <div>Click or Drag Files to Upload</div>
          )}
        </div>
      </HeadlessFileInput>
      <div className="flex flex-row-reverse border-t-2 border-gray-300">
        <button
          className="bg-background text-foreground p-2 hover:brightness-150 dark:hover:brightness-50 rounded-md"
          onClick={async () => {
            if (!fileController.files) return;

            const formData = new FormData();
            formData.append("file", fileController.files[0]);

            await uploadImage(formData);
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}
4;
