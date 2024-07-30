import React from "react";
import backgroundImage from "../assets/8.png";

const features = [
    {
        id: 1,
        title: "Advanced Clinical Tools",
        description: "Utilize cutting-edge tools to enhance your clinical practice and improve patient outcomes. Our platform offers a comprehensive suite of clinical decision support tools that streamline workflows, reduce errors, and provide evidence-based recommendations. From diagnostic aids to treatment planning, our advanced tools empower healthcare professionals to deliver high-quality care efficiently and effectively."
      },
      {
        id: 2,
        title: "Latest Medical Guidelines",
        description: "Stay updated with the latest medical guidelines and best practices. Our platform continuously updates with the most recent guidelines from leading medical organizations, ensuring that you have access to the most current standards of care. Whether it's new protocols for disease management or updates on preventive measures, you'll always be informed and prepared to provide the best care possible."
      },
      {
        id: 3,
        title: "Expert Insights",
        description: "Access expert insights and recommendations to support your clinical decisions. Our platform connects you with a network of medical experts and thought leaders who share their knowledge and experience through detailed articles, case studies, and webinars. Gain valuable perspectives on complex cases, stay informed about emerging trends in healthcare, and enhance your clinical decision-making with expert guidance."
      },
      {
        id: 4,
        title: "Patient Management",
        description: "Efficiently manage patient records and streamline your workflow. Our platform provides robust patient management features that allow you to easily organize and access patient information, schedule appointments, and track treatment progress. With integrated tools for electronic health records (EHR), secure messaging, and patient portals, you can improve communication, enhance patient engagement, and ensure continuity of care."
      }
];

const Features = () => {
  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-semibold text-center mb-8 text-black">Key Features of CareBridge</h1>
        {features.map((feature) => (
          <div
            key={feature.id}
            className="mb-6 p-8 h-64 border rounded-lg shadow-sm relative bg-cover bg-center text-black"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          >
            <div className="absolute inset-0 bg-black opacity-20 rounded-lg"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">{feature.title}</h2>
              <p className="text-lg">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
