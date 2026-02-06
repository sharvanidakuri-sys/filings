Filings is a modern web application built with React, TypeScript, Vite, and Tailwind CSS for analyzing and visualizing financial filing data through clean dashboards, interactive tables, and charts. The project follows a component-based architecture, offers fast performance, and a responsive UI. It can be deployed on platforms like Vercel or Netlify and can also be wrapped into a mobile application (APK) using tools like Median or PWA builders. The repository includes proper configuration, ignores node_modules, and is ready for production use.

Installation and Setup
Prerequisites

Make sure the following are installed on your system:

Node.js (version 18 or higher recommended)

npm (comes with Node.js)

Git

Clone the Repository
git clone https://github.com/sharvanidakuri-sys/filings.git
cd filings

Install Dependencies
npm install

Run the Application (Development Mode)
npm run dev


Open your browser and go to:

http://localhost:5173

Build for Production
npm run build


The production-ready files will be generated in the dist folder.

Preview Production Build
npm run preview

Deployment
Deploy on Vercel

Go to https://vercel.com

Import the GitHub repository sharvanidakuri-sys/filings

Select the main branch

Click Deploy

Deploy on Netlify

Go to https://www.netlify.com

Import the GitHub repository

Build command:

npm run build


Publish directory:

dist

Mobile App (APK) Setup Using Median

Create a Median App

Add the deployed website URL (Vercel/Netlify)

Rebuild the app

Download the generated APK or AAB file
