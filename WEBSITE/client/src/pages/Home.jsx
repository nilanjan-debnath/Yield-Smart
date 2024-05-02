import React, { useState } from 'react'
import { HashLink } from 'react-router-hash-link';
import BackgroundImg from "../../public/images/background image.webp";
import LeftImg from "../../public/images/side img.png";
import ProblemImg from "../../public/images/problem.jpg";
import SolutionImg from "../../public/images/solution image.jpg";

// icons
import { GrGrow } from "react-icons/gr";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { FaCloudShowersHeavy } from "react-icons/fa";
import LineBar from '../components/LineBar';
import Footer from '../components/Footer';


export default function Home() {

  const [plantData, setPlantData] = useState({
    name: 'rice',
    temperature: 0,
    moisture: 0,
  });
  const [irrigation, setIrrigation] = useState(0);
  const [error, setError] = useState(null);
  console.log(irrigation);
  console.log(error);

  const handleChange = (e) => {
    setPlantData({ ...plantData, [e.target.id]: e.target.value });
  }

  const handeCalculation = () => {
    if (plantData.name === 'potato') {
      if (plantData.temperature >= 15 && plantData.temperature < 21 && plantData.moisture >= 70 && plantData.moisture < 80) {
        setIrrigation(60);
        setError(null);
      }
      else if (plantData.temperature >= 18 && plantData.temperature < 24 && plantData.moisture >= 65 && plantData.moisture < 75) {
        setIrrigation(55);
        setError(null);
      }
      else {
        setIrrigation(0);
        setError("This environment not Ideal for " + plantData.name);
      }
    }
    else if (plantData.name === 'rice') {
      if (plantData.temperature >= 24 && plantData.temperature < 30 && plantData.moisture >= 70 && plantData.moisture < 80) {
        setIrrigation(65);
        setError(null);
      }
      else if (plantData.name === 'rice' && plantData.temperature >= 26 && plantData.temperature < 32 && plantData.moisture >= 80 && plantData.moisture < 90) {
        setIrrigation(75);
        setError(null);
      }
      else if (plantData.name === 'rice' && plantData.temperature >= 22 && plantData.temperature < 28 && plantData.moisture >= 70 && plantData.moisture < 80) {
        setIrrigation(65);
        setError(null);
      }
      else {
        setIrrigation(0);
        setError("This environment not Ideal for " + plantData.name);
      }
    }
    else if (plantData.name === 'tomato') {
      if (plantData.temperature >= 18 && plantData.temperature < 24 && plantData.moisture >= 60 && plantData.moisture < 70) {
        setIrrigation(50);
        setError(null);
      }
      else if (plantData.temperature >= 21 && plantData.temperature < 27 && plantData.moisture >= 55 && plantData.moisture < 65) {
        setIrrigation(45);
        setError(null);
      }
      else {
        setIrrigation(0);
        setError("This environment not Ideal for " + plantData.name);
      }
    }
    else if (plantData.name === 'wheat') {
      if (plantData.temperature >= 10 && plantData.temperature < 20 && plantData.moisture >= 60 && plantData.moisture < 70) {
        setIrrigation(50);
        setError(null);
      }
      else {
        setIrrigation(0);
        setError("This environment not Ideal for " + plantData.name + " plant");
      }
    }
    else {
      if (plantData.temperature >= 15 && plantData.temperature < 20 && plantData.moisture >= 85 && plantData.moisture < 95) {
        setIrrigation(-1);
        setError(null);
      }
      else {
        setIrrigation(0);
        setError("This environment not Ideal for " + plantData.name);
      }
    }
  }

  return (
    <main>
      <div className="relative">
        <img src="./images/background image.webp" alt="" className="w-full h-auto" />
        <div
          className="leftImg w-[20rem] h-[20rem] absolute top-1/2 -right-32 transform -translate-y-1/2 -translate-x-1/2">
          <img src="./images/side img.png" alt="" className="w-full h-full object-contain" />
        </div>
        <div className="absolute top-[60%] left-8">
          <h1 className="text-4xl font-semibold text-white">Grow more, Waste less:</h1>
          <h1 className="text-4xl text-white">The future of sustainable agriculture is here</h1>
        </div>
        <div className="flex gap-2 px-8 py-4">
          <HashLink smooth to="#chalange"
            className="text-xl text-gray-500 font-semibold border-r-4 border-gray-500 px-2">Chalenges</HashLink>
          <HashLink smooth to="#solution"
            className="text-xl text-gray-500 font-semibold border-r-4 border-gray-500 px-2">Solutions</HashLink>
          <HashLink smooth to="#" className="text-xl text-gray-500 font-semibold border-r-4 border-gray-500 px-2">Products</HashLink>
          <HashLink smooth to="#benefits" className="text-xl text-gray-500 font-semibold border-r-4 border-gray-500 px-2">Benefits</HashLink>
          <HashLink smooth to="#diff" className="text-xl text-gray-500 font-semibold">Differentiator</HashLink>
        </div>
      </div>
      <h1 id="chalange" className="text-3xl text-center my-6">Transforming Agriculture: Empowering Farmers Through Smart
        Farming
        Solutions</h1>
      <div className="flex justify-center gap-20 items-center px-8 mt-10 py-6">
        <div className="left w-[40%] border border-black h-[17rem] p-4 rounded-lg">
          <h1 className="text-3xl">What Kind of Problems Do Farmers Face?</h1>
          <p className="py-4 text-justify">Under traditional agriculture, farmers rely on time-and-volume-based
            farming strategy which results in resource excess or insufficiency. The lack of real-time insightful
            data ( pH, temperature, sun light, moisture etc ) in the farm and complexities of conventional
            agriculture system lead to inefficiency, great manpower, and high operation cost.</p>
        </div>
        <div style={{boxShadow: "2px 4px 9px 2px"}} className="right w-[35%] h-[17rem] overflow-hidden rounded-lg">
          <img src="./images/problem.jpg" alt="" className="w-full h-full object-cover" />
        </div>
      </div>
      <div style={{background: "url('https://d17ocfn2f5o4rl.cloudfront.net/wp-content/uploads/2022/01/MAR-7834-HEADER-BP-GIS-in-Agriculture_UPD.jpg') no-repeat", backgroundSize: "cover"}}
        className="py-2">
        <h1 id="solution" className="text-center text-3xl my-10 font-semibold">Solutions</h1>
        <div className="solution flex px-8 justify-around my-4">
          <div style={{boxShadow: "2px 4px 9px 2px"}} className="left w-[40%] h-[20rem] rounded-lg overflow-hidden">
            <img src="./images/solution image.jpg" alt="" className="w-full h-full object-cover" />
          </div>
          <div
            className="right rounded-lg w-[50%] p-4 border border-white flex h-[22rem] bg-transparent backdrop-filter backdrop-blur-sm">
            <div className="p-3 flex flex-col items-center gap-4">
              <i className="fa-solid fa-seedling text-4xl text-gray-600"></i>
              <p className="text-center">Real-time insights revolutionize farming, enabling proactive decisions to
                optimize crop health and resource usage. With advanced technology, farmers boost efficiency,
                increase yields, and ensure long-term sustainability.</p>
            </div>
            <div className="p-3 flex flex-col items-center gap-4">
              <i className="fa-solid fa-hand-holding-dollar text-4xl text-gray-600"></i>
              <p className="text-center">Cut costs, waste, and effort with remote management in agriculture.
                Utilize
                technology to streamline tasks, optimize resources, and enhance productivity from afar,
                ensuring
                sustainability and profitability.</p>
            </div>
            <div className="p-3 flex flex-col items-center gap-4">
              <i className="fa-solid fa-cloud-sun-rain text-4xl text-gray-600"></i>
              <p className="text-center">Combat climate-induced weather volatility with strategic agricultural
                approaches. Employ resilient farming practices to mitigate risks, adapt to changing
                conditions,
                and ensure consistent yields despite environmental challenges.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="threeSection relative flex justify-center mt-12 mb-6 h-[120vh]">
        <div className="img w-[80%] overflow-hidden h-[30rem] my-40 relative z-20">
          <img src="./images/three section.jpg" alt="" className="w-full h-full object-contain" />
        </div>
        <div
          className="absolute border-4 border-gray-300 w-[30rem] h-[28rem] p-4 rounded-xl top-0 right-28 z-10 text-gray-600">
          <h1 className="text-center text-2xl my-4 font-semibold">Field Crops</h1>
          <p className="w-[80%] float-right text-justify mx-4">Rice, being a water-loving plant, is typically
            cultivated in flooded paddy fields, with water depth varying throughout growth stages. It's
            essential to maintain proper water levels for optimal growth. In contrast, wheat prefers
            well-drained soil and is not typically grown in flooded conditions. Additionally, while both crops
            require nitrogen, phosphorus, and potassium, the specific nutrient needs may vary depending on the
            soil type and environmental conditions. Micronutrients such as iron, zinc, and manganese play vital
            roles in the healthy growth of both rice and wheat plants, ensuring proper development and
            resistance to diseases.</p>
        </div>
        <div
          className="absolute border-4 border-gray-300 w-[30rem] h-[25rem] p-4 rounded-xl -bottom-0 right-32 z-10 text-gray-600">
          <h1 className="text-center text-2xl my-4 font-semibold">Vegetable Crops</h1>
          <p className="w-[80%] float-right text-justify mx-4">Vegetable plants have diverse growing requirements
            compared to field crops like rice and wheat. They thrive in well-drained soil and are not typically
            grown in flooded conditions like rice. While they also require essential nutrients like nitrogen,
            phosphorus, and potassium, the specific needs vary depending on the plant type and environmental
            conditions. Micronutrients such as iron, zinc, and manganese are crucial for their healthy growth,
            aiding in proper development and disease resistance.</p>
        </div>
        <div
          className="absolute border-4 border-gray-300 w-[30rem] h-[29rem] p-4 rounded-xl bottom-8 left-28 z-10 text-gray-600">
          <h1 className="text-center text-2xl my-4 font-semibold">Greenhouse Crops</h1>
          <p className="w-[80%] float-left text-justify mx-4">For greenhouse plants, environmental control is
            paramount. Each species may have specific temperature, humidity, and light requirements for optimal
            growth. Unlike rice and wheat, which are field crops, greenhouse plants are cultivated in controlled
            environments. They are shielded from external weather conditions, allowing for year-round
            production. Greenhouse plants often require precise management of watering schedules to avoid
            overwatering or underwatering, as well as proper ventilation to prevent diseases. Nutrient
            management is also critical, with balanced formulations of nitrogen, phosphorus, and potassium
            tailored to the specific needs of each plant species.</p>
        </div>
      </div>
      <div style={{background: "url('https://www.growindigo.co.in/wp-content/uploads/2024/01/About-Grow-Indigo-Resized.jpg') no-repeat", backgroundSize: "cover"}}
        id="benefits" className="w-full px-4 py-8 text-white opacity-90">
        <h1 className="text-3xl my-8 text-center font-semibold">Benefits Will You Get</h1>
        <div className="flex justify-center gap-8">
          <div className="left border-4 w-[35%] p-8 rounded-lg bg-transparent backdrop-filter backdrop-blur-md">
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
          <div className="right border-4 w-[35%] p-8 rounded-lg bg-transparent backdrop-filter backdrop-blur-md">
            <ul className="flex flex-col gap-4 text-lg">
              <li className="flex flex-col"><span className="font-semibold">Minimum Human Interference</span><span
                className="text-base">The crops are kept at optimum temperature, humidity, light, CO2 , and
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
        <div className="flex gap-10 justify-center my-8 px-4 items-center">
          <div className="left border border-black w-[50%] p-4 rounded-xl">
            <h1 className="text-xl font-semibold my-2">UV Films</h1>
            <ul className="flex flex-col gap-4">
              <li>UV films act as a barrier, shielding crops from harmful UV radiation in sunlight, reducing sunburn and leaf damage, which can otherwise decrease crop yields and quality.</li>
              <li>UV films block UV rays, reducing the transmission of pathogens like viruses, bacteria, and fungi among crops. This helps maintain healthier plants and higher yields, crucial in enclosed environments like greenhouses prone to rapid disease spread.</li>
              <li>UV films regulate greenhouse temperature by blocking UV rays, reducing solar heat gain while allowing visible light through. This stabilizes growing conditions, preventing overheating and fluctuations for optimal crop growth.</li>
              <li>UV films conserve water by reducing soil surface evaporation. By blocking UV radiation, they prevent rapid evaporation of surface moisture droplets, helping plants utilize water more efficiently, particularly in arid regions.</li>
            </ul>
          </div>
          <div style={{boxShadow: "2px 4px 9px 2px"}} className="right w-[35%] h-80 rounded-xl overflow-hidden">
            <img src="https://europlas.com.vn/Data/Sites/1/media/000croda_image_downloads.jpg" alt="" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="flex justify-center gap-10 my-8 items-center">
          <div style={{boxShadow: "2px 4px 9px 2px"}} className="left w-[35%] overflow-hidden rounded-xl">
            <img src="https://www.researchgate.net/profile/Manar-El-Sayed-Abdel-Raouf/publication/356783134/figure/fig4/AS:1099767249682433@1639216353047/Roles-of-hydrogels-in-agriculture.jpg" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="right w-[50%] p-4 border border-black rounded-xl">
            <h1 className="text-xl font-semibold my-4">Hydrogel</h1>
            <ul className="flex flex-col gap-4">
              <li>Hydrogels act as soil water reservoirs, maintaining moisture levels and providing continuous hydration to plant roots, even during droughts. This promotes healthier crop growth and reduces water stress.</li>
              <li>Hydrogels improve soil water retention, allowing farmers to reduce irrigation frequency and water usage while sustaining crop productivity. This conserves water, cuts irrigation costs, and enhances agricultural sustainability and profitability.</li>
              <li>Hydrogels absorb and retain nutrients and fertilizers, preventing leaching from the soil. This boosts nutrient uptake by plant roots, improving utilization and reducing nutrient runoff, which can harm the environment.</li>
              <li>Hydrogels improve soil structure by increasing porosity and reducing compaction, promoting better root development and nutrient uptake.</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
