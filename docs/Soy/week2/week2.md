# 조건부 렌더링

> React는 `if` 문, `&&` 및 `? :` 연산자와 같은 자바스크립트 문법을 사용하여 조건부로 JSX를 렌더링할 수 있다.
> 

<br>

## 조건부로 JSX 반환하기

```jsx
export default function PackingList() {
  return (
    <section>
      <h1>Soy's Packing List</h1>
      <ul>
        <Item
          isPacked={true} /* 이 값을 변경하여 결과를 바꿀 수 있다.*/
          name="옷"
        />
        <Item
          isPacked={true}
          name="화장품"
        />
        <Item
          isPacked={false}
          name="충전기"
        />
      </ul>
    </section>
  );
}
```

짐을 챙겼는지 안 챙겼는지 표시할 수 있는 여러 개의 `Item`을 렌더링하는 `PackingList` 컴포넌트가 있을 때 

<br>

```jsx
function Item({ name, isPacked }) {
  if (isPacked) {
    return <li className="item">{name} ✅</li>;
  }
  return <li className="item">{name}</li>;
}
```
<br>

`if/else 문`을 통해 짐을 챙긴 항목에 체크 표시를 추가할 수 있다.
`isPacked` prop이 `true`이면 이 코드는 다른 JSX 트리를 반환한다. 

- ❓**다른 JSX 트리를 반환한다?**
    
    조건에 따라 서로 다른 UI 구조를 렌더링한다. = 보여지는 화면이 달라짐 
    

<br>

### **조건부로 `null`을 사용하여 아무것도 반환하지 않기**

- 아무것도 렌더링하고 싶지 않을 때 사용

컴포넌트는 반드시 무언가를 반환해야 하는데, 이 경우에 null을 반환한다. 

```jsx
if (isPacked) {  //true이면 아무것도 반환 X
  return null;
}
return <li className="item">{name}</li>;
```

<br>

## **조건부로 JSX 포함시키기**

```jsx
function Item({ name, isPacked }) {
  if (isPacked) {
    return <li className="item">{name} ✅</li>;
  }
  return <li className="item">{name}</li>;
}
```

이 코드에서는 `<li className="item">...</li>` 를 중복 반환하고 있다. 이 경우 유지 보수를 어렵게 만들 수 있다.

<br>

### ✅ 해결 방법

### **삼항 조건 연산자 (`? :`)**

> 조건문 ? 참일 경우 : 거짓일 경우 실행할 표현식
> 

```jsx
return (
  <li className="item">
    {isPacked ? name + ' ✅' : name}
  </li>
);
```

`?` 기준으로 참(true)이면 `name + ' ✅'` 렌더링, 거짓(false)이면 `name`을 렌더링한다.

<br>

### **논리 AND 연산자 (`&&`)**

조건(왼쪽)이 true일 경우에만 JSX를 렌더링한다. 

조건이 false이면 전체 표현식이 false가 되므로 React는 null 또는 undefined로 간주해 아무것도 렌더링하지 않는다.

```jsx
return (
  <li className="item">
    {name} {isPacked && '✅'}
  </li>
);
```

- ⚠️ **조건에 숫자를 넣지 않아야 한다.**
    
    조건 테스트를 위해 JS는 자동으로 왼쪽(조건)을 bool로 반환한다. 그러나 왼쪽이 `0`이면 전체식이 `0`을 얻게 되어 React가 아무것도 아닌 `0`을 렌더링한다. 
    
    예시)  `messageCount && <p>New messages</p>`
    
    `messageCount` 가 0일 때 0 자체를 렌더링 한다. 
    
    (아무것도 렌더링하지 않는다고 생각하면 안된다.)
    
<br>
    

## **변수에 조건부로 JSX를 할당하기**

```jsx
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = name + " ✅";
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}
```

재할당 가능한 let으로 변수를 정의하고 if문을 이용해 `isPacked`가 `true`인 경우 JSX 표현식을 `itemContent`에 다시 할당한다. 중괄호를 이용해 변수를 포함할 수 있다. 

> 중괄호는 JS로 들어가는 창
> 


<br>

# 리스트 렌더링
    

