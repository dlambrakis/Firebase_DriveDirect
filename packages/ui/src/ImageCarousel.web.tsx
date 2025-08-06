import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel, { EmblaOptionsType } from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './button';

type PropType = {
  images: string[];
  options?: EmblaOptionsType;
};

export const ImageCarousel: React.FC<PropType> = (props) => {
  const { images, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const defaultImage = 'https://placehold.co/1200x800/1a1a1a/ffffff?text=No+Image';
  const displayImages = images && images.length > 0 ? images : [defaultImage];

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex">
          {displayImages.map((image, index) => (
            <div className="relative flex-[0_0_100%] aspect-w-16 aspect-h-10" key={index}>
              <img
                className="object-cover w-full h-full"
                src={image}
                alt={`Vehicle image ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>

      {displayImages.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 left-2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/30 hover:bg-black/50 text-white"
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/30 hover:bg-black/50 text-white"
            onClick={scrollNext}
            disabled={nextBtnDisabled}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {displayImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2 mt-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                'overflow-hidden rounded-md aspect-w-16 aspect-h-10 ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                index === selectedIndex ? 'ring-2 ring-primary' : 'opacity-60 hover:opacity-100'
              )}
            >
              <img
                className="object-cover w-full h-full"
                src={image}
                alt={`Thumbnail ${index + 1}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
