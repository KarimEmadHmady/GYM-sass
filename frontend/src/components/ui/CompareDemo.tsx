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
      firstImage: "/image/1/New Project.png",
      secondImage: "/image/1/New Project (1).png",
    },
    {
      firstImage: "/image/2/New Project.png",
      secondImage: "/image/2/New Project (1).png",
    },
    {
      firstImage: "/image/3/New Project.png",
      secondImage: "/image/3/New Project (1).png",
    },
    {
      firstImage: "/image/4/New Project.png",
      secondImage: "/image/4/New Project (1).png",
      },
      {
        firstImage: "/image/5/New Project.png",
        secondImage: "/image/5/New Project (1).png",
      },
      {
        firstImage: "/image/6/New Project.png",
        secondImage: "/image/6/New Project (1).png",
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
            firstImageClassName={item.firstImageClassName ?? "object-contain w-full h-full"}
            secondImageClassname={item.secondImageClassname ?? "object-contain w-full h-full"}
            className={item.className ?? "w-full max-w-[320px] aspect-[4/3] md:max-w-[360px] md:aspect-[4/3]"}
            slideMode={item.slideMode ?? "hover"}
          />
        ))}
      </div>
    </div>
  );
}
