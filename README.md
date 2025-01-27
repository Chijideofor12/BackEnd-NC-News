# Northcoders News API

Since `.env.*` files are included in `.gitignore`, they are not tracked by version control. To successfully run this project locally, you need to create the necessary environment variable files: 

1.  Create 2 .env files in the root directory of this project: 

- .env.test 
- .env.development

2. Add the following line to each file, replacing `<database_name>` with the appropriate database name:

For `.env.test`, set `PGDATABASE` to the name of the test database.
- For `.env.development`, set `PGDATABASE` to the name of the development database.

eg PGDATABASE=<database_name>

3. Save the files. These files will allow the application to connect to the correct databases locally.

> **Note**: Ensure the database names match those specified in your project configuration (e.g., in the `config` or `db` setup files).

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
