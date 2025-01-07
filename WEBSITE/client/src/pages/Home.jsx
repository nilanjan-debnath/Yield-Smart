import React, { useEffect, useState } from 'react'
import { HashLink } from 'react-router-hash-link';
import Footer from '../components/Footer';
import backgroundImg from "../../public/images/background image.webp";
import circularImg from "../../public/images/side img.png";
import problemImg from "../../public/images/problem.jpg"
import solutionImg from "../../public/images/solution.jpg";
import solutionLeftImg from "../../public/images/solution image.jpg";
import benefitsImg from "../../public/images/grow.jpg";
import Header from '../components/Header';
import imageUvFilm from "/images/pic1.jpg";
import imageHidrogel from "/images/pic2.png";


export default function Home() {

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkBackend();
  }, []);

  const checkBackend = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/test");
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        setLoading(false);
        return;
      }
      console.log(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <>
    <Header />
    <main>
      {loading && (
        <div className="w-full h-screen bg-[#36ADFF] flex items-center justify-center absolute top-0 left-0">
          <div className="w-16 h-16 border-8 border-t-8 border-t-white border-gray-300 rounded-full animate-spin"></div>
        </div>
      )}
      {!loading && (
        <div>
          <div className="relative">
            <div className="w-full h-48 sm:h-60 md:h-auto">
              <img src={backgroundImg} alt="" className="w-full h-full object-cover" />
            </div>
            <div
              className="leftImg hidden absolute top-[40%] -right-20 transform -translate-y-1/2 -translate-x-1/2 lg:block w-48 h-48 xl:-right-32 xl:top-1/2 xl:w-[20rem] xl:h-[20rem]">
              <img src={circularImg} alt="" className="w-full h-full object-contain" />
            </div>
            <div className="absolute top-16 left-2 lg:top-[60%] lg:left-8">
              <h1 className="text-3xl font-semibold text-white sm:text-4xl">Grow More, Waste Less:</h1>
              <h1 className="text-2xl text-white sm:text-4xl">The future of sustainable agriculture is here</h1>
            </div>
            <div className="flex gap-1 px-1 py-4 sm:gap-2 lg:px-8">
              <HashLink smooth to="#chalange"
                className="text-base text-gray-500 font-semibold border-r-4 border-gray-500 px-1 sm:px-2 sm:text-xl">Challenges</HashLink>
              <HashLink smooth to="#solution"
                className="text-base text-gray-500 font-semibold border-r-4 border-gray-500 px-1 sm:px-2 sm:text-xl">Solutions</HashLink>
              <HashLink smooth to="#benefits" className="text-base text-gray-500 font-semibold border-r-4 border-gray-500 px-1 sm:px-2 sm:text-xl">Benefits</HashLink>
              <HashLink smooth to="#diff" className="text-base text-gray-500 font-semibold sm:text-xl">Differentiator</HashLink>
            </div>
          </div>
          <h1 id="chalange" className="text-xl text-center my-6 sm:px-2 sm:text-2xl md:px-0 md:text-3xl">Transforming Agriculture: Empowering Farmers Through Smart
            Farming
            Solutions</h1>
          <div className="flex flex-col-reverse justify-center gap-20 items-center px-4 mt-10 py-6 sm:gap-4 lg:gap-20 xl:px-8 sm:flex-row">
            <div className="left w-full border border-black  p-4 rounded-lg sm:w-[50%] lg:w-[40%]">
              <h1 className="text-xl sm:text-2xl md:text-3xl">What Kind of Problems Do Farmers Face?</h1>
              <p className="py-4 text-justify text-sm sm:text-base">Under traditional agriculture, farmers rely on time-and-volume-based
                farming strategy which results in resource excess or insufficiency. The lack of real-time insightful
                data ( pH, temperature, sunlight, moisture, etc.) in the farm and complexities of conventional
                agriculture system lead to inefficiency, great manpower and high operation cost.</p>
            </div>
            <div style={{ boxShadow: "2px 4px 9px 2px" }} className="right w-full h-[17rem] overflow-hidden rounded-lg sm:w-[50%] lg:w-[35%]">
              <img src={problemImg} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
          <div style={{ background: `url(${solutionImg}) no-repeat`, backgroundSize: "cover" }}
            className="py-2">
            <h1 id="solution" className="text-center text-3xl my-10 font-semibold">Solutions</h1>
            <div className="solution flex flex-col px-2 gap-8 my-4 sm:flex-row sm:px-8 sm:justify-around sm:gap-0 md:px-4 md:gap-2 lg:px-8">
              <div style={{ boxShadow: "2px 4px 9px 2px" }} className="left w-full h-[20rem] rounded-lg overflow-hidden sm:hidden md:block md:w-1/2 lg:w-[40%]">
                <img src={solutionLeftImg} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="right h-[29rem] rounded-lg w-full px-1 py-4 border border-white flex bg-transparent backdrop-filter backdrop-blur-sm sm:px-4 sm:w-[95%] md:w-[50%] sm:h-[22rem] text-white sm:text-black">
                <div className="py-3 px-1 flex flex-col items-center gap-4 sm:px-3">
                  <p className="text-center text-sm sm:text-base">Real-time insights revolutionize farming, enabling proactive decisions to
                    optimize crop health and resource usage. With advanced technology, farmers boost efficiency,
                    increase yields, and ensure long-term sustainability.</p>
                </div>
                <div className="p-3 flex flex-col items-center gap-4">
                  <p className="text-center text-sm sm:text-base">Cut costs, waste, and effort with remote management in agriculture.
                    Utilize
                    technology to streamline tasks, optimize resources, and enhance productivity from afar,
                    ensuring
                    sustainability and profitability.</p>
                </div>
                <div className="p-3 flex flex-col items-center gap-4">
                  <p className="text-center text-sm sm:text-base">Combat climate-induced weather volatility with strategic agricultural
                    approaches. Employ resilient farming practices to mitigate risks, adapt to changing
                    conditions,
                    and ensure consistent yields despite environmental challenges.</p>
                </div>
              </div>
            </div>
          </div>
          <div style={{ background: `url(${benefitsImg}) no-repeat`, backgroundSize: "cover" }}
            id="benefits" className="w-full h-screen px-4 py-4 text-white opacity-90 sm:py-8">
            <h1 className="text-2xl my-2 text-center font-semibold sm:my-8 sm:text-3xl">Benefits You will Get</h1>
            <div className="flex flex-col justify-center gap-4 sm:flex-row sm:gap-2 md:gap-8">
              <div className="left border-4 w-full p-8 rounded-lg bg-transparent backdrop-filter backdrop-blur-md sm:w-1/2 sm:px-4 md:px-8 lg:w-[35%]">
                <ul className="flex flex-col gap-4 text-lg">
                  <li className="flex flex-col"><span className="font-semibold">Efficiency Improvement</span><span
                    className="text-base">The automatic remote solution can improve resource usage effectively,
                    including water, light, etc.</span></li>
                  <li className="flex flex-col"><span className="font-semibold">High Flexibility at Scale</span><span
                    className="text-base">The battery-powered sensors can be added or moved anytime anywhere
                    with no worries about cable and electricity.</span></li>
                  <li className="flex flex-col"><span className="font-semibold">Data Visualization</span><span
                    className="text-base">Data Visualization
                    Collected data can be transferred to the cloud platform, enabling users to remote
                    control and monitor the devices.</span></li>
                  <li className="flex flex-col"><span className="font-semibold">Crops Diseases identification </span><span
                    className="text-base">Automated remote solutions, like imagery and drones, swiftly identify
                    crop diseases over large areas, optimizing resource usage.</span></li>
                </ul>
              </div>
              <div className="right border-4 w-[35%] p-8 rounded-lg bg-transparent backdrop-filter backdrop-blur-md hidden sm:block sm:w-1/2 sm:px-4 md:px-8 lg:w-[35%]">
                <ul className="flex flex-col gap-4 text-lg">
                  <li className="flex flex-col"><span className="font-semibold">Minimum Human Interference</span><span
                    className="text-base">The crops are kept at optimum temperature, humidity, light, CO2, and
                    soil moisture levels automatically.</span></li>
                  <li className="flex flex-col"><span className="font-semibold">Low Maintenance Costs</span><span
                    className="text-base">The battery-powered sensors will do away with a lot of the repetitive
                    work.</span></li>
                  <li className="flex flex-col"><span className="font-semibold">Labor Costs Reduction</span><span
                    className="text-base">The automatic solution will decrease the number of farmers needed to
                    monitor and tend the growth situation of crops.</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div id="diff" className="">
            <h1 className="text-3xl my-4 text-center">Differentiator</h1>
            <div className="flex flex-col-reverse gap-8 justify-center my-8 px-4 items-center sm:gap-4 md:gap-10 sm:flex-row">
              <div className="left border border-black w-full p-4 rounded-xl sm:w-[50%]">
                <h1 className="text-xl font-semibold my-2">UV Films</h1>
                <ul className="flex flex-col gap-4 text-sm sm:text-base">
                  <li>UV films act as a barrier, shielding crops from harmful UV radiation in sunlight, reducing sunburn and leaf damage, which can otherwise decrease crop yields and quality.</li>
                  <li>UV films block UV rays, reducing the transmission of pathogens like viruses, bacteria, and fungi among crops. This helps maintain healthier plants and higher yields, crucial in enclosed environments like greenhouses prone to rapid disease spread.</li>
                  <li>UV films regulate greenhouse temperature by blocking UV rays, reducing solar heat gain while allowing visible light through. This stabilizes growing conditions, preventing overheating and fluctuations for optimal crop growth.</li>
                  <li>UV films conserve water by reducing soil surface evaporation. By blocking UV radiation, they prevent rapid evaporation of surface moisture droplets, helping plants utilize water more efficiently, particularly in arid regions.</li>
                </ul>
              </div>
              <div style={{ boxShadow: "2px 4px 9px 2px" }} className="right w-full h-80 rounded-xl overflow-hidden sm:w-[50%] md:w-[35%]">
                <img src={imageUvFilm} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex justify-center flex-col px-4 gap-8 my-8 items-center sm:gap-4 md:gap-10 sm:flex-row sm:px-4">
              <div style={{ boxShadow: "2px 4px 9px 2px" }} className="left w-full overflow-hidden rounded-xl sm:w-[50%] md:w-[35%]">
                <img src={imageHidrogel} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="right w-full p-4 border border-black rounded-xl sm:w-[50%]">
                <h1 className="text-xl font-semibold my-4">Hydrogel</h1>
                <ul className="flex flex-col gap-4 text-sm sm:text-base">
                  <li>Hydrogels act as soil water reservoirs, maintaining moisture levels and providing continuous hydration to plant roots, even during droughts. This promotes healthier crop growth and reduces water stress.</li>
                  <li>Hydrogels improve soil water retention, allowing farmers to reduce irrigation frequency and water usage while sustaining crop productivity. This conserves water, cuts irrigation costs, and enhances agricultural sustainability and profitability.</li>
                  <li>Hydrogels absorb and retain nutrients and fertilizers, preventing leaching from the soil. This boosts nutrient uptake by plant roots, improving utilization and reducing nutrient runoff, which can harm the environment.</li>
                  <li>Hydrogels improve soil structure by increasing porosity and reducing compaction, promoting better root development and nutrient uptake.</li>
                </ul>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      )}
    </main>
    </>
  )
}
