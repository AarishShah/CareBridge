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
            </div>
    </div>
  )
}

export default Moto

