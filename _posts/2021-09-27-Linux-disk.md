---
layout: post
title: "Linux 디스크 용량이 부족할 때"
author: "Poogle"
categories: [BackEnd]
sitemap:
  changefreq: daily
  priority: 1.0
comments: true
tag: [Linux]

---

# Ubuntu Linux 디스크 용량 부족할 때 할 수 있는 방법들

> 참고:[[ Linux ] 디스크 정리를 위한 명령어](https://goateedev.tistory.com/181)

> 참고:[[Linux] 파일 삭제해도 용량이 늘어나지 않을때 (용량 부족 시)](https://musclebear.tistory.com/66)

> 참고:[리눅스 서버 용량 확보 방법(log 간편 정리)](https://lovemewithoutall.github.io/it/linux-log-clear/)

## 용량 확인 명령어
* 크기 별 정렬

```bash
ls -alhS
```

* 용량 확인

```bash
# 디스크 사용량 확인
df -h

# 현재 폴더에 있는 용량 확인
du -hs *
```

---
<br>

## GUI 도구 추천 - Stacer
* [설치 링크](https://sourceforge.net/projects/stacer/files/)
* [Stacer github](https://github.com/oguzhaninan/Stacer)

```bash
sudo apt install stacer
```
* 설치 파일 다운로드 후 명령 실행 (Ubuntu 20.04+ 기준)

![스크린샷, 2021-09-27 18-56-42](https://user-images.githubusercontent.com/58318786/134887412-810f2efb-3470-4ed4-8fc1-af42d01f53cd.png)

---
<br>

### 안 쓰는 패키지와 설정 파일 제거

```bash
sudo apt-get autoremove --purge
```

* `--purge`: 설정 파일도 함께 삭제하는 옵션

---
<br>

### APT 캐시 정리

```bash
# 캐시 크기 확인
sudo du -sh /var/cache/apt

# 오래된 캐시 삭제 
sudo apt-get autoclean

# 전체 캐시 삭제
sudo apt-get autoclean

### Thumbnail 캐시 삭제

```bash
# 썸네일 캐시 확인
du -sh ~/.cache/thumbnails

# 썸네일 캐시 삭제
rm -rf ~/.cache/thumbnails/*

```