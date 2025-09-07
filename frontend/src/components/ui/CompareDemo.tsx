import React from "react";
import { Compare } from "@/components/ui/compare";

type CompareCard = {
  firstImage: string;
  secondImage: string;
  className?: string;
  firstImageClassName?: string;
  secondImageClassname?: string;
  slideMode?: "hover" | "drag";
};

export function CompareDemo({
  cards = [
    {
      firstImage: "/1.png",
      secondImage: "/2.png",
    },
    {
      firstImage: "/3.png",
      secondImage: "/4.png",
    },
    {
      firstImage: "/5.png",
      secondImage: "/6.png",
    },
    {
        firstImage: "/7.png",
        secondImage: "/8.png",
      },
      {
        firstImage: "/9.png",
        secondImage: "/10.png",
      },
      {
        firstImage: "/11.png",
        secondImage: "/12.png",
      },
  ],
}: {
  cards?: CompareCard[];
}) {
  const visible = cards.slice(0, 6);

  return (
    <div className="bg-black px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center p-2 xl:px-[200px]">
        {visible.map((item, idx) => (
          <Compare
            key={idx}
            firstImage={item.firstImage}
            secondImage={item.secondImage}
            firstImageClassName={item.firstImageClassName ?? "object-cover object-left-top"}
            secondImageClassname={item.secondImageClassname ?? "object-cover object-left-top"}
            className={item.className ?? "h-[250px] w-[260px] md:h-[400px] md:w-[320px]"}
            slideMode={item.slideMode ?? "hover"}
          />
        ))}
      </div>
    </div>
  );
}
