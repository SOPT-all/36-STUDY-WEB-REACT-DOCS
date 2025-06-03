# Week 4

## ✅ state 업데이트

##### 1. React의 상태 업데이트와 렌더링

- setState()는 즉시 실행되지 않고, 다음 렌더링을 예약함.
- 동일한 렌더링 내에서 읽은 state는 고정값이라 이후 setState()가 있어도 바로 바뀌지 않음.

```
setNumber(number + 1); // 이 안의 number는 여전히 이전 값
```

##### 2. Batching이란?

- React는 여러 state 업데이트를 하나의 렌더링으로 묶음(batch).
- 마치 레스토랑 웨이터가 여러 주문을 한 번에 주방에 전달하는 것처럼, 이벤트 핸들러가 끝날 때까지 기다림.
- 이 덕분에 불필요한 렌더링을 줄이고 성능을 높일 수 있음.

##### 3. 업데이트 방식에 따른 결과 차이

❌ 일반 방식: setState(value)

```
setNumber(number + 1);
setNumber(number + 1);
setNumber(number + 1);
```

number는 모두 0으로 평가됨 → 결과는 1.

업데이터 함수 방식: setState(prev => prev + 1)

```
setNumber(n => n + 1);
setNumber(n => n + 1);
setNumber(n => n + 1);
```

이전 값 기반으로 순차 계산됨 → 결과는 3.

##### 4. 업데이트 순서가 중요한 경우

```
예시 1:
setNumber(number + 5);  // 초기값: 0 → 큐에 "5로 교체"
setNumber(n => n + 1);  // 5 + 1 = 6 → 최종 결과: 6

예시 2:
setNumber(number + 5);  // → 5
setNumber(n => n + 1);  // → 6
setNumber(42);          // → 42 (최종 값)

마지막 setNumber(42)가 모든 이전 업데이트를 덮어씀.
```

##### 5. 업데이터 함수란?

- 형태: setState(prev => newValue)

- 이전 state 값을 기준으로 새 값을 계산.

- 큐에 순차 적용되며, 이전 결과가 다음 업데이트의 기준이 됨.

##### 6. 명명 규칙

- 업데이터 함수의 매개변수는 보통 다음 중 하나의 규칙을 따름:

- 변수 축약형: n => n + 1

- 전체 변수명: enabled => !enabled

- 접두사 사용: prevCount => prevCount + 1

##### 7. 주의사항

- 업데이터 함수 내부에서는 side effect (예: API 호출 등) 하지 말 것.

- StrictMode에서는 두 번 실행되어 예상치 못한 부작용을 검출할 수 있음.

## ✅ 객체 State 업데이트

##### 1. React state는 읽기 전용처럼 다뤄야 함

자바스크립트의 객체는 변경 가능한(mutable) 값이지만,

React에서는 state 객체를 직접 수정하면 리렌더링되지 않음 → setState를 통해 새 객체로 교체해야만 리렌더링 발생

```
// ❌ 이렇게 하면 렌더링 안됨
position.x = 100;
position.y = 200;

// ✅ 이렇게 해야 렌더링됨
setPosition({ x: 100, y: 200 });
```

##### 2. 객체의 일부만 바꾸고 싶을 땐 전개 구문 사용

기존 객체를 복사하고 바꾸고 싶은 부분만 덮어쓰기

```
setPerson({
  ...person,
  firstName: 'Kim'
});
```

...person은 얕은 복사(shallow copy)만 하므로 한 단계만 복사됨

##### 3. 전개 구문은 “얕은 복사”

중첩된 객체일 경우, 해당 부분도 따로 복사해야 함

```
// ❌ 이건 artwork만 바꾸는 게 아니라 person 전체를 새로 만들어야 함
setPerson({
  ...person,
  artwork: {
    ...person.artwork,
    city: 'New Delhi'
  }
});
```

#### 4. 여러 input을 하나의 state로 다루는 방법

이벤트 핸들러 하나로 처리
input에 name 속성 부여 후, e.target.name 활용

```
function handleChange(e) {
  setPerson({
    ...person,
    [e.target.name]: e.target.value
  });
}
```

```
<input name="email" value={person.email} onChange={handleChange} />
```

##### 5. Immer로 중첩 객체 쉽게 관리하기

반복적인 전개 구문 없이도 직관적인 코드 작성 가능

