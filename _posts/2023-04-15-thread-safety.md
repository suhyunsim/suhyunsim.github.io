---
layout: post
title: "thread-safety에 대해 알아보기"
author: "Poogle"
categories: [BackEnd]
sitemap:
changefreq: daily
priority: 1.0
comments: true
tag: [thread-safety, Race Condition, Data Race, OS, multi-thread]

---

> _참고 링크_
> 
> **Books** 
> 
> [Brian Goetz, Tim Peierls, Bloch Joshua, Bowbeer Joseph, Holmes David, Lea Doug (2006). Java Concurrency in Practice. Addison-Wesley Professional. ](https://www.amazon.com/Java-Concurrency-Practice-Brian-Goetz/dp/0321349601)
> 
> [Joshua Bloch(2018). Effective Java(3rd ed.). Addison-Wesley Professional.](http://www.yes24.com/Product/Goods/65551284)
> 
> **Youtube Videos** 
> 
> [CppCon 2018: Geoffrey Romer “What do you mean "thread-safe"?”](https://www.youtube.com/watch?v=s5PCh_FaMfM)
> 
> [Thread Safety in Singleton](https://www.youtube.com/watch?v=QWrcOmLWi_Q)
> 
> [Race Conditions in Java Multithreading](https://www.youtube.com/watch?v=RMR75VzYoos&list=PLL8woMHwr36EDxjUoCzboZjedsnhLP1j4&index=10)
> 
> [[10분 테코톡] 🌷 코다의 Process vs Thread](https://www.youtube.com/watch?v=1grtWKqTn50)
> 
> [[10분 테코톡] 알렉스, 열음의 멀티스레드와 동기화 In Java](https://www.youtube.com/watch?v=ktWcieiNzKs)
> 
> **Articles**
> 
> [Race condition vs. Data Race: the differences explained](https://www.avanderlee.com/swift/race-condition-vs-data-race/)
> 
> [Thread Safety and Shared Resources](https://jenkov.com/tutorials/java-concurrency/thread-safety.html)
> 
> [Race Conditions and Critical Sections](https://jenkov.com/tutorials/java-concurrency/race-conditions-and-critical-sections.html)

<br>

백엔드 개발자 면접을 준비하면서 자주 접하게 된 키워드 **`thread-safety`**. 이번 글에서는 아래 정리한 순서에 따라 `thread-safety`와 관련된 여러 가지 주제들을 다뤄보려고 합니다.

<br>

```text
- Multi-Thread Programming
- Thead-Safety란?; 무엇으로부터 'safe'하려는 걸까요?
    - Race Condition
    - Data Race
- Thread-Safety와 공유 자원; Java에서 스레드가 실행될 때 어떤 자원을 공유하게 될까요?
- Thread Control Escape Rule; thread-safety 판단 방법
- Thread-Safety 구현 방법
```

<br>

# Multi-Thread Programming

![image](https://user-images.githubusercontent.com/58318786/233841959-cb3e9b1b-c85f-411d-bbf7-6bdc78369d25.png)

모든 기술이 그렇듯 싱글 스레드 환경과 멀티 스레드 환경은 각각의 장단점을 지니고 있습니다.

**싱글 스레드**의 경우 하나의 프로세스에서 오직 하나의 스레드로만 실행하는 것을 의미하는데 그렇기 때문에, 하나의 레지스터와 스택으로 표현이 가능합니다.

싱글 스레드는,
- 👍 context switch 작업을 요구하지 않고 자원 접근에 대한 동기화를 신경쓰지 않아도 됩니다.
- 👍 단순히 CPU만을 사용하는 계산작업이라면, 오히려 멀티스레드보다 싱글스레드로 프로그래밍하는 것이 더 효율적일 수 있습니다.
- 👍 프로그래밍 난이도가 쉽고, CPU, 메모리를 적게 사용해 비용이 적게 든다는 장점이 있습니다. 

- 👎 그러나 해당 장점들은 여러 개의 CPU를 활용하지 못하거나 또 연산량이 많은 작업일 때 활용할 수 없는 단점이 되기도 합니다.

반면 **멀티 스레드**는 CPU의 최대 활용을 위해 프로그램의 둘 이상을 동시에 실행하는 기술이고,
- 👍 이러한 작업은 컨텍스트 스위칭( Context Switching )을 통해서 이뤄집니다.
- 👍 이로인해 응답 속도가 빠르고 병렬성이 증가하는 장점이 있습니다.
- 👍 또한 **프로세스의 컨텍스트 스위칭**과는 달리 캐시 메모리를 비울 필요가 없기 때문에 상대적으로 비용과 시간이 덜 듭니다.

- 👎️ 다만 앞서 말씀드린 것처럼 단일 스레드에 비해 컨텍스트 스위칭 시 오버헤드가 발생할 수 있고,
- 👎 공유하는 자원에 동시에 접근할 경우 동기화 작업이 필요하다는 특성이 있습니다.

<br>

---

<br>

# Thread-Safety란?

![image](https://user-images.githubusercontent.com/58318786/233842654-5a614fef-3f45-4991-877e-6af295a7c3b1.png)

_POSIX 공식문서, Bard, Java Concurrency in Practice_ 등 다양한 자료들에서 정의하는 `thread-safety` 개념을 정리해보면,

### **다수의 스레드에 의한 동시 호출에서 안정성이 보장되는 상태**

를 의미합니다.

멀티 스레드 프로그래밍에서 일반적으로 어떤 함수나 변수, 혹은 객체가 여러 스레드로부터 동시에 접근이 이루어져도 프로그램의 실행에 문제가 없음을 의미하는데,
보다 엄밀하게는 하나의 함수가 한 스레드로부터 호출되어 실행 중일 때, 다른 스레드가 그 함수를 호출하여 동시에 함께 실행되더라도 각 스레드에서의 함수의 수행 결과가 올바로 나오는 것으로 정의합니다.

즉, 두 개 이상의 스레드가 **Race Condition**에 들어가거나 **같은 객체에 동시에 접근**해도 **연산결과의 정합성**이 보장될 수 있게끔 **메모리 가시성**이 확보된 상태라고 할 수 있습니다.

<br>

# Race Condition; 경쟁 상태
🤔 `thread-safety`라는 키워드를 보면 무엇으로부터 `safe`, 안전하게 유지하려는 것인지 궁금증이 들 수 있습니다. 여기서 위 정의에서 언급되는 `Race Condition`에 대해 알아보려고 합니다.

경쟁 상태란,
- 현재 작업이 제어할 수 없는 또 다른 작업과의 진행순서 즉, 타이밍에 따라 결과가 달라져 여러 결과를 만들어낼 수 있는 바람직하지 않은 상황을 의미합니다.
- 여러 스레드나 프로세스가 **한정된 공유 자원에 동시에(concurrently) 접근하는 경우** 경쟁상태는 **데이터의 불일치(inconsistency) 문제**를 야기할 수 있습니다. 따라서 경쟁상태를 다루기 위해서는 **동기화(synchronize)**가 되어야 합니다.

<br>

## 경쟁 상태의 대표 유형 1) Read-Modify-Write 패턴
이전 상태를 기준으로 객체의 현재 상태를 변경하면서 발생하는 문제로,

<img width="240" alt="image" src="https://user-images.githubusercontent.com/58318786/233843623-d068f1c1-e2df-4637-b6a0-7060a332b99a.png">

예를 들어 count라는 공유자원이 있을 때 

- 1) count 변수에 있는 값을 읽어오고, 
- 2) 변수에 있는 값을 수정하고, 
- 3) 그 변수에 있는 값을 덮어쓰는 3번의 연산이 일어나면서 

하나의 스레드가 값을 증가시키고 저장하기 직전에 다른 스레드가 증가되기 직전인 값을 읽어와서 또 증가를 시킨다면 count 변수의 결과값이 원하는 대로 증가하지 않는 상태가 발생할 수 있습니다.

## 경쟁 상태의 대표 유형 2) Check-Then-Act 패턴
이전에 검증(Check)한 결과가 행동(Act) 시점에는 더 이상 유효하지 않을 때 발생하는 문제인데요,

<img width="313" alt="image" src="https://user-images.githubusercontent.com/58318786/233843728-ffda1f01-463f-4295-a83d-541d4e1d2fa5.png">

예시를 보시면 check 와 act 사이의 시간 차를 만들기 위해 임의로 `Thread.sleep()` 메서드를 활용하고 스레드 100개로 동시에 요청을 보냈을 때
- `if()` (Check)을 통과하기 전에는 조건에 부합하는 값이지만,
- `if()` 를 통과한 이후에는 조건에 부합하지 않는 숫자가 되어 경쟁 상태가 발생할 수 있습니다.
- 결국 연산 사이의 시간 차가 발생하기 때문에 한 스레드가 연산을 하고 있을 때 다른 스레드의 연산이 개입할 수 있어서 경쟁조건이 발생합니다.

<br>

# Data Race; 데이터 경쟁
🤔 Race Condition과 함께 자주 언급되는 `Data Race`에 대해 알아보겠습니다.

데이터 경쟁이란,
- 다른 곳에서 메모리 위치를 읽거나 수정할 가능성이 있는 어떤 메모리 위치에 쓰기 작업을 하는 것으로
- 만약 프로그램의 실행이 두 개의 잠재적으로 동시에 발생하는 충돌하는 액션을 포함하고, 그 중 적어도 하나가 원자적이지 않은 경우에는 해당 프로그램에 데이터 경쟁이 포함되어 있다고 할 수 있습니다.
- 병렬 처리를 하는 경우 흔하게 발생합니다.
- Data Race는 일반적으로 Race Condition의 부분집합이지만, 종종 그렇지 않은 경우도 발생합니다.

### _참고_ Race Condition vs Data Race

1) 동기화를 위한 아무 수단도 사용하지 않은 경우 => Race Condition과 Data Race 모두 발생합니다.

2) 개별 변수를 읽을 때에만 동기화 (Mutex 등의 락 or Atomic 연산을 이용)를 적용한 경우 => Race Condition은 발생하지만 Data Race는 발생하지 않습니다.

3) 전체 연산에 동기화를 적용한 경우 => Race Condition과 Data Race 모두 발생하지 않습니다.

<br>

---

<br>

# Thread-Safety와 공유 자원
이번에는 자바에서 스레드가 실행될 때 어떤 자원을 공유하게 되며 각각의 공유되는 자원들이 thread-safety한 지 알아보도록 하겠습니다.

<img width="700" alt="image" src="https://user-images.githubusercontent.com/58318786/233844602-de7d5f7c-327c-4fb0-a1ed-c7edaf2454bf.png">

## Local Variables 지역변수
* 지역변수는 각 스레드의 Stack에 저장되기 때문에 지역변수는 스레드 간 절대 공유되지 않습니다. => 즉 모든 지역변수는 `thread-safety`하다고 할 수 있습니다.

## Local Object References 지역 레퍼런스 변수
* 지역 레퍼런스 변수는 레퍼런스 자체는 공유되지 않지만 참조된 객체는 스레드 각각의 Stack에 저장되지 않습니다.
* 모든 객체들은 공유 Heap에 저장되고 만약 생성된 객체가 생성된 메소드 지역 안에서 벗어나지 않으면 `thread-safety`합니다.

## Object Member Variables 객체 멤버 변수
* 객체 멤버 변수는 객체와 함께 Heap에 저장됩니다.
* 만약 두 스레드가 같은 객체 인스턴스의 메소드를 호출하고, 그 메소드가 객체 멤버 변수를 업데이트 할 경우 메소드는 `thread-safety` 하지 않습니다.
* 그러나 만약 두 스레드가 다른 인스턴스에 대해 동시적으로 호출한다면 경쟁 조건을 유발하지 않습니다. => 즉, 객체가 `thread-safety` 하지 않더라도 경쟁 조건을 유발하지 않는 방법으로 사용될 수 있습니다.

<br>

---

<br>

# Thread Control Escape Rule

그렇다면 우리는 `thread-safety`를 어떻게 판단할 수 있을까요?

보통 어떤 프로그램이 스레드 안전인지 아닌지 알아내는 것은 간단하지 않지만 다음 상황들을 참고할 수 있습니다.

- 전역 변수나 힙, 파일과 같이 여러 스레드가 동시에 접근 가능한 자원을 사용하는지 여부
- 핸들과 포인터를 통한 데이터의 간접 접근 여부
- 부수 효과를 가져오는 코드가 있는지 여부

즉,

### “만약 한 자원의 생성, 사용, 소멸이 동일한 스레드 내에서 이루어지고, 해당 스레드에서 절대 벗어나지 않는다면 이 자원의 사용은 thread-safety라 할 수 있습니다.”

* 자원은 객체, 배열, 파일, 데이터베이스, 커넥션, 소켓 기타 등등 어떤 방식으로든 공유 자원이 될 수 있고, 자바에서 객체들은 반드시 정확하게 소멸(객체로의 참조를 잃거나 null)되지 않아도 됩니다.
* 객체 사용이 `thread-safety`해도 그 객체가 파일이나 데이터베이스 같은 공유 자원을 가리킨다면, 전체적으로 해당 어플리케이션은 `thread-safety`하지 않을 수 있습니다.
* 따라서 스레드에 의해 컨트롤 되는 객체가 자원 그 자체인지, 혹은 그 자원으로의 참조인 것인지 구분해야 합니다.

![image](https://user-images.githubusercontent.com/58318786/233845078-8c15292a-9161-4aa1-a99b-6d13a7c87c69.png)

* Ex. 두 개의 스레드가 각각 데이터베이스에 연결하는 커넥션을 생성하면 커넥션 자체는 `thread-safety`합니다.
  * ⚠️ 그러나 그 연결이 가리키는 데이터베이스의 사용은 `thread-safety`하지 않을 수 있습니다.
  * 두 개의 스레드가 각각 특정 레코드가 있는지 확인하고 없으면 추가하라는 쿼리를 수행할 때, 두 스레드가 동시에 실행되어 레코드의 존재 여부를 두 번 체크해 두 번 새로 생성하게 되면 thread-safety하지 않은 동작이 발생할 수 있습니다.

<br>

---

<br>

# Thread-Safety 구현 방법

그렇다면 `thread-safety`하게 설계하고 구현하려면 어떻게 해야할까요?

> Java Concurrency in Practice

![image](https://user-images.githubusercontent.com/58318786/233845268-9bde5bdd-6c38-4f8f-be42-ea4589f85f40.png)

* `thread-safety`하게 구현하는 방법은 다양합니다. 그 중 몇 가지를 살펴보면,

## 재진입성(Reentrancy)
* 어떤 함수가 한 스레드에 의해 호출되어 실행 중일때, 다른 스레드가 그 함수를 호출하더라도 그 결과가 각각 올바르게 주어져야 합니다.

## 상호배제(Mutual Exclusion)
* 공유 자원을 사용할 경우 해당 자원에 대한 접근을 Semaphore와 같은 Lock으로 통제해야 합니다.
* 임계구역을 정의하고 해당 임계구역은 한 번에 하나의 스레드만 접근해야 합니다.

## 스레드 지역 저장소(Thread Local Storage)
* 공유 자원의 사용을 최대한 줄이고 공유상태를 피할 수 없을 경우 각각의 스레드에서만 접근 가능한 저장소를 사용함으로써 동시 접근을 막아야 합니다.

## 원자 연산(Atomicity)
* 공유 자원에 접근할 때 원자 연산, 원자적으로 정의된 접근 방법을 사용합니다.

## 불면 객체(Immutable Object)
* 객체 생성 이후에 값을 변경할 수 없도록 만들어야 합니다.

<br>

정리하자면, **`공유변수는 최소화`하고, 사용해야 하는 공유변수가 있을 때는 최대한 `캡슐화`하며, 관련한 `문서화`를 잘 해야합니다.**

