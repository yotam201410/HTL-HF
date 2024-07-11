import { useState, useEffect } from 'react'
import { PersonForm } from './components/PersonForm'
import 'alertifyjs/build/css/alertify.css';
import { Filter } from './components/Filter';
import { Persons } from './components/Persons';
import axios from 'axios';
const App = () => {
  const [persons, setPersons] = useState([]);
  const [searchWord, setSearchWord] = useState('');
  useEffect(() => {
    const fetchPersons = async () => {
      const response = await axios.get("http://localhost:3001/persons")
      const data = response.data
      setPersons(data);
    }

    fetchPersons();

  }, [])
  const addPerson = (name, number) => {
    setPersons(persons.concat({ name, number, id: persons.length + 1 }))
    return persons.length + 1;
  };

  const removePerson = (id) => {
    setPersons(persons.filter((person) => person.id !== id))
  }
  const putPerson = async (person) => {
    await axios.put(`http://localhost:3001/persons/${person.id}`, person);
  }
  const updatePerson = (name, number) => {
    const index = persons.findIndex(person => person.name === name);
    persons[index].number = number;
    setPersons(persons);
    putPerson(persons[index]);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchWord={searchWord} setSearchWord={setSearchWord} />
      <PersonForm updateFunction={updatePerson} addPersonFunction={addPerson} compareFunction={(name) => { return persons.find((person) => person.name === name) }} />
      <h2>Numbers</h2>
      <Persons removeFunction={removePerson} persons={persons.filter((person) => person?.name.toLowerCase().includes(searchWord.toLowerCase()))} />
    </div >
  )
}

export default App;