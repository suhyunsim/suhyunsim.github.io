---
layout: post
title: "SDI Example - Design A URL Shortener"
author: "Poogle"
categories: [BackEnd]
sitemap:
changefreq: daily
priority: 1.0
comments: true
tag: [System Design Interview]

---

> 참고 링크
> 
> [책 - 가상 면접 사례로 배우는 대규모 시스템 설계 기초](http://www.yes24.com/Product/Goods/102819435)
>
> [유튜브 - URL shortener system design, tinyurl system design, bitly system design](https://www.youtube.com/watch?v=JQDHz72OA3c)
> 
> [유튜브 - System Design : Design a service like TinyUrl](https://www.youtube.com/watch?v=fMZMm_0ZhK4)

# Example - Design A URL Shortener
## Step 1
### Questions & Answers
* Q. Example?
  * A. `https://www.systeminterview.com/q=chatsystem&c=loggedin&v=v3&l=long` => `https://tinyurl.com/y7keocwj` => click -> redirects you to the original URL
* Q. What is the traffic volume? 
  * A. 100 million URLs are generated per day.
* Q. How long is the shortened URL? 
  * A. As short as possible.
* Q. What characters are allowed in the shortened URL? 
  * A. combination of numbers (0-9) and characters (a-z, A- Z).
* Q. Can shortened URLs be deleted or updated?
  * A. For simplicity, X

### Summary
* URL shortening: given a long URL => return a much shorter URL 
* URL redirecting: given a shorter URL => redirect to the original URL 
* High availability
* scalability
* fault tolerance considerations

### Estimation
* Write operation: 100 million URLs are generated per day.
* Write operation per second: 100 million / 24 / 3,600 = 1,160
* Read operation: Assuming ratio of read operation to write operation is 10:1
* Read operation per second: 1,160 * 10 = 11,600 
* Assuming the URL shortener service will run for 10 years, this means we must support 100 million * 365 * 10 = 365 billion records. 
* Assume average URL length is 100. 
* Storage requirement over 10 years: 365 billion * 100 bytes * 10 years = 365 TB 

---

<br>

## Step 2
### Blueprint - API Endpoints
* REST Style

1. **URL Shortening**: create a new short URL
* `POST /api/v1/data/shorten`
* Request Body
```json
  { 
    "long url": "longURLString"
  } 
```
* Response: short URL

2. **URL Redirecting**: redirect a short URL
* `GET /api/v1/shortUrl`
* Response: long URL for HTTP redirection

![Blank diagram - Page 1 (6)](https://user-images.githubusercontent.com/58318786/209703847-786e6810-4769-4d79-997e-6f47c9f47500.jpeg)

* 301 Permanently Moved
  * requested URL is `permanently` moved to the long URL
  * the browser caches the response -> subsequent requests for the same URL will not be sent to the URL shortening service
  * requests are redirected to the long URL server directly
  * 👍 reduce server load
* 302 Redirect
  * requested URL is `temporarily` moved to the long URL
  * -> subsequent requests for the same URL will be sent to the URL shortening service first
  * -> Then they are redirected to the long URL server
  * 👍 analytics - track click rate and source of the click more easily

### URL shortening
* Hash function -> maps a long URL to the hash value
* Requirements
  * Each `longURL` -> hashed to one `hashValue`
  * Each `hashValue` -> can be mapped back to `longURL`

---

<br>

## Step 3 - Design Deep Dive
### Data Model -> save to DB

![Blank diagram - Page 1 (9)](https://user-images.githubusercontent.com/58318786/209710680-7143f6c8-0a24-44b0-b1e1-85340cd91b75.jpeg)

### Hash functions

![Blank diagram - Page 1 (7)](https://user-images.githubusercontent.com/58318786/209709538-894437e3-6e25-43a8-8160-bd8eabe57e4f.jpeg)
* Hash + Collision Resolution
  * Hash Function
    * CRC32
    * MD5
    * SHA-1
  * To make it shorter -> collect the first 7 characters(n = 7) => hash collision
    * recursively append a new predefined string until no more collision is discovered
    * => eliminate collision
    * ⚠️  expensive to query the database to check if a shortURL exists for every request
    * => bloom filters(space-efficient probabilistic technique to test if an element is a member of a set)

<br>

![Blank diagram - Page 1 (10)](https://user-images.githubusercontent.com/58318786/209712488-83c1a398-244e-439f-8a4c-b35421332b1a.jpeg)

* Base 62 conversion
  * `[0-9, a-z, A-Z]`: 10 + 26 + 26 = 62
  * length of hash value(n)
    * 62^n >= 365 billion
    * n = 7

### Hash + Collision Resolution vs Base 62 conversion
* 
* HCR
  * Fixed short URL length
  * X need unique ID generator
  * O Collision -> resolved
  * X to figure out next available shortURL -> X depend on ID
* Base62
  * not fixed -> go up with ID
  * O need unique ID generator
  * X Collision (ID unique)
  * O figure out next available shortURL if ID increments by 1 -> security concern

### URL Redirection

![Blank diagram - Page 1 (11)](https://user-images.githubusercontent.com/58318786/209713470-b90e67f4-34f0-4208-996f-f3656fcfe9ff.jpeg)


---

<br>

## Step 4
### Wrap up - additional talking points
* Rate limiter
  * A potential security problem: malicious users send an overwhelmingly large number of URL shortening requests
  * Rate limiter filter out requests based on IP address or other filtering rules
* Web server scaling
  * web tier: stateless -> easy to scale the web tier by adding or removing web servers.
* Database scaling
  * Database replication & sharding
* Analytics
  * How many people click
  * When people click
* Availability, consistency, and reliability