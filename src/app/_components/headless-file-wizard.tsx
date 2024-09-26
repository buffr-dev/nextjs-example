import { CSSProperties, PropsWithChildren } from "react";
import { ChangeEventHandler, useCallback, useRef } from "react";
import {
  buildFileDropHandler,
  ignoreAndPreventDefault,
} from "../_utils/event-handlers";
import { FileWrapper } from "../_hooks/use-file-manager/types";

const inputStyle: CSSProperties = {
  position: "absolute",
  left: 0,
  top: 0,
  display: "none",
  height: "100%",
  width: "100%",
};

const labelStyle: CSSProperties = {
  position: "relative",
};

const defaultInputName = "file-input";

export interface HeadlessFileWizardProps<M, T extends FileWrapper<M>>
  extends PropsWithChildren {
  inputName?: string;
  onChange: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  disableFileDrop?: boolean;
}

export function HeadlessFileWizard<T>({
  ...props
}: HeadlessFileWizardProps<T>) {
  const inputName = props.inputName || defaultInputName;
  const inputRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   if (!inputRef.current) return;

  //   // Deterministically clear file input after values change.
  //   // Forces developer to submit images through alternative path to standard form submission.
  //   // If form submission workflow is needed, use a VanillaInput instead.
  //   inputRef.current.value = "";
  // });

  const onInputChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      dispatchFileAction({
        type: "update",
        file: e.target.files![0],
        metaChanges: { progress: 20 },
      });
    },
    []
  );

  const dropHandler = useCallback(buildFileDropHandler(onChange), [onChange]);
  const onDrop = props.disableFileDrop ? undefined : dropHandler;
  const onDragOver = props.disableFileDrop
    ? undefined
    : ignoreAndPreventDefault;

  return (
    <label
      htmlFor={inputName}
      style={labelStyle}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      {/* How to enable consumer to own drop styling? data tags? */}
      {props.children}
      <input
        accept={props.accept}
        multiple={props.multiple}
        disabled={props.disabled}
        onChange={onInputChange}
        type="file"
        name={inputName}
        style={inputStyle}
        id={inputName}
      />
    </label>
  );
}
