# Ref로 값 참조하기

> 컴포넌트가 일부 정보를 기억하고 싶지만, 해당 정보가 렌더링 유발을 원치 않을 때 `ref`를 사용한다.
> 

## **컴포넌트에 ref를 추가하기**

```jsx
// 리액트에서 가져오기
import { useRef } from 'react';

// 컴포넌트 내에서 useRef 훅 호출
// 참조할 초기값을 유일한 인자로 전달
const ref = useRef(0);
```

useRef는 다음과 같은 자바스크립트 객체를 반환

→ current값을 변조하면 즉시 변경됨

```jsx
{
  current: 0 // useRef에 전달한 값
}
```

`ref.current` 프로퍼티를 통해 해당 ref의 current 값에 접근할 수 있고, 의도적으로 변경할 수 있으므로 읽고 쓸 수 있다.

→ React의 단방향 데이터 흐름에서 탈출구가 되는 것

```jsx
function handleClick() {
  ref.current = ref.current + 1;
  alert('You clicked ' + ref.current + ' times!');
}
```

## ref와 state 차이

렌더링 정보에 사용할 때 해당 정보를 `state`로 유지

이벤트 핸들러에게만 필요한 정보이며 변경이 일어날 때 리렌덩이 필요하지 않으면 `ref`사용

> ref는 자주 필요하지 않은 “탈출구”
> 

| refs | state |
| --- | --- |
| `useRef(initialValue)` 는 `{ current: initialValue }` 을 반환 | `useState(initialValue)` 은 state 변수의 현재 값과 setter 함수 `[value, setValue]` 를 반환 |
| state를 바꿔도 리렌더 되지 않음 | state를 바꾸면 리렌더 |
| Mutable-렌더링 프로세스 외부에서 `current` 값을 수정 및 업데이트 가능 | ”Immutable”—state 를 수정하기 위해서는 state 설정 함수를 반드시 사용하여 리렌더 대기열에 넣어 함 |
| 렌더링 중에는 `current` 값을 읽거나 쓰면 안 됨. | 언제든지 state를 읽을 수 있으나 각 렌더마다 변경되지 않는 자체적인 state의 snapshot이 있음 |

## refs를 사용할 시기

- 일반적으로 컴포넌트가 React를 “외부”와 외부 API—컴포넌트의 형태에 영향을 미치지 않는 브라우저 API 와 통신해야 할 때
- timeout IDs를 저장
- DOM 엘리먼트 저장 및 조작
- JSX를 계산하는 데 필요하지 않은 다른 객체 저장
- 컴포넌트가 일부 값을 저장해야 하지만 렌더링 로직에 영향을 미치지 않는 경우

## refs의 좋은 예시

- 탈출구로 간주하기
    - 외부 시스템이나 브라우저 API로 작업할 때 유용
    - 애플리케이션 로직과 데이터 흐름의 상당 부분이 refs에 의존하지 않도록 하기
- 렌더링 중에  **`ref.current`** 를 읽거나 쓰지 않기
    - 렌더링 중 일부 정보가 필요한 경우 state 사용하기
    - **`ref.current`** 가 언제 변하는지 React는 모르기 때문에 컴포넌트 동작 예측 어려움
- mutation 방지 걱정 필요 없음
    - 변형하는 객체가 렌더링에 사용되지 않는 한 React는 ref나 해당 콘텐츠를 어떻게 처리하든 신경쓰지 않음

# Ref로 DOM 조작하기

React는 렌더링 결과에 맞춰 DOM 변경을 자동으로 처리하기 때문에 DOM을 자주 조작할 필요가 없지만 가끔 DOM 요소에 접근해야할 때가 있는데, ref를 사용한다.

- 특정 노드에 포커스 옮기기
- 스크롤 위치 이동
- 위치와 크기 측정 등등

## ref로 노트 가져오기

```jsx
// React가 관리하는 DOM 노드에 접근하기 위해 useRef Hook을 가져옴
import { useRef } from 'react';

// 컴포넌트 안에서 ref를 선언하기 위해 가져온 hook 사용
const myRef = useRef(null);

// ref를 DOM 노드를 가져와야하는 JSX tag 에 ref 어트리뷰트로 전달
<div ref={myRef}>
```

React가 이 `<div>`에 대한 DOM 노드를 생성할 때, React는 이 노드에 대한 참조를 `myRef.current`에 넣는다.

→ 이 DOM 노드를 이벤트 핸들러에서 접근하거나 노드에 정의된 내장 브라우저 API를 사용할 수 있다.

```jsx
myRef.current.scrollIntoView();
```

<details>
<summary><strong>ref 콜백 (콜백 ref) 사용법 & 문제 해결</strong></summary>

### ❗️ Hook 사용 규칙  
- React의 hook(예: `useRef`)은 컴포넌트 최상단에서만 호출해야 함  
  (반복문, 조건문, map 내부에서는 **호출 불가**)

