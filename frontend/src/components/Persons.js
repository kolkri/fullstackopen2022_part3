const Persons = ({persons, filter, deleteName}) => {
    return (
        <>
        {persons.filter(item => {
            if(filter === ''){
              return item
          } else if (item.name.toLowerCase().includes(filter.toLowerCase())) {
              return item
          }
          }).map((person) => {
              return(
                <div key={person.name}>
                    {person.name} {person.number}
                    <button onClick={() => deleteName(person.id)}>delete</button>
                </div>
                )}
            )}
         
        </>
    )
  }
  
  export default Persons