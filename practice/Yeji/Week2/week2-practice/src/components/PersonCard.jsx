function PersonCard({ person, onToggle }) {
  return (
    <button
      onClick={() => onToggle(person.id)}
      style={{
        backgroundColor: "#4da6ff",
        color: "#fff",
        border: "none",
        padding: "12px 20px",
        cursor: "pointer",
        fontWeight: "bold",
        borderRadius: "6px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        transition: "background-color 0.2s ease, transform 0.2s ease",
      }}
      onMouseOver={(e) => (e.target.style.backgroundColor = "#339af0")}
      onMouseOut={(e) => (e.target.style.backgroundColor = "#4da6ff")}
    >
      {person.name}
    </button>
  );
}

export default PersonCard;
