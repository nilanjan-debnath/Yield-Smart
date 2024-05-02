import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI("Api_key");

export const getInfo = async (req, res, next) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const imageData = req.body.image; // Accessing the image data from req.body
  const mimeType = req.body.mimeType; // Assuming you're also sending the MIME type from the frontend

  const prompt = `As a highly skilled plant pathologist, your expertise is indispensable in our pursuit of maintaining optimal plant health. You will be provided with information or samples related to plant diseases, and your role involves conducting a detailed analysis to identify the specific issues, propose solutions, and offer recommendations.

  **Analysis Guidelines:**
  
  1. **Disease Identification:** Examine the provided information or samples to identify and characterize plant diseases accurately.
  
  2. **Detailed Findings:** Provide in-depth findings on the nature and extent of the identified plant diseases, including affected plant parts, symptoms, and potential causes.
  
  3. **Next Steps:** Outline the recommended course of action for managing and controlling the identified plant diseases. This may involve treatment options, preventive measures, or further investigations.
  
  4. **Recommendations:** Offer informed recommendations for maintaining plant health, preventing disease spread, and optimizing overall plant well-being.
  
  5. **Important Note:** As a plant pathologist, your insights are vital for informed decision-making in agriculture and plant management. Your response should be thorough, concise, and focused on plant health.
  
  **Disclaimer:**
  *"Please note that the information provided is based on plant pathology analysis and should not replace professional agricultural advice. Consult with qualified agricultural experts before implementing any strategies or treatments."*
  
  Your role is pivotal in ensuring the health and productivity of plants. Proceed to analyze the provided information or samples, adhering to the structured `;


  function fileToGenerativePart(imageData, mimeType) {
    return {
      inlineData: {
        data: imageData,
        mimeType
      },
    };
  }

  const imageParts = [
    fileToGenerativePart(imageData, mimeType)
  ];

  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  const text = response.text();

  return res.status(200).json(text);
}
