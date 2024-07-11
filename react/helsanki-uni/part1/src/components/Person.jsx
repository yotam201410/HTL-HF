import axios from 'axios'
export const Person = ({ id, name, number, deletePersonList }) => {
    const deletePersonBackend = async () => {
        await axios.delete(`http://localhost:3001/persons/${id}`);
    }
    const deletePerson = () => {
        if (window.confirm("delete " + name + "?")) {
            deletePersonBackend();
            deletePersonList(id);
        }
    }
    return (
        <div>
            <p key={id}>{name} {number}</p> <button onClick={deletePerson}>delete</button>
        </div>
    );
}