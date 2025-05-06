import './App.css'
import PersonCard from '../components/PersonCard'
import PersonDetail from '../components/PersonDetail'
import { people } from '../src/data'

function App() {

  return (
    <>
    <section className='section'>
      {people.map((person)=>
        <div className="entire-card" key={person.id}>
          <PersonCard name={person.name}></PersonCard>
          <PersonDetail
            name={person.name}
            field={person.field}
            achievement={person.achievement}
            image={person.imageUrl}
          ></PersonDetail>
        </div>
      )}
    </section>
    </>
  )
}

export default App