## 배열을 데이터로 렌더링하기

서로 다른 데이터를 사용하여 동일한 컴포넌트의 여러 인스턴스를 표시해야 하는 경우 JavaScript 객체와 배열에 저장하고 [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)과 [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) 같은 메서드를 사용하여 해당 객체에서 컴포넌트 리스트를 렌더링할 수 있다.

### **Array.prototype.map()**

 ****Array 인스턴스의 **`map()`** 메서드는 호출한 배열의 모든 요소에 주어진 함수를 호출한 결과로 채운 새로운 배열을 생성한다. (순회 메서드)

- ❓**인스턴스**
    
    객체 지향 프로그래밍에서 클래스를 기반으로 생성된 실체 
    
    예) 클래스 → 설계도 / 인스턴스 → 설계도를 바탕으로 실제로 만들어진 자동차 한 대
    
    **JavaScrip에서 Array의 인스턴스가 무슨 뜻인가?**
    
    → Array는 배열을 다루기 위한 클래스와 같은 역할
    
    즉, Array를 사용해 배열을 만들면 그 배열은 Array의 인스턴스가 된다!
    
    `const arr = [1, 2, 3];`  여기서 arr가 Array의 인스턴스
    

> `.map(callbackFn)`
`.map(callbackFn, thisArg)`
> 

<br>

**매개변수**

1. callbackFn
    
    배열의 각 요소에 대해 실행할 함수
    
    | `currentValue` | 배열 내에서 처리할 현재 요소 |
    | --- | --- |
    | `index` | 배열 내에서 처리할 현재 요소의 인덱스 |
    | `array` | `map()`을 호출한 배열. |
2. `thisArg` (option)
    
    `callback`을 실행할 때 `this`로 사용되는 값.
    
 <br>
    

**반환값**

배열의 각 요소에 대해 실행한 `callback`의 결과를 모은 **새로운 배열**

<br>

**map()을 이용해 렌더링하는 방법** 

1. 데이터를 배열로 이동
    
    ```jsx
    const array = [ ]
    ```
    

1. Array의 요소를 새로운 JSX 노드 배열에 매핑
    
    ```jsx
    const listItems = array.map(list => <li>{list}</li>);
    ```
    
    ⚠️ 화살표 함수는 암시적을 `⇒` 바로 뒤에 식을 반환하기 때문에 `return`이 필요하지 않다.
    
    하지만, `⇒` 뒤에 `{ }` (중괄호)가 오는 경우 `return`을 명시적으로 작성해야 한다.
    
    ```jsx
    // 암시적 반환
    const listItems = chemists.map(person =>
      <li>...</li> 
    );
    
    // 명시적으로 작성 - 여러 문장 작성할 경우!!
    const listItems = chemists.map(person => { 
      return <li>...</li>;
    });
    ```
    
2. `<ul>`로 래핑된 컴포넌트의 `listItems`를 **반환**
    
    ```jsx
    return <ul>{listItems}</ul>;
    ```
   
   <br>

## **배열의 항목들을 필터링하기**

### **Array.prototype.filter()**

[`Array`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array) 인스턴스의 `filter()` 메서드는 주어진 배열의 일부에 대한 얕은 복사본을 생성하고, 주어진 배열에서 제공된 함수에 의해 구현된 테스트를 통과한 요소로만 필터링한다. (순회 메서드)

