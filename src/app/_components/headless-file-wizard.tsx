import {
  ChangeEventHandler,
  CSSProperties,
  forwardRef,
  PropsWithChildren,
} from "react";

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

export interface HeadlessFileWizardProps extends PropsWithChildren {
  inputName?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
}

export const HeadlessFileInput = forwardRef<
  HTMLInputElement,
  HeadlessFileWizardProps
>((props, ref) => {
  const inputName = props.inputName || defaultInputName;

  return (
    <label htmlFor={inputName} style={labelStyle}>
      {props.children}
      <input
        ref={ref}
        accept={props.accept}
        multiple={props.multiple}
        disabled={props.disabled}
        onChange={props.onChange}
        type="file"
        name={inputName}
        style={inputStyle}
        id={inputName}
      />
    </label>
  );
});
