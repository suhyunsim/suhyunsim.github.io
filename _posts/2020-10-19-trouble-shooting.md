---
layout: post
title: "Photo Tag 개발기록 - 3"
author: "Poogle"
categories: [Project]
sitemap:
  changefreq: daily
  priority: 1.0
comments: true
tag: [Project, Photo-Tag, REST]

---

# Trouble Shooting - RESTFUL

## Restful?

* 태그 추천 API는 사용자가 사진을 찍고 해당 사진에 관한 메모를 적을 때 추천해줄만한 단어들을 제공하는 API
* 어떤 photo에 대한 추천 태그를 클라이언트가 서버로 요청하면, 서버는 해당 사진을 Kakao Vision API로 다시 요청을 보냄

### Q. 해당 API를 만들 때 적합한 url 이름은 무엇일까?
=> 현재 구현된 API: GET 요청 `{base url}/tags/suggestion?photo={photo}`

### Q. 그런데 Photo가 여러 장이라면? Request Parameter에 여러 장의 photo 정보를 담아서 보내는가?
* 태그를 추천할 때 사진을 꼭 여러 장을 한 번에 보내야 할까
  * 여러 장을 한 번에 보내면 여러 번 요청할 비용을 줄이는 것에서 의미가 있음
* GET 요청에 Request Body를 활용해도 되는가?

> [참고한 StackOverFlow](https://stackoverflow.com/questions/978061/http-get-with-request-body)
![스크린샷, 2021-05-20 00-25-07](https://user-images.githubusercontent.com/58318786/118839981-f4513280-b901-11eb-8c75-67bd7b44ec1e.png)
![스크린샷, 2021-05-20 00-25-16](https://user-images.githubusercontent.com/58318786/118839987-f5825f80-b901-11eb-8c82-3f468bc6a528.png)

* 어쨌든 최대한 GET 요청에는 Request Body를 쓰지 않는 것이 좋음
* 그런데 결국 구현하고 보니 MultiPart File을 요청 보낼 때는 Body를 고민할 필요가 없었음

### 그런 REST API로 괜찮은가 - 참고
> [2017 DEVIEW 그런 REST API로 괜찮은가 강의 자료](https://slides.com/eungjun/rest)

> [2017 DEVIEW 그런 REST API로 괜찮은가 강의](https://tv.naver.com/v/2292653)

> [Your API isn't RESTful - And That's Good](https://medium.com/@trevorhreed/you-re-api-isn-t-restful-and-that-s-good-b2662079cf0e)

> [Richardson Maturity Model](https://devopedia.org/richardson-maturity-model#summary)

* 강의 주 내용
  - 오늘날 대부분의 "REST API"는 사실 REST를 따르지 않고 있다.
  - REST의 제약조건 중에서 특히 **Self-descriptive**와 **HATEOAS**를 잘 만족하지 못한다.
  - REST는 **긴 시간에 걸쳐(수십년) 진화**하는 웹 애플리케이션을 위한 것이다.
  - REST를 따를 것인지는 API를 설계하는 이들이 스스로 판단하여 결정해야한다.
  - REST를 따르겠다면, **Self-descriptive**와 **HATEOAS**를 만족시켜야한다.Self-descriptive는 **custom** **media type**이나 **profile** **link relation** 등으로 만족시킬 수 있다.HATEOAS는 HTTP 헤더나 본문에 **링크**를 담아 만족시킬 수 있다.
  - REST를 따르지 않겠다면, "REST를 만족하지 않는 REST API"를 뭐라고 부를지 결정해야 할 것이다.HTTP API라고 부를 수도 있고그냥 이대로 REST API라고 부를 수도 있다. (roy가 싫어합니다)

* 지금까지 내가 RESTful하게 구현한다고 했던 API는 단순히 url 명명 규칙, 관습에 대한 아주 사소한 부분이었다. 진정한 REST API를 Photo Tag에 적용하기 위해서는 많은 것들을 변경해야 할 것 같다.