import { useEffect, useRef, useState } from 'react';
import { Image, ImageURISource } from 'react-native';

import { createCache } from '../utils';
import type { Dimensions, ImageSource } from '../@types';

const CACHE_SIZE = 50;
const imageDimensionsCache = createCache(CACHE_SIZE);

const useImageDimensions = (image: ImageSource): Dimensions | null => {
  const [dimensions, setDimensions] = useState<Dimensions | null>(null);
  const isImageUnmountedRef = useRef(false);

  const getImageDimensions = (image: ImageSource): Promise<Dimensions> => {
    return new Promise((resolve) => {
      if (typeof image == 'number') {
        const cacheKey = `${image}`;
        let imageDimensions = imageDimensionsCache.get(cacheKey);

        if (!imageDimensions) {
          const { width, height } = Image.resolveAssetSource(image);
          imageDimensions = { width, height };
          imageDimensionsCache.set(cacheKey, imageDimensions);
        }

        resolve(imageDimensions);

        return;
      }

      // @ts-ignore
      if (image.uri) {
        const source = image as ImageURISource;

        const cacheKey = source.uri as string;

        const imageDimensions = imageDimensionsCache.get(cacheKey);

        if (imageDimensions) {
          resolve(imageDimensions);
        } else {
          // @ts-ignore
          Image.getSizeWithHeaders(
            source?.uri,
            source.headers,
            (width: number, height: number) => {
              imageDimensionsCache.set(cacheKey, { width, height });
              resolve({ width, height });
            },
            () => {
              resolve({ width: 0, height: 0 });
            }
          );
        }
      } else {
        resolve({ width: 0, height: 0 });
      }
    });
  };

  useEffect(() => {
    getImageDimensions(image).then((dimensions) => {
      if (!isImageUnmountedRef.current) {
        setDimensions(dimensions);
      }
    });

    return () => {
      isImageUnmountedRef.current = true;
    };
  }, [image]);

  return dimensions;
};

export default useImageDimensions;
