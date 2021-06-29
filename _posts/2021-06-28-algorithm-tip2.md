---
layout: post
title: "알고리즘 팁 - 2"
author: "Poogle"
categories: [Algorithm]
sitemap:
  changefreq: daily
  priority: 1.0
comments: true
tag: [List, Array, stream, 내림차순 정렬]

---

# 정렬 - 내림차순 정렬
* `Collections.reverse()`: 내림차순 정렬 아니고 리스트 구성을 반대로 뒤집는 것

```java
int[] arr = {5, 3, 1, 4, 6, 8, 7, 2};
Integer[] intArr = Arrays.stream(arr).boxed.toArray(Integer[]::new);
Arrays.sort(intArr, Comparator.reverseOrder());
```


```java
int[] arr = {5, 3, 1, 4, 6, 8, 7, 2};
List<Integer> intlist = Arrays.stream(arr).boxed.sorted(Comparator.reverseOrder()).collect(Collectors.toList());
```

---

# Comparable과 Comparator
* 객체를 내가 원하는 정렬 방식으로 정렬하고 싶을 때
* Comparable: `java.lang`
* Comparator: `java.util`
## Comparable
* 같은 타입의 인스턴스끼리 서로 비교할 수 있는 클래스들, 주로 Integer와 같은 wrapper 클래스, String, Date, File과 같은 것들
* 정렬할 때 기본적으로 적용되는 정렬 기준 메서드를 정의하는 인터페이스
* 정렬할 객체에 Comparable implements하고 `compareTo()` 오버라이드
    * 현재 < 파라미터 -> 음수 리턴
    * 현재 == 파라미터 -> 0 리턴
    * 현재 > 파라미터 -> 양수 리턴

```java
public interface Comparable {
    int compareTo(Object o);
}
```

## Comparator
* 기본 정렬기준 외에 다른 기준으로 정렬하고자 할 때 사용
* 정렬할 객체에 Comparator implements하고 `compare()` 오버라이드
    * 첫 번째 파라미터 < 두 번째 파라미터 -> 음수 리턴
    * 첫 번째 파라미터 == 두 번째 파라미터 -> 0 리턴
    * 첫 번째 파라미터 > 두 번째 파라미터 -> 양수 리턴
```java
class MyComparator implements Comparator<Point> {
    @Override
    public int compare(Point p1, Point p2) {
        if (p1.x > p2.x) { //x에 대해서는 오름차순
            return 1;
        } else if (p1.x == p2.x) {
            if (p1.y < p2.y) { //y에 대해서는 내림차순
                return 1;
            }
        }
        return -1;
    }
}
```

> 참고: https://gmlwjd9405.github.io/2018/09/06/java-comparable-and-comparator.html
