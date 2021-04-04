---
layout: post
title: "ParameterizedTest"
author: "Poogle"
categories: [BackEnd]
sitemap:
  changefreq: daily
  priority: 1.0
comments: true
tag: [TDD, ParameterizedTest, ValueSource, MethodSource, NullAndEmptySource]

---

## `@ParameterizedTest`

### `@ValueSource`

- 해당 어노테이션에 지정한 배열을 파라미터 값으로 순서대로 넘겨줌
- 테스트 메소드 실행 당 하나의 인수만을 전달할 때 사용
- 리터럴 값의 배열을 테스트 메서드에 전달

```java
@ParameterizedTest
@DisplayName("5자 이하의 이름을 가진 자동차 생성 테스트")
@ValueSource(strings = {"pobi", "crong", "honux"})
void createCarWithName(String name) {
    car = new Car (name);
    assertThat(car.getName()).isEqualTo(name);
}
```

### `@MethodSource`

- 보다 복잡한 인수를 제공하는 방법으로 method를 argument source로 사용
- `@MethodSource` 에 설정하는 이름은 존재하는 메서드 이름
- argument source method 조건
    - Stream<Arguments> (혹은 Iterable, Iterator) 또는 List와 같은 컬렉션과 유사한 interface 를 반환할 수 있다.
    - 클래스 단위 생명 주기가 아닌 경우, static method 여야 한다.
- `@MethodSource`를 이용하면 다른 테스트 클래스 간에 인수를 공유하는 것이 유용하다.

```java
static Stream<Arguments> **distances**() {
    return Stream.of(
            Arguments.of(new MoveStrategy[]{() -> false, () -> false, () -> false}, new Car(carName, 0)),
            Arguments.of(new MoveStrategy[]{() -> true, () -> true, () -> true}, new Car(carName, 3)),
            Arguments.of(new MoveStrategy[]{() -> true, () -> false, () -> true}, new Car(carName, 2))
    );
}

@ParameterizedTest
@DisplayName("이동거리 확인 테스트")
@MethodSource("**distances**")
void checkPosition(MoveStrategy[] positions, Car expected) {
    for (MoveStrategy moveStrategy : positions) {
        car = car.move(moveStrategy);
    }
    assertEquals(expected, car);
}
```

### `@NullAndEmptySource`
- Null과 공백을 모두 테스트 하기 위해 사용하는 어노테이션
```java
    @ParameterizedTest
    @DisplayName("생성자 테스트")
    @NullAndEmptySource
    void create(String input) {
        assertTrue(Strings.isNullOrEmpty(input));
    }
```