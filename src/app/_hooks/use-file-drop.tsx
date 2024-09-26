import {
  buildFileDropHandler,
  ignoreAndPreventDefault,
} from "../_utils/event-handlers";

export function useFileDrop(onChange: (newFiles: File[]) => void) {
  return {
    onDrop: buildFileDropHandler(onChange),
    onDragOver: ignoreAndPreventDefault,
  };
}
