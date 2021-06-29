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

### Map 정렬하기 - List를 이용
* keySet이나 values를 List로 가져와서 정렬하기

```java
Map<String, Integer> map = new HashMap<>();
map.put("Poogle", 3);
map.put("Lena", 1);
map.put("Solar", 2);
map.put("Jay", 5);

List<String> keyList = new ArrayList<>(map.keySet());
keyList.sort((s1, s2) -> s1.compareTo(s2));
// keyList.sort(String::compareTo); 도 가능

for (String key : keyList) {
    System.out.println("key: " + key);
}
```
### Map 정렬하기 - Collections.sort 이용(오름차순,  내림차순)
```java
Map<String, Integer> map = new HashMap<>();
map.put("Poogle", 3);
map.put("Lena", 1);
map.put("Solar", 2);
map.put("Jay", 5);

List<String> keyList = new ArrayList<>(map.keySet());

//오름차순
Collections.sort(keyList, (value1, value2) -> (map.get(value1).compareTo(map.get(value2))));

//내림차순
Collections.sort(keyList, (value1, value2) -> (map.get(value2).compareTo(map.get(value1))));

for (String key : keyList) {
    System.out.println("key: " + key);
    System.out.println("value: " + map.get(key));
}

```

### Map 정렬하기 - Stream을 이용
```java
Map<String, Integer> map = new HashMap<>();
map.put("Poogle", 3);
map.put("Lena", 1);
map.put("Solar", 2);
map.put("Jay", 5);

//key로 정렬하기
List<Map.Entry<String, Integer>> entries = map.entrySet().stream()
        .sorted(Map.Entry.comparingByKey())
        .collect(Collectors.toList());

//value로 정렬하기
entries = map.entrySet().stream()
        .sorted(Map.Entry.comparingByValue())
        .collect(Collectors.toList());

for (Map.Entry<String, Integer> entry : entries) {
    System.out.println("key: " + entry.getKey());
    System.out.println("value: " + entry.getValue());
}
```

