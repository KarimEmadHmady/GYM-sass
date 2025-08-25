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
      firstImage: "https://assets.aceternity.com/code-problem.png",
      secondImage: "https://assets.aceternity.com/code-solution.png",
    },
    {
      firstImage: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1200",
      secondImage: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1200",
    },
    {
      firstImage: "https://images.unsplash.com/photo-1520975954732-35dd22437a43?q=80&w=1200",
      secondImage: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=1200",
    },
    {
        firstImage: "https://images.unsplash.com/photo-1520975954732-35dd22437a43?q=80&w=1200",
        secondImage: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=1200",
      },
      {
        firstImage: "https://images.unsplash.com/photo-1520975954732-35dd22437a43?q=80&w=1200",
        secondImage: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=1200",
      },
      {
        firstImage: "https://images.unsplash.com/photo-1520975954732-35dd22437a43?q=80&w=1200",
        secondImage: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=1200",
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
