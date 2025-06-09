# React Effect의 생명주기

**사이클**
| 컴포넌트   | effect |
| ---------- | --------------------------------------------------------------------------------------- |
| 마운트(화면에 추가),<br>업데이트(새로운 state나 props 수신),<br>마운트 해제(화면에서 제거)     | 동기화 시작, 중지                                                                        |

- props와 state에 의존하는 effect의 경우 해당 사이클이 여러 번 발생할 수 있음
- React는 effect의 의존성을 위해 린터 규칙 제공
    
    → effect가 최신 props와 state에 동기화
    

---

## **effect의 생명주기**

effect는 외부 시스템을 현재 props 및 state와 동기화

- 컴포넌트가 마운트된 상태에서 동기화를 여러번 시작하고 중지할 수도 있다.

```jsx
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
	  // 동기화 시작
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
	    // 동기화 중지 (cleanup 함수)
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

📌 일부 effects는 cleanup 함수를 반환하지 않음 (React는 빈 cleanup 함수를 반환한 것처럼 동작)

<br />

<details> <summary><strong>동기화가 두 번 이상 수행되어야 하는 이유</strong></summary>
  <br />
	1. general를 roomId로 선택했을 때 UI가 표시되면 effect를 실행하여 동기화 시작 → general 방에 연결 <br />
  <br />
2. roomId를 travel로 변경했을 때 UI 업데이트가 되어도 effect는 여전히 지난 general에 연결됨
    
    ⇒ `roomId` prop이 변경되었기 때문에 그때 effect가 수행한 작업이 더 이상 UI와 일치하지 않음
    
  <br />
  <br />

❓ **무엇을 해야 할까**

1. 이전 roomId와의 동기화를 중지 (`"general"` 방에서 연결 끊기)
2. 새 roomId와 동기화 시작(`"travel"` 방에 연결)

</details>
    
    <br />

## **React가 effect를 재동기화하는 방법**

- effect가 사용하는 **의존성(예: roomId)** 값이 변경될 때, React는 먼저 기존 effect의 cleanup 함수를 호출해 기존 동기화를 정리
- 그 후, effect 함수가 다시 실행되어 새로운 값에 맞게 동기화가 시작됨
- 예시:
    1. roomId가 "general" → effect로 연결
    2. roomId가 "travel"로 변경 → cleanup 실행(기존 연결 해제) → effect 다시 실행(새 연결)
    3. 컴포넌트 언마운트 시 마지막 cleanup
    
    <br />

## **effect의 관점에서 생각하기**

- 컴포넌트 라이프사이클(마운트/업데이트/언마운트)처럼 “시점”(콜백, 생명주기 이벤트)에 집착 X
- 항상 한 번에 하나의 시작 ~ cleanup으로 동기화 종료 사이클에 집중
    
    ⇒ effect는 항상 “지금 필요한 동기화”에만 집중하도록 설계
    
- 필요한 횟수만큼 effect를 시작하고 중지할 수 있는 탄력성을 확보가 필요
<br />

### **React가 effect를 다시 동기화될 수 있는지 확인하는 방법**

- 개발 모드에서 React는 effect가 cleanup/재시작이 잘 되는지 일부러 마운트-언마운트 과정을 한 번 더 수행함.
- 이는 버그 예방을 위해서며, 배포 환경에서는 한 번만 실행됨.

<br />

## **React가 effect를 다시 동기화해야 한다는 것을 인식하는 방법**

- 컴포넌트가 리렌더링될 때마다 의존성 배열을 확인하고 배열의 값이 하나라도 바뀌면 React는 effect를 다시 동기화함.
    - Object.is(같은 값인지 여부 확인)로 비교
    - 의존성이 바뀌지 않으면 effect는 그대로 유지

```jsx
function ChatRoom({ roomId }) { // roomId prop은 시간이 지남에 따라 변경될 수 있다.
  // roomId를 읽는다
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);     connection.connect();
    return () => {
      connection.disconnect();
    };

  }, [roomId]); // React에 이 effect가 roomId에 "의존"한다고 알려준다
    // ...
