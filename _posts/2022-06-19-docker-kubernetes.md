---
layout: post
title: "Doker와 Kubernetes"
author: "Poogle"
categories: [BackEnd]
sitemap:
  changefreq: daily
  priority: 1.0
comments: true
tag: [docker, kubernetes]

---

# Virtual Machine vs Container
### Virtual Machine(VM)
* Server -> Hypervisor -> Guest OS
* OS를 각각 설치하기 때문에 리소스 낭비가 있음

### Container
* 어플리케이션을 구동하는 환경을 격리한 Space
* Server -> Docker Engine -> Container
* VM에 비해 오버헤드가 적음

# 컨테이너를 사용하면?
* Environment Disparity 문제 해결(~~제 맥북에서는 되는데요...!~~)
* 기능별로 모듈화를 할 수 있어 MSA 구축 가능
* 언어와 프레임워크 상관업싱 동일한 프로세스를 가질 수 있음
* VM 대비 컨테이너 생성이 쉽고 빠름
* 컨테이너 이미지를 이용한 배포, 롤백 간단함
* 특정 클라우드 벤더(AWS, GCP...)에 종속적이지 않음 (멀티 클라우드도 가능)

### MSA를 구축하면서 한 번에 여러 개의 컨테이너를 관리할 필요가 생김
* 어느 서버가 비어있는지 어떻게 알 수 있을까
* 배포와 롤백은 어떻게 할 수 있을까
* Service Discovery, Monitoring을 어떻게 할 수 있을까

<br>

---

<br>

# 컨테이너 오케스트레이션
* 복잡한 컨테이너 환경을 효과적으로 관리

### Cluster
* 마스터 노드로 중앙 제어
* 많은 노드들을 클러스터 단위로 관리 - 추상화
* 노드들끼리 통신을 잘 할 수 있도록, 노드의 개수가 적절한지 모니터링

### State
* 상태 관리
```yaml
{ 
  image: "app"
  Replicas: 4
}
```
* 클러스터에 오류가 생겼을 때 클러스터 개수를 적절히 유지 시켜주기

### Scheduling
* 배포 시 알맞은 노드에 어플리케이션을 할당해주기

### Rollout / Rollback
* 배포 버전 관리
* 중앙 제어 방식

### Service Discovery
* 서비스 등록 및 조회

### Volume
* 볼륨 스토리지
* 서비스마다 다양한 DB를 사용하고 싶을 때 다양한 볼륨 스토리지를 적용할 수 있도록 해줌

<br>

---

<br>


# 쿠버네티스 Kubernetes
* 컨테이너를 쉽고 빠르게 배포/확장하고, 관리를 자동화하는 오케스트레이션 툴
* 많은 수의 컨테이너를 협조적으로 연동시키기 위한 통합 시스템, 이 컨테이너를 다루기 위한, API 및 명령행 도구(kubectl) 등이 함께 제공됨
* 컨테이너의 운영체제 같은 것
* Google의 주도로 개발, CNCF가 관리
* 컨테이너를 이용한 애플리케이션 개발
* 도커 호스트 관리
* 서버 리소스의 여유를 고려한 컨테이너 배치
* 스케일링
* 여러 개의 컨테이너 그룹에 대한 로드 밸런싱
* 헬스 체크 등...

## 용어 정리

|:-:|:-:|
|<span style='background-color: #F7DDBE'>리소스</span>|<span style='background-color: #F7DDBE'>용도</span>|
|Kubernetes Cluster|쿠버네티스의 여러 리소스를 관리하기 위한 집합체|
|Node|컨테이너가 배치되는 서버|
|Namespace|쿠버네티스 클러스터 안의 가상 클러스터|
|Pod|컨테이너 집합 중 가장 작은 단위, 컨테이너 실행 방법 정의|
|Replica Set|같은 스펙을 갖는 파드를 여러 개 생성하고 관리|
|Deployment|레플리카 세트의 리비전 관리|
|Service|파드의 집합에 접근하기 위한 경로를 정의|
|Ingress|서비스를 쿠버네티스 클러스터 외부로 노출|
|ConfigMap|설정 정보를 정의하고 파드에 전달|
|Role|네임스페이스 안에서 조작 가능한 쿠버네티스 리소스 규칙 정의|
|ClusterRole|클러스터 전체적으로 조작 가능한 쿠버네티스 리소스 규칙 정의|
|Service Account|파드가 쿠버네티스 리소스를 조작할 떄 사용하는 계정|

<br>

---

<br>

# 기본 개념

![image](https://user-images.githubusercontent.com/58318786/174483293-91e80e16-fef1-4645-a2ec-13205bc9d9b2.png)

![IMG_E24F5C7E3E86-1](https://user-images.githubusercontent.com/58318786/174484358-2af3ac41-1517-444d-99dc-5a9d93446be4.jpeg)




> 참고:
>
> 