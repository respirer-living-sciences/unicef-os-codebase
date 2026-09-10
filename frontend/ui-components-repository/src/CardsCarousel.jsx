import React, { useEffect } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";
import CardMUI from "./CardMUI";
import sampleData from "./sample_data";
import "./card-carousel.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        color: "#5a5a5a",
        lineHeight: "1.5715",
      }}
      onClick={onClick}
    >
      <ArrowForwardIosIcon />
    </div>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        color: "#5a5a5a",
        lineHeight: "1.5715",
      }}
      onClick={onClick}
    >
      <ArrowBackIosIcon fontSize="medium" />
    </div>
  );
}

export default function CardsCarousel({ CardsSlider, loading }) {
  var settings = {
    autoplay: false,
    autoplaySpeed: 7000,
    // focusOnSelect: true,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1340,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
          arrows: true,
        },
      },

      {
        breakpoint: 950,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };
  return (
    <div className="carousel-container">
      <Slider {...settings}>{CardsSlider}</Slider>
    </div>
  );
}