```

<br />

## **각 effect는 별도의 동기화 프로세스를 나타낸다**


- 하나의 effect는 하나의 동기화 과정만 담당해야 함 (ex. 연결, 분석 로그 각각 별도 effect)
- 관련 없는 여러 동기화 작업을 하나의 effect에 섞으면 의도치 않은 중복 실행 등 버그 발생 위험

```jsx
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
  }, [roomId]);

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    // ...
  }, [roomId]);
  // ...
}
```

<br />

## **반응형 값에 “반응”하는 effect**

- effect에서 읽는 값이 state, props, useContext, 렌더링 중 계산된 값 등이면 반응형 값
    
    → 반응형 값은 **종속성 배열에 포함**
    
    (리렌더링 시 변경될 수 있으므로)
    
    ✅ 컴포넌트 내부의 모든 값은 반응형 
    
- 컴포넌트 외부에 선언된 상수는 변경되지 않으니 종속성에서 제외해도 된다.
    
    ```jsx
    const serverUrl = 'https://localhost:1234';
    
    useEffect(() => {
        const connection = createConnection(serverUrl, roomId);
     ...
    ```
    

<details> <summary><strong>빈 종속성이 있는 effect의 의미</strong></summary>
effect의 종속성 배열이 <code>[]</code>이면 <br>
<strong>컴포넌트가 마운트/언마운트될 때만 effect가 동작</strong>.

effect 내부에서 <strong>반응형 값을 사용하지 않는 경우</strong>에만 사용해야 함.

</details>


<br />

## **전역 변수/변경 가능한 값(ref 등)은 종속성이 아님**

- 렌더링 중에 바뀌지 않는 값(컴포넌트 외부의 상수)은 종속성에서 제외 가능.
- **location.pathname**처럼 React 바깥에서 변경되는 값은 종속성이 될 수 없으며, 이런 값은 `useSyncExternalStore` 를 사용해야 함
- ref의 `.current` 값도 종속성이 될 수 없음 (바꿔도 다시 렝더링이 트리거되지 않음).

<br />

### **React는 모든 반응형 값을 종속성으로 지정했는지 확인한다.**

- 린트(ESLint 플러그인)가 자동으로 effect 내부에서 읽은 반응형 값이 종속성에 포함되어 있는지 체크.
- 빼먹으면 린트 에러 발생: 반응형 값을 빼면 버그로 이어짐.

```jsx
Lint Error
11:6 - React Hook useEffect has missing dependencies: 'roomId' and 'serverUrl'. Either include them or remove the dependency array.
```

<br />

## **다시 동기화하지 않으려는 경우**

종속성 배열에 값을 넣지 않고도 effect가 재실행되지 않게 하려면, effect 내부에서 읽는 값이 **절대 변하지 않는 값**임을 React(및 린트)에 증명해야 한다. 

→ 즉, 반응형(state, props 등) 값이 아니라 상수여야 함

### Sol 1. 컴포넌트 외부에 상수로 선언

```jsx
const serverUrl = 'https://localhost:1234'; 
const roomId = 'general'; 

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ 선언된 모든 종속성
  // ...
}
```

### Sol 2. effect 내부에 상수로 선언

```jsx
function ChatRoom() {
  useEffect(() => {
    const serverUrl = 'https://localhost:1234';
    const roomId = 'general'; 
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ 선언된 모든 종속성
  // ...
}
```

### 📌 알아두기

- effect는 반응형 코드 블록
    - 내부에서 읽은 값 변경 시 다시 동기화
    - 동기화가 필요할 때 마다 실행 (↔ 상호작용당 1번만 실행되는 이벤트 핸들러)
- 종속성 선택 불가
    - effect에서 읽은 모든 반응형 값이 종속성에 포함하도록 린트가 강제
    - 때때로 이는 무한 루프나 너무 자주 effect가 동기화되는 문제 야기 → 린트 억제하여 해결하지 말 것!!
    
    ✅ **해결 방법**
    
    1. effect가 독립적인 동기화 프로세스를 나타내는지 확인
        
        → 여러 개의 독립적인 것을 동기화하면 분리하자
        
    2. 객체/함수를 종속성에 직접 넣지 말 것
        
        → 렌더링마다 새로 만들어지는 값(객체/함수 등)을 종속성에 넣으면 effect가 불필요하게 반복 실행되니 구조를 개선하자
        
<br />

# Effect에서 이벤트 분리하기

### 이벤트 핸들러 vs Effect

| 이벤트 핸들러 | Effect |
| --- | --- |
| 특정 상호작용에 대한 응답으로 실행<br>ex) 전송 버튼 클릭 → 메시지 전송 | 동기화가 필요할 때마다 실행<br>ex) 선택된 채팅 서버와 연결 유지 |

## 반응형 값과 반응형 로직

**반응형 값:** 컴포넌트 본문 내부에 선언된 props, state, 변수

반응형 값은 렌더링 과정에 관여하며 리렌더링으로 인해 변경될 수 있다. 

```jsx
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');
  // ...
}
```

사용자가 message를 편집하거나 다른 roomId를 선택하는 경우에서의 차이를 보면, 

### 이벤트 핸들러 내부의 로직은 반응형이 아니다.

- 사용자가 같은 상호작용(예-클릭)을 반복하지 않는 한 재실행 되지 않는다.
- 변화에 반응하지 않으면서 반응형 값을 읽는다.

```jsx
sendMessage(message);
```

사용자 관점에서 message를 바뚜는 것이 메시지를 전송하고 싶다는 의미가 아니다. (단지 입력 중)

→ 반응형 값이 변경되었다는 이유만으로 로직이 재실행되어서는 안된다. 

```jsx
function handleSendClick() {
  sendMessage(message);
}
```

따라서 이벤트 핸들러는 반응형이 아니므로`sendMessage(message)`는 사용자가 전송버튼을 클릭할 때만 실행될 것.

<br />

### Effect 내부의 로직은 반응형이다.

- 반응형 값을 읽음 → 의존성으로 지정

```jsx
const connection = createConnection(serverUrl, roomId);
connection.connect();
```

사용자 관점에서 roomId를 바꾸는 것은 다른 방에 연결하고 싶다는 뜻

→ 반응형 값을 따라가고, 그 값이 바뀌면 다시 실행되기를 원한다.

따라서  `createConnection(serverUrl, roomId)`와 `connection.connect()`는 구별되는 모든 `roomId` 값에 대해 실행될 것이다.

<br />

### **아직 안정된 버전의 React로 출시되지 않은 실험적인 API**

### **Effect 이벤트 선언하기 (useEffectEvent)**

- `useEffectEvent`는 **Effect 내부에서만 사용하는 비반응형(비동기/콜백 등) 로직을 분리**할 수 있게 해 주는 실험적 Hook.
- Effect 이벤트로 선언된 함수는 항상 최신 props/state를 참조하며, Effect 의존성에 넣지 않아도 됨.

```jsx
const onConnected = useEffectEvent(() => {
  showNotification('연결됨!', theme);
});

useEffect(() => {
  connection.on('connected', () => onConnected());
}, [roomId]);
```

### **Effect 이벤트로 최근 값 읽기**

예전에는 의존성 린터 경고 때문에 의존성 배열을 억지로 늘리거나, 값 변동을 관리하기 어려웠다.

Effect 이벤트를 쓰면, **최근의 props/state 값을 읽으면서도 의존성에 추가할 필요가 없다.**

하지만 실제 반응형이어야 할 값은 Effect 의존성 배열에 꼭 추가해야 한다.

```jsx
import { useEffect, useEffectEvent } from 'react';

function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  // Effect 이벤트 선언: 비반응형 콜백
  const onVisit = useEffectEvent((visitedUrl) => {
    logVisit(visitedUrl, numberOfItems); // 항상 최신 numberOfItems를 읽음
  });

  // 의존성에는 url만
  useEffect(() => {
    onVisit(url);
  }, [url]);
}

```

<br />

# Effect의 의존성 제거하기

## **Effect 의존성은 코드와 일치해야 한다**

- Effect는 내부에서 사용하는 모든 반응형 값을 의존성 배열에 선언해야 한다.
- 빈 배열([])로 두면 린터가 누락된 의존성을 알려주고, 권고대로 채워야 한다.

```jsx
Lint Error
11:6 - React Hook useEffect has a missing dependency: 'roomId'. Either include it or remove the dependency array.
```

```jsx
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  return () => connection.disconnect();
}, [roomId]); 
```

## **의존성을 제거하려면 "반응형 값이 아님"을 증명해야 한다**

- 의존성 배열에서 빼고 싶다면, 그 값이 렌더링이나 상태 변화에 영향받지 않는 값임을 코드로 증명해야 함.

```jsx
// 컴포넌트 외부에 선언 > 반응형 아님
const roomId = 'music'; 
function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); 
}
```

## **의존성을 변경하려면 코드를 변경해야 한다**

- 의존성 배열이 마음에 들지 않으면, **Effect 코드 구조를 먼저 바꾼다** → 그에 맞게 의존성 배열도 변경.


>✅ 의존성 배열은 내 Effect가 실제로 읽는 모든 반응형 값의 목록이어야 하며, **사용자가 임의로 선택하는 것이 아니다**.


⚠️ **의존성 린터를 억제하지 말 것**

`// eslint-ignore-next-line react-hooks/exhaustive-deps`와 같은 방법으로 린트 무시 ❌

