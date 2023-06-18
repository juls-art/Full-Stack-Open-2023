import { useState, useEffect } from 'react'
import personService from './services/persons'

const Persons = ({persons, filter, setPersons}) => {
  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase()))
  const removePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id))
          console.log('removed')
        })
        .catch((error) => {
          alert(`${name} was already deleted from server`)
        })
    }
  }
  return (
    <div>
      {filteredPersons.map(person =>
        <Person key={person.id} person={person} removePerson={removePerson} />
      )}
    </div>
  )
}

const Person = ({person, removePerson}) => {
  const handleRemoveClick = () => {
    removePerson(person.id, person.name)
  }
  return <p>{person.name} {person.number} {" "} 
  <button onClick={handleRemoveClick}>delete</button>
  </p>
}

const Filter = ({filter, handleFilterChange}) => {
  return (
    <div> 
      filter shown with{" "} <input
        value={filter}
        onChange={handleFilterChange}
      />  
    </div>
  )
}

const PersonForm = ({
  addName,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
}) => {
  return(
  <form onSubmit={addName}>
      <div>
        name: <input
         value={newName}
         onChange={handleNameChange}/>
      </div>
      <div>
        number: <input 
          value={newNumber}
          onChange={handleNumberChange}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Notification = ({ message }) => {
  if (message[0] === null) {
    return null
  }
  const messageStyle = message[1] ? 'message' : 'error'
  return (
    <div className={messageStyle}>
      {message}
    </div>
  )
}
 
const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState([null,true])

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)

    if (persons.find(person => person.name === newName)) {
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        const person = persons.find(person => person.name === newName)
        const changedPerson = {...person, number: newNumber}
        personService
          .update(person.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== returnedPerson.id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
            setMessage([`Updated ${returnedPerson.name}`,true])
            setTimeout(() => {
              setMessage([null,true])
            }, 5000)
          }).catch(error => {
            setMessage([`Information of ${person.name} has already been removed from server`,false])
          })
      }
    }else{
      const nameObject = {  
        name: newName,
        number: newNumber,
      }
      personService
        .create(nameObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setMessage([`Added ${returnedPerson.name}`,true])
          setTimeout(() => {
            setMessage([null,true])
          }, 5000)
        }).catch(error => {
          setMessage([error.response.data.error,false])
        })
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter filter={filter} handleFilterChange={handleFilterChange}/>

      <h2>add a new</h2>
      <PersonForm 
        addName={addName}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} setPersons={setPersons}/>
    </div>
  )
}
export default App