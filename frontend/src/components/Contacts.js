import React, {useContext, useEffect} from 'react';
import ContactsContext from '../context/contactsContext';

import ContactItem from './ContactItem';

const Contacts = () => {
    const {contacts, getContacts} = useContext(ContactsContext);

    useEffect( () => {
      getContacts();
      // eslint-disable-next-line
    }, []);

    // const contacts =[
    //     {
    //       "id": 1,
    //       "name": "John Doe",
    //       "email": "jdoe@gmail.com"
    //     },
    //     {
    //       "id": 2,
    //       "name": "Philip Banks",
    //       "email": "philipb@yahoo.com"
    //     },
    //     {
    //       "name": "test2 test2",
    //       "email": "test2@b.com",
    //       "id": 4
    //     }
    //   ];

    return (
      <div>
        {contacts.map((contact) => (
          <ContactItem key={contact.id} contact={contact} />
        ))}
      </div>
    );
}

export default Contacts;
