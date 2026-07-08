import Link from "next/link";
import LogoCard from "@/components/LogoCard";

interface Template {
  id:         string;
  image:      string;
  title:      string;
  desc:       string;
  category:   string;
  folderName: string | null;
  createdAt?: string;
}

interface Props {
  templates: Template[];
}

export default function NewestTemplates({ templates }: Props) {
  return (
    <section className="bg-white px-6 md:px-16 py-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">

        <h2 className="text-center text-3xl md:text-4xl font-bold text-[#1A4450] mb-10">
          Newest Templates
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {templates.map((t) => (
            <LogoCard key={t.id} {...t} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/templates/all"
            className="inline-block bg-[#1A4450] text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-[#1A4450]/80 transition"
          >
            See all templates →
          </Link>
        </div>
      </div>
    </section>
  );
}