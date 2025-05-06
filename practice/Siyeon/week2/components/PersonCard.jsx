export default function PersonCard({ name }) {
    function handleClick(e) {
      const card = e.target.closest('.entire-card');
      const isShown = card.getAttribute('data-show') === 'true';
      card.setAttribute('data-show', !isShown);
  
      const detailDiv = card.querySelector('.detail');
      if (detailDiv) {
        detailDiv.style.display = isShown ? 'none' : 'block';
      }
    }
  
    return (
      <button className="names" onClick={handleClick}>
        {name}
      </button>
    );
  }
  