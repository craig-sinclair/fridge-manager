## Fridge Manager
Simple React Native app to manage the items stored within your fridge.

### Setup Project
- The project uses PostgreSQL as a database. Below is the command to *Create the table* which can be run from the SQL shell:
```
CREATE TABLE fridge (
   id SERIAL PRIMARY KEY,
   name VARCHAR(255) NOT NULL,
   quantity INT
);
```
- The database/pgSQL.js file is used to set up a server to allow for connection to the PostgreSQL server. This can be run from within a command line with:
```
node pgSQL.js
```

- Note that in app/index.js a variable 'ipAddress' is defined which should store your iPv4 address. This is to allow a mobile connection to your localhost which is running a server setup for database connection.
- Also, within database/pgSQL.js the client object defines your connection to a PostgreSQL database, the details of this (username/password etc) shall need to be changed.
