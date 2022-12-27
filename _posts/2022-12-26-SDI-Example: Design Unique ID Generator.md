---
layout: post
title: "SDI Example - Design A Unique ID Generator in Distributed Systems"
author: "Poogle"
categories: [BackEnd]
sitemap:
changefreq: daily
priority: 1.0
comments: true
tag: [System Design Interview, Multi-Master Replication, UUID, Ticket Server, Twitter Snowflake]

---

> 참고 링크
> 
> [책 - 가상 면접 사례로 배우는 대규모 시스템 설계 기초](http://www.yes24.com/Product/Goods/102819435)

# Example - Design A Unique ID Generator in Distributed Systems
## Step 1
### Questions & Answers
* Q. What are the characteristics of unique IDs? 
  * A. IDs must be **unique** and **sortable**.
* Q. For each new record, does ID increment by 1?
  * A. The ID increments by **time** but not necessarily only increments by 1. (IDs created evening > IDs created morning(same day)) 
* Q. Do IDs only contain **numerical** values? 
  * A. O
* Q. What is the ID **length** requirement? 
  * A. IDs should fit into 64-bit. 
* Q. What is the **scale** of the system?
  * A. The system should be able to generate 10,000 IDs per second.

### Summary
* IDs must be unique.
* IDs are numerical values only.
* IDs fit into 64-bit.
* IDs are ordered by date.
* Ability to generate over 10,000 unique IDs per second.

---

<br>

## Step 2
### Options
* Multi-master replication
  * use DB's auto_increment feature
  * increase next id by k(number of servers in use)
  * ❌
    * Hard to scale with multiple data centers
    * IDs do not go up with time across multiple servers
    * Does not scale well when a server is added or removed
* Universally unique identifier (UUID)
  * 128-bit number to identify information in computer systems
  * low probability of getting collusion
  * generate independently without coordination between servers
  * ✅
    * simple
    * No coordination between servers is needed -> X synchronization issues 
    * easy to scale -> because each web server is responsible for generating IDs they consume
  * ❌
    * 128 bits (> 64 bits)
    * X go up with time
    * non-numeric
* Ticket server
  * centralized auto_increment feature in a single database server (Ticket Server)
  * ✅
    * Numeric Ids
    * easy to implement
    * works for small ~ medium scale application
  * ❌
    * Ticket Server -> SPOF(Single-Point-of-Failure)

### Blueprint

![Blank diagram - Page 1 (4)](https://user-images.githubusercontent.com/58318786/209671011-03bf7f6c-4ec4-4084-95e6-ff9927e84a3a.jpeg)


---

<br>

## Step 3
### Design Deep Dive - Twitter snowflake approach
* TimeStamp
  * As timestamps grow with time, IDs are sortable by time.
  * Maximum (in 41bits): 2 ^ 41 - 1 = 2199023255551 milliseconds (ms)
    * ~ 69 years = 2199023255551 ms / 1000 seconds / 365 days / 24 hours/ 3600 seconds
    * ID generator will work for 69 years and having a custom epoch time close to today’s date delays the overflow time
    * After 69 years -> need a new epoch time or adopt other techniques to migrate IDs.

* Sequence number
  * Maximum (12 bits): 2 ^ 12 = 4096 combinations
    * support a maximum of 4096 new IDs per millisecond.
  * This field is 0 unless more than one ID is generated in a millisecond on the same server

---

<br>

## Step 4
### Wrap up - additional talking points
* Clock synchronization
  * In our design -> assume servers have the same clock
  * -> X when a server is running on multiple cores, multi-machine scenarios
  * => Solution: Network Time Protocol
* Section length tuning
  * ex. if) low concurrency & long-term applications => fewer sequence numbers(↓) but more timestamp bits(↑) => effective
* High availability
  * Since an ID generator is a mission-critical system, it must be highly available.
