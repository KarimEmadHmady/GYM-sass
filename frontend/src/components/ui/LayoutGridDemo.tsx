"use client";
import React, { useState, useRef, useEffect } from "react";
import { LayoutGrid } from "../ui/layout-grid";

export function LayoutGridDemo() {
  // Detect language from URL or localStorage (you can integrate with your i18n system)
  const isArabic = typeof window !== 'undefined' && window.location.pathname.includes('/ar');
  
  return (
    <div className="h-screen py-20 w-full">
      <LayoutGrid cards={getCards(isArabic)} />
    </div>
  );
}

const SkeletonOne = ({ isArabic }: { isArabic: boolean }) => {
  return (
    <div>
      <p className={`font-bold md:text-4xl text-xl text-white ${isArabic ? 'font-cairo' : ''}`}>
        {isArabic ? 'قاعة تدريب رئيسية' : 'Main Training Hall'}
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className={`font-normal text-base my-4 max-w-lg text-neutral-200 ${isArabic ? 'font-cairo' : ''}`}>
        {isArabic 
          ? 'قاعة تدريب واسعة ومجهزة بأحدث المعدات العالمية. بيئة تدريب احترافية تناسب جميع المستويات من المبتدئين إلى المحترفين.'
          : 'A spacious training hall equipped with the latest global equipment. Professional training environment suitable for all levels from beginners to professionals.'
        }
      </p>
    </div>
  );
};

const SkeletonTwo = ({ isArabic }: { isArabic: boolean }) => {
  return (
    <div>
      <p className={`font-bold md:text-4xl text-xl text-white ${isArabic ? 'font-cairo' : ''}`}>
        {isArabic ? 'فصول جماعية' : 'Group Classes'}
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className={`font-normal text-base my-4 max-w-lg text-neutral-200 ${isArabic ? 'font-cairo' : ''}`}>
        {isArabic 
          ? 'فصول يوغا، كروس فيت، زومبا، بيلاتس وغيرها من الأنشطة الممتعة. مدربين محترفين وبيئة تدريب ديناميكية.'
          : 'Yoga, CrossFit, Zumba, Pilates and other fun activities. Professional trainers and dynamic training environment.'
        }
      </p>
    </div>
  );
};

const SkeletonThree = ({ isArabic }: { isArabic: boolean }) => {
  return (
    <div>
      <p className={`font-bold md:text-4xl text-xl text-white ${isArabic ? 'font-cairo' : ''}`}>
        {isArabic ? 'منطقة كارديو' : 'Cardio Zone'}
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className={`font-normal text-base my-4 max-w-lg text-neutral-200 ${isArabic ? 'font-cairo' : ''}`}>
        {isArabic 
          ? 'منطقة كارديو متكاملة مع أجهزة المشي والدراجات والسلالم الكهربائية. تجهيزات حديثة لتمارين القلب والأوعية الدموية.'
          : 'Integrated cardio zone with treadmills, bikes, and stair climbers. Modern equipment for cardiovascular exercises.'
        }
      </p>
    </div>
  );
};

const SkeletonFour = ({ isArabic }: { isArabic: boolean }) => {
  return (
    <div>
      <p className={`font-bold md:text-4xl text-xl text-white ${isArabic ? 'font-cairo' : ''}`}>
        {isArabic ? 'منطقة الأوزان الحرة' : 'Free Weights Area'}
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className={`font-normal text-base my-4 max-w-lg text-neutral-200 ${isArabic ? 'font-cairo' : ''}`}>
        {isArabic 
          ? 'منطقة تدريب متخصصة للأوزان الحرة والتمارين المركبة. دامبلز، باربلز، ومعدات متقدمة لبناء القوة والكتلة العضلية.'
          : 'Specialized training area for free weights and compound exercises. Dumbbells, barbells, and advanced equipment for building strength and muscle mass.'
        }
      </p>
    </div>
  );
};

const getCards = (isArabic: boolean) => [
  {
    id: 1,
    content: <SkeletonOne isArabic={isArabic} />,
    className: "md:col-span-2",
    thumbnail: "/G1.jpg",
  },
  {
    id: 2,
    content: <SkeletonTwo isArabic={isArabic} />,
    className: "col-span-1",
    thumbnail: "/G2.jpg",
  },
  {
    id: 3,
    content: <SkeletonThree isArabic={isArabic} />,
    className: "col-span-1",
    thumbnail: "/G3.jpg",
  },
  {
    id: 4,
    content: <SkeletonFour isArabic={isArabic} />,
    className: "md:col-span-2",
    thumbnail: "/G4.jpg",
  },
];
