export interface FileWrapper<T> {
  file: File;
  meta: T;
}

export interface FileReducerAppendAction<T> {
  type: "append";
  wrappedFile: FileWrapper<T>;
}
export interface FileReducerRemoveAction {
  type: "remove";
  file: File;
}
export interface FileReducerRemoveAllAction {
  type: "removeAll";
}
export interface FileReducerUpdateAction<T> {
  type: "update";
  file: File;
  metaChanges: Partial<T>;
}

export type FileReducerAction<T> =
  | FileReducerAppendAction<T>
  | FileReducerRemoveAction
  | FileReducerRemoveAllAction
  | FileReducerUpdateAction<T>;
