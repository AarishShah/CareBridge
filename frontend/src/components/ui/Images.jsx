import React from "react";
import { useNavigate } from 'react-router-dom';
import PersonalInfoDoctor from '../ui/personalInfo/PersonalInfoDoctor';
import PersonalInfoPatient from '../ui/personalInfo/PersonalInfoPatient';

const Images = ({ images, setHoveredIndex }) => {
  const navigate = useNavigate();

  const handleButtonClick = (path) => {
    navigate(path);
  };

  const renderComponent = (component) => {
    switch (component) {
      case 'PersonalInfoDoctor':
        return <PersonalInfoDoctor />;
      case 'PersonalInfoPatient':
        return <PersonalInfoPatient />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full w-full md:w-10/12 ml-4 md:ml-44 mt-12 no-scrollbar overflow-hidden hover:overflow-scroll">
      {images.map((image, index) => (
        <div 
          key={index}
          className="relative mb-12 flex flex-col items-start"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <img src={image.src} alt={image.heading} className="w-full h-auto sm:h-full" />
          <div className="absolute top-0 left-12 mt-8 text-black text-lg md:text-2xl font-semibold p-2">
            {image.heading}
            <div>
              {image.button && (
                <button
                  className="w-4/12 md:w-7/12 ml-96 md:mt-6 bg-gray-300 text-black text-sm p-2 rounded"
                  onClick={() => handleButtonClick(image.button.path)}
                >
                  {image.button.text}
                </button>
              )}
              {image.buttons && image.buttons.map((btn, btnIndex) => (
                <button
                  key={btnIndex}
                  className="w-4/12 md:w-5/12 ml-96 mt-2 bg-gray-300 text-black text-sm p-2 rounded"
                  onClick={() => handleButtonClick(btn.path)}
                >
                  {btn.text}
                </button>
              ))}
            </div>
          </div>
          <div className="absolute top-20 text-sm md:text-lg p-2 left-12">
            {image.component ? (
              renderComponent(image.component)
            ) : (
              <div dangerouslySetInnerHTML={{ __html: image.text }} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Images;
