import Head from 'next/head';
import Image from 'next/image';
import VideoMap from '@/component/VideoMap';

import useSWR from 'swr';
import axios from 'axios';
import { MutableRefObject, useEffect, useState } from 'react';
import { MediaPlayerElement } from 'vidstack';
import { GetWindowSize } from '@/GetWindowSize';
import InfiniteScroll from 'react-infinite-scroller';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export type DataResponse = {
  videoUrlArray: string[];
  imageUrlArray: string[];
};

export default function Home() {
  let value = 0;

  const fetcher = async () => {
    const { data } = await axios.get('/api/get-urls');
    return data;
  };
  const { data, isLoading, error } = useSWR<DataResponse>(
    'api/data/url',
    fetcher
  );

  const [currentPage, setCurrentPage] = useState(1);

  const [currentData, setCurrentData] = useState<string[]>([]);

  useEffect(() => {
    if (data) {
      setCurrentData(data.videoUrlArray.slice(0, 10));
    }
  }, [data]);

  const updatePage = () => {
    if (data) {
      setCurrentPage(currentPage + 1);
      const maxLength = data.videoUrlArray.length;
      const compareLength = maxLength <= currentData.length + 10;
      const newData = data.videoUrlArray.slice(
        currentData.length,
        compareLength ? maxLength : currentData.length + 10
      );
      const concatedValue = currentData.concat(newData);
      setCurrentData(concatedValue);
    }
  };

  const [currentVideo, setCurrentVideo] =
    useState<MutableRefObject<MediaPlayerElement | null> | null>(null);
  const [lastVideo, setLastVideo] =
    useState<MutableRefObject<MediaPlayerElement | null> | null>(null);

  useEffect(() => {
    if (lastVideo) {
      lastVideo?.current?.pause();
    }
    currentVideo?.current?.startLoading();
    if (currentVideo) {
      setLastVideo(currentVideo);
    }
    const vid = Array.from(document.getElementsByTagName('video'));
    vid.forEach((item) => {
      item.setAttribute('playsinline', 'true');
    });
  }, [currentVideo]);

  const { width } = GetWindowSize();

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>来たるべき風景の予感</title>
        <meta
          name="description"
          content="少し不思議なドキュメンタリースクール?来たるべき風景の予感"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/star.png" />
      </Head>
      <div className="mt-10 fixed top-0 z-50 w-screen flex justify-center">
        <Image
          src="/kitarubeki2.png"
          alt="image"
          width="500"
          height="100"
          priority
        />
      </div>
      <div className="w-screen h-full bg-violet-900 items-center pt-60 min-h-screen pb-40">
        <div className="fixed bottom-10 z-0 left-[10%]">
          <Image src="/star.gif" width="200" height="200" alt="star" priority />
        </div>
        <div className="fixed top-28 md:top-52 z-0 right-[10%]">
          <Image src="/star.gif" width="150" height="150" alt="star" priority />
        </div>
        <div className="fixed top-0 z-10 left-[2%] lg:left-[20%] -rotate-[30deg] md:h-40 md:w-40 w-20 h-20 flex items-center justify-center">
          <Image
            src="/new-program2.gif"
            width="200"
            height="200"
            alt="star"
            priority
          />
        </div>
        {data && (
          <InfiniteScroll
            loadMore={() => {
              setTimeout(() => {
                updatePage();
              }, 1000);
            }}
            pageStart={0}
            loader={
              <div className="z-50 animate-spin mt-20" key={0}>
                <AiOutlineLoading3Quarters size={100} color="white" />
              </div>
            }
            hasMore={data.videoUrlArray.length !== currentData.length}
            key={'yes'}
            className="h-full w-full flex flex-col items-center gap-y-20 min-h-[2000px]"
          >
            {currentData.map((item, _i) => {
              value = value + 1;
              return (
                <VideoMap
                  data={data}
                  item={item}
                  _i={_i}
                  value={value}
                  key={_i}
                  setCurrentVideo={setCurrentVideo}
                  setLastVideo={setLastVideo}
                  width={width}
                />
              );
            })}
          </InfiniteScroll>
        )}
      </div>
    </>
  );
}
