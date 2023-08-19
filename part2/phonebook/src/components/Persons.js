const Persons = ({filteredPerson, handleDelete}) => {
    return (
        <>
            {filteredPerson.map(person => <p key={person.id}>{person.name} {person.number} <button onClick={() => {
                if(window.confirm(`Delete ${person.name}`)){
                    handleDelete(person.id)
                }           
            }}>Delete</button></p>)}
        </>
    )
}

export default Persons