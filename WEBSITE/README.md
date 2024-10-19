# Yield Smart

## Overview

YieldSmart is a comprehensive agricultural solution encompassing both a web platform and an Android mobile application. This integrated system leverages IoT technology and artificial intelligence to empower farmers with tools for effective crop management and disease diagnosis. By combining the convenience of a mobile app with the analytical capabilities of a web platform, YieldSmart offers farmers a seamless and versatile solution to optimize their farming practices.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Usage](#usage)
- [Contributing](#contributing)

## Features

- **Real-Time Monitoring:** Monitor environmental conditions and crop health in real-time through IoT integration. Track parameters such as temperature, humidity, and soil moisture via both the web platform and the Progressive Web App (PWA). This enables timely interventions to mitigate risks and optimize crop growth.

- **PWA for Disease Diagnosis:** Use the PWA to capture and upload photos of plant leaves directly from smartphones or other devices. Advanced computer vision technology analyzes these images to identify symptoms of crop diseases. Integration with the Gemei API provides accurate disease diagnoses and recommendations for management strategies.

- **Quick Diagnosis:** A dedicated page for quick diagnosis allows users to capture an image of their crops directly through the PWA and receive immediate feedback on potential issues. This feature leverages fast image processing and machine learning algorithms to provide instant results.

- **Chat Section:** Engage in real-time conversations with an AI assistant through the chat section. Users can upload crop images and ask for suggestions or advice on how to manage specific issues. This feature uses AI to provide instant support and guidance to farmers.

- **Notification and Alerts:** Receive notifications and alerts on both the web platform and the PWA regarding important events such as disease outbreaks, adverse weather conditions, or critical changes in environmental parameters. These alerts help farmers take immediate action to protect their crops and optimize farm operations.


## Technologies Used

- **MERN Stack:** Leveraging MongoDB for database management, Express.js for server-side development, React.js for front-end UI, and Node.js for backend operations, NovaMart delivers a powerful and scalable solution.
  
- **Redux Toolkit:** Manage application state efficiently with Redux Toolkit, ensuring a smooth and consistent user experience across the platform.
  
- **Gemini-Api:** Utilizing Firebase for authentication, real-time database, and hosting, NovaMart offers a reliable and high-performance infrastructure.


## Usage
## Commands to start the website
- **Install npm packages for backend (open terminal in root directory).**

    `npm i`

- **Install npm packages for frontend**

    `cd client`<br>
    `npm i`

- **Add a .env file in the root directory and add them**

    `JWT_SECRET = ""`<br>
    `MONGO = ""`<br>
    `GEMINI_KEY = ""`

- **Now to run the website split the terminal one for root directory and one for client (cd client). Then run this command in both terminal**
    
    `npm run dev`

## Contributing

We welcome contributions from the community! Whether you're reporting a bug, submitting a feature request, or contributing code, your input is highly valued.

