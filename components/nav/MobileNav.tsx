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
      <div className="flex items-center justify-between px-2 pt-8 pb-10 bg-[#1F2127] w-[70%] h-[15%]">
        <Link href="/">
          <img src="/full-icon.png" className="w-[10rem]" />
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
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://x.com/WABBIT_MEME?t=m_8K5xjW41nkJ8pp5U77Yw&s=09"
            className={`font-semibold text-base ${
              activeLink === "Gallery" ? "text-[#034AA6]" : "text-[#646464]"
            } hover:underline md:text-[1vw]`}
          >
            Twitter
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://t.me/WABBIT_MEME_777"
            className={`font-semibold text-base ${
              activeLink === "Gallery" ? "text-[#034AA6]" : "text-[#646464]"
            } hover:underline md:text-[1vw]`}
          >
            Telegram
          </a>
        </div>
      </div>
    </div>
  );
}
