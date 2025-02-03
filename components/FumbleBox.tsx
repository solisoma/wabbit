import React from "react";

export default function FumbleBox({
  imgSrc,
  address,
  name,
  amount,
}: {
  imgSrc: string;
  name: string;
  address: string;
  amount: string;
}) {
  return (
    <div className="flex flex-col items-center gap-y-4 rounded-lg border">
      <div className="flex flex-col gap-y-1">
        <div>
          <img src={imgSrc} />
        </div>
        <h2>{name}</h2>
        <p>{address}</p>
      </div>
      <p>
        Fumbled: <span>{amount}</span>
      </p>
    </div>
  );
}
