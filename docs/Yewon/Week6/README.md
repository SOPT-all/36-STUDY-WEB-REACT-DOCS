# Week6

## Ref로 값 참조하기

컴포넌트가 일부 정보를 “기억”하고 싶지만, 해당 정보가 렌더링을 유발하지 않도록 하려면 Ref를 사용한다.

```
import { useRef } from 'react';
```

```
const ref = useRef(0);
```

useRef는 다음과 같은 객체를 반환

```
{
  current: 0 // useRef에 전달한 값
}
```

- ref.current 프로퍼티를 통해 해당 Ref의 current 값에 접근할 수 있다.

| 항목                  | **`ref`**                                                                      | **`state`**                                                                      |
| --------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| 생성 방식             | `useRef(initialValue)`는 `{ current: initialValue }` 객체를 반환함             | `useState(initialValue)`는 `[value, setValue]` 형태로 값과 설정 함수 반환        |
| 리렌더링 트리거 여부  | `ref.current` 값을 변경해도 컴포넌트는 **리렌더링되지 않음**                   | `setState`로 값을 변경하면 컴포넌트는 **리렌더링됨**                             |
| 가변성 (Mutability)   | **Mutable**: 렌더링 외부에서 `current` 값을 자유롭게 읽고 쓸 수 있음           | **Immutable**: `setState` 함수로만 변경 가능하며 직접 수정 불가                  |
| 읽기/쓰기 시점 제한   | **렌더링 중에는 `ref.current`를 읽거나 쓰지 말아야 함** (권장되지 않음)        | State는 **렌더링 중에도 읽기 가능**하지만 각 렌더링마다 독립적인 snapshot을 가짐 |
| React 관리 여부       | React는 `ref` 값 변경을 감지하거나 추적하지 않음                               | React가 값 변경을 감지하고 UI 업데이트 스케줄링                                  |
| 주요 용도             | DOM 요소 참조, 이전 값 기억, 비동기 작업 플래그 등 렌더링과 무관한 데이터 저장 | 사용자 입력 값, UI 상태 등 렌더링에 영향을 주는 데이터 관리                      |
| 불변성 요구           | 없음 – 직접 `ref.current = ...` 가능                                           | 있음 – `setValue` 함수로만 변경 가능                                             |
| 리렌더링 간 유지 여부 | 리렌더링 되어도 `ref` 객체는 동일하게 유지됨                                   | 리렌더링 시에도 상태 값은 유지되지만 새로운 값으로 업데이트됨                    |

📍UI에 영향을 주는 값은 state, 렌더링과 무관한 참조나 저장 값은 ref를 사용하는 것이 원칙

스톱워치 예시

```
import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Start
      </button>
      <button onClick={handleStop}>
        Stop
      </button>
    </>
  );
}
```

## Ref로 DOM 조작하기

✅ ref의 주요 사용 목적
| 목적 | 설명 |
| ----------- | ---------------------------- |
| DOM 요소에 포커스 | `.focus()` 메서드 호출 |
| 스크롤 제어 | `.scrollIntoView()` 사용 |
| 크기 및 위치 측정 | `.getBoundingClientRect()` 등 |
| 비동기 제어 | 타이머 ID, 외부 라이브러리 인스턴스 등 저장 |

예시1. 포커스 이동

```
import { useRef } from 'react';

function MyComponent() {
  const myRef = useRef(null);

  function handleClick() {
    myRef.current.focus();  // 또는 scrollIntoView 등
  }

  return (
    <>
      <input ref={myRef} />
      <button onClick={handleClick}>Focus Input</button>
    </>
  );
}
```

예시2. 한 요소로 스크롤 이동하기

```
import { useRef } from 'react';

export default function CatFriends() {
  const firstCatRef = useRef(null);
  const secondCatRef = useRef(null);
  const thirdCatRef = useRef(null);

  function handleScrollToFirstCat() {
    firstCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToSecondCat() {
    secondCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToThirdCat() {
    thirdCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={handleScrollToFirstCat}>
          Neo
        </button>
        <button onClick={handleScrollToSecondCat}>
          Millie
        </button>
        <button onClick={handleScrollToThirdCat}>
          Bella
        </button>
      </nav>
      <div>
        <ul>
          <li>
            <img
              src="https://placecats.com/neo/300/200"
              alt="Neo"
              ref={firstCatRef}
            />
          </li>
          <li>
            <img
              src="https://placecats.com/millie/200/200"
              alt="Millie"
              ref={secondCatRef}
            />
          </li>
          <li>
            <img
              src="https://placecats.com/bella/199/200"
              alt="Bella"
              ref={thirdCatRef}
            />
          </li>
        </ul>
      </div>
    </>
  );
}
```

<MyInput /> 같이 직접 만든 컴포넌트에 ref를 주입할 때는 null이 기본적으로 주어진다.

```
<input ref={inputRef} />

vs

import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
}

function MyForm() {
  const inputRef = useRef(null);
  return <MyInput ref={inputRef} />
}
```

## Effect로 동기화하기

✅ useEffect란?
Effect는 컴포넌트의 렌더링 결과로 발생하는 부수 효과(side effect) 를 다루기 위한 React Hook이다.

외부 시스템(예: DOM 조작, 서버 연결, 타이머, 이벤트 리스너 등)과의 동기화 시점을 제어할 수 있다.

useEffect()는 렌더링 후 커밋 단계에 실행되며, 렌더 중에는 실행되지 않는다.