### ❓ 문제  
- **목록의 각 아이템마다 ref가 필요한 경우**
- **몇 개의 ref가 필요한지 미리 알 수 없는 경우**  
  → 각 항목에 useRef를 개별로 만들 수 없음

### 💡 해결 방법

1. **부모 요소에 단일 ref 부여 후, querySelectorAll 등으로 자식 DOM 찾기**
2. **ref 어트리뷰트에 콜백 함수(콜백 ref) 전달**  
   - React는 해당 DOM 노드를 ref 콜백에 넘겨줌
   - ref가 해제될 때는 `null`을 전달
   - 개발자가 직접 Map 등 컬렉션으로 노드들을 관리할 수 있음

```jsx
<li
  key={cat.id}
  ref={node => {
    const map = getMap(); // Map 객체 반환
    if (node) {
      // 노드를 Map에 추가
      map.set(cat, node);
    } else {
      // 노드를 Map에서 제거
      map.delete(cat);
    }
  }}
>
  {/* ... */}
</li>


## 다른 컴포넌트의 DOM 노드 접근하기

### ref의 기본 동작

- 내장 DOM 요소에 ref를 전달하면 `ref.current`에 해당 DOM 노드가 할당된다.
- 직접 만든 컴포넌트에 ref를 바로 전달하면 기본적으로 `ref.current`는 null이 된다.

### forwardRef를 이용한 ref 전달

- 컴포넌트가 자신이 가진 DOM 노드를 상위 컴포넌트에 노출하고 싶을 때 `forwardRef` API를 사용한다.
- `forwardRef`로 선언하면 ref를 받아서 내부 DOM 요소에 연결할 수 있다.

→  주로 입력창, 버튼 등 저수준 컴포넌트에서 사용

## **React가 ref를 부여할 때**

### 렌더링

- React는 화면에 무엇을 그려야 하는지 알아내도록 컴포넌트를 호출
- 일반적으로 렌더링 중 ref 접근은 X (너무 이름)
    - 첫 렌더링에서 DOM 노드는 아직 생성 전이라 `ref.current`는 null
    - 갱신에 의한 렌더링에서 DOM 노드는 아직 업데이트 전

### 커밋

- React는 변경사항을 DOM에 적용
- ref의 값은 커밋 단계에서 할당
    - 첫 렌더링 시 ref.current는 null이며, DOM 노드 생성 후에야 실제 노드가 할당

## **ref 사용 시 주의점(모범 사례)**

- ref는 React의 일반적 데이터 흐름(상태, props)로 할 수 없는 "예외적" 상황(포커스/스크롤 관리 등)에서만 사용한다.
- ref로 직접 DOM을 변경(노드 삭제 등)하는 것은 React의 동작과 충돌할 수 있으므로 **직접적인 DOM 조작은 지양**해야 한다.

# Effect로 동기화하기

외부 시스템과 동기화가 필요할 때 effect를 사용한다.

### 컴포넌트 내부 로직

1. **렌더링 코드**를 주관하는 로직은 컴포넌트 최상단 위치
    - props와 state를 적절히 변형해 JSX 반환
    - 순수성
2. **이벤트 핸들러**는 단순한 계산 용도가 아닌 무언가를 하는 컴포넌트 내부의 중첩 함수 
    - 특정 사용자 작업으로 인해 발생하는 사이트 이펙트 포함

### Effect란?

렌더링 자체에 의해 발생하는 부수 효과를 특정하는 것

- 특정 이벤트가 아닌 렌더링에 의해 직접 발생
- 커밋이 끝난 후 화면 업데이트가 이루어진 다음 실행
    
    → 외부 동기화의 굳 타이밍 
    

⚠️ **무작정 Effect 추가하지 말기**

React 코드를 벗어난 특정 외부 시스템과 동기화하기 위해 사용하는 것이지 단순 다른 상태에 기반해 조정되는 경우 필요하지 않을 수 있다. 

ex)

이벤트: 채팅에서 메시지를 보내는 것 (사용자가 특정 버튼 클릭함에 따라 직접적으로 발생)

Effect: 서버 연결 설정 (어떠한 상호작용과도 상관없이 발생해야함

## Effect 작성 방법

### 1. **Effect 선언하기**

- 컴포넌트 내부에서 `useEffect`를 선언하고, 부수효과(외부 시스템 연동 등)를 정의한다.
    - `useEffect`는 화면에 렌더링이 반영될 때까지 코드 실행을 “지연”
- Effect는 기본적으로 **모든 렌더링 후 실행**된다

```jsx
useEffect(() => {
  // 모든 렌더링 후 실행됨
  console.log('렌더링 후 실행');
});
```

### 2. **Effect 의존성 지정하기**

- 두 번째 인자로 **의존성 배열**을 넘겨주면 해당 값이 변경될 때만 Effect가 실행된다.
- 의존성 없는 경우: `[]` (마운트 시 1회만 실행)

```jsx
useEffect(() => {
  // 모든 렌더링 후에 실행됩니다
});

useEffect(() => {
  // 마운트될 때만 실행됩니다 (컴포넌트가 나타날 때)
}, []);

