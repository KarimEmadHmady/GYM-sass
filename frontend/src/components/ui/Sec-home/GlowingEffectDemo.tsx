"use client";

import { Box, Lock, Search, Settings, Sparkles } from "lucide-react";
import { GlowingEffect } from "@/components/ui/Sec-home/glowing-effect";

export function GlowingEffectDemo() {
  // Detect language from URL or localStorage (you can integrate with your i18n system)
  const isArabic = typeof window !== 'undefined' && window.location.pathname.includes('/ar');
  
  const content = {
    features: isArabic ? [
      {
        icon: <Box className="h-4 w-4 text-black dark:text-neutral-400" />,
        title: "أحدث معدات التدريب",
        description: "نوفر أحدث وأفضل معدات التدريب العالمية لضمان تجربة تدريب مثالية"
      },
      {
        icon: <Settings className="h-4 w-4 text-black dark:text-neutral-400" />,
        title: "مدربين محترفين معتمدين",
        description: "فريق من المدربين المعتمدين دولياً مع خبرة تزيد عن 10 سنوات"
      },
      {
        icon: <Lock className="h-4 w-4 text-black dark:text-neutral-400" />,
        title: "برامج لياقة مخصصة",
        description: "نصمم برامج تدريب شخصية تناسب أهدافك ومستوى لياقتك"
      },
      {
        icon: <Sparkles className="h-4 w-4 text-black dark:text-neutral-400" />,
        title: "فصول جماعية متنوعة",
        description: "فصول يوغا، كروس فيت، زومبا، بيلاتس وغيرها من الأنشطة الممتعة"
      },
      {
        icon: <Search className="h-4 w-4 text-black dark:text-neutral-400" />,
        title: "نظام تغذية متكامل",
        description: "استشارات تغذية شخصية وخطة وجبات مخصصة لتحقيق أهدافك"
      }
    ] : [
      {
        icon: <Box className="h-4 w-4 text-black dark:text-neutral-400" />,
        title: "Latest Training Equipment",
        description: "We provide the latest and best global training equipment to ensure the perfect training experience"
      },
      {
        icon: <Settings className="h-4 w-4 text-black dark:text-neutral-400" />,
        title: "Certified Professional Trainers",
        description: "Team of internationally certified trainers with over 10 years of experience"
      },
      {
        icon: <Lock className="h-4 w-4 text-black dark:text-neutral-400" />,
        title: "Customized Fitness Programs",
        description: "We design personal training programs that suit your goals and fitness level"
      },
      {
        icon: <Sparkles className="h-4 w-4 text-black dark:text-neutral-400" />,
        title: "Diverse Group Classes",
        description: "Yoga, CrossFit, Zumba, Pilates and other fun activities"
      },
      {
        icon: <Search className="h-4 w-4 text-black dark:text-neutral-400" />,
        title: "Integrated Nutrition System",
        description: "Personal nutrition consultations and customized meal plans to achieve your goals"
      }
    ]
  };

  return (
    <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
      <GridItem
        area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
        icon={content.features[0].icon}
        title={content.features[0].title}
        description={content.features[0].description}
        isArabic={isArabic}
      />

      <GridItem
        area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
        icon={content.features[1].icon}
        title={content.features[1].title}
        description={content.features[1].description}
        isArabic={isArabic}
      />

      <GridItem
        area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
        icon={content.features[2].icon}
        title={content.features[2].title}
        description={content.features[2].description}
        isArabic={isArabic}
      />

      <GridItem
        area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
        icon={content.features[3].icon}
        title={content.features[3].title}
        description={content.features[3].description}
        isArabic={isArabic}
      />

      <GridItem
        area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
        icon={content.features[4].icon}
        title={content.features[4].title}
        description={content.features[4].description}
        isArabic={isArabic}
      />
    </ul>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  isArabic: boolean;
}

const GridItem = ({ area, icon, title, description, isArabic }: GridItemProps) => {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-gray-600 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className={`-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-black md:text-2xl/[1.875rem] dark:text-white ${isArabic ? 'font-cairo' : ''}`}>
                {title}
              </h3>
              <h2 className={`font-sans text-sm/[1.125rem] text-black md:text-base/[1.375rem] dark:text-neutral-400 [&_b]:md:font-semibold [&_strong]:md:font-semibold ${isArabic ? 'font-cairo' : ''}`}>
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
