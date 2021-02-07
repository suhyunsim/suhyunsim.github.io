---
layout: post
title: "Jekyll로 GitHub 블로그 만들기 - 2"
author: "Poogle"
categories: [Others]
comments: true
tag: [GitHub, Blog, Jekyll]
---

이번 포스팅에서는 Jekyll로 만든 블로그에 여러가지 기능을 커스텀하는 방법을 알아보겠습니다. 우선 제가 사용하는 블로그의 기본 테마는 Jekyll의 Tale이라는 테마인데요. 

<br>

# Tale 테마에서는

1) **전체 게시물을 보여주는 Posts 페이지,**

![image](https://user-images.githubusercontent.com/58318786/107129715-adb76980-690a-11eb-8b40-d1079c42528d.png)

**2) 게시물의 태그를 관리해주는 Tags 페이지,**

![image](https://user-images.githubusercontent.com/58318786/107129717-b60fa480-690a-11eb-8fd6-92bd6aec99b9.png)

**3) 자기소개를 할 수 있는 About 페이지를 제공합니다.**

![image](https://user-images.githubusercontent.com/58318786/107129719-b90a9500-690a-11eb-8e01-0bc0723e4489.png)

저는 이 세 가지 페이지 외에도 대분류를 할 수 있는 카테고리 페이지, 블로그 내 포스트들을 검색할 수 있는 검색 페이지를 추가로 구현하려고 합니다.

<br>

# 카테고리 페이지 만들기

저의 경우에는 한 포스팅에 대해 태그는 여러 개가 붙을 수 있고, 대분류로 나눠진 카테고리는 하나만 설정하도록 하고 싶었습니다. 사실 사이드 바와 같은 기능을 추가하고 싶었는데 현재 사용하고 있는 템플릿 자체의 scss 코드를 여러모로 수정해야 하는 대공사가 될 것 같아 아주 간단한 형식의 카테고리 페이지만을 추가하려고 합니다.

### 결과적으로 원하는 형태는,

![image](https://user-images.githubusercontent.com/58318786/107130338-9b8bfa00-690f-11eb-8eca-dea0498abab0.png)

- **navigation에서 Categories 버튼을 클릭해 `/categories` 링크로 접속하면 전체 카테고리들과 포스트들의 목록이 나옵니다.** 포스트들의 목록은 최신에 작성된 순서되로 정렬되며 각각의 포스트들을 클릭했을 때 해당 포스트로 이동합니다.

![image](https://user-images.githubusercontent.com/58318786/107130292-37693600-690f-11eb-9e35-9e3fd76f426a.png)

- **카테고리 명을 클릭하면 해당 카테고리에 해당되는 포스트들만 보여지는 개별 카테고리 페이지로 이동합니다.** 해당 카테고리 페이지에서도 포스트를 클릭하면 원하는 포스트로 이동합니다.

### 이러한 구조로 만들기 위해서...

**1) 우선 카테고리 페이지의 전체 형식을 구성하기 위해 `_layouts/category.html` 파일을 작성합니다.** 

```html
---
layout: default
---

<h1>{{page.title}}</h1>
<ul class="posts-list">
    {% assign category = page.category | default: page.title %}
    {% for post in site.categories[category] %}
        {% if post.title != null %}        
        {% endif %}
    <li>
        <h3>
            <a href="{{ site.baseurl }}{{ post.url }}">
                {{ post.title }}
            </a>
            <small>{{ post.date | date_to_string }}</small>
        </h3>
    </li>
    {% endfor %}
</ul>
```

**2) 카테고리 폴더(categories)를 만들고 사용할 카테고리들의 md 파일을 작성합니다.**

```markdown
---
layout: category

title: BackEnd
---
```

![image](https://user-images.githubusercontent.com/58318786/107130409-7e0b6000-6910-11eb-9474-deec093c2191.png)

- 1)에서 작성한 코드들은 이 폴더의 위치와 내용들을 확인하고 반복문을 통해 화면에 표시됩니다.
- layout은 1)에서 작성한 html 파일이 되고 title을 카테고리명으로 적어줍니다.

**3) 설정파일인 `_config.yml` 파일에 카테고리 위치와 리스트에 대한 정보를 추가합니다.**

```yaml
category_dir: categories/
category_list: [ Project, BackEnd, Algorithm, TIL, Others]
```

**4) 카테고리 개별 페이지를 위한 `categories/index.html` 파일을 작성합니다.**

```html
---
layout: default
permalink: '/categories'
---

<div class="page clearfix">
    <div class="left">
        <ul>
            {% for category in site.categories %}
            <h1 id="{{category | first}}"><a href="/categories/{{category | first}}">{{category | first}}</a></h1>
            {% for posts in category %}
            {% for post in posts %}
            {% if post.url %}
            <li>
                <a class="title" href="{{ post.url | prepend: site.url }}">{{ post.title }}</a>
                <time>
                    {{ post.date | date:"%F" }} {{ post.date | date: "%a" }}.
                </time>
            </li>
            {% endif %}
            {% endfor %}
            {% endfor %}
            {% endfor %}
        </ul>
    </div>
</div>
```
<br>

---

# Utterances (GitHub) 댓글 적용하기

Tale은 Disqus 댓글 기능을 기본적으로 제공하고 있습니다만, 아무래도 GitHub Pages를 활용해서 만든 블로그인 만큼 Disqus보다는 Utterances 댓글을 사용하려고 합니다. 작성된 댓글을 issue로 확인할 수 있다는 점에서도 더욱 편리하게 느껴졌습니다.

