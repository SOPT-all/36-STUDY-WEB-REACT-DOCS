import './App.css';
import PersonCard from '../components/PersonCard';
import PersonDetail from '../components/PersonDetail';
import { people } from '../src/data';

function App() {
  return (
    <section className="section">
      {people.map((person) => (
        <div
          className="entire-card"
          key={person.id}
          data-show="false"
        >
          <PersonCard name={person.name} />
          <PersonDetail
            show={false} // 기본값 false
            name={person.name}
            field={person.field}
            achievement={person.achievement}
            image={person.imageUrl}
          />
        </div>
      ))}
    </section>
  );
}

export default App;
