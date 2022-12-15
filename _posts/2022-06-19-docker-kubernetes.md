---
layout: post
title: "Docker와 Kubernetes"
author: "Poogle"
categories: [BackEnd]
sitemap:
  changefreq: daily
  priority: 1.0
comments: true
tag: [docker, kubernetes]

---

Docker와 Kubernetes에 대해 정리합니다.

```text
- Virtual Machine vs Container
- 컨테이너?
- 컨테이너 오케스트레이션
- Kubernetes
  - Master
  - Node
  - Object

```

# Virtual Machine vs Container
### Virtual Machine(VM)
* Server -> Hypervisor -> Guest OS
* OS를 각각 설치하기 때문에 리소스 낭비가 있습니다.

### Container
* 어플리케이션을 구동하는 환경을 격리한 Space
* Server -> Docker Engine -> Container
* VM에 비해 오버헤드가 적습니다.

# 컨테이너를 사용하면?
* Environment Disparity 문제 해결(~~제 맥북에서는 되는데요...!~~)
* 기능별로 모듈화를 할 수 있어 MSA를 구축할 수 있습니다.
* 언어와 프레임워크 상관없이 동일한 프로세스를 가질 수 있습니다.
* VM 대비 컨테이너 생성이 쉽고 빠릅니다.
* 컨테이너 이미지를 이용한 배포, 롤백이 간단합니다.
* 특정 클라우드 벤더(AWS, GCP...)에 종속적이지 않습니다. (멀티 클라우드도 가능)

### MSA를 구축하면서 한 번에 여러 개의 컨테이너를 관리할 필요가 생깁니다
* 어느 서버가 비어있는지 어떻게 알 수 있을까?
* 배포와 롤백은 어떻게 할 수 있을까?
* Service Discovery, Monitoring을 어떻게 할 수 있을까?

<br>

---

<br>

# 컨테이너 오케스트레이션
* 복잡한 컨테이너 환경을 효과적으로 관리할 수 있습니다.

### Cluster
* 마스터 노드로 중앙 제어를 할 수 있습니다.
* 많은 노드들을 클러스터 단위로 관리할 수 있습니다. - 추상화
* 노드들끼리 통신을 잘 할 수 있도록, 노드의 개수가 적절한지 모니터링합니다.

### State
* 상태 관리
```yaml
{ 
  image: "app"
  Replicas: 4
}
```
* 클러스터에 오류가 생겼을 때 클러스터 개수를 적절히 유지 시켜줍니다.

### Scheduling
* 배포 시 알맞은 노드에 어플리케이션을 할당해줍니다.

### Rollout / Rollback
* 배포 버전을 관리합니다.
* 중앙 제어 방식

### Service Discovery
* 서비스 등록 및 조회를 할 수 있습니다.

### Volume
* 볼륨 스토리지를 관리합니다.
* 서비스마다 다양한 DB를 사용하고 싶을 때 다양한 볼륨 스토리지를 적용할 수 있도록 해줍니다.

<br>

---

<br>


# 쿠버네티스 Kubernetes
* 컨테이너를 쉽고 빠르게 배포/확장하고, 관리를 자동화하는 오케스트레이션 툴입니다.
* 많은 수의 컨테이너를 협조적으로 연동시키기 위한 통합 시스템, 이 컨테이너를 다루기 위한, API 및 명령행 도구(kubectl) 등이 함께 제공됩니다.
* 컨테이너의 운영체제 같은 것
* Google의 주도로 개발, CNCF가 관리합니다. 컨테이너 오케스트레이션의 사실상 표준(de facto)입니다.
* 컨테이너를 이용해 애플리케이션을 개발합니다.
* 도커 호스트를 관리합니다.
* 서버 리소스의 여유를 고려해서 컨테이너를 배치합니다.
* 스케일링
* 여러 개의 컨테이너 그룹에 대한 로드 밸런싱을 지원합니다.
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
* Control Plane과 Worker Node로 분리됩니다.

