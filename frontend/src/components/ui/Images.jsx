import React from 'react';

const Images = ({ images }) => {
  return (
    <div className='h-full w-10/12 ml-44 mt-12 overflow-auto '>
      {images.map((image, index) => (
        <div key={index} className='relative mb-12 '>
          <img src={image.src} alt="" className='w-full h-auto' />
          <div className='absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-2'>
            {image.text}
            {image.button && (
              <button className='ml-4 bg-gray-500 text-white p-2 rounded'>
                {image.button.text}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Images;