→ 버그 가능성이 매우 높아지고, React에게 거짓말하는 셈

<br />

## **불필요한 의존성 제거하기**

Q. 의존성이 하나라도 변경되면 Effect가 다시 실행하는 것이 합리적일까? 

A. 아니다.

그 이유에 대한 몇 가지 상황이 있다. 

- 다른 조건에서 Effect의 다른 부분을 다시 실행하고 싶을 수 있다.
- 일부 의존성 변경에 반응하지 않고 최신 값만 읽고 싶을 수 있다.
- 의존성은 객체나 함수이기 때문에 의도치 않게 너무 자주 변경될 수 있다.

<br />

### 그래서 해결은?

### **1. 이 코드가 Effect에 있어야 하는지 확인**

특정 이벤트(예: 폼 제출)에만 동작해야 한다면, Effect가 아니라 이벤트 핸들러에 넣기

```jsx
function handleSubmit() {
  post('/api/register');
  showNotification('등록 완료!');
}
```

### **2. Effect가 관련 없는 여러 동기화를 하고 있는가?**

여러 동기화를 한 Effect에서 하지 말고, **각각의 Effect로 분리하기**

```jsx
// 나라가 바뀔 때 도시 리스트, 도시가 바뀔 때 지역 리스트
useEffect(() => { /* ... */ }, [country]);
useEffect(() => { /* ... */ }, [city]);
```

