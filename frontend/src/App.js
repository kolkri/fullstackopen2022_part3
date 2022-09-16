import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import contactService from './services/contacts'

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }

  return (
    <div style={footerStyle}>
      <br />
      <em>Contact app, Kristiina Kolu, 2022</em>
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)


  useEffect(()=>{
    contactService
      .getAll()
      .then(data => {
        setPersons(data)
      })
  }, [])

  const addName = (event) => {
        event.preventDefault()
        const personObject = {
          name: newName,
          number: newNumber
        }
        if(persons.some(person => person.name === newName)){
          if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
            const personToFind = persons.find(p => p.name === newName)
            const personID = personToFind.id
            const changedContact = {...personToFind, number: newNumber}
            contactService
              .update(personID, changedContact)
              .then(data => {
                setPersons(persons.map(person => person.id !== personID ? person : data))
              })
              .catch(error => {
                setErrorMessage(
                  `Information of '${personToFind.name}' has already been removed from server`
                )
                setTimeout(() => {
                  setErrorMessage(null)
                }, 5000)
                setPersons(persons.filter(p => p.id !== personID))
              })
          }
        } else {
          contactService.create(personObject).then(data => {
            setErrorMessage(
              `Added ${newName}`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            setPersons(persons.concat(data))
            setNewName('')
            setNewNumber('')
          })
          
        }
      }
  
  const deleteName = (id) => {
      const personToFind = persons.find(p => p.id === id)
      if (window.confirm(`Delete ${personToFind.name}?`)) {
        contactService.deleteContact(id).then(data => {
          setPersons(persons.filter(p => p.id !== id))
        })
      }
  }

  const Notification = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className="error">
        {message}
      </div>
    )
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={errorMessage} />
      <Filter filter={filter} setFilter={setFilter}/>
      <h1>add a new</h1>
      <PersonForm 
        addName={addName} 
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        />
      <h1>Numbers</h1>
      <Persons persons={persons} filter={filter} deleteName={deleteName}/>
      <Footer />
    </div>
  )

}

export default App
