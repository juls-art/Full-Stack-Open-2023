import { useState, useEffect } from 'react'
import axios from 'axios'

const Persons = ({persons, filter}) => {
  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase()))
  return (
    <div>
      {filteredPersons.map(person =>
        <Person key={person.id} person={person} />
      )}
    </div>
  )
}
const Person = ({person}) => {
  return <p>{person.name} {person.number}</p>
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
 
const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const hook = () => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }
  
  useEffect(hook, [])

  const addName = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    const nameObject = {  
      name: newName,
      number: newNumber,
      id: persons.length + 1,
    }
    if (persons.find(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    setPersons(persons.concat(nameObject))
    setNewName('')
    setNewNumber('')
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
      <Persons persons={persons} filter={filter}/>
    </div>
  )
}

export default App