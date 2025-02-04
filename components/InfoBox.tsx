import React from "react";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";

export default function InfoBox({
  header,
  desc,
  increment,
  percent,
  imgSrc,
}: {
  header: string;
  desc: string;
  increment?: boolean;
  percent?: number | string;
  imgSrc?: string;
}) {
  return (
    <div className="flex justify-between items-center p-3 rounded-lg shadow-md shadow-gray-200 transition-transform duration-500 cursor-pointer bg-[--background] md:hover:translate-y-[-8px]">
      <div>
        <h2 className="text-xl font-semibold">{header}</h2>
        <div
          className={`flex gap-6 font-base ${
            imgSrc && (!increment ? "text-[#FC1B1B]" : "text-[#25D366]")
          }`}
        >
          <p>{desc}</p>
          {percent && (
            <div className="flex gap-1">
              {increment ? (
                <BiSolidUpArrow size={20} color="#25D366" />
              ) : (
                <BiSolidDownArrow size={20} color="#FC1B1B" />
              )}
              <p>{percent}%</p>
            </div>
          )}
        </div>
      </div>
      {imgSrc && (
        <div className="w-[2rem] h-[2rem]">
          <img src={imgSrc} className="w-full h-full" />
        </div>
      )}
    </div>
  );
}
