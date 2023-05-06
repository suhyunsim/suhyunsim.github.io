---
layout: post
title: "Java에서의 동시성 관련 키워드"
author: "Poogle"
categories: [BackEnd]
sitemap:
changefreq: daily
priority: 1.0
comments: true
tag: [동시성, synchronized, 병렬성, 동시성 유틸리티, Lock, atomic, volatile, Thread Local]

---

> _참고 링크_
> 
> **Books** 
>
> [Brian Goetz, Tim Peierls, Bloch Joshua, Bowbeer Joseph, Holmes David, Lea Doug (2006). Java Concurrency in Practice. Addison-Wesley Professional. ](https://www.amazon.com/Java-Concurrency-Practice-Brian-Goetz/dp/0321349601)
>
> [Joshua Bloch(2018). Effective Java(3rd ed.). Addison-Wesley Professional.](http://www.yes24.com/Product/Goods/65551284)
> 
> **Lectures** 
> 
> [스프링 핵심 원리 - 고급편](https://www.inflearn.com/course/스프링-핵심-원리-고급편/dashboard)
> 
> [재고시스템으로 알아보는 동시성이슈 해결방법](https://www.inflearn.com/course/동시성이슈-재고시스템)
> 
> 
> **Articles**
> 
> [🔒 Java 로 동기화를 해보자!](https://tecoble.techcourse.co.kr/post/2021-10-23-java-synchronize/)
> 
> **Posts**
>
> [[Study] 동시성(Concurrency) 과 병렬성 (Parallelism) 올바른 개념 잡기](https://vagabond95.me/posts/concurrency_vs_parallelism/)
>
> [메모리와, 연속 메모리 할당(contiguous memory allocation)](https://matdongsane.tistory.com/29)
>
> [[Java] 멀티 스레드환경의 동시성 이슈 그리고 해결방법](https://velog.io/@mooh2jj/멀티-스레드의-동시성-이슈)
>
> [자바 백엔드 기술 면접 대비하기 - 1편](https://f-lab.kr/blog/java-backend-interview-1)
>
> [[Java] Java의 동시성 이슈](https://velog.io/@syleemk/Java-Concurrent-Programming-가시성과-원자성)
>
> [[Java] Concurrent Programming - 가시성과 원자성](https://steady-coding.tistory.com/554)




이번 글에서는 아래 정리한 순서에 따라 **`Java와 동시성 키워드`** 에 관련된 여러 가지 주제들을 다뤄보려고 합니다.

<br>

```text
- 동시성 문제
    - 동기화
    - 동시성과 병렬성
- synchronized - 암시적 Lock
    - wait(), notify(), notifyAll()
    - 동시성 유틸리티(실행자 프레임워크, 동시성 컬렉션, 동기화 장치)
- java.util.concurrent.locks - 명시적 Lock
    - ReentrantLock
        - Condition
    - ReentrantReadWriteLock
    - StampedLock
- Atomic Type
- volatile
    - 가시성과 원자성
- ThreadLocal

```

<br>

# 동시성 문제와 관련된 키워드

## 프로세스 동기화
- 다중 프로세스 환경에서 자원 등에 한 프로세스만이 접근가능하도록 하는 것을 의미합니다.
- 프로세스 동기화를 하지 않으면 동시에 공유 자원에 접근할 수 있어 데이터의 일관성이 깨질 수 있습니다.

<br>

## 멀티 스레드와 동기화
- 한 프로세스 안에서 실행되는 여러 개의 스레드들은 서로 공유할 수 있는 메모리 부분이 있고 이 때 동기화 문제가 발생할 수 있습니다.
- 동기화 문제는 스레드 간의 공유자원에 접근하는 것을 한 번에 한 스레드만 가능하게 해서 해결이 가능합니다.

<br>

## 병렬성(Parallelism)과 동시성(Concurrency)

<img width="200" alt="image" src="https://user-images.githubusercontent.com/58318786/236462856-e494e2d8-341f-4b47-bf99-f116d105b357.png">

### 병렬성
- 멀티 코어에서 멀티 스레드를 동작하는 방식으로 한 개 이상의 스레드를 포함하는 각 코어들이 동시에 실행되는 성질입니다.
- 물리적인 개념입니다.
- 실제로 여러 작업 처리를 하며 동시에 실행됩니다.
- 병렬성을 만족하면 동시성도 만족하게 됩니다.

<img width="200" alt="image" src="https://user-images.githubusercontent.com/58318786/236462903-41781b89-9fb4-46d9-941d-161d4d624119.png">


### 동시성
- 동시에 실행되는 것처럼 보이는 것을 의미합니다.
- 싱글 코어에서 멀티 스레드 동작하는 방식(여러 스레드가 번갈아가며 실행)입니다.
- 논리적 개념입니다.
- 동시성을 만족한다고 병렬성을 만족하는 것은 아닙니다.(동시성은 병렬성이기 위한 필요조건이지만 충분조건은 아님)
- **동시성 문제**: 동일한 자원에 대해 여러 스레드가 동시에 접근하면서 발생하는 문제를 의미합니다.

<br>

## 동시성 문제
- 값을 어디선가 변경할 때 발생합니다.(읽기만 할 때는 발생하지 않습니다.)
* 여러 쓰레드가 동시에 같은 인스턴스의 필드 값을 변경하면서 발생합니다.
- 여러 쓰레드가 같은 인스턴스의 필드에 접근해야 하기 때문에 트래픽이 적은 상황에서는 확률상 잘 나타나지 않고, 트래픽이 점점 많아질수록 자주 발생합니다.
- 특히 스프링 빈 처럼 싱글톤 객체의 필드를 변경하며 사용할 때 주의해야 합니다.

### 동시성 문제 예제

![image](https://user-images.githubusercontent.com/58318786/236547795-f28a92bb-d152-423b-81e8-f952803e3f2f.png)

### 🤔 100개 수량이 있는 재고를 하나씩 감소 시키는 어떤 요청이 있을 때 해당 요청을 100개를 실행하는데 이 때 멀티 스레드로 요청을 수행한다면 결과가 어떻게 될까요?

![image](https://user-images.githubusercontent.com/58318786/236551187-d44e463e-fc60-47dd-953b-22311f06b4a8.png)

* 예상할 때는 100개를 1개식 100번 감소시켜서 0개가 남을 것으로 예상하지만 결과는 그렇지 않습니다.
* 이처럼 값을 어디선가 변경할 때 여러 스레드가 동시에 하나의 자원을 공유하고 있기 때문에 같은 자원을 두고 경쟁상태가 발생하는 것을 **동시성 문제**라고 합니다.

<br>

---

<br>

# Java의 동기화 키워드 - `synchronized`
* Java의 예약어(변수명이나 클래스명으로 사용 불가능합니다.)
* synchronized를 이용해서 임계구역을 설정합니다.
  * 임계구역은 멀티 스레드 프로그램의 성능을 좌우하기 때문에 가능하면 메소드 전체에 lock을 걸기 보다는 synchronized 블록으로 임계구역 최소화해야 합니다.
* 암시적 락: Lock 클래스를 직접 사용해서 lock, unlock을 구현하는 것이 아닌 내부적으로 객체의 고유 락을 사용해서 접근을 제어하기 때문에 암시적 락이라고도 합니다.
* cf.) 고유 락(intrinsic lock): 자바의 모든 객체가 갖고 있는 락(monitor lock)을 의미합니다. (synchronized는 고유 락 사용)
* synchronized는 원자성, 가시성 문제를 해결해줍니다.

## 사용 방법
1) **synchronized methods**: 메소드 자체를 synchronized로 선언해서 사용합니다.

<img width="390" alt="image" src="https://user-images.githubusercontent.com/58318786/236620332-18cf34b2-986f-4b49-b551-5c639d117727.png">

* 스레드는 synchronized 키워드가 붙은 메서드가 호출된 시점부터 해당 메서드가 포함된 객체의 lock을 얻어 작업을 수행하다가 메서드가 종료되면 lock을 반환합니다.

2) **synchronized statements**: 메소드 내의 특정 문장만 synchronzied로 감싸는 방법입니다.

<img width="296" alt="image" src="https://user-images.githubusercontent.com/58318786/236620395-e3170f56-413c-4e4e-ba1f-1cb099cf1beb.png">

* 이 때 참조 변수는 lock을 걸고자 하는 객체를 참조하는 것으로 이 영역으로 들어가면서부터 스레드는 지정된 객체의 lock을 얻게 되고 블록을 벗어나면 lock을 반납합니다.
  * `synchronized(this)` 혹은 `synchronized(Object)` 등으로 사용할 수 있습니다.

## synchronized의 주의점
* synchronized는 한 프로세스 내에서만 동작합니다.
  * 서버가 여러 대일 경우, `synchronized`는 각 프로세스의 동시접근 제어만을 보장해주기 때문에 다른 서버에서 가변 공유데이터에 접근하는 것을 막을 수가 없어, 업데이트 도중 값이 변경될 수 있는 문제점이 여전히 남아 있습니다.(멀티 프로세스 환경 고려필요)
* synchronized는 blocking을 사용하여 멀티 스레드 환경에서 공유 객체를 동기화하는 키워드이기 때문에 blocking 성능 이슈가 발생할 가능성이 있습니다.
  * 특정 스레드가 해당 블록 전체에 lock을 걸면 해당 lock에 접근하는 스레드들이 blocking 상태로 들어간다는 점을 고려해야 합니다.

## 사용 예제

### 🤔 100개 수량이 있는 재고를 하나씩 감소시키는 요청 100개를 멀티스레드로 수행한다면? (위 동기화 문제 예제 동일)

<img width="610" alt="image" src="https://user-images.githubusercontent.com/58318786/236621379-24e66036-1b9f-4ddc-af2e-71a2074a2b56.png">

* synchronized 메서드 사용

<img width="476" alt="image" src="https://user-images.githubusercontent.com/58318786/236621435-78456fd8-105f-42dc-b860-3e7939fc08ee.png">

* synchronized 블록 사용

<img width="482" alt="image" src="https://user-images.githubusercontent.com/58318786/236621419-3852bba5-f068-4beb-b2c3-61b8ba8fd69e.png">

* 해당 테스트가 성공하는 것을 확인할 수 있다.

<img width="669" alt="image" src="https://user-images.githubusercontent.com/58318786/236621814-131f2085-9877-48a4-be97-031300d79709.png">

<br>

## 스레드 상태 제어 메서드 - `wait()`, `notify()`, `notifyAll()`

![image](https://user-images.githubusercontent.com/58318786/236622213-5f007eaa-8185-4f79-814d-11647bfeea80.png)

* 스레드는 생성된 후에 start() 메서드를 통해 Runnable과 Running 상태를 번갈아가며 실행되는데, JVM의 스레드 스케쥴러가 한정된 자원으로 인해 스레드를 교환해가며(컨텍스트 스위칭) 실행하기 때문입니다.
* 이 때 동기화된 스레드(보호구역에서 실행하고 있는 스레드) 혼자서는 동기화 블록에서 다른 스레드로 제어권을 넘길 수 없습니다.
* 따라서 동기화된 블록에서 스레드 간의 동기화에 대한 통신을 하기 위해서는 Object에 정의되어 있는 `wait()`, `notify()`, `notifyAll()` 메소드를 사용합니다.
* Monitor의 Condition Variable를 통해 메소드가 구현되어 있습니다.
* 단, ⚠️ synchronized 블록에서만 사용해야 합니다. (아닐 경우 java.lang.illegalMonitorStateException 발생)
* `wait()`: Lock을 가진 스레드가 다른 스레드에 Lock을 넘겨준 이후에 대기해야 할 때 사용합니다.
  * `wait()`를 사용하면 스레드는 WAITING 또는 TIME_WAITING 상태에 들어가면서 Non-Runnable 영역으로 들어갑니다.
  * `sleep()`은 현재 스레드를 잠시 멈추게 할 뿐 Lock을 release하지는 않습니다.
* `notify()`: 대기중인 임의의 스레드(우선순위가 높은 스레드)를 깨울 때 사용합니다.
* `notifyAll()`: 대기중인 모든 스레드를 깨울 때 사용합니다. -> 메서드 사용 시 하나의 스레드만 Lock을 획득하고 나머지 스레드는 다시 대기 상태에 들어갑니다.

<br>

## 참고 - 동시성 유틸리티

### Effective Java Item 81. wait와 notify보다는 동시성 유틸리티를 애용해라
* Java 5부터 도입된 고수준의 동시성 유틸리티가 `wait()`, `notify()`로 하드코딩 해야하는 일들을 대신 처리해줍니다.
* `java.util.concurrent`의 고수준 유틸리티로는 세 가지가 존재합니다.

1) 실행자 프레임워크
```java
// 작업 큐 생성
ExecutorService exec = Executors.newSingleThreadExecutor();

// 실행할 태스크 넘기기
exec.execute(runnable);

// 실행자 종료
exec.shutdown();
```

2) 동시성 컬렉션(concurrent collection)
* List, Queue, Map 같은 표준 컬렉션 인터페이스에 동시성을 구현한 고성능 컬렉션 
* 높은 동시성에 도달하기 위해 동기화를 각자의 내부에서 수행 
* Ex. ConcurrentHashMap, BlockingQueue,
  * ConcurrentHashMap은 내부적으로 여러 개의 락을 가지고 해시값을 이용해 이러한 락을 분할하여 사용합니다.
  * 분할 락을 사용하여 병렬성과 성능 모두 잡은 컬랙션입니다.
  * 내부적으로 여러 락을 사용해 일반적인 map을 사용할 때처럼 구현하면 내부적으로 알아서 락을 자동으로 사용해서 편리하게 사용할 수 있습니다.

3) 동기화 장치(synchronizer) 
* 스레드가 다른 스레드를 기다릴 수 있게 하여 서로 작업을 조율할 수 있게 함 
* Ex. CountDownLatch, Semaphore, Phaser

<br>

---

<br>

# Java의 동기화 키워드 - `java.util.concurrent.lock` 명시적 Lock
* `synchronized`으로 동기화하면 자동적으로 Lock을 사용할 수 있기 때문에 편리하지만 같은 메서드 내에서만 Lock을 걸 수 있다는 제약이 때로는 불편할 수 있습니다. 그럴 때 Lock클래스를 사용합니다.

## `ReentrantLock`: 재진입이 가능한 Lock이고 가장 일반적인 Lock
  * 재진입: 특정 조건에서 락을 풀었다가 나중에 다시 락을 걸 수 있음

<img width="400" alt="image" src="https://user-images.githubusercontent.com/58318786/236628421-f1f3feda-d1b4-4971-9340-243a457a243d.png">

<br>

### cf.) Condition
* `synchronized`로 동기화를 구현한 후 `wait()`, `notify()`를 사용하면 스레드의 종류를 구분하지 않고 공유 객체의 waiting pool에 같이 넣어서 필요한 스레드를 선택하는 것이 불가능했습니다.(임의의 스레드 or 전체 스레드 깨우기)
* 그러나 `ReentrantLock`과 `Condition`을 사용하면 쓰레드의 종류에 따라 구분된 waiting pool에서 따로 기다리도록 해 구분할 수 있습니다.
* => 경쟁 상태가 발생할 가능성이 낮아집니다.
* `wait()`와 `notify()`와 대응되는 `Condition method`

<img width="500" alt="image" src="https://user-images.githubusercontent.com/58318786/236638503-42f6737c-258c-44ed-b181-266afe2267d1.png">

<br>

## `ReentrantReadWriteLock`: 읽기 & 쓰기를 위한 Lock

<img width="500" alt="image" src="https://user-images.githubusercontent.com/58318786/236628570-9d30bb4c-377d-4738-9462-f5a073cfa5b2.png">

<img width="300" alt="image" src="https://user-images.githubusercontent.com/58318786/236628575-b72c3534-3e33-41c8-99ad-8988a3053f46.png">

<img width="300" alt="image" src="https://user-images.githubusercontent.com/58318786/236628580-8139a2b3-ef2e-4fae-8103-1edc43f00e67.png">

<img width="300" alt="image" src="https://user-images.githubusercontent.com/58318786/236633127-e9cb4de6-1618-49c0-a230-101519f6c584.png">

* 무조건 lock이 있어야만 임계 영역의 코드를 수행할 수 있는 ReentrantLock과 달리, 읽기 락이 걸려 있으면, 다른 쓰레드가 읽기 락을 중복해서 걸고 읽기를 수행할 수 있습니다. 
* 그러나 읽기 락이 걸린 상태에서 쓰기 락을 거는 것은 허용되지 않습니다. (반대도 마찬가지)
* ReentrantLock을 사용하기 위해서는 ReentrantLock 객체를 생성해야 합니다.
* lock을 걸고 싶은 위치에서 ReentrantLock 객체의 lock() 메서드를 호출하고, 해제하고 싶은 위치에서 unlock()을 호출하여 lock을 제어할 수 있습니다.

<br>

## `StampedLock`: 락을 걸거나 해지할 때 '스탬프(long 타입의 정수 값)'를 사용

![image](https://user-images.githubusercontent.com/58318786/236633458-f9b192c6-df22-45cd-aeaa-00884c673a1b.png)

* `ReentrantReadWriteLock`에 '낙관적 읽기 락(optimistic reading lock)'이 추가된 형태입니다.
* 읽기 락이 걸려있으면 쓰기 락을 얻기 위해서는 읽기 락이 풀릴 때까지 기다려야 하는데 비해 낙관적 읽기 락은 쓰기 락에 의해 바로 풀립니다.

<br>

---

<br>

# Java의 동기화 키워드 - Atomic Type (concurrent package 사용)
* Atomicity(원자성): 쪼갤 수 없는 가장 작은 단위를 의미합니다. 
* Java의 Atomic Type은 Wrapping 클래스의 일종으로, 참조 타입과 원시 타입 두 종류의 변수에 모두 적용이 가능합니다. 
* `java.util.concurrent.atomic` 패키지에 정의된 클래스입니다. 
* 사용시 내부적으로 CAS(Compare-And-Swap) 알고리즘을 사용해 lock 없이 동기화 처리를 할 수 있습니다.
  * 메모리 위치의 내용을 주어진 값과 비교 후 동일한 경우에만 해당 메모리 위치의 내용을 새로 주어진 값으로 수정합니다. 
  * 현재 주어진 값(현재 스레드에서의 데이터)과 실제 데이터를 비교해서 두 개가 일치할 때만 값을 업데이트 합니다. => `compareAndSet()` 
  * 현재 연산 중에서 스레드의 값과 메모리의 값이 다른 경우 중간에 다른 스레드를 통한 작업이 있었던 것으로 판단하여 write 중단하고 작업을 재시도합니다.

## 사용 방법
* 변수를 선언할 때 타입을 Atomic Type으로 선언합니다.
* 주요 클래스 
  * `AtomicBoolean` / `AtomicLong` / `AtomicIntegerArray` / `AtomicDoubleArray` 
* 주요 메소드 
  * `get()`
  * `set(newValue)`: 값 업데이트 
  * `getAndSet(newValue)`: 원자적으로 값 업데이트 후 원래 값 반환 
  * `compareAndSet(expect, update)`: 현재값과 예상값이 동일한 경우 update 후 true 반환, 그렇지 않을 경우 update없이 false만 반환

<br>

---

<br>

# Java의 동기화 키워드 - `volatile`
* 동시성 프로그래밍에서 발생할 수 있는 문제 중 하나인 가시성 문제를 해결하기 위해 사용되는 키워드입니다.
* volatile 키워드는 Java 변수를 Main Memory에 저장하겠다라는 것을 명시합니다. 
* 매번 변수의 값을 Read할 때마다 CPU cache에 저장된 값이 아닌 Main Memory에서 읽고, 변수의 값을 Write할 때마다 Main Memory에 작성합니다.

## Volatile 가시성?
* Volatile 변수를 사용하고 있지 않는 MultiThread 애플리케이션은 작업을 수행하는 동안 성능 향상을 위해서 Main Memory에서 읽은 변수를 CPU Cache에 저장합니다. 
* 만약 Multi Thread환경에서 Thread가 변수 값을 읽어올 때 각각의 CPU Cache에 저장된 값이 다르기 때문에 변수 값 불일치 문제가 발생할 수 있습니다.
=>  즉, 여러 개의 스레드가 사용됨에 따라, CPU Cache Memory와 RAM의 데이터가 서로 일치하지 않아 생기는 문제가 발생합니다. 
* 따라서 `volatile` 키워드를 붙인 공유 자원은 RAM에 직접 읽고 쓰는 작업을 수행할 수 있도록 해줍니다.

<br>

### volatile 사용 전

<img width="700" alt="image" src="https://user-images.githubusercontent.com/58318786/236639522-62d1a8e9-58fe-43d3-a2f5-caa1f52985d2.png">

* CPU1에서 수행된 스레드를 thread1, CPU2에서 수행된 스레드를 thread2라고 할 때 thread2는 CPU Cache Memory2와 RAM에 공유 변수인 stopRequested를 true로 쓰기 작업을 완료했는데, thread1은 CPU Cache Memory1에서 읽은 업데이트 되지 않은 stopRequested 값을 사용하고 있습니다.
* 이 값은 false이므로 계속해서 반복문을 수행하게 되면서 thread2가 수정한 값을 thread1이 언제 보게 될지 보증할 수 없고 이러한 문제를 가시성 문제라고 합니다.

<img width="618" alt="image" src="https://user-images.githubusercontent.com/58318786/236639537-36943a53-8d53-4d5e-826a-26a66d189be1.png">



<br>

### volatile 사용 후

<img width="653" alt="image" src="https://user-images.githubusercontent.com/58318786/236639552-e3c1b967-49c6-4617-86b5-2dcd598315c7.png">
* 이 문제를 해결하기 위해서는 stopRequested 변수를 volatile로 선언하면 됩나다. 

<img width="653" alt="image" src="https://user-images.githubusercontent.com/58318786/236639562-779c7ffb-9f4a-4f68-9f3a-f5482ec4732d.png">
* volatile을 사용하면 CPU Cache Memory를 거치지 않고, RAM으로 직접 읽고 쓰는 작업을 수행하게 됩니다.

<br>

## 🤔 Volatile은 어떤 상황에 사용할까요?
* Multi Thread의 안정성(데이터 무결성)을 확보한다고 여기저기 `synchronized` 혹은 `lock`을 남발한다면 Multi Thread 로직으로 인해 코드 복잡도만 높아지고, 실제 성능에 대한 효과는 크게 누리지 못할 것입니다. 즉, `lock`을 최소화하는 방법 중 하나로 `volatile`을 사용할 수 있습니다.
* ⚠️ 단, 하나의 Thread만이 연산(modify)을 해야 합니다. 만약 그렇다면 `lock`을 사용하지 않고 volatile 키워드만으로도 동시성 이슈를 해결할 수 있습니다.

<br>

## 🤔 그렇다면 가시성이 보장되면 동시성도 보장될까요?
* `volatile` 키워드는 `volatile` 변수를 메인 메모리로부터 읽을 수 있게 해주는 것이 전부이며 다른 스레드에 의해 이 값이 언제든지 바뀔 수 있습니다.
* 즉, 가시성이란 공유 데이터를 읽는 경우의 동시성만 보장해줍니다.

### cf.) 가시성 vs 원자성 
* 가시성: CPU - Cache - Memory 관계상의 개념 (메모리 가시성) 
* 원자성: 한 줄의 프로그램 문장이 컴파일러에 의해 기계어로 변경되면서, 이를 기계가 순차적으로 처리하기 위한 여러 개의 Machine Instruction이 만들어져 실행되기 때문에 일어나는 현상 (연산의 원자성)

### ❓ Ex. Q. 0이 들어있는 변수(i)에 10개의 스레드가 동시에 접근해서 `i++` 연산을 하면 우리 예상과 다르게 10이 나오지 않습니다. 왜 그럴까요?
* 📌 ++ 연산의 구체적인 동작:
  * i의 기존 값을 읽습니는다. (READ)
  * i에 1을 더합니다. (MODIFY)
  * i의 값을 변수에 할당합니다. (WRITE)

* 🤔 이를 두 개 Thread가 동시에 100회 수행한다고 했을때, 만약 i++이 원자성을 가지고 있는 연산이라고 하면 => 결과 200이어야 하겠지만, 실제로는 200보다 작은 값이 도출됩니다.
* **✅ 원인: i++이 3개의 instruction(READ-MODITY-WRITE)로 구성되어있기 때문입니다!**
  * Thread1이 값을 읽어 i + 1을 하기 직전에 Thread2가 i를 읽어 i + 1을 수행하고 반영하는 동작을 수행한다면 후자의 연산은 무효가 되는 현상이 발생합니다. 
  * 즉, 가시성 문제를 해결하더라도 원자성이 확보되지 못하면 원치 않는 결과가 도출될 수 있습니다.


<br>

---

<br>

# `Thread Local`
* 쓰레드 로컬은 해당 쓰레드만 접근할 수 있는 특별한 저장소 (ex. 물건 보관 창구)입니다. 
* 여러 사람이 같은 물건 보관 창구를 사용하더라도 창구 직원은 사용자를 인식해서 사용자별로 확실하게 물건을 구분합니다.
* 또한 사용자A, 사용자B 모두 창구 직원을 통해서 물건을 보관하고, 꺼내지만 창구 지원이 사용자에 따라 보관한 물건을 구분해줍니다.
* 자바는 언어차원에서 쓰레드 로컬을 지원하기 위한 java.lang.ThreadLocal 클래스를 제공

## Thread Local이 없을 때 발생할 수 있는 문제

<img width="839" alt="image" src="https://user-images.githubusercontent.com/58318786/236640769-c4ea1ef3-2c74-4445-9ba4-05f6bb53a263.png">

<br>

1. Thread-A 는 userA 를 nameStore 에 저장
2. Thread-B 는 userB 를 nameStore 에 저장
3. Thread-A 는 userB 를 nameStore 에서 조회
4. Thread-B 는 userB 를 nameStore 에서 조회

=> **동시성 문제**: Thread-A 입장에서는 저장한 데이터와 조회한 데이터가 다른 문제가 발생할 수 있습니다.

<br>

## Thread Local을 적용하면?

![image](https://user-images.githubusercontent.com/58318786/236640819-958532a4-314a-47db-a4df-c22c3c24b67b.png)

* 쓰레드 로컬을 사용하면 각 쓰레드마다 **별도의 내부 저장소를 제공**합니다. 
  * => 따라서 같은 인스턴스의 쓰레드 로컬 필드에 접근해도 문제가 생기지 않습니다. 
* 쓰레드 로컬을 통해서 데이터를 조회할 때 
  * thread-A가 조회하면 쓰레드 로컬은 thread-A 전용 보관소에서 userA 데이터를 반환합니다.
  * thread-B가 조회하면 thread-B 전용 보관소에서 userB 데이터를 반환합니다. 

## 🤔 Thread Local 사용 시 주의할 점은?
* 쓰레드 로컬의 값을 사용 후 제거하지 않고 그냥 두면 WAS(톰캣)처럼 쓰레드 풀을 사용하는 경우에 심각한 문제가 발생할 수 있습니다.

![image](https://user-images.githubusercontent.com/58318786/236640956-6e929f3c-f6a0-489a-a81d-0200525085b0.png)

### 사용자A 저장 요청
1. 사용자A가 저장 HTTP 요청 
2. WAS가 스레드풀에서 스레드를 하나 조회 
3. 스레드A 할당 
4. 스레드A가 사용자A의 데이터를 스레드 로컬에 저장 
5. 스레드 로컬의 스레드A 전용 보관소에 사용자A 데이터 보관

<br>

![image](https://user-images.githubusercontent.com/58318786/236640980-a3295136-e95d-4de6-9a5a-0848be8cc84a.png)

### 사용자A 저장 요청 종료
6. HTTP 응답 종료
7. WAS는 사용 끝난 스레드A를 스레드 풀에 반환(추후 스레드 재사용)
8. 현재 스레드A는 스레드풀에 재사용을 위해 살아있고 스레드 로컬의 스레드A 전용 보관소의 사용자 A의 데이터 역시 살아있음

<br>

### 사용자 B 조회 요청

![image](https://user-images.githubusercontent.com/58318786/236641026-a3287dfd-295c-4e33-8801-7fd2a146681d.png)

1. 사용자B가 조회를 위해 새로운 HTTP 요청 
2. WAS가 스레드풀에서 스레드를 조회 
3. 스레드A 할당(다른 스레드가 할당될 수도 있음)
4. 스레드A가 스레드 로컬에서 데이터 조회 
5. 스레드 로컬이 스레드A 전용 보관소에 있는 사용자A 값 반환 
6. 사용자A 값이 사용자B에게 전달 
7. 의도치 않은 값으로 사용자B에게 응답

* ✅ 따라서 `ThreadLocal.remove()`를 통해 스레드 로컬의 값을 꼭 제거해야 합니다.
