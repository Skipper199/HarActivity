<!-- PROJECT LOGO -->
<br />
<p align="center">

  <h3 align="center">HarActivity</h3>

  <p align="center">
    A site to analyze  HAR files!
    <br />
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

This project is part of the Computer Engineering and Informatics Department (CEID) of University of Patras Web Programming & Systems course. It features a website that filters and analyzes .har files. In more detail, a user can create an account and choose a .har file from their local machine. After that, the website filters the chosen file and presents the user with two options, download the new filtered file on their local machine or/and upload it to their profile. If the user chooses to upload the file on their profile, then the user has the ability to see the server locations of the requested websites on a heatmap (based on the uploaded files). Additionally, a user with admin privileges can have access to more information about all the .har files uploaded on the database (number of users, number of distinct ISPs etc).

### Built With

The project was built with the MERN Stack.

- [MongoDB](https://www.mongodb.com)
- [Express](https://expressjs.com)
- [React](https://reactjs.org)
- [Node.js](https://nodejs.org/)

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these steps.

### Prerequisites

- Node.js
- npm

For more information on how to install Node.js and npm, visit [Node.js](https://nodejs.org/) website.

### Installation

1. Get a free Access Token at [mapbox](https://www.mapbox.com/)

2. Clone the repo
   ```sh
   git clone https://github.com/GTS08/Web-Project.git
   ```
3. Change directory to server

4. Install npm packages
   ```sh
   npm install
   ```
5. Set the environmental variables in .env file
   ```sh
   MONGODB_URI = '<MONGODB_URI>'
   PORT = <port_number>
   SECRET = '<secret_key_for_token>'
   ```
6. Open the server

   ```sh
   npm run dev
   ```

7. Change directory to client

8. Install npm packages
   ```sh
   npm install
   ```
9. Set the environmental variables in .env file
   ```sh
   REACT_APP_MAPBOX_ACCESS_TOKEN = '<mapbox_api_key>'
   REACT_APP_IP_ADDRESS = '<your_public_ip>'
   ```
10. Open the react app
    ```sh
    npm start
    ```

<!-- USAGE EXAMPLES -->

## Usage

In order to use the site, visit http://localhost:3000/. You can either login or signup.
