과제를 잘못 이해한 관계로.. 이렇게 챌린지 도전하기 코드를 썼습니다다,,

- 정리한 노션 링크: https://bubble-coelurus-a6f.notion.site/1-1e36e23ac89c80868358c16a0a2f5e0a?pvs=4


### 1주차 챌린지 도전하기

#### 첫 번째 컴포넌트

##### 1. 컴포넌트 내보내기

- root 컴포넌트를 내보내지 않았기 때문에 이 샌드박스는 작동하지 않습니다.
=> ``export default``를 붙여줌

```
export default function Profile() {
  return (
    <img
      src="https://newsimg.sedaily.com/2024/05/06/2D9311DXOZ_1.jpg"
      alt="아이유"
    />
  );
}
```

##### 2. return문을 고치세요
- 괄호를 추가하고 세미콜론 위치를 바꿨다.

```
export default function Profile() {
  return (
    <img src="https://blog.kakaocdn.net/dn/SjrCh/btsJpIIayCv/PPj9shqxiktJ0jMtXdw8UK/img.jpg" alt="아이유" />
  );
}

```

##### 3. 실수를 찾아내세요
- 컴포넌트는 반드시 맨 앞글자가 대문자로 시작해야 한다!
```
function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

##### 4. 컴포넌트를 새로 작성해 보세요.
- 똑같이 갤러리 같은 걸 하려다가 새로 리스트 컴포넌트..를 만들어보았다
```
// 아래에 컴포넌트를 작성해 보세요!
function List(){
  return(
    <ul>
      <li>1. 컴포넌트 복습하기</li>
      <li>2. 컴포넌트 실습하기</li>
    </ul>
  );
}

export default function Todos(){
  return(
    <div>
      <h1>할 일 목록</h1>
      <List />
      <List />
    </div>
  )
}
```


#### 컴포넌트 import 및 export하기

##### 컴포넌트를 한 단계 더 분리하기
- import를 좀 더 세분화하여서 분리할 수 있다는 것을 깨달았다! 분리를 이렇게 하는 거구나~ ..
- App.js
```
import Gallery from './Gallery.js';

export default function App() {
  return (
    <div>
      <Gallery />
    </div>
  );
}

```
- Gallery.js
```
import {Profile} from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}

```

- Profile.js
```
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```



#### jsx로 마크업 작성하기

##### HTML을 JSX로 변환해보기
- <br>태그도 닫아줘야 한다니 익숙하지가 않아서 신기했다..
```
export default function Bio() {
  return (
    <>
      <div className="intro">
        <h1>Welcome to my website!</h1>
      </div>
      <p className="summary">
        You can find my thoughts here.
        <br></br><br></br>
        <b>And <i>pictures</i></b> of scientists!
      </p>
    </>
  );
}
```


#### 중괄호가 있는 jsx에서 자바스크립트 사용하기

##### 1. 실수 고치기
- .을 이용해서 객체에 접근해주게 변경했다
```
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

##### 2. 정보를 객체로 추출하기
- 객체에 이미지를 담고, TodoList()쪽 src도 중괄호를 이용해 주었다.
```
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  },
  url: 'https://i.imgur.com/7vQD0fPs.jpg'
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={person.url}
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

#### 3. JSX 중괄호 안에 표현식 작성하기
- 으어 이건 생각 못하고 답을 봤는데 중괄호 안이 표현식이라고 생각해야 하는구나...
```
const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={baseUrl + person.imageId + person.imageSize + '.jpg'}
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```


#### 컴포넌트에 props 전달하기

- 여기는 너무 어려워서 정답들을 보았습니다,,
