type Props = {
  image: string;
  title: string;
  desc: string;
};

export default function LogoCard({ image, title, desc }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <img src={image} alt={title} className="w-full h-40 object-cover" />
      <div className="p-3">
        <h2 className="font-bold text-lg">{title}</h2>
        <p className="text-gray-600 text-sm">{desc}</p>
      </div>
    </div>
  );
}