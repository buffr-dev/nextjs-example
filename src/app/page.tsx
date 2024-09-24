import { ImageInput } from "./_components/image-input";
import { stockImageURL } from "./constants";
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center flex-col">
      <ImageInput initialURL={stockImageURL} />
    </div>
  );
}
