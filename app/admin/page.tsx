import Navbar from "@/components/Navbar";
import LogoutButton from "@/components/LogoutButton";
import UploadForm from "@/components/UploadForm";
import TemplateUploadForm from "@/components/TemplateUploadForm";
import AdminLogoManager from "@/components/AdminLogoManager";
import AdminDashboard from "@/components/AdminDashboard";
import PendingApprovals from "@/components/PendingApprovals";
import { connectDB } from "@/lib/mongodb";
import Logo from "@/models/Logo";

type ActiveTab = "dashboard" | "pending" | "brand-upload" | "template-upload" | "manage";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const activeTab = (tab as ActiveTab) || "dashboard";

  await connectDB();
  const pendingCount = await Logo.countDocuments({ status: "pending" });
  const logosDocs    = await Logo.find().sort({ createdAt: -1 }).lean();
  const logos = logosDocs.map((l: any) => ({
    _id: l._id.toString(), imageUrl: l.imageUrl, title: l.title, desc: l.desc,
    category: l.category || "Uncategorized", folderName: l.folderName || null, createdAt: l.createdAt?.toISOString(),
  }));

  const tabs = [
    { key: "dashboard",       label: "📊 Dashboard"      },
    { key: "pending",         label: `⏳ Pending${pendingCount > 0 ? ` (${pendingCount})` : ""}` },
    { key: "brand-upload",    label: "🏷 Brand Upload"    },
    { key: "template-upload", label: "🖼 Template Upload" },
    { key: "manage",          label: "🗂 Manage"          },
  ];

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <Navbar />
      <div className="pt-25 px-6 md:px-16 py-4 flex items-center justify-between border-b border-white/5">
        <div>
          <p className="text-[#d4a373] text-xs uppercase tracking-widest">LogoVines</p>
          <h1 className="text-white font-bold text-lg">Admin Panel</h1>
        </div>
        <LogoutButton />
      </div>
      <div className="border-b border-white/5 px-6 md:px-16 overflow-x-auto">
        <div className="flex gap-0 min-w-max">
          {tabs.map((t) => (
            <a key={t.key} href={`/admin?tab=${t.key}`}
              className={`px-6 py-4 text-xs font-semibold uppercase tracking-widest border-b-2 transition-all duration-200 whitespace-nowrap ${
                activeTab === t.key ? "border-[#d4a373] text-[#d4a373]" : "border-transparent text-gray-500 hover:text-white"
              } ${t.key === "pending" && pendingCount > 0 ? "text-yellow-400" : ""}`}
            >{t.label}</a>
          ))}
        </div>
      </div>
      {activeTab === "dashboard"       && <AdminDashboard />}
      {activeTab === "pending"         && <PendingApprovals />}
      {activeTab === "brand-upload"    && <UploadForm />}
      {activeTab === "template-upload" && <TemplateUploadForm />}
      {activeTab === "manage"          && <AdminLogoManager initialLogos={logos} />}
    </div>
  );
}