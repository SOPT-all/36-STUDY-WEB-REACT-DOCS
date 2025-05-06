import { people } from "../data";
import "./PersonCardStyle.css";
import { useState } from "react";
import PersonDetail from "./PersonDetail";

export default function PersonCard() {
    const [selectedPerson, setSelectedPerson] = useState(null);

    const handleOpenDetail = (person) => {
        if(selectedPerson && selectedPerson.id === person.id) {
            setSelectedPerson(null); // 숨기기
        } else {
            setSelectedPerson(person);
        }
    };

    return(
        <section className="CardContainer">
            {people.map((person) => (
                <div key={person.id}>
                    <button onClick={() => handleOpenDetail(person)}>
                        {person.name}
                    </button>

                    {selectedPerson && person.id === selectedPerson.id && 
                        <PersonDetail person={selectedPerson}/>
                    }
                </div>
            ))}
        </section>
    )
}

