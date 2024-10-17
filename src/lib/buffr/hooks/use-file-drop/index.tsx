import {
  buildFileDropHandler,
  ignoreAndPreventDefault,
} from "../../utils/event-handlers";

export function useFileDrop(onChange: (newFiles: File[]) => void) {
  return {
    onDrop: buildFileDropHandler(onChange),
    onDragOver: ignoreAndPreventDefault,
  };
}
