---
layout: post
title: "SDI Example - Design a Rate Limiter"
author: "Poogle"
categories: [BackEnd]
sitemap:
changefreq: daily
priority: 1.0
comments: true
tag: [System Design Interview, Rate Limiter, ]

---

> 참고 링크
> 
> [책 - 가상 면접 사례로 배우는 대규모 시스템 설계 기초](http://www.yes24.com/Product/Goods/102819435)



# Example - Design a Rate Limiter
## Step 1
### Questions & Answers
* Q. What kind? client-side rate limiter or server-side API rate limiter? 
  * A. **server-side**
* Q. Does the rate limiter throttle(limit rule) API requests based on IP, the user ID, or other properties? 
  * A. **flexible** enough to support different sets of throttle rules
* Q.scale of the system? (startup / big company) 
  * A. must be able to handle a **large number of requests** 
* Q. work in a **distributed environment**?
  * A. O
* Q. Is the rate limiter a separate service or should it be implemented in application code? 
  * A. up to you
* Q. Do we need to **inform** users who are throttled?
  * A. O

### Requirements 
* **Accurately** limit excessive requests.
* **Low latency**. The rate limiter should not slow down HTTP response time.
* Use as **little memory** as possible.
* **Distributed** rate limiting. The rate limiter can be **shared** across multiple servers or processes.
* **Exception handling**. Show clear exceptions to users when their requests are throttled.
* **High fault tolerance**. If there are any problems with the rate limiter (ex. cache server goes offline) -> it does not affect the entire system.

---

<br>

## Step 2
### Blueprint
* Need a **counter** -> to keep track of how many requests are sent from the same user, IP address, etc 
* If the counter is larger than the limit -> the request is disallowed.
* Where?
  * DB: X -> slowness of disk access
  * In-memory cache(Redis): O -> fast and supports time-based expiration strategy
  * 2 commands: `INCR`(Increase counter +1) / `EXPIRE`(Timeout value)

![Blank diagram - Page 1](https://user-images.githubusercontent.com/58318786/209582326-f14928d9-b8b7-459e-9c22-e3e5022d5513.jpeg)

---

<br>

## Step 3
### Design Deep Dive
* How are rate limiting rules created?
* Where are the rules stored? 
* How to handle requests that are rate limited?
* How does a client know whether it is being throttled?
* How does a client know the number of allowed remaining requests before being throttled?
  * => **HTTP Response Header**
    * `X-Ratelimit-Remaining`: the remaining number of allowed requests within the window
    * `X-Ratelimit-Limit`: how many calls the client can make per time window
    * `X-Ratelimit-Retry-After`: the number of seconds to wait until you can make a request again without being throttled
      * `429 too many requests` response

<br>

### Detail design in Single Server

![Blank diagram - Page 1 (2)](https://user-images.githubusercontent.com/58318786/209584227-bfe76331-54e1-4339-ada7-c427af89a45a.jpeg)

### Distributed Environment
* **Race Condition**
  * If two requests concurrently read the counter value before either of them writes the value back,
  * Each will increment the counter by one and write it back without checking the other thread.
  * => Solutions
    * Lock -> but slow down the system
    * Lua Script
    * Redis Sorted Set
* **Synchronization Issue**
  * When multiple RLM used -> synchronized need
  * => Solutions
    * Sticky Session: allow a client to send traffic to the same rate limiter -> X advisable (X scalable, X flexible)
    * Use centralized data stores (Redis)

### Performance Optimization
* **Multi-data center setup**
  * latency is high for users located far away -> multi reduce latency
* **Synchronize data with an eventual consistency model**

### Monitoring
* CheckList
  * The rate limiting algorithm is effective.
    * check effectiveness for supporting burst traffic
  * The rate limiting rules are effective.
    * not to drop so many valid requests

---

<br>

## Step 4
### Wrap up - additional talking points
* Hard vs Soft rate limiting
  * hard: requests X exceed threshold
  * soft: requests can exceed threshold for a short period
* Rate Limiting in different levels
  * Application Layer(7) -> HTTP 
  * Network Layer(3) -> IP tables
* Avoid being rate limited
  * Use client cache to avoid making frequent API calls. 
  * Understand the limit and do not send too many requests in a short time frame. 
  * Include code to catch exceptions or errors so your client can gracefully recover from exceptions. 
  * Add sufficient back-off time to retry logic.
