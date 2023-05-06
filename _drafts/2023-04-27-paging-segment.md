---
layout: post
title: "paging과 segmentation에 대해 알아보기"
author: "Poogle"
categories: [BackEnd]
sitemap:
changefreq: daily
priority: 1.0
comments: true
tag: [가상메모리, paging, segmentation]

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
> [[컴퓨터 공학 기초 강의] 38강. 페이징을 통한 가상 메모리 관리](https://www.youtube.com/watch?v=8ufliWkgqMo)
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

백엔드 개발자 면접을 준비하면서 자주 접하게 된 키워드 **`paging`** 과 **`segment`**. 이번 글에서는 아래 정리한 순서에 따라 **`paging`** 과 **`segment`** 에 관련된 여러 가지 주제들을 다뤄보려고 합니다.

<br>

```text

```

<br>

운영체제가 메모리를 어떤 식으로 관리하는가? -> 연속 메모리 할당
프로세스가 연속적으로 메모리 할당되는 것

문제?

운영체제 메모리 관리하는 법: 스와핑
현재 당장 사용되지 않는 프로세스들을 보조기억장치의 일부 영역(스왑영역)으로 쫓아내고(스왑아웃) 그렇게 생긴 빈 공간에 새 프로게스 적재(스왑 인)

프로세스들이 요구하는 메모리 공간 크기보다 실제 메모리 크기가 작아도(요구 > 실제) 함께 실행 가능

메모리 할당
프로세스는 메모리의 빈 공간(적재 가능 공간)
연속메모리할당 방식에는 3가지 (어떻게 어떤 빈 공간에 적재할것인지)
* 최초 적합 first-fit: 빈공간 순서대로 검색하다가 적재할 수 있는 공간을 발견하면(최초) 그 공간에 프로세스를 배치하는 방식
  * 빈 공간을 검색하는 시간이 최소화됨, 빠른 할당
* 최적 적합 best-fit: 운영체제가 비어있는 공간을 모두 검색하고 적재 가능한 가장 작은 곳으로 배치
* 최악 적합 worst-fit:  운영체제가 비어있는 공간을 모두 검색하고 적재 가능한 가장 큰 곳으로 배치


근데 이거는 비효율적
왜? 외부 단편화 잠재적 문제가 발생하기 때문
프로세스들이 실행되고 종료되길 반복하며 메모리 사이 사이에 빈 공간이 발생함
-> 프로세스를 할당하기 어려울만큼 작은 메모리공간들로 인해 메모리가 낭비되는 현상

어떻게 해결하냐
1) 메모리압축(compaction)
메모리 내 흩어져 있는 빈 공간들을 하나로 모으는 방식
프로세스를 적당히 재배치 시켜 흩어져 있는 작은 빈 공간들을 하나의 큰 공간으로 만들기
=> 오버헤드 발생, 프로세스 어떻게 해야 할 지  

2) 가상메모리 기법(페이징)


페이징과 세그멘테이션: 가상메모리 관리 기법 중 하나

페이징이 더 많이 쓰임

가상메모리: 실행하고자 하는 프로그램을 일부만 메모리에 적재해서 실제 물리 메모리 크기보다 큰 프로세스를 실행할 수 있게 하는 기술 

페이징이란?
페이징으로 외부 단편화를 해결할 수 있음
외부단편화?
왜 발생? - 각기 다른 프로세스가 메모리에 연속적으로 할당
