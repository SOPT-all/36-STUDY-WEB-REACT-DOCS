# State 업데이트 큐

state 변수를 설정하면 다음 렌더링이 큐에 들어간다.

그러나 다음 렌더링을 큐에 넣기 전에, 값에 대해 여러 작업을 수행할 수 있다.

```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}

```

1. 각 렌더링의 state 값은 고정되어 있으므로 렌더링 이벤트 핸들러의 number 값은 몇 번을 호출하든 항상 0
2. React는 state 업데이트를 하기 전에 이벤트 핸들러의 모든 코드가 실행될 때까지 기다린다. → 렌더링은 모든 `setNumber()` 호출이 완료된 이후에만 일어남 

### batching

- 너무 많은 리렌더링이 발생하지 않고도 여러 컴포넌트에서 나온 다수의 state 변수를 업데이트할 수 있다.

= 이벤트 핸들러와 그 안에 있는 코드가 완료될 때까지 UI가 업데이트 되지 않는다.

- 안전한 경우에만 수행
    - 클릭과 같은 의도적인 이벤트에 대해서는 수행하지 않음

👍 **장점**

- React 앱의 빠른 실행 가능
- 일부 변수만 업데이트된(반쯤 완성된) 혼란스러운 렌더링 처리 X

## **다음 렌더링 전에 동일한 state 변수를 여러 번 업데이트하기**

> **업데이터 함수(updater function)**
`setNumber(n => n + 1)` 와 같이 이전 큐의 state를 기반으로 다음 state를 계산하는 함수를 전달
> 

→ state 값을 대체하는 것이 아니라 React에게 “state 값으로 무언가를 하라”고 지시

1. React는 이벤트 핸들러의 다른 코드가 모두 실행된 후에 이 함수가 처리되도록 큐에 넣음
2. 다음 렌더링 중에 React는 큐를 순회하여 최종 업데이트된 state를 제공

```jsx
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
  setNumber(42);
}}>
```

| queued update | `n` | returns |
| --- | --- | --- |
| ”replace with `5`” | `0` (unused) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |
| ”replace with `42`” | `6` (unused) | `42` |
- 이벤트 핸들러가 완료되면 리렌더 실행, 그동안 큐 처리
- 업데이터 함수는 렌더링 중에 실행되므로, **순수해야 하며** 결과만 반환해야 함

## **명명 규칙**

- 업데이터 함수 인수의 이름은 해당 state 변수의 첫 글자로 지정하는 것이 일반적
- 자세한 코드를 선호하면 전체 state 변수 이름 반복 or 같은 접두사 사용

# 객체 State 업데이트 하기

State는 객체를 포함한 모든 종류의 자바스크립트 값을 가질 수 있지만, state가 가진 객체를 직접 변경하면 안됨

→ 객체를 업데이트 하고 싶다면, 새로운 객체를 생성해 state가 복사본을 사용하도록 해야 함.

> 변경(mutation): 기술적으로 객체 자체의 내용을 바꾸는 것
> 

```jsx
const [position, setPosition] = useState({ x: 0, y: 0 });
```

- 하지만 객체를 불변성을 가진 것처럼 대하고, 변경하는 대신 교체해야 함.

## **State를 읽기 전용인 것처럼 다루세요**

```jsx
onPointerMove={e => {
  position.x = e.clientX;
  position.y = e.clientY;
}}
```

position에 할당된 객체를 이전 렌더링에서 수정하고 있지만, React는 state 설정 함수가 없으면 객체가 변경되었는지 알 수 없다. 즉, 아무것도 하지 않음

→ 리렌더링을 발생시키려면? 새 객체를 생성해 state 함수로 전달하기

```jsx
onPointerMove={e => {
  setPosition({
    x: e.clientX,
    y: e.clientY
  });
}}
```

## **전개 문법으로 객체 복사하기**

- 새로 생성하는 객체에 *존재하는* 데이터를 포함하고 싶을 때 사용
    
    ex) 한 개의 필드만 수정하고, 나머지 필드는 이전 값을 유지하고 싶을 때
    

```jsx
setPerson({
  ...person, // 이전 필드를 복사
  firstName: e.target.value // 새로운 부분은 덮어쓰기
});
```

⚠️ 한 레벨 깊이의 내용만 복사

## **중첩된 객체 갱신하기**

```jsx
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
});
```

다음과 같은 중첩 객체 구조에서 `city`를 바꾸기 위해서는 먼저 (이전 객체의 데이터로 생성된) 새로운 `artwork` 객체를 생성한 뒤, 그것을 가리키는 새로운 `person` 객체를 만들어야 함.

```jsx
const nextArtwork = { ...person.artwork, city: 'New Delhi' };
const nextPerson = { ...person, artwork: nextArtwork };
setPerson(nextPerson);

// 또는 단순 함수 호출
setPerson({
  ...person, // 다른 필드 복사
  artwork: { // artwork 교체
    ...person.artwork, // 동일한 값 사용
    city: 'New Delhi' // 하지만 New Delhi!
  }
});
```

