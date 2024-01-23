import {
  Dispatch,
  FC,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import 'vidstack/styles/defaults.css';
import { MediaOutlet, MediaPlayButton, MediaPlayer } from '@vidstack/react';
import 'vidstack/styles/base.css';
import 'vidstack/styles/ui/buttons.css';
import 'vidstack/styles/ui/captions.css';
import 'vidstack/styles/ui/tooltips.css';
import 'vidstack/styles/ui/live.css';
import 'vidstack/styles/ui/sliders.css';
import { DataResponse } from '@/pages';
import { MediaPlayerElement } from 'vidstack';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

interface Props {
  data: DataResponse;
  item: string;
  _i: number;
  value: number;
  setCurrentVideo: Dispatch<
    SetStateAction<MutableRefObject<MediaPlayerElement | null> | null>
  >;
  setLastVideo: Dispatch<
    SetStateAction<MutableRefObject<MediaPlayerElement | null> | null>
  >;
  width: number;
}

const VideoMap: FC<Props> = ({
  _i,
  data,
  item,
  value,
  setCurrentVideo,
  width,
}): JSX.Element => {
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [windowLoaded, setWindowLoaded] = useState(false);

  useEffect(() => {
    setWindowLoaded(true);
  }, []);

  const ref = useRef<MediaPlayerElement | null>(null);

  const imgArray = [
    '/back-girl.png',
    '/sit-boy.png',
    '/camera-girl.png',
    '/sit-nakazato.png',
    '/mac-girl.png',
    '/grass-girl.png',
    '/bg-man.png',
    '/girl-sleep.png',
    '/girl-face.png',
    '/nakazato-top.png',
    '/girls.png',
    '/girl-star.png',
  ];

  const [rightPos] = useState(Math.floor(Math.random() * 30) + 0);
  const [imgNumber] = useState(Math.floor(Math.random() * imgArray.length));

  return (
    <div className="aspect-video h-40 md:h-52">
      <MediaPlayer
        ref={ref}
        src={item}
        poster={data.imageUrlArray[_i]}
        className="relative h-full w-full flex items-center justify-center object-fill"
        controls={isPlay}
        playsinline
        onCanPlay={() => {
          ref.current?.play();
          setIsPlay(true);
          setIsLoading(false);
        }}
        onPlay={() => {
          setIsPlay(true);
          setIsLoading(false);
        }}
        onLoadStart={() => {
          setIsLoading(true);
        }}
        onLoadedData={() => {
          setIsLoading(false);
        }}
        onClick={async (player) => {
          if (!isPlay) {
            setCurrentVideo(ref);
          }
        }}
        load="custom"
        onPause={() => {
          setIsPlay(false);
          setIsLoading(false);
        }}
      >
        <MediaOutlet className="absolute" />
        <div className="">
          {!isPlay && !isLoading && <MediaPlayButton className="scale-150" />}
        </div>
        {isLoading && !isPlay && (
          <div className="z-50 animate-spin">
            <AiOutlineLoading3Quarters size={100} color="white" />
          </div>
        )}
      </MediaPlayer>
      {windowLoaded && (
        <div
          className={`rounded-lg absolute overflow-hidden`}
          style={{
            left: value % 2 === 0 ? 100 - rightPos + '%' : rightPos + '%',
          }}
        >
          <img src={imgArray[imgNumber]} alt="image" width="60" height="100" />
        </div>
      )}
    </div>
  );
};

export default VideoMap;
