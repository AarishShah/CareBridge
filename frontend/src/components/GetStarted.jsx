import image from "../assets/5.png";

export default function GetStarted() {
  return (
    <div className="relative">
      <img src={image} alt="" className="w-full h-auto" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-8 py-8 rounded-lg">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-black mb-4 md:mb-6">Elevate Your Medical Practice</h1>
        <p className="text-sm md:text-md lg:text-lg text-black mb-2 md:mb-4 mt-4 md:mt-6">
          Join CareBridge and transform <br />
          your practice with advanced clinical tools. <br /> Stay ahead with the latest medical guidelines and expert <br />
           insights to enhance patient outcomes.
        </p>
        <p className="text-sm md:text-md lg:text-lg text-black">
          Looking to elevate your practice?
          <button className="mt-2 md:mt-4 ml-2 md:ml-4 px-4 md:px-6 py-2 bg-blue-500 text-white rounded-lg">Get Started</button>
        </p>
      </div>
    </div>
  );
}
