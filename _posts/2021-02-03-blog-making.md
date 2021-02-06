---
layout: post
title: "Jekyll로 GitHub 블로그 만들기 - 1"
author: "Poogle"
categories: [Others]
comments: true
tag: [GitHub, Blog, Ruby, Jekyll]

---

오늘은 Github 블로그를 만들고 jekyll 테마를 활용해서 커스텀하는 과정을 소개해보도록 하겠습니다.

# 왜 Github 블로그를 선택했나요?

- Github으로 블로그를 관리하고 싶어서
- 블로그 포스팅을 커밋으로 기록하고 싶어서
- 나만의 기술 블로그를 만들고 싶어서

등의 이유로 저는 Github으로 블로그를 만들기로 결정했습니다. 사실 가장 큰 이유는 제가 원하는대로 **커스텀하는 저만의 블로그**를 만들고 싶은거였는데요. 최대한 깔끔한 테마로 개성있게 만들고 싶어서 Jekyll을 사용한 Github 블로그를 만들었습니다.

### *다른 방법으로 기술 블로그를 만들고 싶다면?*

- **Jekyll(Ruby로 작성됨) + `github.io` (푸글의 블로그)**
- Hugo(Go로 작성됨) + `github.io`
- Hugo + Netlify
- Hexo(Node.js 기반) + `github.io`
- Gatsby(React 기반) + GraphQL + Netlify

이런 다양한 방법들이 있답니다. 각각의 장단점이 있으니 가장 흥미로운 방법으로 블로그를 만들어보세요!

**참고 - 용어 설명**
- Ruby: 동적 객체 지향 스크립트 프로그래밍 언어
- Jekyll: 루비로 작성된 블로그 인식 정적 사이트 생성기
- Hexo: Node.js 기반 정적 사이트 생성기(Static site generator)
- Hugo: Go로 작성된 정적 사이트 생성기
- Gatsby: React 기반의 정적 페이지 생성 프레임워크
- Node.js: 소프트웨어 플랫폼, 작성 언어로 자바스크립트를 활용
- React: 웹 프레임워크, 자바스크립트 라이브러리
- GraphQL: 데이터 질의어
- Netlify: 웹 기반 응용 프로그램 및 정적 웹 사이트를위한 호스팅 및 서버리스 백엔드 서비스를 제공

<br>

# Github 블로그 (GitHub Pages site) 만들기 튜토리얼

