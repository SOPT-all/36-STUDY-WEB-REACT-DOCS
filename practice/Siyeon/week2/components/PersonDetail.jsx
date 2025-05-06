
export default function PersonDetail({name, field, achievement, image}){
    return(
        <div className="detail">
            <p><b>이름:</b> {name}</p>
            <p><b>분야:</b> {field}</p>
            <p><b>업적:</b> {achievement}</p>
            <img src={image} alt={name} className="image"/>
        </div>
    );
}