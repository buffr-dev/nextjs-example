"use client";

import clsx from "clsx";
import { HeadlessFileInput } from "../../lib/buffr/components/headless-file-input";
import { useFileUploader } from "@/lib/buffr/hooks/use-file-uploader";

interface Props {
  initialURL?: string | null;
}

export function ImageInput(props: Props) {
  const { files, setFiles, propPartials, uploadAll } = useFileUploader([]);

  return (
    <div className="border-2 rounded-md overflow-clip w-full">
      <HeadlessFileInput
        accept="image/*"
        inputName="uploader"
        multiple
        {...propPartials.inputProps}
        {...propPartials.dropzoneProps}
      >
        <div
          className={clsx(
            "flex items-center justify-center",
            "w-full h-[250px] text-foreground",
            "text-foreground relative bg-gray-200",
            "hover:bg-gray-200/80 cursor-pointer"
          )}
        >
          {files.length > 0 && (
            <div className="flex gap-6 justify-start w-full h-full flex-wrap overflow-y-scroll p-4">
              {files.map((f, i) => (
                <div
                  key={f._id}
                  className="bg-background p-2 shadow-md shadow-slate-500/50 h-40 relative rounded-sm"
                >
                  <img
                    className=" w-full h-full object-cover"
                    src={URL.createObjectURL(f.file)}
                  />
                  {f.uploadProgress < 1 && (
                    <div className="absolute top-0 left-0 w-full h-full flex items-center flex-col bg-white/50 rounded-md justify-center">
                      <div>Uploading...</div>
                      {(f.uploadProgress * 100).toFixed(0) + "%"}
                    </div>
                  )}
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      setFiles((files) =>
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
          {files.length === 0 && <div>Click or Drag Files to Upload</div>}
        </div>
      </HeadlessFileInput>
      <div className="flex flex-row-reverse border-t-2 border-gray-300">
        <button
          className="bg-background text-foreground p-2 hover:brightness-150 dark:hover:brightness-50 rounded-md"
          onClick={uploadAll}
        >
          Save
        </button>
      </div>
    </div>
  );
}
