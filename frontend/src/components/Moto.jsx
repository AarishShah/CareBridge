// import image from '../assets/1.png';

// export default function Moto() {
//   return (
//     <div className="relative">
//       <img src={image} alt="Moto Image" className="w-full h-auto" />
//       <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
//         <p className="text-black text-3xl font-semibold mb-6">
//           CareBridge
//         </p>
//         <p className="text-black text-xl leading-relaxed">
//           Quick Access and Management<br />
//           of all Medical Records<br />
//           at one Destination
//         </p>
//       </div>
//     </div>
//   );
// }

import video1 from "../assets/video1.mp4";
import video2 from "../assets/video2.mp4";

const Moto = () => {
  return (
    <div className="flex flex-col items-center mt-6 lg:mt-20">
        <h1 className="text-3xl sm:text-6xl lg:text-6xl text-center tracking-wide">
        Empower Healthcare Decisions
            <span className="bg-gradient-to-r from-blue-500 to-blue-800 text-transparent bg-clip-text">{" "} <br /> with CareBridge</span> 
        </h1>
        <p className="mt-10 text-lg text-center text-neutral-500 max-w-4xl">Transform your clinical practice with intelligent insights.
Unlock the potential of your medical expertise with our advanced decision support tools. Experience the future of healthcare today with CareBridge.</p>
      <div className="flex justify-center my-10">
        <a href="#" className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 px-4 mx-3 rounded-md">
            Start for free
            </a>
            <a href="#" className="py-3 px-4 mx-3 rounded-md border">
                Documentation 
                </a>
            </div>
            <div className="flex mt-10 justify-center">
                {/* <video autoplay loop muted className="rounded-lg h-80 w-112 border border-blue-700 shadow-blue-400 mx-2 my-4">
                    <source src={video1} type="video/mp4"/>
                    Your browser does not support the video tag.
                </video>
                <video autoplay loop muted className="rounded-lg h-80 w-112 border border-blue-700 shadow-blue-400 mx-2 my-4">
                    <source src={video2} type="video/mp4"/>
                    Your browser does not support the video tag.
                </video> */}
            </div>

    </div>
  )
}

export default Moto

