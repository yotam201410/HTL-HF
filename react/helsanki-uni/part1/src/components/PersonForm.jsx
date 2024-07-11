import alertify from 'alertifyjs';
import { useState } from 'react'
import axios from 'axios';
const postPhone = async (name, number, id) => { await axios.post("http://localhost:3001/persons", { id, name, number }) }

export const PersonForm = ({ addPersonFunction, compareFunction,updateFunction }) => {
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const addName = (event) => {
        event.preventDefault();
        if (!compareFunction(newName)) {
            const id = addPersonFunction(newName, newNumber);
            postPhone(newName, newNumber, id);
            setNewName('');
            setNewNumber('');
            alertify.success('added to phone book');
        }
        else {
            if (window.confirm(`${newName} is already added to the phonebook, replace the old number with the new one?`)) {
                console.log(updateFunction);
                updateFunction(newName,newNumber);
            }
        }
    }
    return (
        <form onSubmit={addName}>
            <div>
                name: <input placeholder="enter name" value={newName} onChange={(event) => setNewName(event.target.value)} required />
                number: <input placeholder="enter number" value={newNumber} onChange={(event) => setNewNumber(event.target.value)} required />

            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>)
}