import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link
      to="/"
      className={"text-2xl font-bold trackinf-tighter transition-all"}
    >
      <p className="hidden lg:block">
        WALLY
        <span className="text-[#d88c6f]">SUMA</span>
      </p>

      <p className="flex text-4x1 lg:hidden">
        <span className="-skew-x-6">W</span>
        <span className="text-[#d88c6f] skew-x-6">SUMA</span>
      </p>
    </Link>
  );
};
