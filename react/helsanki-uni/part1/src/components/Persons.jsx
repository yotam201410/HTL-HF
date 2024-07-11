import { Person } from "./Person";
export const Persons = ({ persons, removeFunction }) => {
    return (
        <div>
            {persons.map((person) => <Person key={person.id} id={person.id} name={person.name} number={person.number} deletePersonList={removeFunction} />)}
        </div>
    );
}