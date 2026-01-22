import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { FiCheck, FiPause, FiPlay } from 'react-icons/fi';
import introVideo from '../../assets/videos/intro.mp4';

const Intro = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  return (
    <section className="relative overflow-hidden bg-white py-12 md:py-20">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 md:gap-12 lg:grid-cols-2">
          {/* Content will be reordered using row-start-* classes */}
          {/* Content - will be second on mobile, first on larger screens */}
          <motion.div
            className="relative lg:row-start-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary/80 font-accent text-base font-medium md:text-lg">
              WELCOME TO OUR WORLD
            </span>
            <h2 className="mt-1 mb-4 text-3xl font-bold text-gray-900 md:mt-2 md:mb-6 md:text-4xl">
              Crafting Timeless Elegance
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-gray-600 md:text-base">
              Step into a world where fashion meets artistry. Our collections are meticulously
              designed to bring out the best in you, combining contemporary trends with timeless
              elegance.
            </p>

            <div className="mb-6 space-y-3">
              <div className="flex items-start">
                <div className="mt-0.5 shrink-0 md:mt-1">
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-400 text-white md:h-5 md:w-5">
                    <FiCheck className="h-2.5 w-2.5 md:h-3 md:w-3" />
                  </div>
                </div>
                <p className="ml-3 text-sm text-gray-600 md:text-base">
                  Premium quality materials sourced from around the world
                </p>
              </div>
              <div className="flex items-start">
                <div className="mt-0.5 shrink-0 md:mt-1">
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-400 text-white md:h-5 md:w-5">
                    <FiCheck className="h-2.5 w-2.5 md:h-3 md:w-3" />
                  </div>
                </div>
                <p className="ml-3 text-sm text-gray-600 md:text-base">
                  Ethically crafted with sustainable practices
                </p>
              </div>
              <div className="flex items-start">
                <div className="mt-0.5 shrink-0 md:mt-1">
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-400 text-white md:h-5 md:w-5">
                    <FiCheck className="h-2.5 w-2.5 md:h-3 md:w-3" />
                  </div>
                </div>
                <p className="ml-3 text-sm text-gray-600 md:text-base">
                  Designed to make you feel confident and empowered
                </p>
              </div>
            </div>

            <button className="hover:bg-primary w-full rounded-md bg-gray-700 px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:scale-105 sm:w-auto md:px-8 md:py-3 md:text-base">
              Discover More
            </button>
          </motion.div>

          {/* Video - will be first on mobile, second on larger screens */}
          <motion.div
            className="relative row-start-1 h-[300px] w-full overflow-hidden rounded-xl shadow-lg md:h-[400px] md:rounded-2xl md:shadow-2xl lg:row-auto"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <video
              ref={videoRef}
              autoPlay={false}
              loop
              muted
              playsInline
              onEnded={handleVideoEnd}
              className="absolute inset-0 h-full w-full object-cover object-center"
            >
              <source src={introVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-black/20" />
            <button
              onClick={togglePlay}
              className="group absolute top-1/2 left-1/2 z-10 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full bg-white/90 transition-transform duration-300 hover:scale-110"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? (
                <FiPause className="text-primary text-xl transition-transform group-hover:scale-110" />
              ) : (
                <FiPlay className="text-primary ml-1 text-xl transition-transform group-hover:scale-110" />
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Intro;