[https://docs.github.com/en/github/working-with-github-pages/creating-a-github-pages-site](https://docs.github.com/en/github/working-with-github-pages/creating-a-github-pages-site)

Github 블로그를 만드는 튜토리얼 공식문서입니다.

간단히 설명하자면

- 새 Repository를 만드는데 이름을 `<user>.github.io`로 짓습니다.
    - Repository 이름을 깃헙 아이디와 동일하게 해야 url이 중복되지 않습니다.
- 생성된 Repository의 Setting에서 GitHub Pages 항목을 찾고 Repository를 등록합니다.

<br>

# Ruby, Jekyll 설치하기

## Ruby

- Ruby는 간결함과 생산성을 강조한 동적인 오픈 소스 프로그래밍 언어
- 인터프리터 형식으로 실행되는 고기능 스크립트 언어이자 뛰어난 객체 지향적 언어, 이러한 특성을 가지면서 루비와 같이 가독성이 뛰어난 대표적인 스크립트 언어로는 파이썬이 있습니다
- Jekyll은 루비로 작성되어 있습니다!

### Gem, rubygem, rails, rbenv

- rails: 프레임워크
- gem: 라이브러리
    - rubygem(Gem):  루비에서  지원하는 패키지 시스템(node의 npm, 리눅스에서 yum, apt 같은 것)
- 레일즈 프로젝트를 생성하면 프로젝트 디렉터리에 Gemfile(gem 등록하는 파일)이 생성됩니다.
- 루비 프로그래머는 gem을 이용해서 프로그램 설치, 배포 가능
- rbenv: 루비 버전 독립적으로 사용할 수 있도록 도와주는 패키지(여러 버전을 설치할 수 있게 해주고 필요할 때마다 선택할 수 있습니다)

저는 현재 다른 루비 프로그램을 사용중이기 때문에 루비의 여러 버전이 필요한 상태입니다. rbenv로 루비를 설치해보도록 하겠습니다.

### rbenv 설치 방법

**1.** **brew로 설치**

```bash
brew update
brew install rbenv ruby-build
rbenv versions #버전 확인
```

**2. 우분투를 비롯한 데비안 기반 리눅스에서 rbenv를 설치하는 방법**

```bash
git clone git://github.com/sstephenson/rbenv.git .rbenv
```

- 쉘 환경변수 수정 `.bash_profile`

```bash
[ -f "$HOME/.profile" ] && source "$HOME/.profile"
[ -f "$HOME/.bashrc" ] && source "$HOME/.bashrc"
```

- `.zshrc`

    ```bash
    export RBENV_ROOT="${HOME}/.rbenv"
    if [ -d "${RBENV_ROOT}" ]; then
      export PATH="${RBENV_ROOT}/bin:${PATH}"
      eval "$(rbenv init -)"
    fi
    ```

    - `rbenv`가 저장된 디렉토리를 `RBENV_ROOT` 환경 변수에, `rbenv` 실행 파일이 들어 있는 디렉토리를 `PATH`에 추가한다.
    - 쉘을 실행할때마다 `rbenv init -` 명령을 실행한다.
- 루비 설치하기 위해서 rbenv의 플러그인 ruby-build가 필요

    ```bash
    mkdir -p ~/.rbenv/plugins
    cd ~/.rbenv/plugins
    git clone git://github.com/sstephenson/ruby-build.git
    ```

    - .rbenv/plugins 디렉토리를 생성하고 github에서 ruby-build를 받아온다.
- 의존 package 설치

    ```bash
    sudo apt-get install -y libssl-dev libreadline-dev
    sudo apt-get install -y zlib1g-dev
    ```

- rbven 플러그인인 ruby-build 목록에 설치가능한 루비 버전을 확인 할 수 있음

    ```bash
    rbenv install --list
    ```

- intstall 옵션으로 루비 설치

    ```bash
    $ rbenv install 2.7.0
    ```

- rehash 옵션 - 새로 루비 설치하거나 루비 gem 설치하고 반드시 실행

    ```bash
    rbenv rehash
    ```

- global 옵션 - 전역 설정 변경

    ```bash
    rbenv global 2.7.0
    ```

- 버전 확인

    ```bash
    ruby -v
    ```

![image](https://user-images.githubusercontent.com/58318786/107111169-119d4c00-6891-11eb-9f21-1070c81af590.png)


- 설치된 ruby 버젼 전체 확인

    ```bash
    rbenv versions
    ```

![image](https://user-images.githubusercontent.com/58318786/107111176-182bc380-6891-11eb-9735-4b6f4588b2d9.png)


## Jekyll 설치

Jekyll은 정적 웹사이트 생성기입니다. Jekyll의 테마를 이용해 블로그를 꾸밀 수 있는데 포스팅을 마크다운 언어로 쉽게 작성할 수 있고 편리합니다. 

- `gem install jekyll bundler`

### Jekyll 블로그 생성하기

- `jekyll new 블로그폴더이름`
- `cd 블로그폴더이름`
- `bundle exec jekyll serve`: jekyll 서버 실행
    - `jekyll serve` 이렇게만 해도 가능!
    - localhost:4000으로 접속해 블로그가 생성된 것을 확인합니다.

![image](https://user-images.githubusercontent.com/58318786/107111061-32b16d00-6890-11eb-904d-bee858d087fe.png)

### 다양한 Jekyll Themes

- 테마에 대한 jekyll 공식문서: [https://www.notion.so/20210203-a97242969cf6494c9e2030c3803f399b#6c364ebc94ff44eaa344749a16730652](https://www.notion.so/20210203-a97242969cf6494c9e2030c3803f399b#6c364ebc94ff44eaa344749a16730652)
- Jekyll의 다양한 테마들을 모아놓은 사이트: [http://jekyllthemes.org/](http://jekyllthemes.org/)
- 저의 경우는 여러 테마의 요소들을 커스텀해서 사용했는데 원하는 테마를 선택해 다운받습니다.
- 다운받은 블로그 테마를 처음 생성한 Repository를 clone 받아 이동시킵니다.
- 모든 내용을 commit 후 push하면?

    ⇒ `<user>.github.io` 링크로 나만의 블로그가 완성됩니다.

<br>

# Directory Structure

다음은 Jekyll 블로그의 폴더 구조에 대해 알아보겠습니다.

### 플러그인

테마의 많은 부분이 컨벤션과 다른 폴더 구조를 필요로 하는 jekyll-paginate-v2 플러그인을 사용합니다. 대부분의 젬 기반의 테마에는 젬 안에 assets, _layouts, _includes, 그리고 _sass 디렉토리만을 포함합니다. 테마를 만들거나 직접 커스텀하기 위해서 폴더의 구조에 대해 좀 더 알아보도록 하겠습니다.

- _config.yml
    - 환경설정 정보를 담고 있습니다. head에 넣는 메타 정보와 비슷한 정보를 담기도 하고 baseurl, url 등도 설정할 수 있습니다.
- _includes
    - **재사용할 수 있는 부분적으로 만들어진 html 파일(footer.html, head.html, navbar.html)**을 보관할 수 있는 폴더입니다. 예를 들면 header나 footer는 모든 곳에서 반복적으로 사용하기 때문에 include 폴더에 만들어놓고 가져다 쓰면 편합니다. liquid 태그로 `_include` 안에 html을 소환할 수 있습니다.
- _layouts
    - `default.html` 은 최상위 Jekyll Blog 구성을 담고 있는 파일이라고 볼 수 있습니다. `_include` 폴더 안에 부분적인 html 들이 소환되어 있습니다. `post.html` 은 Post의 형태를 정의해놓은 html 파일입니다.
    - **기본 포스트 레이아웃과 같은 메인 템플릿 파일들을 보관하기 위한 폴더**
- assets
    - 여러분의 젬에 포함시키고 싶은 이미지, 그래픽 등을 담는 폴더입니다. Sass 파일도 이곳에서 임포트(import)합니다. 예를 들어,이 폴더 안에는 main.scss를 담은 css폴더가 있습니다.

    ```scss
    ---
    # Only the main Sass file needs front matter (the dashes are enough)
    ---

    @import 'tale';
    ```

- _sass
    - 부분적인 스타일 코드가 들어 있습니다. 위와 같이 assets 폴더에 CSS를 설정했으면 이 폴더(_sass)에 jekyll-theme-awesome.scss 파일을 만들어, jekyll-theme-awesome.scss에 여러분이 원하는 다른 Sass 부분 코드를 임포트(import)합니다.
    - *여기서 tale은 제가 기본적으로 사용한 테마의 이름입니다.*

    ```scss
    @import 'tale/variables';
    @import 'tale/base';
    @import 'tale/code';
    @import 'tale/post';
    @import 'tale/syntax';
    @import 'tale/layout';
    @import 'tale/pagination';
    @import 'tale/catalogue';
    ```

    - 지킬이 Sass 파일을 어디서 가져와야 하는지 알 수 있도록 여러분의 config.yml에 아래와 같이 적어줍니다.

    ```yaml
    sass:
        sass_dir: _sass
    ```

- _posts
    - 날짜별로 정렬되는 형태의 아이템이 모여있는 폴더입니다. 파일명은 반드시 `2018-01-28-title.md` 형태를 띠어야 합니다.
    - 카테고리별 폴더 → 포스트별 폴더
- _drafts
    - 아직 게시하지 않은, 날짜 정보가 없는 Post를 보관할 수 있는 디렉터리입니다. (초안 목록)
- _data
    - 블로그에 사용할 수 있는 데이터를 모아놓을 수 있는 폴더입니다. 확장자가 `.yml`, `.yaml`, `.json`, `.csv` 일 경우 자동으로 읽어 들여서 `site.data` 변수를 써서 불러올 수 있습니다.
- _site
    - Jekyll이 다른 디렉터리에 있는 모든 파일을 활용해서 Site로 자동 변환 작업을 마치면 그 파일들이 저장되는 폴더입니다. `**_site` 폴더 내 파일은 건드리면 안됩니다.**
    - *빌드 후 결과물인 것*
- index.html
    - 블로그에 접속했을 때 **제일 먼저 자동으로 보여주는 파일입니**다.
- Gemfile
    - .gemspec 파일을 가리키며, 번들러(Bundler)가 여러분의 젬들을 관리하는 파일입니다.

<br>

# 로컬 작업 환경을 위한 설정

- GitHub에 변경 사항을 푸시하기 전 로컬에서 확인하고 싶다면 로컬 서버를 활용합니다.
- 서버 실행 시
    - `bundle exec jekyll serve`
    - 옵션
        - `-livereload`: config.yml 이외의 파일에서 갱신이 생기면 새로고침
        - `-incremental` : 갱신이 발생할 때 부분 빌드 실행

<br>

---

이번 시간에는 Jekyll을 활용해서 GitHub Pages 블로그를 생성하는 기초적인 내용을 다뤄봤습니다. 다음 포스팅으로는 직접 블로그를 커스텀하면서 추가한 다양한 기능들에 대해 알아보도록 하겠습니다.

<br>

*이어서 다룰 내용은...*
- 카테고리
- 태그
- 댓글
- 구글 검색 노출
- 블로그 내 검색