import image from "../assets/5.png";

export default function GetStarted() {
  return (
    <div className="relative">
      <img src={image} alt="" className="w-full h-auto" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 rounded-lg">
        <h1 className="text-3xl font-semibold text-black mb-8">Elevate Your Medical Practice</h1>
        <p className="text-lg text-black mb-4 mt-8">
          Join CareBridge and transform your practice with <br />
          advanced clinical tools. Stay ahead with the latest <br />
          medical guidelines and expert insights to <br />
          enhance patient outcomes.
        </p>
        <p className="text-lg text-black">
          Looking to elevate your practice? 
          <button className="mt-4 ml-4 px-6 py-2 bg-blue-500 text-black rounded-lg">Get Started</button>
        </p>
      </div>
    </div>
  );
}
