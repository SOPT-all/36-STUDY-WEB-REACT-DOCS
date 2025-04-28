# [Week1] UI 표현하기

## 컴포넌트 
* 컴포넌트 : 고유한 로직과 모양을 가진 UI의 일부 
    *  리액트 컴포넌트는 마크업을 반환하는 JS 함수
* React에서
    * 컴포넌트: 마크업으로 뿌릴 수 있는 JavaScript 함수
        * 모든 UI는 컴포넌트
    * 컴포넌트 이름은 항상 대문자로 시작 

### 기본 선언 및 중첩 
```jsx
function MyButton() {
  return (
    <button>I'm a button</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

## 컴포넌트 import 및 export
* 컴포넌트의 가장 큰 장점은 재사용성 
    → 컴포넌트를 조합해 또 다른 컴포넌트를 만들 수 있다. 

#### `default`
```jsx
export default function HI(name) {
  return `Hello, ${name}!`;
}
```

```jsx 
import HI from './HI';

console.log(HI('sweb')); 

```
원하는 이름으로 import 가능 

#### `named`
```jsx
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
```
```jsx
import { add, subtract } from './math';

console.log(add(2, 3)); 
console.log(subtract(5, 2));
```
파일을 여러개 내보낼 때 유용 
export한 이름과 동일한 이름 + 중괄호 사용 

> 한 파일에서는 단 하나의 default export만 사용할 수 있지만 named export는 여러 번 사용 가능

| Syntax | Export 구문 | Import 구문 |
|:------|:------------|:-----------|
| Default | `export default function Button() {}` | `import Button from './button.js';` |
| Named | `export function Button() {}` | `import { Button } from './button.js';` |



## jsx로 마크업 작성하기

### JSX
JavaScript에서 확장한 문법
    JS 파일을 HTML과 비슷하게 마크업을 작성할 수 있도록 해줌 → 동적으로 정보 표시 
* React의 대부분 코드 베이스로 사용됨

### 규칙
**1. 하나의 루트 엘리먼트로 반황하기**

한 컴포넌트에서 여러 엘리먼트를 반환하려면, 하나의 부모 태그로 감싸기

```jsx
// 태그로 감싸기 
<div>
    <h1>hello</h1>
    <img src="" alt="">
</div>

// 빈 Fragment로 감싸기
<>
    <h1>hello</h1>
    <img src="" alt="">
</>

```

**2. 모든 태그는 닫아주기**


```jsx
// 잘못된 코드 
<>
    <h1>안녕
</>

// 올바른 코드
<>
    <h1>안녕</h1>
</>
```

**3. 대부분 캐멀 케이스로 작성**

JSX에서 작성된 속성은 JS의 key가 되기 때문

`class`는 `className`, `sroke-wodth`는 `strokeWidth`와 같은 방식으로 작성 

```jsx
<img
  src="https://i.imgur.com/yXOvdOSs.jpg"
  alt="Hedy Lamarr"
  className="photo"
/>
```

## 중괄호가 있는 JSX 안에서 자바스크립트 사용하기

#### `언제?`
1. JS 파일에 HTML과 비슷한 마크업을 작성해 렌더링 로직과 콘텐츠를 같은 곳에 놓고 싶을 때
2. JS 로직을 추가하거나 해당 마크업 내부의 동적인 프로퍼티를 참고하고 싶을 때 

=> 중괄호를 사용하면 마크업에서 바로 JavaScript를 사용할 수 있다. 

##### `따옴표로 문자 전달하기`
문자열 속성을 JSX에 전달하기 위해 작은 따옴표나 큰 따옴표로 묶어야 한다.

```jsx 
export default function ImageComponents() {
  return (
    <img
      className=""
      src=""
      alt=""
    />
  );
}
```

### 동적으로 전달하려면?
    ""를 {}로 바꿔 Js의 값을 사용할 수 있다.

```jsx
export default function ImageComponents() {
  const avatar = 'https://i.imgur.com/7vQD0fPs.jpg';
  const description = 'Gregorio Y. Zara';
  return (
    <img
      className="avatar"
      src={avatar}
      alt={description}
    />
  );
}
```

#### 중괄호를 사용하는 곳
**1. JSX 태그 안의 문자**
<h1>{name}'s To Do List</h1> : 작동 O 
<{tag}>Gregorio Y. Zara's To Do List</{tag}> : 작동 X

**2. = 바로 뒤에 오는 속성(attribute)**
src={avatar} : avatar 변수를 읽기
src="{avatar}" : "{avatar}" 문자열을 전달


## 컴포넌트에 props 전달하기
React 컴포넌트는 props를 이용해 서로 통신
* props: JSX 태그에서 전달하는 정보

### 전달 방법
**1. 자식 컴포넌트에 props 전달하기**
```jsx
export default function Profile() {
  return (
    <Avatar
      name="soy" age={24}
    />
  );
}
```

**2. 자식 컴포넌트 내부에서 props 읽기**
##### `구조 분해 할당` 
```jsx
function Avatar({ name, age = 20 }) {
  
}

// age = 20처럼 기본값 지정 가능 
```

##### `spread`
```jsx

const avatar = { name: "soy", age: 24, part: "web" };

function Profile(props) {
    return (
    <div>
      <Avatar {...props} />
    </div>
  );
}
```

### children prop
JSX 안에 작성된 중첩된 콘텐츠는 부모 컴포넌트에
children prop으로 전달됨

```jsx
function Wrapper({ children }) {
  return <div className="wrapper">{children}</div>;
}

export default function App() {
  return (
    <Wrapper>
      <h1>Hello!</h1>
      <p>Nice to meet you.</p>
    </Wrapper>
  );
}
```
* <h1>, <p>는 Wrapper 컴포넌트에 children으로 전달됨
    * Wrapper는 div안에 children을 넣어서 보여줌

### props의 불변성
props는 부모 컴포넌트가 다른 값을 넘기면 시간이 지나면서 변할 수 있음
**하지만 props 자체는 불변함**
* 컴포넌트는 props 직접 수정 불가
* 변경하고 싶다면, 부모 컴포넌트에 다른 props(새로운 객체)를 요쳥해야 함. 

```jsx
export default function SayHI({ name }) {
  return <h1>Hello, {name}!</h1>;
}

<SayHI name="soy" />
<SayHI name="react" />
```