---
layout: post
title: "Jekyll 블로그 되살리기! 🧐"
author: "Poogle"
categories: [Others]
sitemap:
  changefreq: daily
  priority: 1.0
comments: true
tag: [jeykyll]

---

# 저는 약 1 - 2년 전 Windows를 쓰던 노트북으로 jekyll 블로그를 만들었습니다. 그리고...
새 맥북으로 블로그 포스트를 작성하게 되었습니다! 야호
<br>
신나게 포스트를 작성하려는데... 블로그를 어떻게 관리했는지 기억이 안 나네요 🙃?!?!
<br>
블로그 Repository를 clone 받아서 바로 작업하면 되는 줄 알았는데...
<br>
여기저기서 빨간줄이! 😱
<br>
<br>

## 그래서 정리하는 Jekyll 블로그 사용 방법!
_(참고: 해당 포스트는 Jekyll 블로그 생성기가 아니고 블로그를 잘 사용하는 방법에 대해 설명합니다!)_

* 사실 이런 설정이 없어도 이미 제대로 만들어진 Jekyll 블로그라면 post를 제대로 GitHub에 푸시하는 것만으로도 충분할 수 있습니다.
* 그러나 로컬에서 작업하는 상황을 GitHub에 푸시하기 전 바로바로 확인하고 싶다면 직접 Jekyll을 깔아서 작업하는게 좋겠죠?

<br>
<br>
<br>


# 기본 설정 체크하기
## ✅ Ruby 설치
* Jekyll은 Ruby로 만들어졌기 때문에 Ruby를 우선 설치해줘야 합니다.
여기서는 Ruby를 rbenv로 설치를 하겠습니다. 
* rbenv는 Ruby의 버전을 독립적으로 사용할 수 있도록 도와주는 패키지입니다.
여러 개의 Ruby 버전 설치가 가능하면서 간단하게 버전들을 오갈 수 있습니다.
* Mac은 기본적으로 Ruby가 설치되어 있는데 OS에 의존적이기 때문에 Ruby 버전을 다양하게 사용해야 할 때는 rbenv로 설치하고 관리해주면 편리합니다.
* rbenv 설치는 아래와 같습니다. _brew와 rbenv가 설치되어 있다면 넘어가주세요!_

---
```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
* hombrew를 설치해줍니다.

---
```shell
brew install rbenv
```
* rbenv를 설치해줍니다.

---
```shell
rbenv install -l
```
* 설치할 수 있는 Ruby 버전을 확인할 수 있습니다.
* Mac의 경우 설치하려는 버전이 없을 때 `brew upgrade ruby-build` 명령어를 실행해 리스트를 업데이트 할 수 있습니다.

---
```shell
rbenv install 3.0.3
```
* Ruby 3.0.3버전을 설치해보겠습니다.

---
```shell
rbenv versions
```
* 설치 되어있는 Ruby 버전들을 확인할 수 있습니다.
<img width="559" alt="스크린샷 2022-03-16 오후 1 59 00" src="https://user-images.githubusercontent.com/58318786/158519876-a33ef074-f0b5-443b-9961-0a09ef17e239.png">
* system: Mac에 기본적으로 설치되어있는 Ruby
* 처음에 3.1.1 버전을 설치했다가 버전을 낮춰야 할 일이 있어서 3.0.3을 추가로 설치한 상태입니다.

---
```shell
rbenv global 3.0.3
```
* 원하는 버전의 Ruby를 사용하도록 설정해줍니다.

---
```shell
vim ~/.zshrc
```
```shell
[[ -d ~/.rbenv  ]] && \
  export PATH=${HOME}/.rbenv/bin:${PATH} && \
  eval "$(rbenv init -)"
```
* 쉘 설정 파일인 .zshrc에 (혹은 .bashrc) rbenv PATH를 추가해줍니다.

---
```shell
source ~/.zshrc
```
* 설정을 적용합니다.

---

## ✅ Bundler 설치
* Bundler는 필요한 gem과 gem 버전을 설치하는 도구입니다.
> 참고: https://rubygems.org/ : gem들을 찾을 수 있는 사이트

```shell
gem install bundler
```
* Bundler를 설치해줍니다.

---
```shell
bundle install
bundle update
```
* bundler 커맨드들을 활용해 gem을 설치하고 Gemfile에 등록되어 있는 gem들에 맞게 의존성을 해결해줄 수 있습니다.
* bundle install 명령어로 gem을 설치합니다.
* bundle update로 번들러와 gem들을 업데이트 해줍니다.
* 종종 dependency 문제로 오류를 만날 수 있는데 gemfile을 잘 확인하고 필요한 버전들에 맞게 설정하거나 혹은 업데이트가 필요할 수 있습니다.

---
## ✅ Jekyll 설치

```shell
gem install jekyll bundler
```
* Ruby를 활용해 jekyll gem을 설치합니다.

---
<img width="525" alt="image" src="https://user-images.githubusercontent.com/58318786/158524661-75c5946b-8f7b-4d4e-a308-12dd967cd87e.png">

* 저의 경우 jekyll 4.2.2버전을 사용중입니다.

---

<br>
<br>
<br>

# 실행

```shell
bundle exec jekyll serve
```
* Gemfile에 따라 jekyll을 실행합니다.

<img width="976" alt="image" src="https://user-images.githubusercontent.com/58318786/158533061-4bc6857e-d6ec-423f-bb76-8807504b3bd8.png">

* 이제 `localhost:4000`에서 실행된 블로그를 볼 수 있습니다.😆
* 변경이 생기고 새로고침하면 바로 반영됩니다.
```shell
--livereload: config.yml 파일 이외의 파일에서 갱신이 생기면 새로고침
--incremental: 갱신이 발생할 때 부분 빌드 실행
--drafts: 초안 포함해서 사이트 미리보기
```

<br>
<br>
<br>

---

_아래는 제가 블로그를 로컬에서 실행하면서 찍혔던 버그들을 수정한 것들입니다._

## Bugs 🐞

### webrick

<img width="870" alt="image" src="https://user-images.githubusercontent.com/58318786/158420300-b44221a1-0d11-4c51-99c0-098383716d16.png">

* webrick 로드 오류
```shell
bundle add webrick
```
* webrick을 추가합니다. 추가된 gem은 Gemfile에서 확인할 수 있습니다.

<br>

---

### Liquid Warning
<img width="845" alt="image" src="https://user-images.githubusercontent.com/58318786/158420538-f28b67e8-2cab-4ff2-92f0-1c714e41383c.png">
* Jekyll에서는 Liquid 언어를 사용하는데 Liquid는 중괄호를 escape 문자로 사용합니다.
* 따라서 마크다운 문서에 해당 문자가 있을 때는 에러 메시지를 출력합니다.

#### Before
![image](https://user-images.githubusercontent.com/58318786/158534126-9b84af34-9a95-44fd-ad7d-4a60a7e647e5.png)

#### After
```
> 참고 - ArrayList의 add
```java
var orderItems = new ArrayList<OrderItem>() {% raw %}{{
    add(new OrderItem(UUID.randomUUID(), 100L, 1));
}}{% endraw %};
```

![image](https://user-images.githubusercontent.com/58318786/158536377-72ada326-f3fc-481c-a4ad-717b7ffa32ae.png)

<br>

---

#### Conflict

![image](https://user-images.githubusercontent.com/58318786/158534688-eb5cab1f-6e86-4917-8996-eb36679b44d3.png)
* Jekyll은 제목(인덱스)을 경로로 사용되어서 겹치게 작성될 때 해당 오류가 발생합니다.
* 두 파일 중 하나의 이름을 수정해줍니다.
