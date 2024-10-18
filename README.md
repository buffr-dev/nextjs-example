This is a working prototype of a new library for file uploads for Next.js. 

# Motivation
@buffr/next is an experimental headless UI library that simplifies file upload. Adding file upload to your app has a few gotchas related to styling and ux, as well as backend complications. This library seeks to abstract those gotchas away.

# Usage
Building a user-friendly upload component is fairly simple, and @buffr/next makes this even easier with an unstyled UI component and a custom React hook. Use these modules together for simplest implementation, or compose them as needed for more complex setups.

**Why not use a simple useState hook to track files?**

The `useFileUploader` hook...
- handles presigning, image posting and upload progress tracking using React Server Actions
- makes it easy to store additional metadata alongside the uploaded files
- makes it easy to take action on removed files

## HeadlessFileInput
`HeadlessFileInput` accepts the following props that are propagated to its children in a pragmatic way:
- `accept`: Mime type of what file-types are accepted, default: `*`
- `disabled`: Do not allow user interaction, default: `false`
- `inputName`: the name of the HTML element, default: `file-input`
- `multiple`: Allow the user to select multiple files from the dialog, default: `false`
- `onDrop`: Respond to drop event. Handled by useFileUploader.
- `onDragOver`: Respond to dragover event. Handled by useFileUploader.
- `onChange`: vanilla input onChange handler. Handled by useFileUploader.
- `ref`: a React ref to the raw HTML input element. Handled by useFileUploader.

## useFileUploader(initialFiles: FileWrapper[], config?: FileUploadConfig)
For security purposes, HTML file inputs are not able to be true "controlled components". `useFileUploader` allows a more ergonomic control over the files by wrapping them with additional state. With this control, you can easily accomplish upload progress tracking, dirty/reupload flags, and more.

### Parameters
Call this hook with the following arguments:
- `initialFiles`: The initial FileWrapper objects, likely presaved images from another session. Use this on edit pages and any other pages where you want a default value. This value can be set once on initial render for initialization purposes and is subsequently ignored.
- `config.s3KeyGenerator`: Customize the key for a file right before upload. This is where you can generate a UUID or add any additional keys you might want to include in the S3 Key. Defaults to file.name.
- `config.authAction`: Optional call to check that the current user is authenticated. Use this if the presign route is not intercepted by authorization middleware.
- `config.uploadPresignAction`: Completely override the presigning S3 call. When this is specified, `s3KeyGenerator` and `authAction` are ignored. Use this to generate a presigned URL for an alternative provider.
- `config.append`: When true, new files that are added will be appended to the existing set rather than replacing it.  Default `false`. 
When tracking extra meta alongside files, use `useFileUploaderWithMeta` instead. This hook just has one additional parameter for initialMeta which is given to newly added RawFiles:

`useFileUploaderWithMeta<T>(initialFiles: FileWrapper[], initialMeta: T, config?: FileUploadConfig)`

For example, if you wanted to track a dirty flag along with your file, you could call: `useFileUploaderWithMeta([], { dirty: true })` and every new file would have a dirty flag already set for later reference. 

### Return Values
The `useFileUploader` hook returns an object with the following keys: 
- `files`: array of `FileWrapper<T>`instances. See below for more details on the `FileWrapper<T>` interface
- `setFiles`: update above `files` array similar to setState. Use this for functionality where you need to filter or clear current files.
- `removedFiles`: Array of any files that were removed during a call to `setFiles`. Use this to destroy rows, or perform additional processing as needed.
- `updateFileMeta(file: File, meta: Partial<T>)`: If custom meta is being tracked, use this function to update the stored custom data for a given file.
- `uploadAll`: Upload all objects in the current `files` array that have not begun uploading yet (uploadProgress = 0)
- `uploadFile`: Upload a given file to the calculated presigned URL. 
- `propPartials.inputProps`: Handlers and ref connection to be passed to the input element to be controlled. It is highly recommended to use this as this is how much of the magic happens (e.g. `<HeadlessFileInput {...propPartial.inputProps} />`)
- `propPartials.dropzoneProps`: Optionally set this on the `HeadlessFileInput` or anywhere you want to accept file drops.

The `FileWrapper<T>` interface has a few properties:
- `file`: The raw file that the user uploaded. You can also build a File object using the Blob API when initializing the `useFileUploader` hook.
- `uploadProgress`: A number from 0 to 100 representing percentage completion of a POST request to the presign URL. 
- `source`: When setting initial values for the `useFileUploader` hook, feel free to set this to `initial` to keep track of which files were added by the user during the current session. Otherwise, this value is set to `input` to indicate that it as added by the `input`
- `meta`: Save a custom data object alongside your files when using the hook `useFileUploaderWithMeta`. This can enable easy tracking of dirty flags, rotation angles, and more.

## Example
```tsx
// This is the general concept, example is not tested

const { files, setFiles, propPartials, uploadAll } = useFileUploader([]);

<HeadlessFileInput
        accept="image/*"
        inputName="uploader"
        multiple
        {...propPartials.inputProps}
        {...propPartials.dropzoneProps}
      >
  {files.length === 0 && <div>Click here to upload something</div>}
  {files.length > 0 && files.map((f: WrappedFile) => {
      return <div key={f._id}>File: {f.file.name}</div>
    })
  }
</HeadlessFileInput>
```
# Potential Future Work
- [ ] Multipart upload support for files larger than 100 MB 
- [ ] Resumable upload support using Tus
