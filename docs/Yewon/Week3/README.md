# 이벤트에 대한 응답

리액트에서는 JSX에 이벤트 핸들러를 추가할 수 있는데, 이벤트 핸들러는 클릭, 마우스 호버, 폼 인풋 포커스 등 사용자 상호작용에 따라 유발되는 사용자 정의 함수이다.

`<button>`과 같은 내장 컴포넌트는 onClick과 같은 내장 브라우저 이벤트만 지원한다.

사용자 정의 컴포넌트를 생성하는 경우, 컴포넌트 이벤트 핸들러 props의 역할에 맞는 원하는 이름을 사용할 수 있다.

#### e.preventDefault()를 사용하면 HTML 요소들의 기본동작을 막을 수 있다!

🚨그러나 기본 동작 막기를 너무 남용하지는 않기!

---

기본 동작을 막는 자바스크립트 코드를 추가하면 제약 없이 요소의 동작을 원하는 대로 바꿀 수 있습니다. 링크 `<a>`를 버튼처럼 만들 수 있고, 버튼 `<button>`을 다른 URL로 이동시켜주는 링크처럼 동작하게 할 수도 있습니다.하지만 HTML 요소의 의미를 지키면서 동작을 바꿔야 합니다. `<a>`는 페이지를 돌아다니는 동작을 해야 하지 버튼처럼 동작해선 안 됩니다.이렇게 요소가 가진 의미를 해치지 않으면서 코드를 작성하면 '좋은 코드’가 될 뿐만 아니라 접근성 측면에서도 도움이 됩니다.`<a>`와 기본동작 막기를 조합한 코드를 구상할 때 주의할 것이 있습니다. 사용자는 브라우저 기본 동작을 사용해 마우스 우클릭 등의 방법으로 새 창에서 링크를 열 수 있습니다. 이 기능은 인기가 많죠. 하지만 자바스크립트로 버튼을 조작해 링크처럼 동작하게 만들고 CSS를 이용해 버튼을 링크처럼 꾸미더라도 브라우저에서 제공하는 `<a>` 관련 기능은 버튼에선 작동하지 않습니다.

---

##### State: 컴포넌트의 메모리

컴포넌트는 현재 입력값, 이미지, 장바구니에 담긴 상품 등을 "기억"해야 한다.

- 리액트에서는 이러한 컴포넌트별 메모리를 state라고 부른다.
- useState 훅을 사용하면 컴포넌트에 state 변수를 선언할 수 있다.
- useState는 초기 state를 인자로 받으며, 현재 상태와 상태를 업데이트할 수 있는 상태 설정 함수를 배열에 담아 반환한다.

##### 렌더링과 반영

리액트에서 렌더링(rendering)이란, 컴포넌트의 내용을 화면에 표시하거나 업데이트하는 과정을 의미한다.

- 초기 렌더링: 구성 요소가 화면에 처음 나타날 때 발생
- 리렌더링: 이미 화면에 있는 구성 요소의 두 번째 및 연속 렌더링

렌더링 프로세스
리액트에서는 크게 아래의 3단계를 거쳐 렌더링 과정이 이루어진다.

1. 렌더링 트리거
2. 컴포넌트 렌더링
3. DOM에 커밋

📌1단계: 렌더링 트리거
컴포넌트 렌더링이 일어나는 데에는 두 가지 이유가 있다.

컴포넌트의 초기 렌더링인 경우
컴포넌트의 state가 업데이트된 경우
✅초기 렌더링
컴포넌트가 처음으로 화면에 나타날 때, 리액트는 컴포넌트 트리를 바탕으로 가상 DOM을 생성하고, 이를 실제 DOM에 반영하여 화면에 처음으로 렌더링하는 과정.

✅State 업데이트 시 리렌더링
컴포넌트의 state가 변경될 때마다, 리액트는 해당 컴포넌트를 다시 렌더링하여 변경된 내용을 가상 DOM에 반영하고, 변경된 부분만 실제 DOM에 업데이트하는 과정.

📌2단계: React 컴포넌트 렌더링

렌더링을 트리거한 후 React는 컴포넌트를 호출하여 화면에 표시할 내용을 파악한다. “렌더링”은 React에서 컴포넌트를 호출하는 것이다.

초기 렌더링에서 React는 루트 컴포넌트를 호출한다.
이후 렌더링에서 React는 state 업데이트가 일어나 렌더링을 트리거한 컴포넌트를 호출한다.

React는 기본적으로 부모 컴포넌트가 렌더링되면, 그 안에 있는 모든 자식 컴포넌트를 재귀적으로 렌더링한다. => 일반적으로 컴포넌트가 렌더링되면 그 안에 있는 모든 컴포넌트 역시 렌더링 된다.

일반적인 렌더링 과정에서, React는 "Props가 변경되었는지 여부"는 신경쓰지 않는다. 그저 부모 컴포넌트가 렌더링되었기 때문에 자식 컴포넌트도 무조건 렌더링하는 것이다.

📌3단계: React가 DOM에 변경사항을 커밋
컴포넌트를 렌더링(호출)한 후 React는 DOM을 수정한다.

초기 렌더링의 경우 React는 appendChild() DOM API를 사용하여 생성한 모든 DOM 노드를 화면에 표시한다.
리렌더링의 경우 React는 필요한 최소한의 작업(렌더링하는 동안 계산된 것)을 적용하여 DOM이 최신 렌더링 출력과 일치하도록 한다

## snapshot으로서의 state

State 변수는 읽고 쓸 수 있는 일반 자바스크립트 변수처럼 보일 수 있다. 하지만 state는 스냅샷처럼 동작한다. state 변수를 설정하여도 이미 가지고 있는 state 변수는 변경되지 않고, 대신 리렌더링이 발동된다.

스냅샷(Snapshot)이란 "순간"을 포착한 것.

- 상태를 갱신하면 이미 있는 state 변수 자체를 변경하는 것이 아니라, 리렌더링을 유발한다.

```
console.log(count);  // 0
setCount(count + 1); // Request a re-render with 1
console.log(count);  // Still 0!
```

```
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(score + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Score: {score}</h1>
    </>
  )
}
```

위 코드에서는 +3 버튼을 눌러도 점수가 1만 증가한다.

```
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
```

이 문제는 state를 설정할 때 updater function을 전달하는 것을 통해 해결할 수 있다. setScore(score + 1)를 setScore(s => s + 1)로 대체하면 여러 개의 state 업데이트를 대기열에 추가할 수 있다.

```
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(s => s + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Score: {score}</h1>
    </>
  )
}
```
