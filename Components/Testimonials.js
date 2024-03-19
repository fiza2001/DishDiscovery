import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import "./homepage.css";

const testimonials = [
  {
    id: 1,
    name: "John Doe",
    image: "./images/test-1.jpg",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales nulla ac justo convallis, a lobortis ipsum dapibus.",
  },
  {
    id: 2,
    name: "Jane Smith",
    image: "./images/test-2.avif",
    text: "Vestibulum euismod, felis ut accumsan tincidunt, justo turpis consequat leo, nec venenatis justo libero et justo.",
  },
  {
    id: 3,
    name: "Alice Johnson",
    image: "./images/test-3.jpg",
    text: "Nulla facilisi. Duis semper consectetur libero eu venenatis. Donec venenatis nisl at nulla laoreet, at mollis elit tempus.",
  },
];

const TestimonialSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide(
      currentSlide === testimonials.length - 1 ? 0 : currentSlide + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide(
      currentSlide === 0 ? testimonials.length - 1 : currentSlide - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) =>
        prevSlide === testimonials.length - 1 ? 0 : prevSlide + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="testimonial-slider">
      <div className="testimonial-content">
        <div className="testimonial-image">
          <img
            src={testimonials[currentSlide].image}
            alt="User"
            className="testimonial-avatar"
          />
        </div>
        <p className="testimonial-text">{testimonials[currentSlide].text}</p>
        <p className="testimonial-author">
          - {testimonials[currentSlide].name}
        </p>
      </div>
      <div className="testimonial-buttons">
        <button className="prev-btn" onClick={prevSlide}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <button className="next-btn" onClick={nextSlide}>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
};

export default TestimonialSlider;
