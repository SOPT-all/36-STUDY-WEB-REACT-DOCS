##Week2

# React 조건부 렌더링 요약

## ✅ 기본 조건부 렌더링 (`if`)

````jsx
function Item({ name, isPacked }) {
  if (isPacked) {
    return <li className="item">{name} ✅</li>;
  }
  return <li className="item">{name}</li>;
}

##조건에 따라 렌더링 생략
function Item({ name, isPacked }) {
  if (isPacked) {
    return null; // 아무것도 렌더링하지 않음
  }
  return <li className="item">{name}</li>;
}

##중복 최소화 - 삼항 연산자 (? :)
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {isPacked ? name + ' ✅' : name}
    </li>
  );
}

##PackingList 컴포넌트 예시
export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item isPacked={true} name="Space suit" />
        <Item isPacked={true} name="Helmet with a golden leaf" />
        <Item isPacked={false} name="Photo of Tam" />
      </ul>
    </section>
  );
}

# React 리스트 렌더링

## 배열을 기반으로 컴포넌트 렌더링하기

### ✅ 기본 예시
```jsx
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];

const listItems = people.map(person => <li>{person}</li>);

return <ul>{listItems}</ul>;
```

##filter()로 항목 조건부 필터링
const people = [
  { id: 0, name: 'Creola', profession: 'mathematician' },
  { id: 1, name: 'Mario', profession: 'chemist' },
  { id: 2, name: 'Mohammad', profession: 'physicist' },
  ...
];

##'chemist'인 사람만 필터링
const chemists = people.filter(person => person.profession === 'chemist');

##map으로 컴포넌트 렌더링
const listItems = chemists.map(person => (
  <li key={person.id}>
    <img src={getImageUrl(person)} alt={person.name} />
    <p>
      <b>{person.name}:</b> {person.profession}
    </p>
  </li>
));

return <ul>{listItems}</ul>;


##Key prop의 역할
리스트에서 각 항목을 고유하게 식별

변경 시 효율적인 리렌더링 지원

고유한 ID 또는 index 사용

map() → 배열 데이터를 JSX 리스트로 변환

filter() → 조건에 맞는 항목만 걸러냄

key prop → 필수, 중복 없이 고유해야 함

##React 컴포넌트와 순수성
React는 컴포넌트를 수학 함수처럼 취급함.
동일한 props가 주어지면, 항상 동일한 JSX를 반환해야 함.
외부 변수, 객체, props, state 등을 변형하지 않아야 함.

순수하지 않은 예시

let guest = 0;

function Cup() {
  guest += 1; // 외부 변수 변경 → ❌
  return <h2>Tea cup for guest #{guest}</h2>;
}
외부 변수 guest를 변경 → 컴포넌트 재렌더 시 예측 불가한 결과 발생

순수한 예시
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}
오직 props에 기반한 JSX 반환 → 순수 컴포넌트

지역 변형은 괜찮다.
function TeaGathering() {
  const cups = [];
  for (let i = 1; i <= 12; i++) {
    cups.push(<Cup key={i} guest={i} />);
  }
  return cups;
}

cups는 렌더링 중 생성된 지역 변수이므로 외부 상태 변화 X → 순수 유지됨

##사이드 이펙트
렌더링 중에는 절대 발생하지 않음.
이벤트 핸들러: 클릭, 입력 등 사용자 상호작용에 반응
useEffect: 렌더링 이후 특정 작업 수행

##순수 컴포넌트를 위한 핵심 규칙
렌더링 전에 존재했던 외부 객체, 변수 변경 금지

입력이 같으면 항상 같은 JSX 반환

다른 컴포넌트의 렌더링 순서에 의존하지 않기

props, state, context 변형 안됨

변화는 상태 업데이트 또는 이벤트 핸들러에서

useEffect는 최후의 수단으로 사용
````