- 얕은 복사
    
    복사본의 속성이 복사본이 만들어진 원본 객체와 같은 [참조](https://developer.mozilla.org/ko/docs/Glossary/Object_reference) (메모리 내의 같은 값을 가리킴)를 공유하는 복사
    
    즉, 복사본 변경시 원본도 변경됨
    

> `filter(callbackFn)`
`filter(callbackFn, thisArg)`
> 

<br>

**매개변수**

1. callbackFn
    
    배열의 각 요소에 대해 실행할 함수
    
    - 결과 배열에 요소를 유지하려면 true 반환
    
    | `element` | 배열 내에서 처리 중인 현재 요소 |
    | --- | --- |
    | `index` | 배열 내에서 처리 중인 현재 요소의 인덱스 |
    | `array` | `filter()`을 호출한 배열. |
2. `thisArg` (option)
    
    `callback`을 실행할 때 `this`로 사용되는 값.
    
<br>

**반환값**

주어진 배열에서 테스트를 통과한 요소만 포함하는 해당 배열의 얕은 복사본 배열

filter 조건에 만족하는 요소가 없는 경우, 빈 배열 반환 

```jsx
const idolGroup = [{
  id: 0,
  name: '카리나',
  team: '에스파',
}, {
  id: 1,
  name: '윈터',
  team: '에스파',
}, {
  id: 2,
  name: '제니',
  team: '블랙핑크',
}, {
  id: 3,
  name: '지젤',
  team: '에스파',
}, {
  id: 4,
  name: '닝닝',
  team: '에스파',
}];
```

team이 ‘에스파’인 사람들만 표시하고 싶을 때 filter()를 사용하여 새로운 배열을 반환할 수 있다. 

```jsx
import { idolGroup } from './data.js';

export default function List() {
  const aespa = idolGroup.filter(person =>
    person.team === '에스파'
  );
  const listItems = aespa.map(person =>
    <li>
      <p>
        <b>{person.name}:</b>
        {' ' + person.team + ' '}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

<br>

## **`key`를 사용해서 리스트 항목을 순서대로 유지하기**

```jsx
Warning: Each child in a list should have a unique “key” prop.
```

앞선 코드에선 다음과 같은 콘솔 에러가 표시된다.

각 배열 항목에는 고유하게 식별할 수 있는 문자열 또는 숫자를 `key`로 지정해줘야 한다. 

key는 각 컴포넌트가 어떤 배열 항목에 해당하는지 React에 알려주어 나중에 일치시킬 수 있도록 한다. 

→ 배열 항목이 정렬 등으로 인해 이동 / 삽입 /삭제될 수 있기에 중요하다.

<br>

### **`key`를 가져오는 곳**

데이터 소스마다 다른 key 소스 제공

- DB의 데이터 : 본질적으로 고유한 DB의 key / id 사용 O
- 로컬에서 생성된 데이터 : 일렬번호 또는 uuid 같은 패키지 사용

<br>

### key 규칙

- 형제 간 고유해야 한다.
- 변경되어서는 안된다. (렌더링 중에 key 생성하지 않기)
- `Math.random()` 처럼 즉석에서 생성하지 말기
    
    → 렌더링 간 key가 일치하지 않아 모든 컴포넌트와 DOM이 매번 다시 생성될 수 있다. 
    

**이외 주의할 점** 

- 컴포넌트가 key를 prop으로 받지 않는다.
    - key는 단지 React에서 힌트로만 사용
- key 대신 index? ⇒ X
    - key를 지정하지 않으면 React는 배열의 index를 사용한다. 하지만 항목이 삽입 / 삭제 / 순서의 변경이 생기면 시간이 지남에 따라 항목을 렌더링하는 순서가 변경되기 때문에 혼란스러울 수 있다.
    
    <br>

# 컴포넌트를 순수하게 유지하기


## **순수성: 공식으로서의 컴포넌트**

✅ **순수 함수**

- 오직 연산만을 수행
- 함수가 호출되기 전에 존재했던 어떤 객체나 변수는 변경하지 않는다.
- 같은 입력 + 같은 출력  ⇒ 같은 결과 반환

> **React는 작성되는 모든 컴포넌트가 순수 함수일거라 가정한다.** 
같은 입력 → 반드시 같은 JSX 반환
> 

<br>

## **사이드 이펙트: 의도하지(않은) 결과**

React의 렌더링 과정은 항상 순수해야 한다. 

순수한 컴포넌트는 입력(props, state)에 대해서만 의존하고, ****부수적인 효과 없이 순수하게 JSX를 반환해야 한다. 

### 사이드 이펙트

: 함수나 컴포넌트에서 예상치 않은 변경이 발생하는 것

React 컴포넌트에서는 렌더링 중에 변수나 객체를 변경하거나 외부 상태에 영향을 미치는 작업이 있을 때 사이드 이펙트 발생

ex)  애니메이션 시작, 데이터 변경, API 호출 등

<br>

- 순수하지 않은 컴포넌트 (사이드 이펙트O)

```jsx
function MyComponent(props) {
  props.someArray.push(1);  // 원본 배열을 변경하는 사이드 이펙트
  return <div>{props.someArray}</div>;
}

```

<br>

- 순수한 컴포넌트

```jsx
function MyComponent(props) {
 
  const newArray = [...props.someArray, 1];  // 새로운 배열을 생성
  return <div>{newArray}</div>;
}

```
<br> 

**`<React.StrictMode>`**

- React의 개발 모드에서 컴포넌트 함수를 **두 번 호출**하여 순수하지 않은 컴포넌트를 찾는 데 도움을 준다.
- 두 번 호출해도 앱의 동작에 영향을 주지 않으며, 순수 함수처럼 동작하게 된다.

✅ React에서 사용되는 **세 가지 주요 입력 요소:** **`props`**, **`state`**, `context`

- 읽기 전용 → 상태 변경시 setState를 통해 처리

<br>

**이벤트 핸들러**

- 사이드 이펙트를 발생시키는 위치
    
    (버튼 클릭과 같은 사용자 인터랙션에 반응하여 실행됨)
    
- `useEffect`
    - 렌더링 후 특정 작업을 실행하도록 React에게 지시
    - 다른 방법 먼저 시도 후 마지막 수단으로 사용하길 추천
        
        → 렌더링 후에 실행되어서 성능 최적화가 어려워질 수 있음 
        
- 챌린지 도전하기
    
    ```jsx
    export default function Clock({ time }) {
      let hours = time.getHours();
      if (hours >= 0 && hours <= 6) {
        document.getElementById('time').className = 'night';
      } else {
        document.getElementById('time').className = 'day';
      }
      return (
        <h1 id="time">
          {time.toLocaleTimeString()}
        </h1>
      );
    }
    ```
    
  ⚠️ **오류가 나는 이유:** 
  `document.getElementById('time').className`을 사용하여 DOM을 직접 수정하고 있음. 
    
    - 해결 방법
    
    ```jsx
    export default function Clock({ time }) {
      let hours = time.getHours();
      let className;
      if (hours >= 0 && hours <= 6) {
        className = 'night';
      } else {
        className = 'day';
      }
      return (
        <h1 className={className}>
          {time.toLocaleTimeString()}
        </h1>
      );
    }
    ```
    

# 트리로서의 UI

![image.png](\images\1.webp)

React는 컴포넌트로부터 UI 트리를 생성한다. React 앱의 컴포넌트 간의 관계를 관리하고 모델링하기 위해 트리 구조를 사용한다. 

## 렌더 트리

컴포넌트의 주요 특징은 다른 컴포넌트의 컴포넌트를 구성하는 것인데, 컴포넌트를 중첩하면 부모 / 자식 컴포넌트의 개념이 생긴다.

⇒ Reaxt 앱을 렌더링할 때 이 관계를 트리라고 모델링할 수 있다.

트리는 노드로 구성되고, 노드는 컴포넌트를 나타낸다. 

Root 노드 (=루트 컴포넌트)는 React가 렌더링하는 첫 번째 컴포넌트이다.

리프 컴포넌트는 트리의 맨 아래에 있으며 자식 컴포넌트가 없다. 

![image.png](\images\2.png)

렌더 트리는 React 앱의 단일 렌더링을 나타낸다. 조건부 렌더링을 사용하면, 서로 다른 렌더링에서 렌더 트리가 다른 컴포넌트를 렌더링할 수 있다. 

이 예시에서, `inspiration.type`이 무엇이냐에 따라 `<FancyText>` 또는 `<Color>`를 렌더링할 수 있다. 

## 모듈 의존성 트리

React 앱의 모듈 간 관계를 시각적으로 표현한 것

각 노드는 모듈을 나타내고, 화살표는 import 관계를 나타낸다. 

- 루트 모듈: 최상의 노드, 다른 모듈들이 이 노드를 참조한다.
- 앱을 배포하기 위해 필요한 코드를 번들로 묶는 데 빌드 도구에서 사용된다. → 디버깅과 최적화 유리