---
layout: post
title: "Docker에서 PostgreSQL 사용하기"
author: "Poogle"
categories: [BackEnd]
sitemap:
  changefreq: daily
  priority: 1.0
comments: true
tag: [docker, postgresql]

---

# Docker
* 컨테이너형 가상화 기술을 구현하기 위한 상주 애플리케이션(dockered라는 데몬이 상주 실행됨)과 이 애플리케이션을 조작하기 위한 명령형 도구(CLI)로 구성되는 프로덕트
* 컨테이너 정보를 Dockerfile 코드로 관리할 수 있음
  * 이 코드 기반으로 복제 및 배포가 이루어지기 때문에 재현성이 높은 것이 특징
* 변화하지 않는 실행 환경으로 멱등성 확보
* 코드를 통한 실행 환경 구축 및 애플리케이션 구성
* 실행 환경과 애플리케이션의 일체화로 이식성 향상
* 시스템을 구성하는 애플리케이션 및 미들웨어의 관리 용이성

## Docker Image
* 도커 컨테이너를 구성하는 파일 시스템과 실행할 애플리케이션 설정을 하나로 합친 것
* 컨테이너를 생성하는 템플릿 역할

## Docker Container
* 도커 이미지를 기반으로 생성되며
* 파일 시스템과 애플리케이션이 구체화돼 실행되는 상태

## Docker Compose
* 애플리케이션 배포 특화된 컨테이너
* 도커 컨테이너 = 단일 애플리케이션 -> 하나 이상의 컨테이너가 서로 통신하고 그 사이에 의존관계가 생김 => 관리하려면? Docker Compose
* yaml 포맷으로 기술된 설정 파일, 여러 컨테이너의 실행을 한번에 관리
* `docker-compose up`: 여러 컨테이너 한 전에 실행

# Docker 설치

```shell
$ brew install --cask docker

$ docker --version
```

<br>

---

<br>

# PostgreSQL
* 객체-관계형 데이터베이스 시스템 ORDBMS
* 오픈소스

```shell
$ brew install postgresql

$ brew services start postgresql
```

## PostgreSQL 명령어

```shell
# 접속 및 데이터베이스 생성
$ psql postgres
$ psql postgres -U user
```

* 참고
  * postgres=# : super user일 때
  * postgres=> : 그냥 user일 때

```shell
# 사용자 생성
CREATE ROLE user WITH LOGIN PASSWORD 'password';

# 현존하는 Role 확인
SELECT rolname FROME pg_roles;

# 권한 부여
ALTER ROLE user CREATEDB

# 사용자 리스트 확인
\du

# 데이터베이스 추가
CREATE DATABASE testdb;

# 권한 부여하기
GRANT ALL PRIVILEGES ON DATABASE testdb TO user;

# DB 접속하기
\connect testdb

# DB 리스트 보기
\dt

# 스키마 생성
CREATE SCHEMA testschema;

# 스키마 리스트 보기
\dn

```

<br>

---

<br>


# Docker & Postgres
## Postgres Image Pull

```shell
$ docker pull postgres
```

## Postgres 실행
* 호스트 5432 포트와 컨테이너 5432 포트 연결해주기
* postgres라는 이름을 가진 컨테이너에 POSTGRES_PASSWORD 값 넣어서 실행

```shell
$ docker run -d -p 5432:5432 --name postgres -e POSTGRES_PASSWORD=비밀번호 postgres
```

```shell
$ docker logs postgres-container
```

* 도커 컨테이너가 중지/삭제될 경우 데이터 역시 삭제됨
* 방지하기 위해서 도커 볼륨이나 바인드 마운트를 사용

### Volume
```shell
# 생성 
$ docker volume create 이름

# 목록
$ docker volume ls

# 제거
$ docker volume rm 이름
```

```shell
$ docker run --name postgres-container -d --restart unless-stopped \
  -p 5432:5432 -e POSTGRES_PASSWORD=비밀번호 \
  -v ${PWD}/data:/var/lib/postgresql/data postgres:#.#
```

* –name `이름` : 컨테이너 이름 지정.
* –restart unless-stopped : 따로 stop 명령을 보내지 않으면 컨테이너 재시작의 경우에도 자동 실행됨.
* -p 5432:5432 : postgres이 사용할 포트 번호 기재
* -e `POSTGRES_PASSWORD=비밀번호` : postgres DB에 대한 비밀번호 설정. 환경변수 설정
* -v 볼륨 정보 : 컨테이너가 사용할 볼륨 정보 기재.
* postgres:#.#: 실행할 postgres 컨테이너 버전


> 참고:
>
> [Mac 유저를 위한 PostgreSQL 설치 및 유저,데이터베이스 설정하기](https://medium.com/@parkopp/mac-%EC%9C%A0%EC%A0%80%EB%A5%BC-%EC%9C%84%ED%95%9C-postgresql-%EC%84%A4%EC%B9%98-%EB%B0%8F-%EC%9C%A0%EC%A0%80-%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%B2%A0%EC%9D%B4%EC%8A%A4-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0-67f5b6e6753d)

> [Docker Postgresql 설치 및 셋팅하기](https://judo0179.tistory.com/96)

> [[Docker] Docker X PostgreSQL 설치 및 연동](https://velog.io/@haeny01/Docker-Docker-X-PostgreSQL-%EC%84%A4%EC%B9%98-%EB%B0%8F-%EC%97%B0%EB%8F%99)

> [Docker 시작하기 (개념/설치)](https://www.daleseo.com/docker/)