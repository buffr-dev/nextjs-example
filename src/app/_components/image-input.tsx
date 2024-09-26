"use client";

import clsx from "clsx";
import { HeadlessFileInput } from "./headless-file-input";
import { uploadImage } from "../_actions/upload-image";
import { useFileInput } from "../_hooks/use-file-input";
import { useFileDrop } from "../_hooks/use-file-drop";
import { useFileWizardUploader } from "../_hooks/use-file-wizard-uploader";

interface Props {
  initialURL?: string | null;
}

interface UploadedImage<D> {
  file: File;
  data: D;
}

export function ImageInput(props: Props) {
  const { files, setFiles, addRawFiles } = useFileWizardUploader();

  const inputProps = useFileInput(
    files.map((f) => f.file),
    addRawFiles
  );
  const fileDropProps = useFileDrop(addRawFiles);

  return (
    <div className="border-2 rounded-md overflow-clip w-full">
      <HeadlessFileInput
        accept="image/*"
        inputName="uploader"
        multiple
        {...inputProps}
      >
        <div
          className={clsx(
            "flex items-center justify-center",
            "w-full h-[250px] text-foreground",
            "text-foreground relative bg-gray-200",
            "hover:bg-gray-200/80 cursor-pointer"
          )}
          {...fileDropProps}
        >
          {files.length > 0 && (
            <div className="flex gap-6 justify-start w-full h-full flex-wrap overflow-y-scroll p-4">
              {files.map((f, i) => (
                <div className="bg-background p-2 shadow-md shadow-slate-500/50 h-40 relative rounded-sm">
                  <img
                    key={f.file.name}
                    className=" w-full h-full object-cover"
                    // TODO release object urls
                    src={URL.createObjectURL(f.file)}
                  />

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
          onClick={async () => {
            if (!files) return;

            const formData = new FormData();
            formData.append("file", files[0].file);

            await uploadImage(formData);
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}
