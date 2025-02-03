import React, { useEffect, useRef, useState } from "react";
import { Holders } from "./data.type";
import { get_token_holders } from "@/api/default";
import { FaRegCopy } from "react-icons/fa6";
import { toast } from "react-toastify";

export default function Table() {
  const [holders, setHolders] = useState<Holders[]>();
  const [filteredHolders, setFilteredHolders] = useState<Holders[]>();
  const [filterAscState, setFilterAscState] = useState({
    bought: true,
    sold: true,
    balance: true,
  });
  const containerRef = useRef(null);

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

  const filterByBalanceChange = (paramHolder: Holders[]) => {
    const residue = paramHolder?.sort((a, b) => {
      const aBalanceDiff = calc_balance_change(a);
      const bBalanceDiff = calc_balance_change(b);

      if (aBalanceDiff < bBalanceDiff) return 1;
      if (aBalanceDiff > bBalanceDiff) return -1;
      return 0;
    });

    setFilteredHolders(residue);
  };

  const filterByBought = () => {
    const residue = holders?.sort((a, b) => {
      if (filterAscState.bought) {
        if (a.total_incoming < b.total_incoming) return 1;
        if (a.total_incoming > b.total_incoming) return -1;
        return 0;
      } else {
        if (a.total_incoming < b.total_incoming) return -1;
        if (a.total_incoming > b.total_incoming) return 1;
        return 0;
      }
    });

    setFilterAscState((init) => ({ ...init, bought: !init.bought }));
    setFilteredHolders(residue);
  };

  const filterBySold = () => {
    const residue = holders?.sort((a, b) => {
      if (filterAscState.sold) {
        if (a.total_outgoing < b.total_outgoing) return 1;
        if (a.total_outgoing > b.total_outgoing) return -1;
        return 0;
      } else {
        if (a.total_outgoing < b.total_outgoing) return -1;
        if (a.total_outgoing > b.total_outgoing) return 1;
        return 0;
      }
    });

    setFilterAscState((init) => ({ ...init, sold: !init.sold }));
    setFilteredHolders(residue);
  };

  const filterByBalance = () => {
    const residue = holders?.sort((a, b) => {
      if (filterAscState.balance) {
        if (a.balance < b.balance) return 1;
        if (a.balance > b.balance) return -1;
        return 0;
      } else {
        if (a.balance < b.balance) return -1;
        if (a.balance > b.balance) return 1;
        return 0;
      }
    });

    setFilterAscState((init) => ({ ...init, balance: !init.balance }));
    setFilteredHolders(residue);
  };

  const getHolder = async () => {
    const fetchHolders = await get_token_holders();
    setHolders(fetchHolders);
    filterByBalanceChange(fetchHolders);
    return fetchHolders;
  };

  const copyText = (addy: string) => {
    window.navigator.clipboard.writeText(addy);
    toast.success("Address copied to clipboard");
  };

  const handleScroll = () => {
    let scrollPosition = window.scrollY;
    const isBigScreen = window.innerWidth > 1000;
    console.log(isBigScreen);
    let triggerHeight = isBigScreen
      ? window.innerHeight * 0.3
      : window.innerHeight * 0.6;

    if (containerRef.current) {
      if (scrollPosition > triggerHeight) {
        (containerRef.current as any).style.height = "87vh";
      } else {
        (containerRef.current as any).style.height = "auto";
      }
    }
  };

  useEffect(() => {
    getHolder();

    // Attach event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup function to remove event listener on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-x-scroll remove-scrollbar live-trade-table"
    >
      <table className="min-w-full border-collapse">
        <thead className="rounded-lg">
          <tr className="text-[1rem] bg-[#292B37]">
            <th className="text-left px-6 py-2 md:px-[2vw] md:py-[.7vw]">
              S/N
            </th>
            <th className="text-left pr-6 md:pr-[2vw]">User</th>
            <th className="text-left pr-6 md:pr-[2vw]">Address</th>
            <th className="text-left pr-6 md:pr-[2vw]">Badge</th>
            <th className="text-left pr-6 md:pr-[2vw]">Total Bought</th>
            <th className="text-left pr-6 md:pr-[2vw]">Total Sold</th>
            <th className="text-left pr-6 md:pr-[2vw]">Current Position</th>
            <th className="text-left pr-6 md:pr-[2vw]">Balance Change</th>
          </tr>
        </thead>
        <tbody>
          {filteredHolders &&
            filteredHolders.map((val, key) => (
              <tr
                key={key}
                className={`${
                  key % 2 != 0 ? "bg-[#20232A]" : "bg-[--background]"
                }  md:text-[1.3vw]`}
              >
                <td className="px-6 py-2 md:px-[2vw] md:py-[.7vw] text-xm">
                  <p>{key}</p>
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
                    <p className="text-[1rem] font-semibold">{val.x_handle}</p>
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
                  <p>{new Intl.NumberFormat().format(val.total_incoming)}</p>
                </td>
                <td className="text-left text-[1rem] font-semibold pr-6 md:pr-[2vw]">
                  <p>{new Intl.NumberFormat().format(val.total_outgoing)}</p>
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
                  <p>
                    {parseFloat(
                      calc_balance_change(val).toPrecision(4)
                    ).toFixed(2)}
                    %
                  </p>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
