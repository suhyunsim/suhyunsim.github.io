---
layout: post
title: "HandlerMethodArguementResolver"
author: "Poogle"
categories: [BackEnd]
comments: true
tag: [Pageable, offset, limit, HandlerMethodArguementResolver]

---

# HandlerMethodArguementResolver 사용 방법
> 프로젝트 구현 중 Pageable을 구현하다가 공통적으로 적용되는 offset, limit 파라미터를 위해 HandlerMethodArguementResolver를 공부하게 되었다.

## HandlerMethodArguementResolver란?
- Spring MVC에서 공통적으로 사용하는 파라미터 바인딩
- 특정 클래스나 특정 어노테이션 등의 요청 파라미터를 수정, 조작
- 인터페이스는 사용자의 요청이 Controller에 도달하기 전에 그 요청의 파라메터들을 수정할 수 있게 도와줌

### 예제 코드
- 구현한 것
    - offset,limit를 Query Parameter로 받아 Pageable 구현체를 생성해주는 `HandlerMethodArgumentResolver` 인터페이스 구현체
    ⇒ `PageableHandlerMethodArgumentResolver`

```java

import org.springframework.web.method.support.HandlerMethodArgumentResolver;

import static org.apache.commons.lang3.math.NumberUtils.toInt;
import static org.apache.commons.lang3.math.NumberUtils.toLong;

public class PageableHandlerMethodArgumentResolver implements HandlerMethodArgumentResolver {

  private Pageable pageable;

  public void setPageable(Pageable pageable) {
    this.pageable = pageable;
  }

  @Override
  public boolean supportsParameter(MethodParameter methodParameter) {
    return Pageable.class.isAssignableFrom(methodParameter.getParameterType());
  }

  @Override
  public Object resolveArgument(MethodParameter methodParameter,
                                ModelAndViewContainer modelAndViewContainer,
                                NativeWebRequest nativeWebRequest,
                                WebDataBinderFactory webDataBinderFactory) throws Exception {
    long offset = toLong(nativeWebRequest.getParameter("offset"), pageable.offset());
    int limit = toInt(nativeWebRequest.getParameter("limit"), pageable.limit());

    return new PageableRequest(offset, limit);
  }
}
```
- `supportsParameter()`: 바인딩 할 클래스 지정
- `resolveArgument()`: 바인딩 할 객체를 조작할 수 있는 메서드
    - 예를 들면 객체를 생성하여 해당 객체에 데이터를 입력해줄 수 있는 메서드

<br>

- Configuration에 등록하기
```java
@Configuration
public class WebMvcConfigure implements WebMvcConfigurer {

  @Bean
  public PageableHandlerMethodArgumentResolver pageableHandlerMethodArgumentResolver() {
    PageableHandlerMethodArgumentResolver resolver = new PageableHandlerMethodArgumentResolver();
    //default
    resolver.setPageable(new PageableRequest(0, 5));
    return resolver;
  }

  @Override
  public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
    argumentResolvers.add(pageableHandlerMethodArgumentResolver());
  }
}
```

