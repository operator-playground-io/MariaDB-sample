const express = require("express");
const {check} = require('express-validator');
const controller = require("./appController");

const router = express.Router();

//Get all the contacts
router.get("/", controller.getContacts);

//Add a new contact
router.post(
  "/",
  [
    check("name", "Name is required").notEmpty(),
    check("email", "Email does not have a valid format").isEmail(),
  ],
  controller.addContact
);

//Update a contact
router.put(
  "/:id",
  [
    check("name", "Name is required").notEmpty(),
    check("email", "Email does not have a valid format").isEmail(),
  ],
  controller.updateContact
);

//Delete a contact
router.delete("/:id", controller.deleteContact);

module.exports = router;
