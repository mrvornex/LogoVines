import Navbar from "@/app/components/Navbar";
import LogoCard from "@/app/components/LogoCard";

export default function Home() {

  const logos = [
    {
      image: "/logos/logo1.png",
      title: "Gaming Logo",
      desc: "Cool gaming style logo"
    },
    {
      image: "/logos/logo2.png",
      title: "Tech Logo",
      desc: "Modern tech brand logo"
    },
    {
      image: "/logos/logo3.png",
      title: "Esports Logo",
      desc: "Professional esports logo"
    }
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      
      <Navbar />

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {logos.map((logo, index) => (
          <LogoCard
            key={index}
            image={logo.image}
            title={logo.title}
            desc={logo.desc}
          />
        ))}
      </div>

    </div>
  );
}