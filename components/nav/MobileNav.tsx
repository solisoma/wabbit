import React, { SetStateAction } from "react";
import Link from "next/link";
import { RxCross2 } from "react-icons/rx";

export default function MobileNav({
  showDropDown,
  setShowDropDown,
  activeLink,
}: {
  activeLink: string;
  showDropDown: boolean;
  setShowDropDown: React.Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div
      onClick={(e) =>
        (e.target as any).id == "parent" && setShowDropDown(false)
      }
      id="parent"
      className={`absolute block z-[999] top-0 h-[100vh] w-[100vw] bg-[#00000050] ${
        showDropDown ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-700 md:hidden`}
    >
      <div className="flex items-center justify-between px-2 bg-[#1F2127] w-[70%] h-[15%]">
        <Link href="/">
          <img src="/full-icon.png" className="w-[3rem]" />
        </Link>
        <button onClick={() => setShowDropDown(false)}>
          <RxCross2 color="white" size={32} />
        </button>
      </div>
      <div className="px-8 w-[70%] h-[85%] bg-[#1F2127]">
        <div className="flex flex-col justify-between gap-4">
          <Link
            href="/"
            className={`font-medium text-base ${
              activeLink === "Home" ? "text-[#034AA6]" : "text-white"
            }`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`font-medium text-base ${
              activeLink === "About Us" ? "text-[#034AA6]" : "text-white"
            }`}
          >
            About Us
          </Link>
        </div>
      </div>
    </div>
  );
}
