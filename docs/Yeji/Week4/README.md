# [Week4] 상호작용성 더하기

## ✅ 리액트 배칭

배칭은 여러 개의 상태 업데이트를 하나로 묶어 한 번에 처리하는 React의 최적화 기법임. 이벤트 핸들러 안에서 호출된 상태 업데이트를 자동으로 배치 처리 함.

React 17 이전에는, 이벤트 루프 안에서 여러 개의 setState() 호출을 감지하면 하나의 업데이트로 스케줄링 하여 렌더링을 한 번만 수행했지만,

React 18 이후에는 Automatic Batching이 도입되어 업데이트가 어디서 발생하더라도 모든 업데이트가 자동으로 배칭되도록 모든 비동기 업데이트를 batch로 감싸도록 개선되었음.

이를 활용하여 최적화를 하려면 상태 업데이트는 가능한 같은 컨텍스트 내에서 묶어서 호출하는 것이 좋고, 외부에서 상태 변경이 있다면 unstable_batchedUpdates를 고려하는 것이 좋음.

## 🥸 스프레드 문법

`...` 스프레드 문법은 배열이나 객체를 개별 요소로 펼치는 문법임.

스프레드 문법은 얕은 복사 Shallow copy를 수행하기 때문에 내부 객체까지 복사하지 않고 참조를 유지함.

React의 상태 업데이트는 항상 새로운 객체를 만들어야만 리렌더링이 발생함. 다시 말해, 상태를 직접 수정하면 리렌더링이 되지 않음.

```js
const arr = [1, 2, 3];
const copy = [...arr]; // [1, 2, 3]

const obj = { name: "예지", age: 25 };
const clone = { ...obj }; // { name: '예지', age: 25 }
```

배열이나 객체를 새로운 배열, 객체로 복사하고, 기존 데이터를 손대지 않고 새로운 값을 만들 수 있음.

이전 상태에 의존하는 로직이 있다면 항상 prev를 사용하는 게 더 안전하기 때문에 이전 상태 값을 기반으로 새로운 상태를 계산해야 할 때 setState(prev => ...) 형태를 많이 사용함.

## 배열 메서드 정리

### filter

```js
const todos = [
  { id: 1, text: "리발 과제", done: true },
  { id: 2, text: "스터디", done: false },
];

const undone = todos.filter((todo) => !todo.done);
// [{ id: 2, text: "리발 과제", done: false }]
```

조건을 만족하는 요소만 걸러서 새로운 배열을 만들어 줌. (원본 배열 변경 X)
리스트 상태에서 특정 항목을 삭제할 때 많이 사용함.

```js
setTodos((prev) => prev.filter((todo) => todo.id !== 삭제할ID));
```

### unshift

```js
const arr = [2, 3];
arr.unshift(1);
console.log(arr); // [1, 2, 3]
```

배열의 앞 쪽에 새로운 요소를 추가함.

기존 배열을 변경하여 불변성이 깨지기 때문에 스프레드로 새로운 배열을 만드는 방식이 더 안전함.

```js
setItems((prev) => [새항목, ...prev]);
```

### map

```js
const names = ["예지", "예지2"];
const greetings = names.map((name) => `안녕 ${name}`);
// ["안녕 예지", "안녕 예지2"]
```

각 요소를 순회하며 특정 작업을 하고, 새로운 배열을 만들어서 반환함. (원본 유지)

리스트 렌더링 할 때 많이 사용함.

```jsx
{
  items.map((item) => <li key={item.id}>{item.text}</li>);
}
```

### slice

```jsx
const arr = [1, 2, 3, 4];
const sliced = arr.slice(1, 3); // [2, 3]
```

배열의 일부를 잘라서 새로운 배열을 반환함. (원본 유지)

페이지네이션이나 항목 슬라이스에 많이 사용함.

### find

```js
const users = [
  { id: 1, name: "예지" },
  { id: 2, name: "수현" },
];

const user = users.find((u) => u.id === 2);
```

조건에 제일 처음 만족하는 요소 하나를 반환함. 조건을 만족하는 요소가 없다면 undefined 반환. (원본 배열 변경 X)

### some

```js
const arr = [1, 2, 3, 4];

const hasEven = arr.some((n) => n % 2 === 0); // true
const hasTen = arr.some((n) => n === 10); // false
```

조건을 만족하는 요소가 하나라도 있으면 true를 반환함. 모두 만족하지 않으면 false를 반환함. (원본 유지)

```js
const hasIncomplete = todos.some((todo) => !todo.done);
```

조건이 하나라도 만족하는지 검사에 많이 사용함.

### every

```js
const arr = [2, 4, 6];

const allEven = arr.every((n) => n % 2 === 0); // true
const allPositive = arr.every((n) => n > 0); // true
```

모든 요소가 조건을 모두 만족하면 true를 반환하고, 하나라도 불만족하면 false를 반환함.

### reduce

```js
array.reduce((acc, curr, index, arr) => {
  return acc + curr;
}, initialValue);
```

배열의 요소를 순회하면서 누적된 결과를 만들어냄. (결과를 하나로 합쳐서 반환)

- acc : 누적값
- curr : 현재 순회 중인 배열 요소
- index : 현재 요소의 인덱스
- arr : 원본 배열

### includes

```js
const fruits = ["apple", "banana", "orange"];

fruits.includes("banana"); // true
fruits.includes("grape"); // false
```

배열에 특정 값이 포함되어있다면 true, 없으면 false를 반환함.
