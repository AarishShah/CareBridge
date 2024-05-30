// DynamicSection.js
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import image from '../assets/3.png';
import image1 from '../assets/4.png';

const sections = [
  {
    img: image,
    alt: 'Healthcare',
    title: 'Discover Informed Healthcare Decisions',
    description: 'On CareBridge, access the latest clinical guidelines and personalized recommendations.',
  },
  {
    img: image1,
    alt: 'Clinicians',
    title: 'Empowering Clinicians Everywhere',
    description: 'Join a community of professionals dedicated to improving patient outcomes.',
  },
];

export default function DynamicSection() {
  const allSections = [...sections, ...sections];

  const settings = {
    dots: true,
    infinite: true,
    speed: 4000, // Slow speed for continuous sliding
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0, // For continuous sliding
    cssEase: 'linear', // Smooth transition
    pauseOnHover: false, // Do not pause on hover
    arrows: false, // Hide arrows for cleaner look
  };

  return (
    <div className="overflow-hidden">
      <Slider {...settings}>
        {allSections.map((section, index) => (
          <div key={index} style={{ display: 'flex' }}>
            <div style={{ width: '100%' }}>
              {/* First Section */}
              <div className="flex items-center mb-24 bg-white rounded-lg shadow-lg p-8">
                <img src={section.img} alt={section.alt} className="mr-16 h-80 w-112 rounded-lg object-cover" />
                <div className="ml-auto text-left">
                  <h2 className="text-2xl font-semibold mb-4">
                    {section.title}
                  </h2>
                  <p className="text-lg">
                    {section.description}
                  </p>
                </div>
              </div>

              {/* Second Section */}
              <div className="flex items-center bg-white rounded-lg shadow-lg p-8">
                <div className="mr-16 text-left">
                  <h2 className="text-2xl font-semibold mb-4">
                    Empowering Clinicians Everywhere
                  </h2>
                  <p className="text-lg">
                    Join a community of professionals dedicated
                    to improving patient outcomes.
                  </p>
                </div>
                <img src={image1} alt="Clinicians" className="h-80 w-112 rounded-lg object-cover ml-auto" />
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
