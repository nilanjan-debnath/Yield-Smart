import React, { useEffect, useState } from 'react';
import leafImage from "../../public/images/leaf image1.jpg";

export default function Disease() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [image, setImage] = useState(leafImage);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  // console.log(selectedImage);
  // console.log(image);
  console.log(output);
  // console.log(loading);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);

    // add image reader
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      // You can get the source link of the image here
      const srcLink = reader.result;
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', selectedImage);

      const res = await fetch("/api/gemini/getInfo", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setOutput(data);
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  }


  function formatApiResponse(text) {
    text = text.replace(/\n\n/g, '\n');
    const li = ['1. ', '2. ', '3. ', '4. ', '5. '];
    li.forEach(l => {
        text = text.replace(new RegExp(escapeRegExp(l), 'g'), '');
    });
    const sections = text.split('\n');
    
    let formattedHtml = '';

    sections.forEach(section => {
        if (/\*\*/.test(section)) {
            const parts = section.split('**');
            let formattedSection = '';
            for (let i = 0; i < parts.length; i++) {
                if (i % 2 === 0) {
                    formattedSection += parts[i];
                } else {
                    formattedSection += `<span>${parts[i]}</span>`;
                }
            }
            formattedHtml += `<p>${formattedSection}</p>`;
        } else {
            formattedHtml += `<p>${section}</p>`;
        }
    });
    // return formattedHtml;
    const removedStartText = formattedHtml.split("*").join('');
    return YourComponent(removedStartText);
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function YourComponent(string) {

  // Create a JSX element with dangerouslySetInnerHTML to render the string as HTML
  return (
      <div dangerouslySetInnerHTML={{ __html: string }} />
  );
}

  return (
    <div>
      <div className="flex flex-col-reverse w-full min-h-[90vh] sm:flex-row">
        <div className="left w-full border border-black min-h-full p-2 relative sm:w-[70%] sm:p-8">
          {loading && (
            <div className="w-full h-full top-0 left-0 absolute flex justify-center items-center bg-gray-300">
              <div className="border-8 border-t-8 border-t-white border-gray-400 rounded-full h-16 w-16 animate-spin"></div>
            </div>
          )}
          {output === '' && (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <h1 className="text-3xl text-gray-500 font-semibold">Plants Diseases Detect</h1>
              <h1 className="text-xl text-gray-400">Upload an Image to check plant Disease</h1>
            </div>
          )}
          {output !== '' && (
            <div className="output p-4 border border-black rounded-md">
              {(output !== '' && !loading) && (
                formatApiResponse(output)
              )}
            </div>
          )}
        </div>
        <div className="right w-full border border-black min-h-full py-0 px-8 flex flex-col items-center gap-4 sm:w-[30%] sm:px-4 sm:py-10">
        {image !== '' && (
            <img src={image} alt="" className="w-[80%] h-80 object-contain p-2 sm:w-full " />
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center border-2 rounded-md p-4">
            <input type="file" onChange={handleFileChange} className='border border-black w-full p-2 rounded-md' required />
            <button className='bg-blue-500 font-semibold py-2 px-4 rounded-md text-white w-full transition-all duration-300 hover:bg-blue-600'>Upload</button>
          </form>
        </div>
      </div>
    </div>
  )
}
