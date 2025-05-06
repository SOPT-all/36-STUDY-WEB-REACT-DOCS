import { useState } from "react";
import { people } from "./data";
import PersonCard from "./components/PersonCard";
import PersonDetail from "./components/PersonDetail";

function App() {
  const [selectedId, setSelectedId] = useState(null);

  const handleToggle = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const selectedPerson = people.find((p) => p.id === selectedId);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🔬 과학자.. 보기..</h1>

      <div style={styles.buttonGroup}>
        {people.map((person) => (
          <PersonCard
            key={person.id}
            person={person}
            onToggle={handleToggle}
            isSelected={selectedId === person.id}
          />
        ))}
      </div>

      {selectedId && (
        <div
          style={styles.detailWrapper}
          onClick={() => handleToggle(selectedId)}
        >
          <PersonDetail person={selectedPerson} />
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#242424",
    color: "#fff",
    minHeight: "100vh",
    padding: "40px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    marginBottom: "32px",
  },
  buttonGroup: {
    display: "flex",
    gap: "16px",
    marginBottom: "32px",
  },
  detailWrapper: {
    backgroundColor: "#f2f2f2",
    color: "#333",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    width: "300px",
    cursor: "pointer",
    transition: "transform 0.2s ease",
  },
};

export default App;