## **Immer로 간결한 갱신 로직 작성하기**

> Immer: 편리하고, 변경 구문을 사용할 수 있게 해주며 복사본 생성을 도와주는라이브러리
> 
- 이전 state를 덮어쓰지 않음
- state 중첩이 깊을 때 → 반복적인 복사 코드를 줄일 수 있음
- state 구조를 바꾸고 싶지 않을 때

**사용방법**

1. `package.json`에 `dependencies`로 `use-immer`를 추가
2. `npm install`을 실행
3. `import { useState } from 'react'`를 `import { useImmer } from 'use-immer'`로 교체

```jsx
const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });
  
   function handleCityChange(e) {
    updatePerson(draft => {
      draft.artwork.city = e.target.value;
    });
  }
```

# 배열 State 업데이트 하기

- 배열은 JavaScript에서는 변경이 가능하지만, state로 저장할 때에는 변경할 수 없도록 처리
- 객체와 마찬가지로, state에 저장된 배열을 업데이트하고 싶을 때에는, 새 배열을 생성(혹은 기존 배열의 복사본을 생성)한 뒤, 이 새 배열을 state로 두어 업데이트
- 읽기 전용으로 처리해야 함.
    - `arr[0] = 'bird'`처럼 배열 내부의 항목을 재할당 X
    - `push()`나 `pop()`같은 함수로 배열을 변경 X

|  | 비선호 (배열을 변경) | 선호 (새 배열을 반환) |
| --- | --- | --- |
| 추가 | `push`, `unshift` | `concat`, `[...arr]` 전개 연산자 |
| 제거 | `pop`, `shift`, `splice` | `filter`, `slice` |
| 교체 | `splice`, `arr[i] = ...` 할당 | `map` |
| 정렬 | `reverse`, `sort` | 배열을 복사한 이후 처리 |

## **배열에서 항목 제거하기**

> `filter` 함수를 사용해 필터링 하기
> 

```jsx
// artist.id와 ID가 다른 artists로 구성된 배열을 생성
setArtists(
	  artists.filter(a =>
    a.id !== artist.id
  )
```

- 해당 artist를 배열에서 필터링한 다음, 반환된 배열로 리렌더링을 요청
- 원본 배열은 수정되지 않음

## **배열 변환하기**

> 배열의 일부 또는 전체 항목을 변경하고자 한다면 `map` 함수를 이용해 새로운 배열 생성
> 

## **배열 내 항목 교체하기**

> 항목을 교체하기 위해 `map`을 이용해서 새로운 배열 생성
> 
- `map`을 호출할 때 두 번째 인수로 항목의 인덱스를 받을 수 있음
    - 인덱스는 원래 항목(첫 번째 인수)을 반환할지 다른 항목을 반환할지를 결정할 때 사용

## **배열에 항목 삽입하기**

> `…연산자`, `slice()` 원하는 위치에 항목을 삽입하고 싶을 때
> 
- `slice()` 함수를 사용하면 배열의 “일부분”을 잘라낼 수 있음
    - 항목 삽입: 삽입 지점 앞에 자른 배열 전개 후 새 항목과 원본 배열의 나머지 부분을 전개하는 배열을 만듦

```jsx
    const nextArtists = [
      // 삽입 지점 이전 항목
      ...artists.slice(0, insertAt),
      // 새 항목
      { id: nextId++, name: name },
      // 삽입 지점 이후 항목
      ...artists.slice(insertAt)
    ];
```

## **배열에 기타 변경 적용하기**

React에서 배열을 뒤집거나 정렬하는 등, 원본 배열을 직접 변경하는 reverse(), sort() 같은 함수는 사용하지 않는 것이 좋음.

대신 **배열을 복사한 뒤 복사본에 변경**을 적용해야 함.

```jsx
const nextList = [...list];
nextList.reverse();
setList(nextList);
```

단, 얕은 복사의 경우 객체들은 여전히 원본과 같은 참조를 가짐

(복사본 객체 직접 수정 시, 원본도 같이 바뀜)

따라서, 객체 속성 변경 시 **깊은 복사** 필요

- 배열 안의 객체를 변경하고 싶을 때는 map()을 사용해 변경이 필요한 객체만 새 객체로 만들어 반환

```jsx
setList(list.map(item =>
  item.id === targetId ? { ...item, seen: true } : item
));
```

**Immer 사용 시**

Immer 라이브러리를 쓰면 draft 객체를 직접 수정하는 문법으로 간단하게 불변성을 유지할 수 있음

```jsx
updateList(draft => {
  const item = draft.find(a => a.id === targetId);
  item.seen = true;
});
```