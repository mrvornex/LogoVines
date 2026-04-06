export default function Navbar() {
  return (
    <nav className="w-full bg-black text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">LogoAI</h1>
      <button className="bg-white text-black px-4 py-2 rounded">
        Admin
      </button>
    </nav>
  );
}