![IMG_E24F5C7E3E86-1](https://user-images.githubusercontent.com/58318786/174484358-2af3ac41-1517-444d-99dc-5a9d93446be4.jpeg)

# 쿠버네티스 아키텍쳐

![IMG_C09F46CE4576-1](https://user-images.githubusercontent.com/58318786/175815719-78b7a53b-b22d-4a28-89f2-5da76cd3bab9.jpeg)

### Desired State
* Current State 와 Desired State의 상태를 비교해서 같게 만드는 것이 쿠버네티스의 역할입니다.
* 이때 빈 노드에 어플리케이션을 할당해주는 것이 Scheduler, 컨테이너 상태를 체크해주는 것이 Controller 입니다.

<br>

---

<br>

## Master
### etcd
<img src="https://user-images.githubusercontent.com/58318786/175814929-6b30a460-7feb-4d5b-a263-73744ffa78da.jpeg" style="float: left; margin-right: 30px; margin-bottom: 10px;" width="70" height="70">

* 모든 상태와 데이터를 저장합니다.
* 고가용성 - 분산 시스템으로 구성해서 안정성을 높여줍니다
* 일관성
* `key-value` 형태로 데이터를 저장합니다.
* 저장소이다 보니 백업이 필수입니다.

### API Server
<img src="https://user-images.githubusercontent.com/58318786/175814926-2509d896-dcef-459e-bab8-1a073764f94a.jpeg" style="float: left; margin-right: 30px; margin-bottom: 10px;" width="70" height="70">

* 상태를 바꾸거나 조회할 수 있습니다.
* etcd와 통신하는 유일한 모듈입니다.
* REST API 형태로 되어있습니다.
* 관리자 요청 뿐만 아니라 다양한 내부 모듈과 통신할 수 있습니다.
* horizontal로 확장되도록 디자인 되어있습니다.
* 권한을 관리합니다.

### Scheduler
<img src="https://user-images.githubusercontent.com/58318786/175814923-4433a6d1-f0eb-43f1-8c02-952158be2b06.jpeg" style="float: left; margin-right: 30px; margin-bottom: 10px;" width="70" height="70">

* 새로 생성된 pod를 감지하고 실행될 노드를 선택합니다.
* 노드의 현재 상태와 pod의 request를 체크합니다.
* 노드에 라벨을 부여합니다.(라벨로 트래킹을 할 수 있습니다.)

### Controller
<img src="https://user-images.githubusercontent.com/58318786/175814931-014e8634-03cf-4213-8977-47c5ccab1047.jpeg" style="float: left; margin-right: 30px; margin-bottom: 10px;" width="70" height="70">

* 논리적으로 다양한 컨트롤러가 존재할 수 있습니다.(node controller, endpoint controller ...)
* 상태를 체크하고 Desired State를 유지합니다.
* 복잡성을 낮추기 위해 하나의 프로세스로 실행합니다.
* 위 과정을 무한히 반복합니다.

<br>

---

<br>


## Node
### Kubelet
<img src="https://user-images.githubusercontent.com/58318786/175815774-ce8d3860-e193-4ae7-bcf5-350e31fa3687.jpeg" style="float: left; margin-right: 30px; margin-bottom: 10px;" width="70" height="70">

* 각 노드에서 실행합니다.
* Pod(컨테이너들을 POD로 감싸줍니다.)들을 실행하고 중지하며 상태를 체크합니다.
* CRI(Container Runtime Interface)

### Proxy
<img src="https://user-images.githubusercontent.com/58318786/175815781-bfa1d160-b0fb-4c0f-b437-35c245781fdf.jpeg" style="float: left; margin-right: 30px; margin-bottom: 10px;" width="70" height="70">

* 네트워크 프록시와 부하 분산 역할들 담당합니다.
* 내/외부 통신을 설정합니다.
* 성능상의 이유로 프록시 프로그램 대신 iptables 또는 IPVS를 사용합니다.(설정만 관리)

## 쿠버네티스 오브젝트

![image](https://user-images.githubusercontent.com/58318786/175816735-24c01684-a7d3-44ee-845e-546cbc01cde4.png)

### Pod
* 가장 작은 배포 단위
* 컨테이너를 배포하는게 아니라 Pod를 배포합니다.
* 전체 클러스터에서 고유한 IP를 할당을 받습니다.
* 하나의 Pod 안에 여러 컨테이너가 속할 수 있습니다.

### Replica Set
* 여러 개의 Pod를 관리합니다.
* Pod를 생성, 제거하여 원하는 Replica 수를 유지합니다.
* Replica Set을 사용하여 배포 버전을 관리하며 점진적으로 수를 유지하면서 무중단 배포를 실행합니다.

### Clueter IP
* 클러스터 내부에서 사용하는 프록시입니다.
* Pod는 동적이지만 서비스는 고유 IP가 존재합니다.
* 클러스터 내부에서 서비스 연결 시 DNS를 이용합니다.
* 내부에서 사용하는 것으로 외부 웹 브라우저에서는 접근할 수 없습니다.

### NodePort
* 노드(host)에 노출되어 외부에서 접근 가능한 서비스 입니다.
* 모든 노드에 동일한 포트로 생성됩니다. (어떤 노드에 보내 특정 클러스터 IP로 보낼 수 있습니다.)

### LoadBalancer
* 하나의 IP 주소를 외부에 노출시켜줍니다.
* 부하를 분산시켜줍니다.

### Ingress
* 도메인 또는 경로 별로 라우팅을 시켜줍니다.
* NodePort와 LoadBalancer를 만들어줍니다.
* cf. NGINX

## 쿠버네티스 API 호출
* Desired State를 다양한 오브젝트로 정의하고 API Serverdp `yaml` 파일로 전달합니다.

> 참고:
> DevOps Engineer, Flynn님 DevOps와 Kubernetes 특강
> 
> [도서: 도커/쿠버네티스를 활용한 컨테이너 개발 실전 입문 - 야마다 아키노리](http://www.yes24.com/Product/Goods/70893433)