---
layout: post
title: "객체지향 생활 체조 원칙 - 규칙2, 규칙8"
author: "Poogle"
categories: [BackeEnd]
sitemap:
  changefreq: daily
  priority: 1.0
comments: true
tag: [CleanCode, OOP, 일급 컬렉션]

---

> 이 글은 [NEXTSTEP](https://edu.nextstep.camp/)의 TDD, Clean Code with Java 수업을 수강하며 내용을 정리한 포스트 입니다.

<br>

# 객체지향 생활 체조 원칙

객체지향 생활 체조 원칙은 [소트웍스 앤솔러지](http://wikibook.co.kr/thoughtworks-anthology/) 책에서 다루고 있는 내용으로 객체지향 프로그래밍을 잘 하기 위한 9가지 원칙을 제시하고 있다. 이 책에서 주장하는 9가지 원칙은 다음과 같다.

```
- 규칙 1: 한 메서드에 오직 한 단계의 들여쓰기(indent)만 한다.
- 규칙 2: else 예약어를 쓰지 않는다.
- 규칙 3: 모든 원시값과 문자열을 포장한다.
- 규칙 4: 한 줄에 점을 하나만 찍는다.
- 규칙 5: 줄여쓰지 않는다(축약 금지).
- 규칙 6: 모든 엔티티를 작게 유지한다.
- 규칙 7: 3개 이상의 인스턴스 변수를 가진 클래스를 쓰지 않는다.
- 규칙 8: 일급 콜렉션을 쓴다.
- 규칙 9: 게터/세터/프로퍼티를 쓰지 않는다.
```

<br>

## 규칙 2: else 예약어를 쓰지 않는다.
- 힌트: if 조건절에서 값을 return하는 방식으로 구현하면 else를 사용하지 않아도 된다.

```java
public int add(String text) {
    if (text == null || text.isEmpty()) {
        return 0;
    }
		return Integer.parseInt(text);
}
```
* if문 내부에서 조기 반환(early return) -> 간결해짐
* if문 대신 Enum을 활용 -> 객체지향적

---
<br>

## 규칙 8: 일급 콜렉션을 쓴다.
> 콜렉션을 포함한 클래스는 반드시 다른 멤버 변수가 없어야 한다. 각 콜렉션은 그 자체로 포장돼 있으므로 이제 콜렉션과 관련된 동작은 근거지가 마련된셈이다. 필터가 이 새 클래스의 일부가 됨을 알 수 있다. 필터는 또한 스스로 함수 객체가 될 수 있다. 또한 새 클래스는 두 그룹을 같이 묶는다든가 그룹의 각 원소에 규칙을 적용하는 등의 동작을 처리할 수 있다.이는 인스턴스 변수에 대한 규칙의 확실한 확장이지만 그 자체를 위해서도 중요하다. 콜렉션은 실로 매우 유용한 원시 타입이다.
많은 동작이 있지만 후임 프로그래머나 유지보수 담당자에 의미적 의도나 단초는 거의 없다. 

* Collection을 Wrapping하면서, 그 외 다른 멤버 변수가 없는 상태

### Ex. 로또 게임
* 6개 숫자로만 이루어지고
* 중복되지 않는 자료구조
```java
public class LottoBalls {

  private static final int LOTTO_SIZE = 6;
  private final Set<LottoBall> lottoBalls;

  public LottoBalls(List<LottoBall> lottoBalls) {
      this.lottoBalls = new HashSet<>(lottoBalls);
  }

  public static LottoBalls createLottoBalls(Set<Integer> lottoBallList) {
      validate(lottoBallList);
      return new LottoBalls(lottoBallList.stream()
              .map(LottoBall::valueOf)
              .collect(Collectors.toList()));
  }

  private static void validate(Set<Integer> lottoBallList) {
      if (lottoBallList.size() != LOTTO_SIZE) {
          throw new IllegalArgumentException(SIZE_MESSAGE);
      }
  }
```
  * 비즈니스에 종속적인 자료구조
  * 컬렉션의 불변 보장
  * 상태와 행위를 한 곳에서 관리
  * 이름이 있는 컬렉션
