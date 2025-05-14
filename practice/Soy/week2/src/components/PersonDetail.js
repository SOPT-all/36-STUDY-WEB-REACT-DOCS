import "./PersonDetailStyle.css";

export default function PersonDetail({ person }) {

    if(!person){
        <p>선택된 사람이 없습니다.</p>
    }

    return(
        <section className="DetailContainer">
            <ul>
                <li>이름: {person.name}</li>
                <li>분야: {person.field}</li>
                <li>업적: {person.achievement}</li>
                <img src={person.imageUrl} alt="프로필 이미지" />
            </ul>
        </section>
    )
}