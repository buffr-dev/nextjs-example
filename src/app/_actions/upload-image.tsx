"use server";

export async function uploadImage(formData: FormData) {
  const file = formData.get("file") as File;
  const data = await file.arrayBuffer();
  console.log(
    "UPLOAD TO BUFFR WITH SECRET",
    process.env.BUFFR_SECRET,
    data.byteLength
  );
}

function getSignedURLExample(id: string, filters: any) {
  // If v0.0.1 is a thumbor URL, can change in future versions
  // - e.g. v0.1.0 uses imgproxy now!
  const hmac = "as93snakvk93k3ks09"; // signed with expiration date
  return `https://cdn.buffr.dev/${hmac}/${id}?${filters.toString()}&expires=1000`;
}
// supabase for file storage
// buffr
