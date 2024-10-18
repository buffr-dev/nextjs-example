const fiftyMegabytes = 50_000_000;

function getProgress(event: ProgressEvent) {
  if (!event.lengthComputable) {
    console.warn(
      "Total file upload length not yet computable, assuming file is maximum size."
    );
  }

  const fileLength = event.lengthComputable ? event.total : fiftyMegabytes;
  return event.loaded / fileLength;
}

export async function uploadFileWithProgress(
  presignedUrl: string,
  formData: FormData,
  onProgress?: (progress: number) => void
) {
  // const presignedUrl = await createPresignedUrl();
  const req = new XMLHttpRequest();
  req.upload.addEventListener("loadstart", (event) => {
    const progress = getProgress(event);
    // Progress == 0, do nothing for now...
    console.log("Upload Start: ", progress);
  });
  req.upload.addEventListener("progress", (event) => {
    // check progress < 1
    const progress = getProgress(event);
    console.log("Upload Progress: ", progress);
    if (onProgress && progress < 1) onProgress(progress);
  });
  req.upload.addEventListener("load", (event) => {
    // upload completed successfully
    const progress = getProgress(event);
    console.log("Upload Load: ", progress);
    if (onProgress) onProgress(1);
  });
  req.upload.addEventListener("abort", (event) => {
    // upload cancelled
    console.error("Upload Aborted");
  });
  req.upload.addEventListener("error", (event) => {
    // upload failed due to unexpected error
    console.error("Upload Error");
  });
  req.upload.addEventListener("timeout", (event) => {
    // upload ran out of time... upload failed
    console.error("Upload Error");
  });
  req.upload.addEventListener("loadend", (event) => {
    const progress = getProgress(event);
    // success or fail
    console.log("Upload End: ", progress);
  });

  req.open("POST", presignedUrl);

  req.send(formData);
}
