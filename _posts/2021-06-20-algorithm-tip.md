---
layout: post
title: "알고리즘 팁 - 1"
author: "Poogle"
categories: [Algorithm]
sitemap:
  changefreq: daily
  priority: 1.0
comments: true
tag: [List, Array, stream, map]

---

# List <-> Array
## int 아닐 때
### Array -> List
```java
String[] arr = {"a", "b", "c"};
List<String> list = Arrays.asList(arr);
```
* list를 변경하지 않고 arr를 변경하면 list값도 같이 변됨
* arr를 변경하지 않고 list를 변경하면 arr값도 같이 변경됨

```java
String[] arr = {"a", "b", "c"};
List<String> list = new ArrayList<>(Arrays.asList(arr));
```
* 원본배열과 변환 리스트의 동기화를 막기 위해서 새로운 ArrayList 객체를 생성해서 사용

```java
String[] arr = {"a", "b", "c"};
List<String> list = Stream.of(arr).collect(Collectors.toList)
```
* Stream 사용 가능

### List -> Array
```java
ArrayList<String> list = new ArrayList<String>();
list.add("a");
list.add("b");
list.add("c");

String[] arr = list.toArray(new String[arr.size()]);
```
## int일 때
* primitive 타입(int)을 wrapper 클래스(Integer)으로

### Array -> List
```java
int[] arr = {1, 2, 3};
List<Integer> list = Arrays.stream(arr)
                            .boxed()
                            .collect(Collectors.toList());
```

### List -> Array
```java
ArrayList<Integer> list = new ArrayList<Integer>();
list.add(1);
list.add(2);
list.add(3);

int[] arr = list.stream()
                .mapToInt(i -> i)
                .toArray();
```

---

# Stream - distinct()
```java
List<String> names = Arrays.asList("a", "a", "b", "c", "c");
names.stream()
     .distinct()
     .forEach(System.out::println);
```
* 중복 제거

---

# Map에서 Key, Value 활용
### Map의 key값, value 값 중 최대값
```java
Map<Integer, Integer> map = new HashMap<>();
map.put(1, 2);
map.put(2, 12);
map.put(3, 12);
map.put(4, 23);

int max = Collections.max(map.values());

for (Map.Entry<Integer, Integer> m : map.entrySet()) {
    if (m.getValue() == max) {
        System.out.println(m.getKey());
    }
}
```
* value 값에 중복이 있을 때 최대 value값을 갖는 key를 찾기 위해서 -> max값을 한 번 찾고 Map을 순회해서 같은 최대값들을 찾아내기