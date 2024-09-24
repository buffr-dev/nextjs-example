import { ChangeEventHandler, CSSProperties, Ref, useMemo } from "react";

interface Props extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  inputName?: string; // implement onchange but for this
  onChange?: ChangeEventHandler<HTMLInputElement>;
  accept?: string;
  multiple?: boolean;
  inputRef?: Ref<HTMLInputElement>;
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

export function HeadlessFileInput(props: Props) {
  const inputName = useMemo(() => {
    if (props.inputName) return props.inputName;

    // default to a unique id if no name is given
    return ["file-input", new Date().getTime()].join("-");
  }, [props.inputName]);

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

{
  /* <ImageInput onChange={d => setDroppedFile(d)}>
  <Card url={}></Card>
</ImageInput> */
}

// const progressMap = useUploadProgress()

// export const buffr = new BuffrClient(key: K)
// const res: { id: string, errors: { [field]: string[] } } = await buffr.uploadImageFile(dropped.file)

interface SingleImageUploader {}

interface MultiImageUploader {}
