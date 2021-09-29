---
layout: post
title: "MySQL 설치 및 초기 설정"
author: "Poogle"
categories: [BackEnd]
sitemap:
  changefreq: daily
  priority: 1.0
comments: true
tag: [MySQL]

---

# MySQL 설치
* Ubuntu 20.04 (`lsb_release -a` ubuntu 버전 확인 명령어)

```bash
sudo apt-get update
sudo apt-get install mysql-server
```

* iptable 실행되고 있다면 외부에서 접속할 수 있도록 mysql port(3306) 열어주기

```bash
sudo ufw allow mysql
```

* mysql 설치 후 실행

```bash
sudo systemctl start mysql
```

* 서버 재시작 시 자동 재시작

```bash
sudo systemctl enable mysql
```

---

<br>

# 최초 설치 후 설정

* 접속 후 버전 확인

```sql
show variables like "%version%";
```

* 한글 설정을 위해 `my.cnf` 수정

```bash
$ sudo -i #root
$ cat /etc/mysql/my.cnf
$ cat << 'EOF' > /etc/mysql/mysql.conf.d/utf8.cnf
# for utf8 characterset
[client]
default-character-set = utf8

[mysqld]
skip-character-set-client-handshake
init_connect = SET collation_connection = utf8_general_ci
init_connect = SET NAMES utf8
character-set-server = utf8
collation-server = utf8_general_ci

[mysqldump]
default-character-set = utf8

[mysql]
default-character-set = utf8
EOF
```

* 설정 확인

```sql
status
```

---

<br>

# 데이터베이스 생성, 유저 생성, 유저 권한 부여

* 유저 만들기

```sql
create user 'poogle'@'localhost' identified by '1234'; #로컬에서만 접속 가능
create user 'poogle'@'123.456.789.123' identified by '1234'; #특정 아이피에서만 접속 가능
create user 'poogle'@'%' identified by '1234'; #어디서든 접속 가능
```

* 유저가 사용할 DB 생성

```sql
create database testdb;
```

* 권한 설정

```sql
grant all on testdb.* to 'poogle'@'%' with grant option;
```
- testdb.* → testdb 모든 테이블
- with grant option → 남들에게 권한을 줄 수 있는 권한
- 없으면? 나는 모든 권한을 갖고 있지만 이걸 위임하지는 못하는 것
- testdb 모든 테이블의 모든 권한을 poogle 유저에게 주기

* 권한 업데이트

```sql
flush privileges;
```

---

<br>

# MySQL 삭제

* 설정 파일 포함 삭제 

```bash
sudo apt-get remove --purge mysql*

# * 명령어가 안 될 때는 개별적으로 삭제가 필요함
```

* mysql과 관련된 파일들이 남아있는지 확인

```bash
dpkg -l | grep mysql
```

* 캐시 및 기존 디렉토리 삭제

```bash
sudo rm -rf /etc/mysql /var/lib/mysql
sudo apt-get autoremove
sudo apt-get autoclean
```

---

<br>

# MySQL 연동 오류 모음

## CommunicationsException
```
com.mysql.jdbc.exceptions.jdbc4.CommunicationsException: Communications link failure
```

* MySQL 디폴트 타임아웃
  * 커넥션 생성 후 타임아웃 기간이 지날 동안 사용되지 않으면 커넥션 종료됨
* DBCP configuration에 jdbc url 설정 시
  * `autoReconnect=true`
  * `validationQuery="select 1"`

```
jdbc:mysql://localhost:3306/{dbname}?{다른 설정들}&autoReconnect=true&validationQuery="select 1"
```

## Can't connect ~ through socket

```
Can't connect to local MySQL server through socket '/var/run/mysqld/mysqld.sock'
```

> 참고: [error: 'Can't connect to local MySQL server through socket '/var/run/mysqld/mysqld.sock' (2)' -- Missing /var/run/mysqld/mysqld.sock](https://stackoverflow.com/questions/11990708/error-cant-connect-to-local-mysql-server-through-socket-var-run-mysqld-mysq)

* 소켓 파일 (`mysql.sock`) 경로를 못 찾는 에러 (Case by Case... 문제의 원인 및 해결 방법이 많음)

1. 재시작: `$ sudo service mysql start`
2. `$ sudo find / -type s`로 `mysql.sock` 파일 위치 찾기
  * `my.cnf` 파일 경로 수정
  * `socket = /var/lib/mysql/mysql.sock`
3. MySQL multi installations일 때

```bash
# 확인 - mysql
ps -A|grep mysql

# kill process
sudo pkill mysql

# 확인 - mysqld
ps -A|grep mysqld

# kill process
sudo pkill mysqld
```

## public key retrieval is not allowed
* MySQL 8.0 이후 접속 시 생기는 문제
* `allowPublicKeyRetrieval=true` 추가

```
jdbc:mysql://localhost:3306/{dbname}?{다른 설정들}&allowPublicKeyRetrieval=true
```

---

> 참고: [MySQL 완전 삭제 (Ubuntu/Debian)](https://velog.io/@moorekwon/MySQL-%EC%99%84%EC%A0%84-%EC%82%AD%EC%A0%9C)

> 참고: [우분투에 Mysql 설치하기 (How to install Mysql-server in Ubuntu)](https://m.blog.naver.com/jesang1/221993846056)