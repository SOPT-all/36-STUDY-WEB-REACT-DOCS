# [Week3] 상호작용성 더하기

## ✅ 이벤트 핸들러 함수

- 컴포넌트 내부에서 정의
- handle000 네이밍 사용
- props로 넘길 때는 on000 네이밍 사용
- e.stopPropagation() : 이벤트 핸들러가 상위 태그에서 실행되지 않도록 함

## 🫧 이벤트 전파

1. 캡처링 단계 (Capturing Phase)
   - 이벤트가 **최상위(Window)** 에서 시작하여 타겟 요소로 내려감.
   - addEventListener에서 `{ capture: true }` 옵션을 주면 이 단계에서 이벤트 리스너가 실행됨.
   - 트리클링(trickling) 이라고도 불림.
2. 타겟 단계 (Target Phase)
   - 이벤트가 실제로 발생한 요소에 도달
   - 이 단계에서는 캡처링과 버블링 리스너 모두 실행될 수 있음.
3. 버블링 단계 (Bubbling Phase)
   - 이벤트가 타겟 요소에서 시작해 부모 요소를 거쳐 위로 올라감.
   - addEventListener에서 아무 옵션을 주지 않거나 `{ capture: false }` 인 경우, 이 단계에서 리스너가 실행됨.

## 🎯 e.target vs e.currentTarget

### e.target

이벤트가 실제 발생하는 DOM 요소를 가리킴. (가장 안쪽에서 이벤트를 발생시킨 요소)

```jsx
function Example() {
  const handleClick = (e: React.MouseEvent) => {
    console.log("target:", e.target);
  };

  return (
    <div onClick={handleClick}>
      <button>버튼</button>
    </div>
  );
}
```

### e.currentTarget

이벤트 핸들러가 바인딩된 요소를 가리킴. (핸들러를 실행 중인 DOM 요소)

```jsx
function Example() {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log("currentTarget:", e.currentTarget);
  };

  return (
    <div onClick={handleClick}>
      <button>버튼</button>
    </div>
  );
}
```

## 🌀 지역 변수 vs. state

컴포넌트 내부의 지역 변수는 렌더링이 일어날 때마다 초기화되고, 지역 변수를 변경해도 리렌더링이 발생하지 않음.

렌더링 간에도 값을 유지하고, 값의 변경이 컴포넌트 업데이트를 유발해야 한다면 useState를 사용해야 함.

## 🥸 useState가 값을 기억하는 방법

useState는 리렌더링이 발생해도 이전 값을 유지하고, 상태가 바뀌면 다시 컴포넌트를 렌더링하도록 연결되어 있어야 함.

컴포넌트가 렌더링될 때, 리액트는 해당 컴포넌트에 대한 정보를 담는 Fiber 객체를 생성하거나 업데이트함. Fiber는 렌더링 중에 호출된 훅(useState, useEffect 등)의 실행 순서에 따라 상태 값들을 내부적으로 배열 형태로 저장함.

useState는 순서를 기준으로 상태를 매칭하기 때문에 조건문, 반복문, 중첩 함수 등에서 호출하게 되면 훅의 순서가 바뀔 수 있음. 그렇기 때문에 가장 최상단에서 hook을 호출해야 함.

## 🌀 리액트 렌더링 과정

### 1. 트리거 (Trigger)

- 초기 렌더링: 컴포넌트가 처음 화면에 마운트될 때
- 상태 업데이트: useState, useReducer 등을 통해 state가 변경되었을 때
- props 변경: 부모로부터 전달된 props 값이 변경되었을 때
- forceUpdate나 context 변경 등 기타 상황

### 2. 렌더링 (Render)

트리거가 감지되면 React는 해당 컴포넌트 렌더링 로직을 실행함.

클래스형 컴포넌트는 해당 컴포넌트의 render() 실행하고, 함수형 컴포넌트는 컴포넌트 함수 자체를 호출하여 새로운 Virtual DOM 트리를 생성함.

Virtual DOM은 실제 브라우저 DOM 이 아니라 메모리에서만 존재하는 객체 구조이고, JSX -> JS 변환 작업과 props & state를 기반으로 어떤 노드가 그려질지 계산하는 과정을 통해 Virtual DOM을 생성합니다.

### 3. 커밋 (Commit)

초기렌더링인 경우에는 브라우저의 DOM에 appendChild 등을 사용해 요소를 추가함.

리렌더링인 경우에는 변경된 부분만 찾아서 최소한의 DOM 조작으로 적용함.

### 4. 브라우저 페인트

브라우저는 변경된 DOM을 기반으로 실제 화면에 렌더링을 수행함.

브라우저 레이아웃, 페인팅 등의 렌더링 작업이 발생하고, 사용자에게 UI 를 업데이트 함.

## 📸 스냅샷

스냅샷이란 렌더링 직전의 상태나 DOM 상태를 기억해두는 것을 의미함.

### 상태 스냅샷

컴포넌트가 리렌더링될 때마다 이전 Virtual DOM 트리의 스냅샷을 내부에 보관하고 있음. 이 값과 다음 렌더링 결과를 비교하여 바뀐 부분만 DOM에 적용함.

### DOM 스냅샷

컴포넌트가 업데이트되기 직전(실제 DOM이 변경되기 직전)의 상태를 기록해둘 필요가 있는 경우에 React는 getSnapshotBeforeUpdate 나 useLayoutEffect를 활용함.

스냅샷은 DOM이 브라우저에 반영되기 바로 직전 시점의 실제 상태를 의미하고 다음 렌더링 후에도 특정 위치나 값을 복구할 수 있음.
