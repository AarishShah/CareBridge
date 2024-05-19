import image from '../assets/2.png';

export default function Header() {
  return (
    <div className="flex items-center justify-between p-4 bg-white ml-8 font-sans">
      {/* Left navigation links */}
      <div className="flex space-x-8 text-xl">
        <button className=" ">Home</button>
        <button className="">Contact</button>
        <button className="">Team</button>
        <button className="">About</button>
      </div>
      
      {/* Centered logo */}
      <div className="flex items-center">
        <img src={image} alt="logo" className="h-12 w-12 rounded-full" />       
      </div>
      
      {/* Right authentication links */}
      <div className="flex space-x-8 mr-8 text-xl">
      <input
          type="text"
          placeholder="search..."
          className="pl-2 text-sm border border-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="">Log in</button>
        <button className="">Sign up</button>
      </div>
    </div>
  );
}
