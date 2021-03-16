import React,{useContext} from 'react';
import PropTypes from 'prop-types';

import ContactsContext from '../context/contactsContext';

const ContactItem = ({contact}) => {
    const {id, name, email} = contact;

    const {setCurrent, deleteContact} = useContext(ContactsContext);

    const onEdit = e => {
        setCurrent(contact);
    }
    
    const onDelete = e => {
        deleteContact(id);
    }

    return (
      <div className="card bg-light">
        <h3 className="text-primary text-left">{name}</h3>
        <ul className="list">
          <li>{email}</li>
        </ul>
        <p>
          <button className="btn btn-dark btn-sm" onClick={onEdit}>
            Edit
          </button>
          <button className="btn btn-danger btn-sm" onClick={onDelete}>
            Delete
          </button>
        </p>
      </div>
    );
}

ContactItem.propTypes = {
    contact: PropTypes.object.isRequired
}

export default ContactItem;
