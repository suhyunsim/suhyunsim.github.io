---
layout: post
title: "Apple OAuth 백엔드 동작"
author: "Poogle"
categories: [BackEnd]
comments: true
tag: [Project, Photo-Tag, OAuth]

---


# Apple OAuth 설정 시 백엔드 동작 방식

![20201101-151343](https://user-images.githubusercontent.com/58318786/97798437-62395380-1c69-11eb-907f-6d6700a755e1.jpg)


Photo Tag 프로젝트를 진행하면서 유저의 회원가입 및 로그인은 Apple OAuth로 동작하도록 구현했는데요. 
> Photo Tag 프로젝트에 대한 소개는 → [이곳]([https://suhyunsim.github.io/2020-10-12/photo-tag-project](https://suhyunsim.github.io/2020-10-12/photo-tag-project))에 있습니다!

iOS 앱 화면에서 Apple OAuth로 수행한 결과를 백엔드 서버로 전달받을 때의 백엔드의 동작 방식을 알아보도록 하겠습니다.

<br>

우선 Apple OAuth 기능을 활성화 한 후 iOS 팀원과 공유할 수 있는 정보는 다음과 같습니다.

![20201101-161930 (1)](https://user-images.githubusercontent.com/58318786/97798447-85fc9980-1c69-11eb-92bd-8bbf201c2a54.jpg)

- redirect url을 앱에서 받기 위해 앱에 등록한 URL Scheme
- 로그인 완료 후 백엔드 서버로 보내주는 jwt 토큰

여기서 url Scheme은 iOS팀원과 상의 후 결정한 custom scheme입니다. 유저가 Apple Login 버튼을 통해 OAuth를 실행하면 Apple을 통해서 유저의 정보를 담은 JWT 토큰이 발행됩니다. 해당 토큰을 Request Body에 담아 백엔드로 POST 요청이 들어오는데요.

백엔드에서 살펴 볼 JWT 토큰의 payload claim들로는(정보의 한 조각을 claim이라고 부르고 name/value 쌍으로 되어있습니다.) 다음과 같은 것들이 있습니다.

### Registered Claim

- iss: 토큰 발급자(issuer)로 apple에서 발급한 토큰이므로 [`https://appleid.apple.com`](https://appleid.apple.com/) 링크가 들어있습니다.
- aud: 토큰 대상자(audience)로 애플 개발자 페이지에서 설정한 Identifiers - Services ID가 들어있습니다.

→ Photo Tag 프로젝트의 경우 이 두 가지를 유효한 토큰인지 검증하는 데에 사용하고 있습니다.

### Private Claim

클라이언트와 서버 협의 하에 사용되는 클레임입니다. 로그인한 유저의 정보를 담기 위해 social id, name,  email 등을 담고 이를 유저 DB에 저장합니다.(회원가입인 경우 DB에 insert, 기존에 정보가 있는 유저인 경우 update 되어 로그인 처리가 이루어집니다.)

즉, 클라이언트에서 받아 온 JWT 토큰을 검증한 후, 유효한 유저일 경우 DB에 정보를 저장해 로그인을 처리합니다.

이후 모든 요청 Request Header에 클라이언트는 해당 토큰을 담아서 통신하고 백엔드는 인터셉터를 활용해 요청을 검증하는 방식으로 작동합니다.