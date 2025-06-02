# [Week6] 탈출구

## ✅ Ref

React가 관리하는 DOM이나 컴포넌트에 직접 접근할 수 있게 해줌. (일반적인 상태변경 -> 리렌더링이 아닌 직접 무언가를 제어할 때 사용함.)

값이 바뀌어도 리렌더링되지 않기 때문에 렌더링 없이 값을 기억해야 할 때 유용함.

- `DOM ref`
  - HTML 요소에 접근 (input.focus(), scrollTo() 등)
- `컴포넌트 ref`
  - 클래스 컴포넌트 인스턴스에 접근

### ref와 state 차이

#### ref

- useRef(초기값)은 {current: 초기값} 반환
- state를 바꿔도 리렌더링 하지 않음
- Mutable : 렌더링 프로세스 외부에서 current 값을 수정, 업데이트 할 수 있음
- 렌더링 중에 current 값을 읽거나 쓸 수 없음

#### state

- useState(초기값)은 state 변수의 현재 값과 setter [value, setValue]를 반환함
- state를 바꾸면 리렌더링함
- Immutable: state를 수정하기 위해서 state 설정 함수를 사용하여 리렌더링 대기열에 넣어야 함
- state를 언제나 읽을 수 있고, 렌더링마다 변경되지 않는 자체적인 state snapshot이 있음

### React가 Ref를 부여할 때

- **렌더링**

  - 첫 렌더링에 ref.current는 null임
  - 이후 렌더링 중 DOM은 아직 생성되지 않음 → 접근 불가

- **커밋**
  - 렌더 완료 후, React가 ref.current를 실제 DOM 노드로 설정
  - DOM이 바뀌면 기존 ref.current는 null로 초기화 후 다시 설정됨

## 🦹🏻‍♀️ Effect 동기화

```jsx
useEffect(() => {
  // Effect 코드
  return () => {
    // 클린업 함수
  };
}, [의존성]);
```

### Effect를 작성하는 법

1. **Effect 선언** : 모든 commit 이후에 실행

- 컴포넌트가 렌더링 될 때마다 리액트는 화면을 업데이트하고 useEffect 내부 코드 실행함. (렌더링이 반영될 때까지 코드 실행을 지연 시킴)

2. **Effect 의존성 지정** : 의존성을 지정하여 모든 렌더링 후가 아니라 필요할 때만 실행되도록 해야함

```jsx
useEffect(() => {
  // 모든 렌더링 후에 실행
});

useEffect(() => {
  // 마운트될 때만 실행 (컴포넌트가 나타날 때)
}, []);

useEffect(() => {
  // 마운트될 때 실행되며, 렌더링 이후에 a 또는 b 중 하나라도 변경된 경우에도 실행
}, [a, b]);
```

3. **클린업 함수 추가**

- 컴포넌트가 언마운트되거나 Effect 재실행 전 호출됨

### useEffect 안에서의 fetch

❗ 왜 useEffect 안에서 직접 데이터를 가져오면 안 좋을까?

- 서버 사이드 렌더링(SSR)과 궁합이 안 좋음
  → 클라이언트에서 JS가 로드되고 렌더된 후에야 fetch가 실행됨 → 초기 HTML엔 데이터 없음
- 네트워크 폭포 현상
  → 부모 → 자식 순서로 렌더링하며 각자 fetch하면 병렬이 아닌 순차 요청으로 느려짐
- 캐싱 불가
  → useEffect 내부 fetch는 매번 새로 요청하므로 비효율적
- 재사용성 낮음
  → 컴포넌트가 언마운트되었다가 다시 마운트되면 다시 fetch 발생
- 버그 가능성
  → 요청 취소, race condition, 로딩 중복 등을 처리하려면 보일러플레이트가 많아짐