### **3. State를 계산하는데 어떤 State를 읽고 있나?**

Effect에서 state를 직접 읽어서 setState에 사용하면 의존성이 생기고, 그 값이 바뀔 때마다 Effect가 다시 실행됨 → **업데이트 함수 패턴** 사용

- before
    
    ```jsx
    useEffect(() => {
      const connection = createConnection();
      connection.connect();
      connection.on('message', (receivedMessage) => {
        setMessages([...messages, receivedMessage]);
      });
      return () => connection.disconnect();
    }, [roomId, messages]);
    ```
    
    message를 의존성 배열에 추가했으므로, 메시지가 올 때마다 `setMessage → message 변경 → effect 재실행 → 채팅 재연결`  불필요한 재연결 발생 <br />
    
- after
    
    ```jsx
    useEffect(() => {
      const connection = createConnection();
      connection.connect();
      connection.on('message', (receivedMessage) => {
        setMessages(prevMessages => [...prevMessages, receivedMessage]);
      });
      return () => connection.disconnect();
    }, [roomId]); 
    ```
    
    message를 Effect에서 직접 읽지 않음 → 의존성 배열에 추가 X
    
    setMessages에 업데이터 함수(이전값을 받아 새 값을 계산하는 함수)를 사용한다. 
    
    이렇게 하면 Effect는 messages에 의존하지 않으므로, 메시지가 올 때 채팅 연결이 재생성되지 않는다.  <br />
    

### **4. 일부 반응형 값이 의도치 않게 변경되나?**

**객체/함수는 “항상 새로운 값”으로 인식됨**

컴포넌트 내부에서 객체나 함수를 만들면, 렌더링마다 항상 새로운 객체/함수가 만들어진다.

