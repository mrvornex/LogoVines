import Navbar from "@/components/Navbar";
import LogoutButton from "@/components/LogoutButton";
import UploadForm from "@/components/UploadForm";
import AdminLogoManager from "@/components/AdminLogoManager";
import AdminDashboard from "@/components/AdminDashboard";
import { connectDB } from "@/lib/mongodb";
import Logo from "@/models/Logo";
import TemplateUploadForm from "@/components/TemplateUploadForm";

type ActiveTab = "dashboard" | "brand-upload" | "template-upload" | "manage";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab = (tab as ActiveTab) || "dashboard";

  await connectDB();
  const logosDocs = await Logo.find().sort({ createdAt: -1 }).lean();
  const logos = logosDocs.map((l: any) => ({
    _id:        l._id.toString(),
    imageUrl:   l.imageUrl,
    title:      l.title,
    desc:       l.desc,
    category:   l.category || "Uncategorized",
    folderName: l.folderName || null,
    createdAt:  l.createdAt?.toISOString(),
  }));

  const tabs = [
    { key: "dashboard",       label: "📊 Dashboard"         },
    { key: "brand-upload",    label: "🏷 Brand Upload"       },
    { key: "template-upload", label: "🖼 Template Upload"    },
    { key: "manage",          label: "🗂 Manage"             },
  ];

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <Navbar />

      {/* Top bar */}
      <div className="pt-20 px-6 md:px-16 py-4 flex items-center justify-between border-b border-white/5">
        <div>
          <p className="text-[#d4a373] text-xs uppercase tracking-widest">LogoVines</p>
          <h1 className="text-white font-bold text-lg">Admin Panel</h1>
        </div>
        <LogoutButton />
      </div>

      {/* Tab bar */}
      <div className="border-b border-white/5 px-6 md:px-16 overflow-x-auto">
        <div className="flex gap-0 min-w-max">
          {tabs.map((t) => (
            <a key={t.key} href={`/admin?tab=${t.key}`}
              className={`px-6 py-4 text-xs font-semibold uppercase tracking-widest border-b-2 transition-all duration-200 whitespace-nowrap ${
                activeTab === t.key ? "border-[#d4a373] text-[#d4a373]" : "border-transparent text-gray-500 hover:text-white"
              }`}
            >{t.label}</a>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === "dashboard"       && <AdminDashboard />}
      {activeTab === "brand-upload"    && <UploadForm />}
      {activeTab === "template-upload" && <TemplateUploadForm />}
      {activeTab === "manage"          && <AdminLogoManager initialLogos={logos} />}
    </div>
  );
}