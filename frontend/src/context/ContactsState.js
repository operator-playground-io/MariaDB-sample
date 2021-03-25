import React, {useReducer} from 'react';
import axios from 'axios';

import {
  GET_CONTACTS,
  ADD_CONTACT,
  UPDATE_CONTACT,
  DELETE_CONTACT,
  SET_ERROR,
  CLEAR_ERROR,
  SET_LOADING,
  SET_CURRENT,
  CLEAR_CURRENT,
} from "./types";
import contactsReducer from './contactsReducer';
import ContactsContext from './contactsContext';

const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV: 'development';
console.log('NODE_ENV: ', NODE_ENV);

const {REACT_APP_SERVER_URL} = process.env;
// const {SERVER_URL} = window;
// console.log('REACT_APP_SERVER_URL: ', REACT_APP_SERVER_URL);

const BACKEND_URL = NODE_ENV === 'development' ? REACT_APP_SERVER_URL : window.SERVER_URL;
console.log('Backend URL: ', BACKEND_URL);

const ContactsState = (props) => {
  const INITIAL_STATE = {
    contacts: [],
    current: null,
    loading: false,
    error: null,
  };

  const [state, dispatch] = useReducer(contactsReducer, INITIAL_STATE);

  //fetch contacts
  const getContacts = async () => {
    console.log("Get contacts..");

    setLoading();

    try {
      const res = await axios.get(`${BACKEND_URL}`);
      const data = res.data;
      console.log(data);

      dispatch({ type: GET_CONTACTS, payload: data });
    } catch (error) {
      console.error(error.response);
      setError(error.response ? error.response.data.msg : error.message);
    }
  };

  //add contact
  const addContact = async (contact) => {
    console.log("Add contact ", contact);

    setLoading();

    try {
      const res = await axios.post(`${BACKEND_URL}`, contact, {
        headers: { "Content-Type": "application/json" },
      });
      const data = res.data;
      console.log(data);

      if ( data ) {
        contact.id = data;
        dispatch({ type: ADD_CONTACT, payload: contact });
      }
      // dispatch({ type: ADD_CONTACT, payload: data });
    } catch (error) {
      console.error(error.response);
      setError(error.response ? error.response.data.msg : error.message);
    }
  };

  //update contact
  const updateContact = async (contact) => {
    console.log("Update contact ", contact);

    setLoading();

    try {
      const res = await axios.put(`${BACKEND_URL}/${contact.id}`, contact, {
        headers: { "Content-Type": "application/json" },
      });
      const data = res.data;
      console.log(data);

      if ( data ) {
        dispatch({ type: UPDATE_CONTACT, payload: contact });
      }
    } catch (error) {
      console.error(error.response);
      setError(error.response ? error.response.data.msg : error.message);
    }
  };

  //delete contact
  const deleteContact = async (id) => {
    console.log("delete contact ", id);

    setLoading();

    try {
      const res = await axios.delete(`${BACKEND_URL}/${id}`);
      const data = res.data;
      console.log(data);

      dispatch({ type: DELETE_CONTACT, payload: id });
    } catch (error) {
      console.error(error.response);
      setError(error.response ? error.response.data.msg : error.message);
    }
  };

  //set error
  const setError = (message) => {
    dispatch({ type: SET_ERROR, payload: message });

    //clear the error after 5 seconds
    setTimeout( () => clearError(), 5000);
  };

  //clear error
  const clearError = () => {
    dispatch({ type: CLEAR_ERROR });
  }

  //set loading
  const setLoading = () => {
    dispatch({ type: SET_LOADING });
  };

  //set current
  const setCurrent = (contact) => {
    dispatch({ type: SET_CURRENT, payload: contact });
  };

  //clear current
  const clearCurrent = () => {
    dispatch({ type: CLEAR_CURRENT });
  };

  return (
    <ContactsContext.Provider
      value={{
        contacts: state.contacts,
        current: state.current,
        loading: state.loading,
        error: state.error,
        getContacts,
        addContact,
        updateContact,
        deleteContact,
        setCurrent,
        clearCurrent,
      }}
    >
      {props.children}
    </ContactsContext.Provider>
  );
};

export default ContactsState;