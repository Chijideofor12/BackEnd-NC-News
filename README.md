# Northcoders News API

Project Overview

Northcoders News API is a RESTful API designed to provide programmatic access to application data, mimicking a real-world backend service like Reddit. The API serves data from a PostgreSQL database and is built using Node.js and Express.js, with database interactions managed via node-postgres.

This project is intended for developers who want to retrieve and interact with structured news-related data via API endpoints.

Hosted API
The API is live and accessible at:
🔗 Northcoders News API

You can visit this link to view all available endpoints and responses.


Getting Started
1. Cloning the Repository
To set up the project locally, first clone the repository:

git clone https://github.com/Chijideofor12/BackEnd-NC-News
cd <your-repo-name>


2. Install Dependencies
Run the following command to install the required Node.js packages:

npm install

 3. Set Up Environment Variables

Since .env.* files are ignored by version control (.gitignore), you need to create them manually to run the project locally.

Create two .env files in the root directory:

.env.development
.env.test
Add the following lines to the respective files, replacing <database_name> with the actual database names:

PGDATABASE=<database_name>

Example:

For development:

PGDATABASE=<database_name>

For Testing:

PGDATABASE=<database_name_test>

Save the files. These environment variables will allow the application to connect to the correct databases.

Note: Ensure the database names match those defined in your config or db setup files.

4. Set Up the Database
Run the following command to create and seed the database:

npm run setup-dbs
npm run seed

5. Running Tests
To ensure everything is working correctly, run the test suite:

npm test

Running the Server Locally

Start the local development server with:

npm start

The server should now be running on http://localhost:9090/api.


Minimum Requirements
To run this project, you need:

Node.js: v18+
PostgreSQL: v14+
Ensure you have these installed before proceeding.

