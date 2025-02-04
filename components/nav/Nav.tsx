"use client";
import React, { useState } from "react";
import Link from "next/link";
import MobileNav from "./MobileNav";
import { AiOutlineMenu } from "react-icons/ai";

export default function Nav({ activeLink }: { activeLink: string }) {
  const [showDropDown, setShowDropDown] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="w-[95%]">
          <div className="flex items-center justify-between">
            <Link href="/">
              <img
                src="/full-icon.png"
                className="w-[8rem] h-[4rem] lg:h-[8vh] lg:w-[10rem]"
              />
            </Link>
            <div className="hidden md:flex md:items-center gap-8">
              <Link
                href="/"
                className={`font-semibold text-base ${
                  activeLink === "Home" ? "text-[#034AA6]" : "text-[#646464]"
                } hover:underline md:text-[1vw]`}
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
            <button
              onClick={() => setShowDropDown(true)}
              className="block md:hidden"
            >
              <AiOutlineMenu size={32} color="white" />
            </button>
          </div>
        </div>
      </div>
      <MobileNav
        activeLink={activeLink}
        showDropDown={showDropDown}
        setShowDropDown={setShowDropDown}
      />
    </>
  );
}
