import React, { useState, useEffect } from "react";
import { useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import img1 from "../Assets/1.png";
import img2 from "../Assets/2.png";
import img3 from "../Assets/3.png";
import img4 from "../Assets/4.png";

const ProductionSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const productionItems = [
    {
      id: 1,
      image: img1,
      title: "Designed for Excellence",
      description:
        "Crafted with meticulous attention to detail, our watches reflect sophistication and functionality, perfect for both work and leisure",
    },
    {
      id: 2,
      image: img2,
      title: "Quality Control Station",
      description:
        "Precision testing and inspection of manufactured components",
    },
    {
      id: 3,
      image: img3,
      title: "Research & Development Lab",
      description: "Innovative product development and testing facility",
    },
    {
      id: 4,
      image: img4,
      title: "Assembly Line Operations",
      description: "Efficient production processes with skilled technicians",
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) =>
      prev === productionItems.length - 1 ? 0 : prev + 1
    );
  }, [productionItems.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? productionItems.length - 1 : prev - 1
    );
  };

  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="relative w-full mx-auto h-[700px] overflow-hidden">
      <div className="relative h-full">
        {productionItems.map((item, index) => (
          <div
            key={item.id}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1581092335397-9583eb92d232";
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-8">
              <h2 className="text-3xl font-bold mb-2 opacity-0 transform translate-y-4 animate-slideUp">
                {item.title}
              </h2>
              <p className="text-lg opacity-0 transform translate-y-4 animate-slideUp animation-delay-200">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-3 transition-all duration-300"
        aria-label="Previous slide"
      >
        <FaChevronLeft className="text-2xl text-black" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-3 transition-all duration-300"
        aria-label="Next slide"
      >
        <FaChevronRight className="text-2xl text-black" />
      </button>

      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {productionItems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-125"
                : "bg-white bg-opacity-50 hover:bg-opacity-75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  );
};

export default ProductionSlider;
