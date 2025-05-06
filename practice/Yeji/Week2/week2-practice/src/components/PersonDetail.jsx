function PersonDetail({ person }) {
  return (
    <div>
      <p>
        <strong>이름:</strong> {person.name}
      </p>
      <p>
        <strong>분야:</strong> {person.field}
      </p>
      <p>
        <strong>업적:</strong> {person.achievement}
      </p>
      <img
        src={person.imageUrl}
        alt={person.name}
        width="100%"
        style={{
          marginTop: "12px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      />
    </div>
  );
}

export default PersonDetail;
