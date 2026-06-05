import { useState } from "react";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  "/images/img1.jpg",
  "/images/img2.jpg",
  "/images/img3.jpg",
  "/images/img4.jpg",
  "/images/img5.jpg",
  "/images/img6.jpg",
  "/images/img7.jpg",
  "/images/img8.jpg",
];

export default function SmoothScrollingGallery() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  const handleClose = () => {
    setSelectedIndex(null);
    setIsPaused(false);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full overflow-hidden my-4">
      <div
        className="overflow-hidden rounded-lg shadow-4xl"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => selectedIndex === null && setIsPaused(false)}
      >
        <motion.div
          className="flex gap-4 w-max animate-scroll shadow-4xl"
          animate={
            isPaused
              ? { animationPlayState: "paused" }
              : { animationPlayState: "running" }
          }
        >
          {[...images, ...images].map((img, index) => (
            <div
              key={index}
              className="min-w-[220px] h-[150px] rounded-xl overflow-hidden shadow-4xl cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => setSelectedIndex(index % images.length)}
            >
              <img
                src={img}
                alt={`img-${index}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
          onClick={handleClose}
        >
          <div
            className="relative max-w-5xl w-full px-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute md:right-[68px] right-4 bg-white bg-opacity-40 hover:bg-opacity-70 text-black p-1 rounded-full shadow z-20"
              onClick={handleClose}
            >
              <X size={20} />
            </button>

            {/* Prev Button */}
            <button
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-40 hover:bg-opacity-70 text-black p-1 rounded-full"
              onClick={handlePrev}
            >
              <ChevronLeft size={20} />
            </button>

            {/* Next Button */}
            <button
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-40 hover:bg-opacity-70 text-black p-1 rounded-full"
              onClick={handleNext}
            >
              <ChevronRight size={20} />
            </button>

            {/* Image */}
            <motion.img
              src={images[selectedIndex]}
              alt="Enlarged"
              className="w-full max-h-[90vh] object-contain rounded-lg shadow-2xl z-10"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