즉, Effect 의존성에 이런 값이 들어가 있으면, 모든 렌더링마다 Effect가 재실행된다. 

```jsx
function ChatRoom({ roomId }) {
  const options = { serverUrl, roomId };
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // 매번 새로 생성됨
}
```

<br />

**객체/함수 의존성 문제 해결법**

1. **정적 객체와 함수를 컴포넌트 외부로 이동**

객체가 props 및 State에 의존하지 않는 경우 해당 객체를 컴포넌트 외부로 이동할 수 있다. 

```jsx
const options = {
  serverUrl: 'https://localhost:1234',
  roomId: 'music'
};

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); 
```

<br />

2. **Effect 내에서 동적 객체 및 함수 이동**

객체가 `roomId` props처럼 재렌더링의 결과로 변경될 수 있는 반응형 값에 의존하는 경우, 컴포넌트 외부로 끌어낼 수 없습니다. 

```jsx
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); 
  //...
```

> 🔎 Effect 내부에서 생성된 객체/함수는 렌더링 때마다 새로 만들어지지만, 의존성 배열에는 Effect 바깥에서 정의된 값만 넣는다.


options는 Effect가 실행될 때마다 새로 생성되지만, options의 값이 언제 바뀌는지를 결정하는 것은 roomId가 바뀔 때 뿐이다.

의존성 배열에서 명시하는 값은 Effect 내부에서 직접 읽고 있는 반응형 값이 어떤건지가 중요하다. 

```jsx
// roomId 변경 -> Effect 재실행 -> 새로운 options 생성 
useEffect(() => {
  const options = { serverUrl, roomId };
  // ...
}, [roomId]);
```

<br />

3. **객체에서 원시 값 읽기**
- 부모가 객체/함수를 만들어 넘기면 Effect 재실행된다.
    
    → props에서 필요한 값만 꺼내서 사용하기 
    
    ```jsx
    function ChatRoom({ options }) {
      const [message, setMessage] = useState('');
    
      const { roomId, serverUrl } = options;
      
      useEffect(() => {
        const connection = createConnection({
          roomId: roomId,
          serverUrl: serverUrl
        });
        connection.connect();
        return () => connection.disconnect();
      }, [roomId, serverUrl]); 
      // ...
    ```
    
    <br />

# 커스텀 Hook으로 로직 재사용하기

```jsx
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ 온라인' : '❌ 연결 안 됨'}</h1>;
}
```

- **Hook은 로직(코드)을 재사용하는 도구**
    - 중복되는 Effect, state, 이벤트 등 여러 컴포넌트에서 반복된다면 커스텀 Hook으로 추출 가능
- **형식은 함수, 이름은 `use`로 시작**
    - 예: `useOnlineStatus`, `useFormInput`
    - 컴포넌트에서 내부적으로 Hook처럼 사용
- **컴포넌트 간 state 자체를 공유하는 것이 아니라, 저장 로직을 공유**
    - 각 Hook 호출은 각자의 state/Effect를 가짐
    
    ⇒ 즉, 같은 Hook을 호출하더라도 각각의 훅은 독립되어 있다.  
    
- **컴포넌트가 재렌더링될 때마다 props/state 전달은 항상 최신값이 전달됨**
    
    ```jsx
    useChatRoom({roomId, serverUrl})
    ```
    
    `roomId`나 `serverUrl`이 바뀌면 Effect가 자동으로 재실행(채팅 재연결), 컴포넌트와 Hook이 서로 최신 상태를 공유함
    
- **이벤트 핸들러도 마찬가지로, props로 전달된 함수를 Hook 안에서 사용할 수 있음**
    - 최신 함수를 매번 받을 수 있음
    
    <br />

### 커스텀 훅 언제 쓰는게 좋은데?

- 중복되는 Effect나 state 관리, fetch, 외부 이벤트 구독 등
    
    → **여러 컴포넌트에서 반복적으로 필요한 로직**
    
- 특정 state, Effect, 이벤트 관리, 외부 시스템 연동 등 실행 방법을 숨기고 목적만 드러내고 싶을 때
    
    → 코드 가독성/유지보수성↑