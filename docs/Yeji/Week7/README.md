# [Week7] 탈출구

## useEffect 콜스택, 이벤트 루프, 태스크 큐

```tsx
function App() {
  // 비동기적으로 태스크 큐에 등록
  useEffect(() => {
    console.log("✅ useEffect 실행");
  }, []);

  console.log("🖥 컴포넌트 렌더링 중"); // 동기적으로 바로 실행

  return <div>Hello</div>;
}
```

### 실행 순서

1. 컴포넌트 렌더링 시작

   - 콜스택: App() 함수 실행
   - 콘솔 출력: "🖥 컴포넌트 렌더링 중"

2. JSX -> DOM 업데이트

   - 콜스택: React 내부 작업
   - DOM에 `<div>Hello</div>` 생성 및 렌더링

3. 브라우저 Paint 작업

   - 콜스택: 없음 (렌더링 완료 후 브라우저의 페인트 단계)
   - UI 표시

4. useEffect 콜백 실행
   - 콜스택: useEffect 콜백이 태스크 큐에서 실행됨
   - useEffect 실행 출력

> useEffect는 콜스택이 비워지고 (렌더링과 브라우저 페인팅이 끝난 다음) 실행
>
> 브라우저가 화면에 내용을 그린(paint) 이후에, React의 비동기 작업 흐름에 따라 태스크 큐에서 실행

## useEffect 내부 값과 종속성 관리

useEffect는 렌더링 이후에 동기화를 실행하는 반응형 코드블록임. (== effect 안에서 읽은 값이 바뀌면 해당 effect는 다시 실행)
하지만, useEffect 안에서 직접 정의된 상수나 객체는 반응형 값이 아니기 때문에 값이 바뀌어도 다시 실행되지 않음.

렌더링 중 생성한 **객체/함수는 새로운 참조값**이므로 종속성으로 넣으면 매번 실행됩니다.

effect 내부에서 여러 props/state를 참조하는 경우에 하나라도 바뀌면 불필요하게 재실행될 수 있기 때문에 각 기능별로 useEffect를 쪼개는 것이 더 좋음.

## 이벤트 핸들러 / effect

### effect 이벤트

effect 내부에서 정의되고 사용되며 외부로 전달되지 않는 비반응형 함수를 의미함.
렌더링 중에 만들어진 일반 함수들과 달리, 외부에 노출되지 않고 effect 내부에서만 사용되므로 재생성될 필요 없이 항상 최신 값을 안정적으로 참조할 수 있음.

=> 이벤트 핸들러처럼 보이지만 state나 props가 바뀌더라도 매번 새로 만들지 않아도 됨.

> **반응형 / 비반응형**
>
> - 반응형 : 렌더링 중에 정의된 함수나 객체 (props나 state가 바뀌면 함수나 객체도 새로 생성됨)
> - 비반응형 : useEffect 내부에서 정의하는 함수나 객체 (외부에 노출되지 않으면 재생성되지 않고, 최신 값은 내부에서 참조 가능)

```tsx
const handleMessage = () => {
  console.log(count); // 이 count는 오래된 값일 수 있음
};

useEffect(() => {
  someAPI.onMessage(handleMessage);
  return () => someAPI.offMessage(handleMessage);
}, []); // deps에 count 없음 → stale 값 참조 가능
```

위 코드는 count가 바뀌어도 effect가 재실행되지 않기 때문에 handleMessage() 내부의 count는 오래된 값을 참조할 수 있음. (stale closure)

**해결 방법 1: effect 내부에서 정의하여 최신 값 참조**

```tsx
useEffect(() => {
  function handleMessage() {
    console.log(count); // 내부에서 정의
  }

  someAPI.onMessage(handleMessage);
  return () => someAPI.offMessage(handleMessage);
}, [count]);
```

**해결 방법 2: useRef로 최신 값 유지**

```tsx
const countRef = useRef(count); // ref로 값 저장

useEffect(() => {
  countRef.current = count;
}, [count]);

useEffect(() => {
  function handleMessage() {
    console.log(countRef.current);
  }

  someAPI.onMessage(handleMessage);
  return () => someAPI.offMessage(handleMessage);
}, []); // effect는 한 번만 실행
```

### `useEffectEvent`

이벤트 로직은 effect 내부에섬나 정의하고 외부로 전달하지 않음.

```tsx
// 최신 count를 내부에서 참조하고 외부에 handler 전달 X
useEffect(() => {
  function handleMessage() {
    console.log(count); // 이 count는 최신 값
  }
  someAPI.onMessage(handleMessage);
  return () => someAPI.offMessage(handleMessage);
}, [count]); // 또는 최신 값을 ref로 관리
```

## 커스텀 훅

useState, useEffect 등 내장 hook을 조합하여 만드는 재사용 가능한 함수임.

컴포넌트 간 로직 공유의 목적으로 많이 사용함. (이벤트 리스너, 서버 데이터 패칭, 애니메이션 제어, 외부 시스템 연결 등)

### 특징

1. 이름 : use0000
2. 위치 : 컴포넌트 최상단이나 다른 훅 안에서만 호출 가능함
3. 기능 : state 자체를 공유하지 않고 state를 만드는 로직만 공유

### 커스텀 훅 특징

#### 1. 상태 로직은 공유하지만 상태 값은 공유하지 않음

- 각 컴포넌트는 독립적인 count를 가짐

```tsx
function useCounter() {
  const [count, setCount] = useState(0);
  return { count, increment: () => setCount((c) => c + 1) };
}

function CounterA() {
  const { count, increment } = useCounter();
  return <button onClick={increment}>A: {count}</button>;
}

function CounterB() {
  const { count, increment } = useCounter();
  return <button onClick={increment}>B: {count}</button>;
}
```

#### 2. 커스텀 훅은 훅을 호출하는 순간부터 독립적으로 작동함

- 상태는 독립적이지만 로직은 재사용함

```tsx
function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  const onChange = (e) => setValue(e.target.value);

  return { value, onChange };
}
```

```tsx
function Form() {
  const firstName = useFormInput("Yeji");
  const lastName = useFormInput("Kim");

  return (
    <>
      <input {...firstName} />
      <input {...lastName} />
    </>
  );
}
```

#### 3. 커스텀 훅 안에서 이벤트 핸들러를 넘기고 싶은 경우

- hook에서 useEffectEvent를 감싸서 안정적으로 해결 가능

```tsx
function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  useEffect(() => {
    const conn = createConnection({ serverUrl, roomId });
    conn.on("message", onReceiveMessage);
    conn.connect();

    return () => conn.disconnect();
  }, [serverUrl, roomId, onReceiveMessage]); // 함수는 매 렌더링마다 새로 생성되므로 재연결됨
}
```

```tsx
import { useEffectEvent } from "react";

function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  // 항상 동일한 참조값을 가지지만, 내부에서 가장 최신의 onReceiveMessage를 실행
  const handleMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const conn = createConnection({ serverUrl, roomId });
    conn.on("message", handleMessage);
    conn.connect();

    return () => conn.disconnect();
  }, [serverUrl, roomId]);
}
```
