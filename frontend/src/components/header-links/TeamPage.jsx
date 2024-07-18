import Header from '../Header';
import backgroundImage from '../../assets/8.png'; // Ensure the path matches your project structure

const TeamPage = () => {
  return (
    <>
      <Header/>
    <div className="min-h-screen flex flex-col items-center p-4"
         style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="bg-white bg-opacity-75 rounded-lg shadow-lg p-6 max-w-4xl text-center">
        <h1 className="text-3xl font-semibold text-gray-800 mb-10">Our Team</h1>
        <p className="text-lg text-gray-600">
          At CareBridge, our team is comprised of dedicated professionals spanning multiple disciplines, including medical experts, software engineers, data analysts, and support staff. Together, we are committed to revolutionizing healthcare through innovation and technology.
        </p>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-700">What We Do</h2>
          <p className="text-gray-600 mt-2">
            Our team works collaboratively to design, develop, and deploy advanced clinical decision support tools that integrate seamlessly into existing healthcare systems. Our efforts focus on enhancing the accuracy of diagnostics, improving patient outcomes, and streamlining clinical workflows.
          </p>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-700">Our Mission</h2>
          <p className="text-gray-600 mt-2">
            We are driven by the mission to empower healthcare providers by delivering innovative and effective solutions that improve care quality and patient safety. Our ultimate goal is to create a more efficient and effective healthcare environment for all.
          </p>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-700">Join Us</h2>
          <p className="text-gray-600 mt-2">
            We are always looking for passionate individuals to join our team. If you are interested in making a significant impact in the healthcare technology sector, reach out to us!
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default TeamPage;
