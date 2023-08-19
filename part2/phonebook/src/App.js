import { useState,useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import phonebookServices from './services/phonebook'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [deletedPerson,setDeletedPerson] = useState([])
  const [message, setMessage] = useState(null)

  useEffect(() => {
    phonebookServices
    .getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [deletedPerson])

  
  
  const handleAdd = (e) => {
    e.preventDefault()
    const newObject = {
      name:newName,
      number:newNumber,
    } 

    const personName = persons.map(p => p.name.toLowerCase())

    if(personName.includes(newName.toLowerCase())){
      const person = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())
      const id = person.id
    
      const personObject = {
        ...person,
        number: newNumber
       }
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        phonebookServices
        .update(id, personObject)
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id !== id ? p : returnedPerson))
          setMessage({
            text: `change ${returnedPerson.name} number `,
            status: 'success'
          })

          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          setMessage({
            text: `Information of ${person.name} has already removed from server`,
            status: 'error'
          })

          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
      }
    }else{
      phonebookServices
      .create(newObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setMessage({
          text: `Added ${returnedPerson.name}`,
          status: 'success'
        })

        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch(error => {
        setMessage({
          text: error.response.data.error,
          status: 'error'
        })

        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
    }
    
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (e) => {
    setNewName(e.target.value)
  }

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value)
  }

  const handleFilter = (e) => {
    setFilter(e.target.value)
  }

  const filteredPerson = filter.length ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase())) : persons

  const handleDelete = (id) => {
    const person = persons.find(p => p.id === id)

    phonebookServices
    .deletePerson(id)
    .then(returnedPerson => {
      setMessage({
        text: `success delete ${person.name}`,
        status: 'success'
      })

      setTimeout(() => {
        setMessage(null)
      }, 5000)
    })
    .catch(error => {
      setMessage({
        text: `Information of ${person.name} has already removed from server`,
        status: 'error'
      })

      setTimeout(() => {
        setMessage(null)
      }, 5000)
    })

    setDeletedPerson(deletedPerson.concat(id))
  }
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message}/>
      <Filter handleClick={handleFilter} />
      <h2>add a new</h2>
      <PersonForm 
        handleAdd={handleAdd} 
        handleNameChange={handleNameChange} 
        handleNumberChange={handleNumberChange} 
        nameValue={newName} numberValue={newNumber}
        person
        />

      <h2>Numbers</h2>
      <Persons filteredPerson={filteredPerson} handleDelete={handleDelete}/>
    </div>
  )
}

export default App