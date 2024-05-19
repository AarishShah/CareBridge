import image from '../assets/1.png';

export default function Moto() {
  return (
    <div className="relative">
      <img src={image} alt="Moto Image" className="w-full h-auto" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
        <p className="text-black text-3xl font-semibold mb-6">
          CareBridge
        </p>
        <p className="text-black text-xl leading-relaxed">
          Quick Access and Management<br />
          of all Medical Records<br />
          at one Destination
        </p>
      </div>
    </div>
  );
}
