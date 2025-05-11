"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import GTAVILogo from "@/components/gtavi-logo";

const GTAVIPage = () => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2026-05-26T00:00:00');

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative w-full h-[400px] mb-8">
          <Image
            src="/assets/gtavi.jpg"
            alt="GTA VI"
            fill
            className="object-cover rounded-lg"
            priority
          />
          <div className="absolute top-5 left-5">
            <GTAVILogo />
          </div>
          <div className="absolute bottom-5 right-5 w-[150px] sm:w-[250px] aspect-video max-[319px]:hidden">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/VQRLujxTm3c"
              title="GTA VI Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="prose max-w-none dark:prose-invert">
          <div className="text-center mt-8">
            <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto max-[319px]:hidden">
              <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg shadow-sm dark:shadow-gray-700/30">
                <div className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center">{timeLeft.days}<span className="sm:hidden block">d</span></div>
                <div className="sm:block hidden text-sm text-gray-600 dark:text-gray-400">Days</div>
              </div>
              <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg shadow-sm dark:shadow-gray-700/30">
                <div className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center">{timeLeft.hours}<span className="sm:hidden block">h</span></div>
                <div className="sm:block hidden text-sm text-gray-600 dark:text-gray-400">Hours</div>
              </div>
              <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg shadow-sm dark:shadow-gray-700/30">
                <div className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center">{timeLeft.minutes}<span className="sm:hidden block">m</span></div>
                <div className="sm:block hidden text-sm text-gray-600 dark:text-gray-400">Minutes</div>
              </div>
              <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg shadow-sm dark:shadow-gray-700/30">
                <div className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center">{timeLeft.seconds}<span className="sm:hidden block">s</span></div>
                <div className="sm:block hidden text-sm text-gray-600 dark:text-gray-400">Seconds</div>
              </div>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Until May 26, 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GTAVIPage; 