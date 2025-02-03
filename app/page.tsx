"use client";

import { get_token_info } from "@/api/default";
import { Info } from "@/components/data.type";
import InfoBox from "@/components/InfoBox";
import Nav from "@/components/nav/Nav";
import Table from "@/components/Table";
import { useEffect, useState } from "react";
import { FaRegCopy } from "react-icons/fa6";
import { Bounce, toast, ToastContainer } from "react-toastify";

export default function Home() {
  const [info, setInfo] = useState<Info>();

  const fetch_info = async () => {
    const getInfo = await get_token_info();
    setInfo(getInfo);
  };

  useEffect(() => {
    fetch_info();
  }, []);
  return (
    <div>
      <div className="fixed top-0 pt-2 left-0 w-full shadow-md bg-[#0a0a0a] z-10 border-b">
        <div className="flex justify-center w-full">
          <div className="w-full lg:w-[90%] py-2">
            <Nav activeLink="Home" />
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col gap-8 px-4 pt-[7rem] w-full md:px-10 md:pt-[8rem] lg:w-[80%]">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-4xl">
              Tracking <span className="text-[#FC1B1B]">Suspicious</span>{" "}
              Activity
            </h1>
            <p className="text-2sm">
              Monitor and expose wallet activity from the{" "}
              <span className="font-bold text-xl">$wabbit</span> presale,
              including significant token dumps and attempts to obscure trading
              patterns. Helping maintain transparency in the ecosystem. Market
              data is delayed by 1-2 hours. Balance is accurate, but transfers
              and PNL reflect this delay.
            </p>
          </div>
          <div className="flex flex-col gap-4 bg-[#0F0F0F] rounded-lg px-3 py-8 md:flex-row md:flex-wrap">
            <div className="w-full lg:w-[48%]">
              <InfoBox
                header="Current price"
                desc={`$${info?.currentPrice || ""}`}
                increment={info?.priceChange! > 0}
                percent={info?.priceChange || ""}
                imgSrc="/dex.png"
              />
            </div>
            <div className="w-full lg:w-[48%]">
              <InfoBox
                header="Max allocation worth"
                desc={`$${
                  info?.currentPrice
                    ? new Intl.NumberFormat().format(
                        Number((777777 * Number(info?.currentPrice)).toFixed(2))
                      )
                    : ""
                }`}
              />
            </div>
            <div className="w-full lg:w-[48%]">
              <InfoBox
                header="Market Cap"
                desc={`$${
                  info?.marketCap
                    ? new Intl.NumberFormat().format(info?.marketCap!)
                    : ""
                }`}
              />
            </div>
            <div className="w-full lg:w-[48%]">
              <InfoBox
                header="Liquidity"
                desc={`$${
                  info?.liquidity
                    ? new Intl.NumberFormat().format(info?.liquidity)
                    : ""
                }`}
              />
            </div>
            <div className="flex gap-4 items-center font-semibold">
              Support the dev:{" "}
              <button
                onClick={() => {
                  window.navigator.clipboard.writeText(
                    process.env.NEXT_PUBLIC_DEV_ADDY!
                  );
                  toast.success("Dev address copied");
                }}
                className="flex gap-2 items-center cursor-pointer"
              >
                <p>wabbit.avax</p>
                <FaRegCopy />
              </button>
            </div>
          </div>
          <div>
            <Table />
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
}
