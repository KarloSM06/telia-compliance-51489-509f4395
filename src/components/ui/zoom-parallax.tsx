'use client';

import { useScroll, useTransform, motion, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

interface Image {
  src: string;
  alt?: string;
}

interface ZoomParallaxProps {
  /** Array of images to be displayed in the parallax effect max 7 images */
  images: Image[];
}

export function ZoomParallax({ images }: ZoomParallaxProps) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  const prefersReducedMotion = useReducedMotion();

  // Lighter scales to reduce GPU memory pressure
  const scale2 = useTransform(scrollYProgress, [0, 1], [1, 2.2]);
  const scale25 = useTransform(scrollYProgress, [0, 1], [1, 2.6]);
  const scale3 = useTransform(scrollYProgress, [0, 1], [1, 3.0]);
  const scale35 = useTransform(scrollYProgress, [0, 1], [1, 3.4]);
  const scale38 = useTransform(scrollYProgress, [0, 1], [1, 3.8]);

  const scales = prefersReducedMotion
    ? [1, 1, 1, 1, 1, 1, 1]
    : [scale2, scale25, scale3, scale25, scale3, scale35, scale38];

  // Limit number of images to render for performance
  const imagesToRender = images.slice(0, 5);

  return (
    <div ref={container} className="relative h-[200vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {imagesToRender.map(({ src, alt }, index) => {
          const scale = scales[index % scales.length] as any;

          return (
            <motion.div
              key={index}
              style={{ scale }}
              className={`absolute top-0 flex h-full w-full items-center justify-center will-change-transform ${index === 1 ? '[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]' : ''} ${index === 2 ? '[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[35vh] [&>div]:!w-[18vw]' : ''} ${index === 3 ? '[&>div]:!left-[27.5vw] [&>div]:!h-[20vh] [&>div]:!w-[22vw]' : ''} ${index === 4 ? '[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[20vh] [&>div]:!w-[18vw]' : ''} ${index === 5 ? '[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[20vh] [&>div]:!w-[25vw]' : ''} ${index === 6 ? '[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[12vh] [&>div]:!w-[12vw]' : ''} `}
            >
              <div className="relative h-[20vh] w-[20vw] transform-gpu">
                <img
                  src={src || '/placeholder.svg'}
                  alt={alt || `Parallax image ${index + 1}`}
                  className="h-full w-full object-cover rounded-lg backface-hidden"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  fetchPriority={index === 0 ? 'high' : 'low'}
                  sizes="(max-width: 768px) 90vw, 25vw"
                  draggable={false}
                  style={{ contentVisibility: 'auto', transform: 'translateZ(0)' }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
