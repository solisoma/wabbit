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

export async function get_token_holders(page: number): Promise<{
  holders: Holders[];
  entries: number;
}> {
  const data_length = page * 100;
  const URL = `${process.env.NEXT_PUBLIC_WABBIT_API!}?start=${
    data_length - 100
  }&end=${data_length}`;

  const req = await fetch(URL);

  if (req.status !== 200) throw new Error("Couldn't fetch holders");

  const response = await req.json();

  const data: { holders: Holders[]; entries: number } = {
    holders: response.holders,
    entries: response.total_entries,
  };
  return data;
}
