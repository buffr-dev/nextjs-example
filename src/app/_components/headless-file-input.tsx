import {
  ChangeEventHandler,
  CSSProperties,
  PropsWithChildren,
  Ref,
} from "react";

export interface HeadlessFileInputProps extends PropsWithChildren {
  inputName?: string;
  inputRef?: Ref<HTMLInputElement>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  accept?: string;
  multiple?: boolean;
}

const inputStyle: CSSProperties = {
  position: "absolute",
  cursor: "pointer",
  left: 0,
  top: 0,
  display: "none",
  height: "100%",
  width: "100%",
};

const labelStyle: CSSProperties = {
  cursor: "pointer",
  position: "relative",
};

const defaultInputName = "file-input";
export function HeadlessFileInput(props: HeadlessFileInputProps) {
  const inputName = props.inputName || defaultInputName;

  return (
    <label htmlFor={inputName} style={labelStyle}>
      {props.children}
      <input
        ref={props.inputRef}
        accept={props.accept}
        multiple={props.multiple}
        onChange={props.onChange}
        type="file"
        name={inputName}
        style={inputStyle}
        id={inputName}
      />
    </label>
  );
}
