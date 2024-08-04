import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import image from '../assets/17.png';
import image1 from '../assets/18.png';
import image2 from '../assets/15.png';
import image3 from '../assets/16.png';

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
  {
    img: image2,
    alt: 'Patient Care',
    title: 'Revolutionize Patient Care',
    description: 'Experience seamless integration of advanced AI tools to enhance diagnosis and treatment plans on CareBridge.',
  },
  {
    img: image3,
    alt: 'Real-Time Data',
    title: 'Foster Collaborative Practice',
    description: 'Connect with other healthcare professionals to share insights and best practices.',
  },
];

export default function DynamicSection() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 25000, // Slow speed for continuous sliding
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
        <div key="first-section" style={{ display: 'flex' }}>
          <div style={{ width: '100%' }}>
            {/* First Section */}
            <div className="flex items-center mb-24 bg-white rounded-lg shadow-lg p-8">
              <img src={sections[0].img} alt={sections[0].alt} className="mr-16 h-80 w-112 rounded-lg object-cover" />
              <div className="ml-auto text-left">
                <h2 className="text-2xl font-semibold mb-4">
                  {sections[0].title}
                </h2>
                <p className="text-lg">
                  {sections[0].description}
                </p>
              </div>
            </div>

            <div className="flex items-center bg-white rounded-lg shadow-lg p-8">
              <img src={sections[1].img} alt={sections[1].alt} className="mr-16 h-80 w-112 rounded-lg object-cover" />
              <div className="ml-auto text-left">
                <h2 className="text-2xl font-semibold mb-4">
                  {sections[1].title}
                </h2>
                <p className="text-lg">
                  {sections[1].description}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div key="second-section" style={{ display: 'flex' }}>
          <div style={{ width: '100%' }}>
            {/* Second Section */}
            <div className="flex items-center mb-24 bg-white rounded-lg shadow-lg p-8">
              <img src={sections[2].img} alt={sections[2].alt} className="mr-16 h-80 w-112 rounded-lg object-cover" />
              <div className="ml-auto text-left">
                <h2 className="text-2xl font-semibold mb-4">
                  {sections[2].title}
                </h2>
                <p className="text-lg">
                  {sections[2].description}
                </p>
              </div>
            </div>

            <div className="flex items-center bg-white rounded-lg shadow-lg p-8">
              <img src={sections[3].img} alt={sections[3].alt} className="mr-16 h-80 w-112 rounded-lg object-cover" />
              <div className="ml-auto text-left">
                <h2 className="text-2xl font-semibold mb-4">
                  {sections[3].title}
                </h2>
                <p className="text-lg">
                  {sections[3].description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Slider>
    </div>
  );
}
