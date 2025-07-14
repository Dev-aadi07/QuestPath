const Card = ({ title, onClick, solved, total }) => {
  return (
    <div 
    onClick={onClick}
    className="
      p-2
      relative
      hover:scale-95
      transition
      cursor-pointer
      rounded-xl w-full
      bg-zinc-950
      border
      border-white/10
      ring-2 ring-white/20
      h-40 flex justify-center items-center  ">
      <h1 className="text-md sm:text-2xl font-bold text-gray-300">{title}</h1>

      <span className="absolute bottom-2 left-3 text-xs text-white/70 px-2 py-[2px] rounded">
        {solved}/{total}
      </span>
    </div>
  );
};

export default Card;
