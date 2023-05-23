# HarActivity

Analyze .har files.

![Flow Map](/screenshots/admin/flowMap.png)

More screenshots can be found [here](screenshots/).

## About The Project

This project is part of the Computer Engineering and Informatics Department (CEID) of University of Patras Web Programming & Systems course. It features a website that filters and analyzes .har files. In more detail, a user can create an account and choose a .har file from their local machine. After that, the website filters the chosen file and presents the user with two options, download the new filtered file on their local machine and/or upload it to their profile. If the user chooses to upload the file on their profile, they have the ability to see the server locations of the requested websites on a heatmap (based on the uploaded files). Additionally, a user with admin privileges can have access to more information about all the .har files uploaded on the database (number of users, number of distinct ISPs, etc).

### Built With

The project was built with the MERN Stack.

- [MongoDB](https://www.mongodb.com)
- [Express](https://expressjs.com)
- [React](https://reactjs.org)
- [Node.js](https://nodejs.org/)

## Getting Started

To get a local copy up and running follow these steps.

### Prerequisites

- Node.js
- npm
- MongoDB

For more information on how to install Node.js and npm, visit [Node.js](https://nodejs.org/) website.

For more information on how to install MongoDB, visit [MongoDB](https://www.mongodb.com) website.

### Installation

1. Get a free Access Token at [mapbox](https://www.mapbox.com/).

2. Setup a local database. More information in [MongoDB](https://www.mongodb.com) website.

3. Clone the repo.
   ```sh
   git clone https://github.com/gthomas08/HarActivity.git
   ```
4. Change directory to server.

5. Install npm packages.
   ```sh
   npm install
   ```
6. Set the environmental variables in .env file.
   ```sh
   MONGODB_URI = '<MONGODB_URI>'
   PORT = <port_number>
   SECRET = '<secret_key_for_token>'
   ```
7. Start the server.

   ```sh
   npm run dev
   ```

8. Change directory to client.

9. Install npm packages.
   ```sh
   npm install
   ```
10. Set the environmental variables in .env file.
    ```sh
    REACT_APP_MAPBOX_ACCESS_TOKEN = '<mapbox_api_key>'
    REACT_APP_IP_ADDRESS = '<your_public_ip>'
    ```
11. Start react app.
    ```sh
    npm start
    ```

## Usage

In order to use the app, visit http://localhost:3000/.

Start by creating a user and then upload a .har file.
