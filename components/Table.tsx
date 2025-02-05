import React, { useEffect, useRef, useState } from "react";
import { Holders } from "./data.type";
import { get_token_holders } from "@/api/default";
import { FaRegCopy } from "react-icons/fa6";
import { toast } from "react-toastify";
import { RiArrowDownSFill, RiArrowUpSFill } from "react-icons/ri";
import { CgSearchLoading } from "react-icons/cg";
import Paginator from "./Paginator";

export default function Table() {
  const [holders, setHolders] = useState<Holders[]>();
  const [sortedHolders, setSortedHolders] = useState<Holders[]>();
  const [entries, setEntries] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [sortAscState, setSortAscState] = useState({
    bought: true,
    sold: true,
    balance: true,
    badge: true,
  });
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const calc_balance_change = (details: Holders) =>
    ((details.balance - details.total_incoming) * 100) / details.total_incoming;

  const get_class_color = (classification: string) => {
    switch (classification) {
      case "Holder":
        return "text-[#007bff]";
      case "Accumulator":
        return "text-[#fd7e14]";
      case "Diamond Hand":
        return "text-[#28a745]";
      default:
        return "text-[#dc3545]";
    }
  };

  const filterHolders = ({ target: { value } }: { target: any }) => {
    const regex = new RegExp(value, "ig");
    const residue = holders?.filter(
      (holder) =>
        holder.address.match(regex) ||
        holder.x_handle.match(regex) ||
        holder.classification.match(regex)
    );

    setSortedHolders(residue);
  };

  const sortByBalanceChange = (
    paramHolder?: Holders[],
    switchit: boolean = true
  ) => {
    const m_holders = paramHolder || sortedHolders;
    const residue = m_holders?.sort((a, b) => {
      const aBalanceDiff = calc_balance_change(a);
      const bBalanceDiff = calc_balance_change(b);

      if (sortAscState.badge) {
        if (aBalanceDiff < bBalanceDiff || isNaN(aBalanceDiff))
          return switchit ? 1 : -1;
        if (aBalanceDiff > bBalanceDiff || isNaN(bBalanceDiff))
          return switchit ? -1 : 1;
      } else {
        if (aBalanceDiff < bBalanceDiff || isNaN(aBalanceDiff))
          return switchit ? -1 : 1;
        if (aBalanceDiff > bBalanceDiff || isNaN(bBalanceDiff))
          return switchit ? 1 : -1;
      }

      return 0;
    });

    if (switchit) setSortAscState((init) => ({ ...init, badge: !init.badge }));
    setSortedHolders(residue);
  };

  const sortByBought = () => {
    const residue = sortedHolders?.sort((a, b) => {
      if (sortAscState.bought) {
        if (a.total_incoming < b.total_incoming) return 1;
        if (a.total_incoming > b.total_incoming) return -1;
      } else {
        if (a.total_incoming < b.total_incoming) return -1;
        if (a.total_incoming > b.total_incoming) return 1;
      }
      return 0;
    });

    setSortAscState((init) => ({ ...init, bought: !init.bought }));
    setSortedHolders(residue);
  };

  const sortBySold = () => {
    const residue = sortedHolders?.sort((a, b) => {
      if (sortAscState.sold) {
        if (a.total_outgoing < b.total_outgoing) return 1;
        if (a.total_outgoing > b.total_outgoing) return -1;
      } else {
        if (a.total_outgoing < b.total_outgoing) return -1;
        if (a.total_outgoing > b.total_outgoing) return 1;
      }
      return 0;
    });

    setSortAscState((init) => ({ ...init, sold: !init.sold }));
    setSortedHolders(residue);
  };

  const sortByBalance = () => {
    const residue = sortedHolders?.sort((a, b) => {
      if (sortAscState.balance) {
        if (a.balance < b.balance) return 1;
        if (a.balance > b.balance) return -1;
      } else {
        if (a.balance < b.balance) return -1;
        if (a.balance > b.balance) return 1;
      }
      return 0;
    });

    setSortAscState((init) => ({ ...init, balance: !init.balance }));
    setSortedHolders(residue);
  };

  const getHolder = async (switchit: boolean = true) => {
    setLoading(true);
    const fetchHolders = await get_token_holders(page);
    setHolders(fetchHolders.holders);
    sortByBalanceChange(fetchHolders.holders, switchit);
    if (page === 1) setEntries(fetchHolders.entries);
    if (inputRef.current) (inputRef.current as any).value = "";
    setLoading(false);
  };

  const copyText = (addy: string) => {
    window.navigator.clipboard.writeText(addy);
    toast.success("Address copied to clipboard");
  };

  const handleScroll = () => {
    let scrollPosition = window.scrollY;
    const isBigScreen = window.innerWidth > 1000;
    let triggerHeight = isBigScreen
      ? window.innerHeight * 0.2
      : window.innerHeight * 0.5;

    if (containerRef.current) {
      if (scrollPosition > triggerHeight) {
        (containerRef.current as any).style.height = "87vh";
      } else {
        (containerRef.current as any).style.height = "auto";
      }
    }
  };

  const getBalanceChange = (val: Holders) => {
    const value = parseFloat(calc_balance_change(val).toPrecision(4)).toFixed(
      2
    );
    return <p>{isNaN(Number(value)) ? "N/A" : `${value}%`}</p>;
  };

  useEffect(() => {
    getHolder(false);
  }, [page]);

  useEffect(() => {
    getHolder();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="pb-[.8rem]">
      <div className="flex gap-2 items-center w-full border mb-[1.5rem] rounded-lg px-2">
        <CgSearchLoading size={24} color="gray" />
        <input
          ref={inputRef}
          type="search"
          onInput={filterHolders}
          placeholder="Search by wallet address, username or badge...."
          className="w-full bg-[inherit] py-2 outline-none"
        />
      </div>
      {!loading ? (
        <div
          ref={containerRef}
          className="w-full overflow-x-scroll remove-scrollbar live-trade-table border border-[#292B37] rounded-lg"
        >
          <table className="min-w-full border-collapse">
            <thead className="rounded-lg">
              <tr className="text-[1rem] bg-[#292B37]">
                <th className="text-left px-6 py-2 md:px-[2vw] md:py-[.7vw]">
                  S/N
                </th>
                <th className="text-left pr-6 md:pr-[2vw]">User</th>
                <th className="text-left pr-6 md:pr-[2vw]">Address</th>
                <th className="text-left pr-6 md:pr-[2vw]">
                  <button
                    onClick={() => sortByBalanceChange()}
                    className="flex items-center gap-2"
                  >
                    <p>Badge</p>
                    <div className="flex flex-col gap-0">
                      <RiArrowUpSFill
                        color={sortAscState.badge ? "white" : "gray"}
                      />
                      <RiArrowDownSFill
                        color={sortAscState.badge ? "gray" : "white"}
                      />
                    </div>
                  </button>
                </th>
                <th className="text-left pr-6 md:pr-[2vw]">
                  <button
                    onClick={sortByBought}
                    className="flex items-center gap-2"
                  >
                    <p>Total Bought</p>
                    <div className="flex flex-col gap-0">
                      <RiArrowUpSFill
                        color={sortAscState.bought ? "white" : "gray"}
                      />
                      <RiArrowDownSFill
                        color={sortAscState.bought ? "gray" : "white"}
                      />
                    </div>
                  </button>
                </th>
                <th className="text-left pr-6 md:pr-[2vw]">
                  <button
                    onClick={sortBySold}
                    className="flex items-center gap-2"
                  >
                    <p>Total Sold</p>
                    <div className="flex flex-col gap-0">
                      <RiArrowUpSFill
                        color={sortAscState.sold ? "white" : "gray"}
                      />
                      <RiArrowDownSFill
                        color={sortAscState.sold ? "gray" : "white"}
                      />
                    </div>
                  </button>
                </th>
                <th className="text-left pr-6 md:pr-[2vw]">
                  <button
                    onClick={sortByBalance}
                    className="flex items-center gap-2"
                  >
                    <p> Current Position</p>
                    <div className="flex flex-col gap-0">
                      <RiArrowUpSFill
                        color={sortAscState.balance ? "white" : "gray"}
                      />
                      <RiArrowDownSFill
                        color={sortAscState.balance ? "gray" : "white"}
                      />
                    </div>
                  </button>
                </th>
                <th className="text-left pr-6 md:pr-[2vw]">Balance Change</th>
              </tr>
            </thead>
            <tbody>
              {sortedHolders &&
                sortedHolders.map((val, key) => (
                  <tr
                    key={key}
                    className={`${
                      key % 2 != 0 ? "bg-[#20232A]" : "bg-[--background]"
                    }  md:text-[1.3vw]`}
                  >
                    <td className="px-6 py-2 md:px-[2vw] md:py-[.7vw] text-xm">
                      <p>{page * 100 - 99 + key}</p>
                    </td>
                    <td className="pr-6 md:pr-[2vw]">
                      <a
                        target="_blank"
                        href={`https://x.com/${val.x_handle}`}
                        rel="noreferrer noopener"
                        className="flex gap-4 items-center"
                      >
                        <div className="rounded-full w-[2rem] h-[2rem] flex items-center justify-center border-2 border-[#D7DDE2] md:w-[2.5rem] md:h-[2.5rem]">
                          <img
                            src={`${process.env.NEXT_PUBLIC_GET_DP_API}${val.x_handle}`}
                            className="h-full w-full rounded-full"
                          />
                        </div>
                        <p className="text-[1rem] font-semibold">
                          {val.x_handle}
                        </p>
                      </a>
                    </td>
                    <td className="text-left text-[1rem] font-semibold pr-6 md:pr-[2vw]">
                      <div className="flex items-center gap-2">
                        <p>{`${val.address.slice(0, 6)}....${val.address.slice(
                          val.address.length - 4
                        )}`}</p>
                        <FaRegCopy
                          size={18}
                          onClick={() => copyText(val.address)}
                          color="gray"
                          className="cursor-pointer"
                        />
                      </div>
                    </td>
                    <td className="text-left text-[1rem] font-semibold pr-6 md:pr-[2vw]">
                      <p className={get_class_color(val.classification)}>
                        {val.classification}
                      </p>
                    </td>
                    <td className="text-left text-[1rem] font-semibold pr-6 md:pr-[2vw]">
                      <p>
                        {new Intl.NumberFormat().format(val.total_incoming)}
                      </p>
                    </td>
                    <td className="text-left text-[1rem] font-semibold pr-6 md:pr-[2vw]">
                      <p>
                        {new Intl.NumberFormat().format(val.total_outgoing)}
                      </p>
                    </td>
                    <td className="text-left text-[1rem] font-semibold pr-6 md:pr-[2vw]">
                      <p>{new Intl.NumberFormat().format(val.balance)}</p>
                    </td>
                    <td
                      className={`${
                        calc_balance_change(val) < 0
                          ? "text-[#FC1B1B]"
                          : "text-[#25D366]"
                      } text-left text-[1rem] font-semibold pr-6 md:pr-[2vw]`}
                    >
                      {getBalanceChange(val)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="flex justify-between py-2 items-center px-1 sticky left-0 top-0 z-[8]">
            <p className="text-xs md:text-[16px]">
              Showing {page * 100 - 99} - {Math.min(page * 100, entries)} of{" "}
              {entries} entries
            </p>
            <Paginator
              page={page}
              setPage={setPage}
              phases={Array.from(
                { length: Math.ceil(entries / 100) },
                (_, i) => i + 1
              )}
            />
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <span className="loader"></span>
        </div>
      )}
    </div>
  );
}
