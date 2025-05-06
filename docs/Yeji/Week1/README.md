# [Week1] UI 표현하기

## 📺 컴포넌트 import 및 export

### `default` vs. `named`

![default, named](./images/import-export.svg)

#### `default`

```jsx
import React from "react";

export default function HiButton({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>;
}
```

```jsx
import Button from "./HiButton";
```

파일당 하나만 가능하고 import 할 때 원하는 이름으로 가져올 수 있음.

#### `named`

```jsx
export function Header() {
  /*…*/
}
export function Footer() {
  /*…*/
}
```

```jsx
import { Header, Footer } from "./components";
```

파일당 여러 개를 내보낼 수 있고, import 할 때 반드시 중괄호 + 이름을 작성해야 함.

> 보편적으로 한 파일에서 하나의 컴포넌트만 export 할 때 default 방식을 사용하고, 여러 컴포넌트를 export 하는 경우에 named 방식을 사용함.

## 💻 jsx로 마크업 작성하기

### JSX 규칙

**1. 하나의 루트 엘리먼트로 반환하기**
JSX는 내부적으로 `React.createElement` 호출 결과인 객체로 변환함.

컴포넌트 함수나 `render()` 메서드는 하나의 React 요소만 반환할 수 있기 때문에 여러 개의 최상위 태그가 있으면 에러가 발생함.

해결 방법

-> 최상위 태그 하나로 감싸거나 빈 Fragment 사용

```jsx
// ❌ 잘못된 코드
function MyComponent() {
  return (
    <h1>안녕하세요</h1>
    <p>환영합니다!</p>
  );
}

// ✅ 해결 1: 태그로 감싸기
function MyComponent() {
  return (
    <div>
      <h1>안녕하세요</h1>
      <p>환영합니다!</p>
    </div>
  );
}

// ✅ 해결 2: Fragment로 감싸기
function MyComponent() {
  return (
    <>
      <h1>안녕하세요</h1>
      <p>환영합니다!</p>
    </>
  );
}
```

**2. 모든 태그는 닫아주기**

JSX는 XML 문법을 따르기 때문에 반드시 태그를 닫아주어야 함.

```jsx
// ❌ 잘못된 코드
function Message() {
  return (
    <p>환영합니다!
  );
}

// ✅ 태그 닫아주기
function Message() {
  return (
    <p>환영합니다!</p>
  );
}

```

**3. 속성은 CamelCase로 작성하기**

JSX 속성은 avaScript 객체의 key 이름이 되므로 CamelCase를 사용함.

클래스는 `className`, for는 `htmlFor`, 이벤트 핸들러는 `onClick`처럼 작성해야 함.

```jsx
<img
  src="https://i.imgur.com/yXOvdOSs.jpg"
  alt="Hedy Lamarr"
  className="photo"
/>
```

**4. JavaScript 표현식은 중괄호로 감싸기**

JSX 안에서 JS 변수나 표현식을 출력할 때는 `{}` 중괄호로 감싸야 함.

```jsx
function Score({ points }) {
  return (
    <div>
      <p>현재 점수: {points}</p>
      {points >= 60 ? <p>합격</p> : <p>불합격</p>}
    </div>
  );
}
```

## ⛓️ 중괄호가 있는 jsx에서 자바스크립트 사용하기

### 중괄호 사용하는 곳

**1. JSX 태그 안의 텍스트에 JS 표현식 삽입**

태그 사이에 {}를 열고 JS 변수, 함수 호출, 연산 결과 등을 넣음.

예: `<p>현재 시간: {new Date().toLocaleTimeString()}</p>`

**2. 속성(attribute) 값으로 JS 표현식 사용**

속성 값은 문자열 리터럴 대신 {} 안의 JS 값을 전달할 수 있음.

예: `<input value={username} onChange={e => setUsername(e.target.value)} />`

## 🚀 컴포넌트에 props 전달하기

### 컴포넌트에 Props 전달하는 방법

**1. 자식 컴포넌트에 props 전달하기**

```jsx
// 부모 컴포넌트
function Parent() {
  return <Child name="예지" age={25} />;
}

// 자식 컴포넌트
function Child(props) {
  return (
    <div>
      {props.name} - {props.age}살
    </div>
  );
}
```

**2. 자식 컴포넌트 내부에서 props 읽기**

- 구조 분해 할당

```jsx
function Child({ name, age }) {
  return (
    <div>
      {name} - {age}살
    </div>
  );
}
```

- spread 문법

```jsx
const user = { name: "예지", age: 25, location: "서울" };

function Parent() {
  return <Child {...user} />;
}

function Child({ name, age, location }) {
  return (
    <div>
      {name} - {age}살 - {location}
    </div>
  );
}
```

### 👧🏻 Children Prop

`children`은 컴포넌트 태그 사이에 위치한 모든 자식 요소를 나타내는 props임.

여러 자식이 있을 경우 배열로, 단일 자식일 경우 해당 요소 하나로 전달함.

```jsx
function App() {
  return <Welcome>Hello world!</Welcome>;
}
```

```jsx
function Welcome(props) {
  return <p>{props.children}</p>;
}
```

자식 엘리먼트나 컴포넌트가 미리 몇 개가 들어올지 알 수 없거나, 재사용 가능하게 만들 때 유용함.

- **JSX.Element** : 단일 React 요소만 허용. 예외 사항이 많음

- **React.ReactChild** : 문자열, 숫자 등을 포함하지만 배열은 허용되지 않으며 사용이 지양됨

- **React.PropsWithChildren** : children이 선택 사항인 경우 적합함

- **React.ReactNode** : 모든 타입을 지원하며 가장 유연하고 많이 사용됨

### props 불변성

props는 읽기 전용(read-only)이기 때문에 자식 컴포넌트 내부에서 직접 수정하면 안 됨.
새로운 props가 전달되면 React는 이전 props를 버리고 새로운 props로 컴포넌트를 업데이트 함.
