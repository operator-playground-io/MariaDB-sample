const mariadb = require("mariadb");

//read config
require('dotenv').config();
console.log('Environment: ', process.env.NODE_ENV);

console.log(
  "Database server host: ",
  process.env.DB_HOST,
  ", port: ",
  process.env.DB_PORT,
  ", database: ",
  process.env.DB_DATABASE,
  ", user: ",
  process.env.DB_USER
);

const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_DATABASE = process.env.DB_DATABASE || 'testdb';
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
console.log("Database host: ", DB_HOST);
console.log("Database port: ", DB_PORT);
console.log("Database database: ", DB_DATABASE);
console.log("Database user: ", DB_USER);

let dbConfig = {
  user: DB_USER,
  password: DB_PASSWORD,
};
if (DB_HOST) {
  dbConfig.host = DB_HOST;
}
if (DB_PORT) {
  dbConfig.port = DB_PORT;
}
if (DB_DATABASE) {
  dbConfig.database = DB_DATABASE;
}
console.log("Database config: ", dbConfig);

const pool = mariadb.createPool(dbConfig);

const createDatabase = async (database) => {
  console.log('Create database ', database);

  //create a new pool
  const newDbConfig = {...dbConfig};
  if ( newDbConfig.database ) {
   delete newDbConfig.database;
  }

  console.log('Create database connection using config ', newDbConfig);
  const conn = await mariadb.createConnection(newDbConfig);

  const query = `CREATE DATABASE IF NOT EXISTS ${database}`;
  console.log('Create database query: ', query);

  let result;

  try {
    const response = await conn.query(query);
    console.log("Result: ", response);
    result = response;
  } catch (err) {
    console.log("Database error: ", err.message);
    throw err;
  } finally {
    await conn.end();
  }

  return result;
}

const createContacts = async () => {
  console.log('Create table CONTACTS');

  const query = "CREATE TABLE IF NOT EXISTS CONTACTS ( \
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, \
    name VARCHAR(100) NOT NULL, \
    email VARCHAR(100) NOT NULL)";

  let result;

  try {
    const response = await pool.query(query);
    console.log("Result: ", response);
    result = response;
  } catch (err) {
    console.log("Database error: ", err.message);
    throw err;
  } 

  return result;
}

const getContacts = async () => {
  console.log("Get contacts...");

  const query = "SELECT * FROM CONTACTS";

  let result;

  try {
    const response = await pool.query(query);
    console.log("Results: ", response, ', count:', response.length);
    result = [...response];

    //remove meta field
    // delete result.meta;
  } catch (err) {
    console.log("Database error: ", err.message);
    throw err;
  } 

  console.log("Contacts: ", result);

  return result;
};

const addContact = async (contact) => {
  console.log("Add contact ", contact);

  const  query= "INSERT INTO CONTACTS (NAME, EMAIL) VALUES (?, ?) RETURNING *";
  const  values= [contact.name, contact.email];

  let result;

  try {
    const response = await pool.query(query, values);
    console.log("Result: ", response);

    if ( response.length > 0 ) {
      result = response[0];
    }
  } catch (err) {
    console.log("Database error: ", err.message);
    throw err;
  } 

  console.log("Row added: ", result);

  return result;
};

const updateContact = async (contact) => {
  console.log("Update contact ", contact);

  const  query= "UPDATE CONTACTS SET NAME = ?, EMAIL=? WHERE ID=?";
  const  values= [contact.name, contact.email, contact.id];

  let rowCount, result;

  try {
    const response = await pool.query(query, values);
    console.log("Result: ", response);
    rowCount = response.affectedRows;
  } catch (err) {
    console.log("Database error: ", err.message);
    throw err;
  }

  result = rowCount ? true : false;
  console.log("Row(s) updated: ", result);

  return result;
};

const deleteContact = async (id) => {
  console.log("Delete contact ", id);

  const query = "DELETE FROM CONTACTS WHERE ID=?";
  const values= [id];

  let rowCount, result;

  try {
    const response = await pool.query(query, values);
    console.log("Result: ", response);
    rowCount = response.affectedRows;
  } catch (err) {
    console.log("Database error: ", err.message);
    throw err;
  }

  result = rowCount ? true : false;
  console.log("Row(s) deleted: ", result);

  return result;
};

const getContactsByName = async (name) => {
  console.log("Get contacts with name ", name);

  const query = "SELECT * FROM CONTACTS WHERE NAME = ?";
  const values= [name];

  let result;

  try {
    const response = await pool.query(query, values);
    result = [...response];
  } catch (err) {
    console.log("Database error: ", err.message);
    throw err;
  }

  console.log("Contacts with name ", name, result);

  return result;
};

const getContactsByEmail = async (email) => {
  console.log("Get contacts with email ", email);

  const query = "SELECT * FROM CONTACTS WHERE EMAIL = ?";
  const values= [email];

  let result;

  try {
    const response = await pool.query(query, values);
    result = [...response];
  } catch (err) {
    console.log("Database error: ", err.message);
    throw err;
  }

  console.log("Contacts with email ", email, result);

  return result;
};

const getContactsCount = async () => {
  const query = "SELECT COUNT(*) as COUNT FROM CONTACTS";

  let result=0;

  try {
    const response = await pool.query(query);
    console.log('Results: ', response);
    result = [...response];

    //REMOVE META FIELD
    // delete result.meta;

    if ( result.length > 0) {
      result = result[0].COUNT;
    }
  } catch (err) {
    console.log("Database error: ", err.message);
    throw err;
  }

  console.log("Count: ", result);

  return result;
};

const initDatabase = async () => {
  await createDatabase(DB_DATABASE);
  await createContacts();
}

module.exports = {
  getContacts,
  addContact,
  updateContact,
  deleteContact,
  getContactsByName,
  getContactsByEmail
};

initDatabase();

// createContacts();
// getContacts();
// getContactsCount();
// addContact({name: 'Tom Jones', email: 'tomj@hotmail.com'});
// updateContact({id: 1, name:'AndiC', email: 'andicirjaliu@hotmail.com'});
// deleteContact(2);