- **Disqus**

![image](https://user-images.githubusercontent.com/58318786/107129838-b9eff680-690b-11eb-9517-8c73c0ea23ba.png)

- **Utterances**

![image](https://user-images.githubusercontent.com/58318786/107129869-eefc4900-690b-11eb-9814-0c31f8928ec4.png)

Utterances를 적용하는 방법은 간단합니다.

- Utterances 설치: [https://github.com/apps/utterances](https://github.com/apps/utterances)
- Repository에 대한 권한 부여 → GitHub Page로 등록한 블로그 Repository
- 필요한 설정 선택 후 스크립트 복사

    ```jsx
    <script src="https://utteranc.es/client.js"
            repo="suhyunsim/suhyunsim.github.io"
            issue-term="pathname"
            label="comments"
            theme="github-light"
            crossorigin="anonymous"
            async>
    </script>
    ```

저의 경우 issue-term은 `pathname`으로 theme은 `github-light` 으로 설정했습니다.

- 해당 스크립트를 `_layouts/post.html` 파일의 댓글 위치에 넣어줍니다.
- 댓글이 작성될 시 해당 Repository에 Issue가 등록됩니다.

<br>

---

# Google에 내 블로그 검색 노출시키기

자신의 블로그, 그리고 블로그에 작성한 글들을 구글 검색에 노출시키는 방법에 대해 알아보도록 하겠습니다. 제가 사용할 방법은 Google Search Console에 제 블로그를 등록하는 방법입니다.

## Google Search Console에 블로그 등록하기

Google Search Consel: [https://search.google.com/search-console/about](https://search.google.com/search-console/about)

- 구글 계정으로 로그인 한 후 속성 추가에 블로그 주소를 입력합니다.

![image](https://user-images.githubusercontent.com/58318786/107141193-97d99100-696a-11eb-91cb-5b84ed3e8a38.png)

- 블로그 소유권을 등록하기 위해 여러 방법 중 하나를 선택합니다. 저의 경우 HTML 태그를 추가하는 간단한 방법을 사용했습니다.

![image](https://user-images.githubusercontent.com/58318786/107141281-0f0f2500-696b-11eb-83e7-71e43acf6dc7.png)

- `_includes/head.html` 파일에 메타 태그 추가

```html
<meta name="google-site-verification" content="~" />
```

- `_config.yml` 파일에 sitemap과 관련된 플러그인을 추가합니다.

```yaml
# Gems
plugins:
  - jekyll-feed
  - jekyll-paginate
  - jekyll-seo-tag
  - jekyll-algolia
  **- jekyll-sitemap**
```

- 제가 사용하는 테마의 경우 gemspec에서 해당 플러그인을 제공하지 않으므로 추가로 `Gemfile` 에 플러그인을 추가하고 따로 gem을 설치했습니다.

```ruby
group :jekyll_plugins do
    gem 'jekyll-sitemap'
end
```

![image](https://user-images.githubusercontent.com/58318786/107141537-9e690800-696c-11eb-9cec-535994e4874a.png)

- **참고: 종종 Gemfile에 작성한 플러그인을 찾지 못할 때는 `bundle install` 명령어를 실행하거나 `gem install {플러그인}` 의 명령어로 직접 설치하면 해당 플러그인이 `Gemfile.lock` 파일에 추가되는 것을 확인할 수 있습니다.**

- site-map 플러그인을 설치하면 `sitemap.xml` 파일이 생성되는데 만약 플러그인으로 작성되지 않는다면 직접 xml 파일을 추가해주면 됩니다. 최상위 위치로 파일을 생성해주면 되는데 이 파일은 웹사이트에서 접근 가능한 페이지들의 목록을 의미합니다. 구글 검색엔진에 쉽게 등록하기 위한 파일이라고 생각하면 됩니다.

```xml
---
layout: null
---
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  {% for post in site.posts %}
    <url>
      <loc>{{ site.url }}{{ post.url }}</loc>
      {% if post.lastmod == null %}
        <lastmod>{{ post.date | date_to_xmlschema }}</lastmod>
      {% else %}
        <lastmod>{{ post.lastmod | date_to_xmlschema }}</lastmod>
      {% endif %}

      {% if post.sitemap.changefreq == null %}
        <changefreq>weekly</changefreq>
      {% else %}
        <changefreq>{{ post.sitemap.changefreq }}</changefreq>
      {% endif %}

      {% if post.sitemap.priority == null %}
          <priority>0.5</priority>
      {% else %}
        <priority>{{ post.sitemap.priority }}</priority>
      {% endif %}

    </url>
  {% endfor %}
</urlset>
```

- 파일을 추가하고 GitHub에 push해 해당 파일이 생성되었는지 확인합니다. `https://{user}.github.io/sitemap.xml` 로 접근하면 됩니다.

- `robots.txt` 파일을 추가합니다. `sitemap.xml` 파일과 같이 최상위 위치에 파일을 추가하는데 sitemap의 링크를 추가하는 파일입니다.

```
User-agent: *
Allow: /
Sitemap: http://{user}.github.io/sitemap.xml
```

- 모든 작업을 push한 후 마지막으로  Google Search Console에 Sitemap을 등록합니다.

![image](https://user-images.githubusercontent.com/58318786/107141747-4501d880-696e-11eb-98a6-c8251010ecc8.png)