✅ useEffect와 이벤트 핸들러 차이
| 항목 | 이벤트 핸들러 | useEffect |
| ------------- | ---------------- | --------------------- |
| 실행 시점 | 사용자 상호작용 시 | 컴포넌트가 **렌더링 후 자동 실행** |
| 주요 용도 | 클릭, 입력, 제출 등 트리거 | 서버 연결, 애니메이션 시작, 구독 등 |
| 렌더 중 사용 가능 여부 | 가능 | 불가 (렌더 후 실행) |

✅ 사용법

```
import { useEffect } from 'react';

useEffect(() => {
  // 렌더링 후 실행됨
});
```

✅ 의존성 배열 (Dependencies)
| 코드 | 설명 |
| ---------------------------------- | --------------------- |
| `useEffect(() => { ... });` | **모든 렌더링 후 실행됨** |
| `useEffect(() => { ... }, []);` | **최초 마운트(한 번)** 만 실행됨 |
| `useEffect(() => { ... }, [dep]);` | **dep이 변경될 때만** 실행됨 |

- 의존성 누락 시 Lint 경고 발생 – 자동으로 추론하므로 수동 생략은 금지

예시 1. DOM과 동기화 (비디오 재생 제어)

```
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]); // 의존성 명시
  return <video ref={ref} src={src} loop playsInline />;
}
```

- isPlaying prop의 값에 따라 play/pause 제어
- useRef로 DOM 접근, useEffect로 시점 제어

예시 2. 클린업 함수 사용

useEffect(() => {
const connection = createConnection();
connection.connect();
return () => {
connection.disconnect();
};
}, []);

- 컴포넌트 언마운트 시 또는 Effect 재실행 전 연결 해제됨
- 주로 구독 해제, 타이머 정리, 이벤트 리스너 제거 등에 사용

✅ 개발 환경에서 두 번 실행되는 이유

- React의 Strict Mode는 개발 중 Effect가 제대로 정리되는지 확인하기 위해 마운트 → 언마운트 → 재마운트 과정을 거침
- 정상 동작이며, 버그가 드러나도록 돕는 디버깅 메커니즘

✅ 잘못된 useEffect 사용 예시

```
useEffect(() => {
  setCount(count + 1); // ❌ 무한 루프 발생
});
```

- Effect는 상태를 변경하고, 상태 변경은 렌더링을 유발하며, 다시 Effect가 실행됨 → 무한 루프

## Effect가 필요하지 않은 경우

✅ Effect를 쓰지 않아도 되는 일반적인 상황
| 상황 | 올바른 해결 방법 |
| --------------------------- | -------------------------------------------------------------- |
| **렌더링 중 데이터 계산** | props나 state에서 파생된 값은 **렌더링 중 계산**<br>→ 불필요한 state + Effect 제거 |
| **값비싼 계산을 캐시** | `useMemo()` 사용 |
| **state 초기화 (prop 변경 시)** | 컴포넌트에 `key={prop}` 전달 → 자동 재마운트로 state 초기화 |
| **state 일부 조정 (prop 변화 시)** | 렌더링 중 조건 확인하여 직접 `setState()` 호출 (조건부로) |
| **버튼 클릭 등의 사용자 이벤트 처리** | 해당 로직은 **이벤트 핸들러에 위치**해야 함 |
| **이벤트 간 공통 로직 공유** | 공통 로직을 함수로 분리하여 핸들러에서 직접 호출 |
| **부모 컴포넌트에 데이터 알리기** | Effect 없이 이벤트 핸들러에서 직접 `onChange()` 호출 |
| **자식이 데이터를 부모에게 전달** | 부모에서 데이터를 가져오고 **props로 전달** |
| **앱 초기화 로직 (한 번만 실행)** | `useEffect` 내부에서 `didInit` 플래그 사용<br>또는 모듈 최상위에서 실행 |
| **서드파티 API 구독** | `useSyncExternalStore()` 사용 권장 |
| **데이터 가져오기** | 경쟁 조건 방지를 위한 **클린업 함수 필요**, 또는 **사용자 정의 Hook**으로 분리 |

❌ 잘못된 Effect 사용 예시
| 예시 | 문제 |
| ----------------------------------------- | ------------------------------------- |
| `useEffect`로 `fullName` 계산 | 렌더링 → Effect 실행 → 다시 렌더링 → **비효율적** |
| `useEffect`로 POST 요청 전송 | **이벤트**에 의한 요청이어야 하므로 이벤트 핸들러로 이동해야 함 |
| `useEffect`로 state 초기화 (`setComment('')`) | 첫 렌더는 이전 값으로 → **더블 렌더링 발생** |
| `useEffect`로 자식 → 부모 데이터 전달 | 데이터 흐름이 **예측 불가능**, 부모에서 가져와야 함 |

판단 기준 요약

| 질문                                        | Effect를 써야 할까?               |
| ------------------------------------------- | --------------------------------- |
| **렌더링 중 계산 가능한가?**                | ❌ 필요 없음 (렌더 중 계산)       |
| **특정 상호작용에 의해 발생하나?**          | ❌ 필요 없음 (이벤트 핸들러 사용) |
| **컴포넌트가 표시되는 것 자체로 발생하나?** | ✅ Effect 사용                    |
| **외부 시스템과 동기화인가?**               | ✅ Effect 사용                    |
| **다른 컴포넌트의 state에 영향 주는가?**    | ❌ state 끌어올리기 고려          |
