import { Holders, Info, MultiType } from "@/components/data.type";

export async function get_token_info(): Promise<Info> {
  const URL = process.env.NEXT_PUBLIC_WABBIT_PROFILE!;

  const req = await fetch(URL);

  if (req.status !== 200)
    return {
      currentPrice: "....",
      priceChange: 0,
      marketCap: 0,
      liquidity: 0,
    };

  const data: MultiType = (await req.json()).pairs[0];
  const info: Info = {
    currentPrice: data.priceUsd,
    priceChange: data.priceChange.h24,
    marketCap: data.marketCap,
    liquidity: data.liquidity.usd,
  };
  return info;
}

export async function get_token_holders(): Promise<Holders[]> {
  const URL = process.env.NEXT_PUBLIC_WABBIT_API!;

  const req = await fetch(URL);

  if (req.status !== 200) throw new Error("Couldn't fetch holders");

  const data: Holders[] = (await req.json()).holders;
  return data;
}