```
import { useImmer } from 'use-immer';

const [person, updatePerson] = useImmer({
  name: 'Kim',
  artwork: { city: 'Seoul', title: 'My Art' }
});

updatePerson(draft => {
  draft.artwork.city = 'New York';  // 직접 바꾸는 것처럼 작성 가능
});
```

내부적으로 Immer는 변경사항을 추적해 새 객체를 자동 생성함

## ✅ 배열 State 업데이트

##### 1. 배열도 객체처럼 "불변"하게 다뤄야 함

push(), pop(), splice(), arr[i] = ... 등 직접 변경하는 방식은 사용 금지

대신 새 배열을 만들어 setState로 교체해야 함

##### 2. 배열 업데이트 기본 원칙

| 작업      | 변경 방식 (사용 금지)       | 권장 방식 (불변 방식)                   |
| --------- | --------------------------- | --------------------------------------- |
| 추가      | `push()`                    | `[...arr, newItem]` or `arr.concat()`   |
| 제거      | `pop(), splice()`           | `arr.filter()`                          |
| 교체      | `arr[i] = ...`              | `arr.map()`                             |
| 정렬/역순 | `arr.sort(), arr.reverse()` | `[...arr].sort()`, `[...arr].reverse()` |

##### 3. 배열에 항목 추가하기

```
setItems([
  ...items,
  { id: nextId++, name: inputValue }
]);
앞에 추가하려면: [{ newItem }, ...items]
```

##### 4. 배열에서 항목 제거하기 (filter)

```
setItems(items.filter(item => item.id !== idToRemove));
```

##### 5. 배열 항목 교체하기 (map)

```
setCounters(counters.map((c, i) => (
  i === targetIndex ? c + 1 : c
)));
```

##### 6. 배열 중간에 항목 삽입하기

```
setList([
  ...list.slice(0, index),
  newItem,
  ...list.slice(index)
]);
```

##### 7. 정렬(reverse, sort) 시 복사 먼저

```
const nextList = [...list]; // 얕은 복사
nextList.reverse();         // 원본 수정 안 함
setList(nextList);
```

하지만 이 경우 배열 내부 항목(객체) 도 얕게 복사되므로, 내부 객체를 직접 수정하면 안 됨.

##### 8. 배열 내부 객체 업데이트 시 map + 전개 연산자

```
setList(list.map(item => (
  item.id === targetId ? { ...item, seen: true } : item
)));
```

복사된 배열의 객체도 ...item으로 새로 만들어야 불변성 유지

##### 9. Immer로 더 간결하게

```
npm install use-immer
```

```
import { useImmer } from 'use-immer';

const [list, updateList] = useImmer(initialList);

updateList(draft => {
  const item = draft.find(i => i.id === targetId);
  item.seen = true; // 직접 수정 가능
});
```

draft는 Proxy 객체 → 변경해도 Immer가 자동으로 새 state 생성

✅ 요약 정리
| 주제 | 요약 |
| --------------- | -------------------------------------------------- |
| 불변성 유지 | 배열도 직접 수정 금지. 새 배열로 교체해야 React가 인식함 |
| 배열 수정 방법 | `map()`, `filter()`, `slice()` 등 비파괴적 함수 사용 |
| 내부 객체 주의 | 얕은 복사 → 내부 객체도 전개해서 새 객체로 만들어야 함 |
| Immer 사용 시 장점 | 코드 간결화 + 불변성 자동 보장 |
| 금지 함수 | `push`, `pop`, `splice`, `reverse`, `sort` (원본 파괴) |

## Quiz

```
import { useState } from 'react';

export default function UserList() {
  const [users, setUsers] = useState([{ id: 1, name: 'Kim' }]);
  const [changeCount, setChangeCount] = useState(0);

  function handleClick() {
    users[0].name = 'Lee';           // ❌ 1

    setChangeCount(changeCount + 1); // ❌ 2
    setChangeCount(changeCount + 1);
  }

  return (
    <>
      <button onClick={handleClick}>Change Name</button>
      <p>{users[0].name} / Changes: {changeCount}</p>
    </>
  );
}
```

<details>
<summary>정답</summary>

1. 객체를 직접 수정하지 말고 전개 구문으로 새 객체 생성 (setUsers([{ ...users[0], name: 'Lee' }]))

2. state 누적 시 업데이트 함수 사용 (setChangeCount(c => c + 1))

</details>
