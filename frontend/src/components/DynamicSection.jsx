import image from '../assets/3.png';
import image1 from '../assets/4.png';

export default function DynamicSection() {
  return (
    <div className="px-40 py-24">
      {/* First Section */}
      <div className="flex items-center mb-24 bg-white rounded-lg shadow-lg p-8">
        <img src={image} alt="Healthcare" className="h-80 w-112 rounded-lg object-cover" />
        <div className="ml-16 text-left">
          <h2 className="text-2xl font-semibold mb-4">
            Discover Informed Healthcare Decisions
          </h2>
          <p className="text-lg">
            On CareBridge, access the latest clinical guidelines 
            and personalized recommendations.
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
  );
}
