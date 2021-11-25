import React, { useState, useEffect } from 'react';
import axios from 'axios';

const useField = (type) => {
  const [value, setValue] = useState('');

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const reset = () => {
    setValue('');
  };

  return {
    type,
    value,
    onChange,
    reset,
  };
};

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([]);

  const getAll = async () => {
    const response = await axios.get(baseUrl);
    const resources = response.data;
    setResources(resources);
    return resources;
  };

  const create = async (resource) => {
    const response = await axios.post(baseUrl, resource);
    const newResource = response.data;
    setResources((prevResources) => [...prevResources, newResource]);
    return newResource;
  };

  const service = {
    getAll,
    create,
  };

  return [resources, service];
};

const App = () => {
  const content = useField('text');
  const name = useField('text');
  const number = useField('text');

  const [notes, noteService] = useResource('http://localhost:3005/notes');
  const [persons, personService] = useResource('http://localhost:3005/persons');

  const omit = (obj, [props]) => {
    const newObj = {};

    for (const prop in obj) {
      if (!props.includes(prop)) {
        newObj[prop] = obj[prop];
      }
    }

    return newObj;
  };

  const handleNoteSubmit = (event) => {
    event.preventDefault();
    noteService.create({ content: content.value });
    content.reset();
  };

  const handlePersonSubmit = async (event) => {
    event.preventDefault();
    personService.create({ name: name.value, number: number.value });
    name.reset();
    number.reset();
  };

  useEffect(() => {
    noteService.getAll();
    personService.getAll();
  }, []);

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...omit(content, ['reset'])} />
        <button>create</button>
      </form>
      {notes.map((n) => (
        <p key={n.id}>{n.content}</p>
      ))}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...omit(name, ['reset'])} /> <br />
        number <input {...omit(number, ['reset'])} />
        <button>create</button>
      </form>
      {persons.map((n) => (
        <p key={n.id}>
          {n.name} {n.number}
        </p>
      ))}
    </div>
  );
};

export default App;
