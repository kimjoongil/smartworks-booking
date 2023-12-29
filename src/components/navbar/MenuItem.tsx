"use client";

interface MenuItemProps {
  onClick: () => void;
  label: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ onClick, label }) => {
  return (
    <div
      onClick={onClick}
      className="p-2 cursor-pointer rounded-md hover:bg-slate-200 hover:text-blue-950 hover:transition-all"
    >
      {label}
    </div>
  );
};

export default MenuItem;
