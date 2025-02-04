import { useRef } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

export default function Paginator({
  page,
  setPage,
  phases,
}: {
  page: number;
  setPage: (p: number) => void;
  phases: number[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 100; // Adjust for smooth scrolling
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative flex items-center gap-1 rounded-lg border-[#C2C2C2] border-[.1vw] md:rounded-[.6vw] md:gap-[.7vw]">
      <HiChevronLeft
        onClick={() => scroll("left")}
        size={24}
        className="cursor-pointer"
      />
      <div
        ref={scrollRef}
        className="flex gap-1 overflow-x-auto md:gap-[.7vw] w-[6rem] remove-scrollbar scroll-smooth snap-x snap-mandatory md:w-[15rem]"
      >
        {phases.map((i, key) => (
          <p
            key={key}
            onClick={() => setPage(i)}
            className={`py-1 px-3 text-base rounded-lg md:py-[.5vw] md:px-[1vw] cursor-pointer snap-center ${
              page === i && "bg-[#034AA6] font-bold text-white"
            } md:rounded-[.6vw] md:text-[1vw]`}
          >
            {i}
          </p>
        ))}
      </div>
      <HiChevronRight
        onClick={() => scroll("right")}
        size={24}
        className="cursor-pointer"
      />
    </div>
  );
}
