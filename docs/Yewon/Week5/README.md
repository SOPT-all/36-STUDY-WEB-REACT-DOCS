# week5
## State 구조 선택하기
State에서 불필요하고 중복된 데이터를 제거하면 모든 데이터 조각이 동기화 상태를 유지하는 데 도움이 된다.

##### State 구조화 원칙
1. 연관된 state 그룹화하기
두 개 이상의 state 변수를 항상 동시에 업데이트한다면, 단일 state 변수로 병합하는 것을 고려하라.
다음과 같이 단일 state 변수와 다중 state 변수 사이에서 무엇을 사용할지 불확실한 경우가 있다.

단일 state 변수 2개
``
const [x, setX] = useState(0);
const [y, setY] = useState(0);
``
다중 state 변수 1개
``
const [position, setPosition] = useState({ x: 0, y: 0 });
``
두 가지 접근 방식 모두 기술적으로 사용할 수 있지만,

두 개의 state 변수가 항상 함께 변경된다면, 단일 state 변수로 통합하는 것이 좋다.

예 : 마우스 커서 움직일 때 항상 커서의 x, y 좌표 둘 다 업데이트한다.

2. state 의 모순 피하기
여러 state 조각이 서로 모순되고 "불일치"할 수 있는 방식으로 state를 구성하는 것은 실수가 발생할 여지를 만든다. 이를 피하라!
다음과 같이 isSending 과 isSent state 변수가 있는 호텔 피드백 양식이 있다.
```
import { useState } from 'react';

const FeedbackForm = () => {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    await sendMessage(text);
    setIsSending(false);
    setIsSent(true);
  }

  if (isSent) {
    return <h1>Thanks for feedback!</h1>
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>How was your stay at The Prancing Pony?</p>
      <textarea
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button
        disabled={isSending}
        type="submit"
      >
        Send
      </button>
      {isSending && <p>Sending...</p>}
    </form>
  );
}

const sendMessage = (text) => {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
}
```

이 코드는 "불가능한" state를 허용한다.

예를 들어 setIsSent 와 setIsSending 을 함께 호출하는 것을 잊어버린 경우,

isSending 과 isSent 가 동시에 true일 수 있다.

이처럼 컴포넌트가 복잡할수록 무슨 일이 일어났는지 이해하기 어렵다.

isSending과 isSent처럼 동시에 true가 되어선 안되는 state 변수들의 경우, 이 두 변수를 'typing'(초기값), 'sending', 'sent' 세 가지 유효한 상태 중 하나를 가질 수 있는 status state 변수로 대체하는 것이 좋다.


가독성을 위해 몇 가지 상수를 선언할 수도 있다.
```
const isSending = status === 'sending';
const isSent = status === 'sent';
```
3. 불필요한 state 피하기
렌더링 중에 컴포넌트의 props나 기존 state 변수에서 일부 정보를 계산할 수 있다면, 컴포넌트의 state에 해당 정보를 넣지 않아야 한다.
렌더링 중에 컴포넌트의 props나 기존 state 변수에서 일부 정보를 계산할 수 있다면,

컴포넌트의 state에 해당 정보를 넣지 않아야 한다.


예를 들어, 아래의 Form 컴포넌트에서 렌더링 중에 항상 firstName과 lastName을 통해 fullName을 계산할 수 있기 때문에 fullName는 불필요한 state이다.
```
const Form = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');
  
  ...
  
  return ( ... )
}
```
아래와 같이 수정해줄 수 있다.
```
const Form = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;
  
  ...
  
  return ( ... )
}
```

4. State의 중복 피하기
여러 상태 변수 간 또는 중첩된 객체 내에서 동일한 데이터가 중복될 경우 동기화를 유지하기 어렵다. 가능하면 중복을 줄여라!
```
import { useState } from 'react';

const initialItems = [
  { title: 'pretzels', id: 0 },
  { title: 'crispy seaweed', id: 1 },
  { title: 'granola bar', id: 2 },
];

export const Menu = () => {
  const [items, setItems] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState(
    items[0]
  );
  
  const handleItemChange = (id, e) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: e.target.value,
        }
      } else {
        return item;
      }
    }))
  }
  
  return (
  	<>
      <h2>What's yoyur travel snack?</h2>
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={e => handleItemChange(item.id, e)}
            />
          </li>
          {' '}
          <button
            onClick={() => setSelectedId(item)}
            >Choose</button>
        ))}
      </ul>
      <p>You picked {selectedItem.title}.</p>
    </>
  )
}
```
위 코드에서 선택된 항목을 selectedItem state 변수에 객체로 저장한다.

그러나 이는 selectedItem의 내용이 items 리스트 내 항목 중 하나와 동일한 객체이므로,

항목 정보가 두 곳에서 중복되는 좋지 않은 방식이다.

중복된 state
```
items = [{ id; 0, title: 'pretzels' }, ...]
selectedItem = { id: 0, title: 'pretzels' }
```
따라서 다음과 같이 중복을 제거하는 것이 좋다.
```
import { useState } from 'react';

const initialItems = [
  { title: 'pretzels', id: 0 },
  { title: 'crispy seaweed', id: 1 },
  { title: 'granola bar', id: 2 },
];

export const Menu = () => {
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState(0);
  
  const selectedItem = items.find(item => item.id === selectedId);
  
  const handleItemChange = (id, e) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: e.target.value,
        }
      } else {
        return item;
      }
    }))
  }
  
  return (
  	<>
      <h2>What's yoyur travel snack?</h2>
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={e => handleItemChange(item.id, e)}
            />
          </li>
          {' '}
          <button
            onClick={() => setSelectedId(item.id)}
            >Choose</button>
        ))}
      </ul>
      <p>You picked {selectedItem.title}.</p>
    </>
  )
}
```
변경 후 중복이 사라지고 필수적인 state 만 남는다.
```
items = [{ id: 0, title: 'pretzels' }, ...]
selectedId = 0
```
5. 깊게 중첩된 state 피하기
깊게 계층화된 state는 업데이트하기 쉽지 않다. 가능하면 state를 평탄한 방식으로 구성하는 것이 좋다.
```
const initialTravelPlan = {
  id: 0,
  title: '(Root)',
  childPlaces: [{
    id: 1,
    title: 'Earth',
    childPlaces: [{
      id: 2,
      title: 'Africa',
      childPlaces: [{
        id: 3,
        title: 'Botswana',
        childPlaces: []
      }, {
        id: 4,
        title: 'Egypt',
        childPlaces: []
      }
    }],
  },
  {
    id: 5,
    title: 'Americas',
    childPlaces: [{
      id: 6,
      title: 'Argentina',
      childPlaces: []
    }, {
      id: 7,
      title: 'Brazil',
      childPlaces: []
    }]
  }]
}
```
중첩된 state를 업데이트하는 것은 변경된 부분부터 모든 객체의 복사본을 만드는 것을 의미한다.

깊게 중첩된 장소를 삭제하는 것은 전체 부모 체인을 복사하는 것을 의미하는데, 이런 코드는 매우 장황할 수 있다.

state 가 업데이트하기에 너무 중첩되어 있다면, "평탄"하게 만드는 것을 고려하라!

예를 들어, 각 place가 자식 장소의 배열을 가지는 트리 구조 대신각 장소가 자식 장소 ID의 배열을 가지는 구조로 수정할 수 있다.
```
const initialTravelPlan = {
  0: {
    id: 0,
    title: '(Root)',
    childIds: 
  }
}
```