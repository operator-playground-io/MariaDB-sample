const mariadb = require("./mariadb");
const { validationResult } = require("express-validator");

const getContacts = async (req, res, next) => {
  let data;

  try {
    data = await mariadb.getContacts();
    console.log(data);

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "An internal error occured" });
  }
};

//Add a new contact
const addContact = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("errors: ", errors);
    return res.status(400).json({ errors: errors.array() });
  }

  //the fields are valid
  const { name, email } = req.body;

  //add the contact to database
  const contact = {
    name,
    email,
  };

  let data;

  try {
    data = await mariadb.getContactsByName(name);
    if (data.length > 0) {
      console.log("A contact with this name alredy exists");
      return res
        .status(400)
        .json({ msg: "A contact with this name alredy exists" });
    }

    data = await mariadb.getContactsByEmail(email);
    if (data.length > 0) {
      console.log("A contact with this email alredy exists");
      return res
        .status(400)
        .json({ msg: "A contact with this email alredy exists" });
    }

    data = await mariadb.addContact(contact);
    console.log(data);

    return res.status(200).json(data);
  } catch (error) {
    console.log("Add contact failed with error: ", error);
    return next(error);
    // return res.status(400).json({ msg: "An internal error occured" });
  }
};

//Update a contact
const updateContact = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("errors: ", errors);
    return res.status(400).json({ errors: errors.array() });
  }

  //the fields are valid
  const { name, email } = req.body;
  //the fields are valid
  const { id } = req.params;
  console.log("Update contact ", id, `: ${name} - ${email}`);

  const contact = {
    id,
    name,
    email,
  };

  let data;

  try {
    data = await mariadb.updateContact(contact);
    console.log(data);

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return next(error);
    // return res.status(400).json({ msg: "An internal error occured" });
  }
};

//Delete a contact
const deleteContact = async (req, res, next) => {
  //the fields are valid
  const { id } = req.params;

  try {
    await mariadb.deleteContact(id);

    return res.status(200).json({ msg: "The contact was deleted" });
  } catch (error) {
    console.log(error);
    return next(error);
    // return res.status(400).json({ msg: "An internal error occured" });
  }
};

module.exports = {
  getContacts,
  addContact,
  updateContact,
  deleteContact,
};
