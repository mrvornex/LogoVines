import Navbar from "@/components/Navbar";
import UserUploadForm from "@/components/UserUploadForm";

export default function UploadPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <Navbar />
      <div className="pt-20">
        <UserUploadForm />
      </div>
    </div>
  );
}