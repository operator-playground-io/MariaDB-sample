import React, {useContext} from 'react';

import ContactsContext from '../context/contactsContext';

const Message = () => {
    const {error} = useContext(ContactsContext);

    return (
      error && (
        <div className={`alert alert-danger`}>
          <i className="fas fa-info-cicle"></i> {error}
        </div>
      )
    );
}

export default Message;
