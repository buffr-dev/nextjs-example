import { SingleImageInput } from "./_components/single-image-input";
import { stockImageURL } from "./constants";
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center flex-col">
      <SingleImageInput initialURL={stockImageURL} />
    </div>
  );
}
