import { FileReducerAction, FileWrapper } from "./types";

export const createFileReducer =
  <T>() =>
  (files: FileWrapper<T>[], action: FileReducerAction<T>): FileWrapper<T>[] => {
    switch (action.type) {
      case "append":
        return [...files, action.wrappedFile];
      case "remove":
        return files.filter((curr) => curr.file !== action.file);
      case "removeAll":
        return [];
      case "update":
        return files.map((curr) =>
          curr.file !== action.file
            ? curr
            : { ...curr, meta: { ...curr.meta, ...action.metaChanges } }
        );
    }
  };
