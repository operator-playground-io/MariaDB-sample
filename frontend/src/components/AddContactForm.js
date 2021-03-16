import React, { useState, useContext, useEffect } from "react";

import ContactsContext from '../context/contactsContext';

const AddContactForm = () => {
  const [contact, setContact] = useState({ name: "", email: "" });

  const { addContact, updateContact, current, clearCurrent } = useContext(ContactsContext);

  useEffect(() => {
    if (current) {
      setContact(current);
    } else {
      setContact({ name: "", email: "" });
    }
  }, [current]);

  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    console.log("Submit");

    e.preventDefault();

    if (current) {
      updateContact(contact);
      clearCurrent();
    } else {
      addContact(contact);
      setContact({ name: "", email: "" });
    }
    
  };

  const handleClear = (e) => {
    console.log("Clear");

    clearCurrent();
  };

  return (
    <div className="form-container">
      <h1>{ current ? 'Edit contact' : 'Add contact'}</h1>
      <form onSubmit={handleSubmit} onReset={handleClear}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={contact.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            name="email"
            value={contact.email}
            onChange={handleChange}
            required
          />
        </div>
        <input
          type="submit"
          className="btn btn-primary btn-block"
          value="Submit"
        />
        <input
          type="reset"
          className="btn btn-secondary btn-block"
          value="Clear"
        />
      </form>
    </div>
  );
};

export default AddContactForm;