useEffect(() => {
 // 마운트될 때 실행되며, *또한* 렌더링 이후에 a 또는 b 중 하나라도 변경된 경우에도 실행됩니다
}, [a, b]);
```

📌 React는 지정한 모든 종속성이 이전 렌더링의 그것과 정확히 동일한 값을 가진 경우에만 Effect를 다시 실행하지 않는다.

📌 의존성을 선택할 수 없다. 

 의존성 배열에 지정한 종속성이 Effect 내부의 코드를 기반으로 React가 기대하는 것과 일치하지 않으면 린트 에러가 발생

### 3. **필요하다면 클린업 함수 추가**

- Effect에서 리소스 해제, 구독 해지 등 정리(cleanup)가 필요하다면 함수 내에서 **클**린업 함수를 반환한다.
- 컴포넌트가 사라지거나(언마운트), Effect가 다시 실행되기 전에 클린업 함수가 호출된다.

```jsx
useEffect(() => {
  const connection = createConnection();
  connection.connect();
  return () => {
    connection.disconnect(); // 언마운트 시 연결 해제
  };
}, []);
```

## **Effect가 두 번 실행되는 경우**

- **React 외부 위젯/라이브러리 컨트롤**
    - 클린업 필요 없는 단순 setter(setZoomLevel 등)는 두 번 호출돼도 무방함
    - 연속 실행 안 되는 경우(예: showModal)는 클린업에서 reset(close) 필요
- **이벤트 구독/등록**
    - 구독할 때는 `addEventListener`, 클린업 함수에서 `removeEventListener`
    - 항상 하나만 등록됨을 보장
- **애니메이션 트리거**
    - Effect에서 애니메이션 시작, 클린업에서 원래 상태로 복귀
- **데이터 Fetch**
    - fetch 결과가 불필요하게 적용되는 걸 막기 위해 ignore 플래그 활용
    
    ```jsx
    useEffect(() => {
      let ignore = false;
      fetchData().then(data => { if (!ignore) setData(data); });
      return () => { ignore = true; };
    }, [id]);
    ```
    

### Effect 사용 X 케이스

- 단 한 번만(앱 전체에서) 실행되어야 할 초기화는 **컴포넌트 밖**에서 실행
- 버튼 클릭, 특정 사용자 액션 등에서만 동작해야 할 로직(예: 결제)은 Effect 대신 **이벤트 핸들러에서 실행**

### Effect에서 fetch의 단점

- **서버에서 실행 안 됨** → 서버 사이드 렌더링(SSR) 불가, 초기 HTML에 데이터 없음
- **네트워크 폭포** → 부모-자식 컴포넌트 순차 fetch, 느림
- **캐싱 어려움** → 언마운트 후 재마운트 시 재요청, 미리 로드 불가
- **코드 복잡** → 경쟁 상태·취소 등 관리 어려움

✅ **대안**

- **프레임워크 내장 데이터 패칭 기능** 사용
    
    (예: Next.js, Remix, 최신 React Router 등)
    
- **클라이언트 캐싱 라이브러리** 활용
    - React Query, SWR, React Router 6.4+ 등
    - 요청 중복 제거, 캐싱, 네트워크 병렬화, 자동 갱신 등 제공


# Effect가 필요하지 않은 경우

| 패턴/상황 | ❌ 잘못된(불필요한) 방식 | ✅ 더 좋은(효율적) 방식 |
| --- | --- | --- |
| **state/props로부터 파생 데이터 계산** | Effect에서 파생 state 계산 및 setState | 렌더링 중 파생값 계산 |
| **비싼 계산** | Effect+state로 결과 저장 | `useMemo`로 메모이제이션 |
| **prop 변경에 따라 state 초기화** | Effect로 state 초기화 | key 변경하여 컴포넌트 재생성 |
| **prop 변경에 따라 state 일부만 조정** | Effect로 부분 state 조정 | 렌더 중 비교 후 필요시 setState |
| **이벤트 핸들러 간 로직 공유** | Effect에서 부수효과 호출 | 핸들러/공용함수로 로직 분리 |
| **POST 등 요청 전송** | Effect에서 요청 | 이벤트 핸들러에서 요청 |
| **state 연쇄(체인) 갱신** | 여러 Effect로 setState 체인 | 이벤트 핸들러 내에서 한번에 모든 state 조정 |
| **앱 초기화** | Effect에서 앱 전역 초기화(로컬스토리지 등) | 모듈/함수 레벨에서 1회만 실행 |
| **부모에게 state/데이터 전달** | Effect에서 부모 state set | 데이터 fetch, state는 부모가 담당, 자식에 전달 |
| **외부 저장소(브라우저 API 등) 구독** | Effect로 직접 구독 | `useSyncExternalStore` 등 내장 Hook 사용 |
| **데이터 가져오기(fetch)** | Effect에서 fetch 후 setState | 직접 fetch하되 경쟁 상태 등 반드시 처리, or 커스텀 Hook, or 프레임워크 내장 기능 사용 |