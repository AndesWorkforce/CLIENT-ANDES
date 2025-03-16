export default function Logo() {
  return (
    <div className="flex items-center">
      <img
        src="/logo-andes.png"
        alt="Andes Workforce"
        className="h-8"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src =
            "https://via.placeholder.com/120x40?text=Andes+Workforce";
        }}
      />
    </div>
  );
}
