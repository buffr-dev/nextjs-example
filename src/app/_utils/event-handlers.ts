import { DragEventHandler, EventHandler, SyntheticEvent } from "react";

export function buildFileDropHandler<T>(
  receivedFiles: (files: File[]) => void
): DragEventHandler<T> {
  return (e) => {
    e.preventDefault();
    receivedFiles(Array.from(e.dataTransfer.files));
  };
}

export const ignoreAndPreventDefault: EventHandler<SyntheticEvent<any>> = (
  e
) => {
  e.preventDefault();
};
