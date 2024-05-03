# Yield Smart

## Overview

YieldSmart is a comprehensive agricultural solution encompassing both a web platform and an Android mobile application. This integrated system leverages IoT technology and artificial intelligence to empower farmers with tools for effective crop management and disease diagnosis. By combining the convenience of a mobile app with the analytical capabilities of a web platform, YieldSmart offers farmers a seamless and versatile solution to optimize their farming practices.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Usage](#usage)
- [Contributing](#contributing)

## Features

- **Real-Time Monitoring:** Through IoT integration, farmers can monitor environmental conditions and crop health in real-time using both the web platform and the mobile app. This includes tracking parameters such as temperature, humidity, soil moisture, and more, allowing for timely interventions to mitigate risks and optimize crop growth.
  
- **Mobile Imaging for Disease Diagnosis:** The Android mobile application enables farmers to capture and upload photos of plant leaves directly from their smartphones. Leveraging advanced computer vision technology, the app analyzes these images to identify symptoms of crop diseases. Integration with the Gemei API provides accurate disease diagnoses and recommendations for management strategies.

- **Notification and Alerts:** Both the web platform and the mobile app provide users with notifications and alerts regarding important events such as disease outbreaks, adverse weather conditions, or critical changes in environmental parameters. These notifications enable farmers to take immediate action to protect their crops and optimize farm operations.

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

