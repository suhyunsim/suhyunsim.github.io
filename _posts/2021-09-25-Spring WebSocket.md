---
layout: post
title: "SpringWebsocket 학습"
author: "Poogle"
categories: [BackEnd]
sitemap:
  changefreq: daily
  priority: 1.0
comments: true
tag: [WebSocket]

---

# Spring WebSocket 실습

> 참고: [Intro to WebSockets with Spring](https://www.baeldung.com/websockets-spring)

## Maven Dependencies

```xml
<!--spring-websocket-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>

<!--spring-messaging-->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-messaging</artifactId>
    <version>5.2.2.RELEASE</version>
</dependency>

<!--Jackson for json-->
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-core</artifactId>
    <version>2.10.2</version>
</dependency>

<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId> 
    <version>2.10.2</version>
</dependency>
```

## Config 파일

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    public void configureMessageBroker(MessageBrokerRegistry config) {
        //enable in-memory message broker to carry the messages back to the client on destinations prefixed with “/topic”
        config.enableSimpleBroker("/topic");
        //complete our simple configuration by designating the “/app” prefix to filter destinations targeting application annotated methods (via @MessageMapping).
        config.setApplicationDestinationPrefixes("/app");
    }

    //enabling Spring's STOMP support, enable SockJS fallback options
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/chat");
        registry.addEndpoint("/chat").withSockJS();
    }
}
```
* `configureMessageBroker()`: 메시지 라우팅하는데 사용될 메시지 브로커 구성
* Stomp
    * simple interoperable protocol designed for asynchronous message passing between clients via mediating servers
    * text based wire-format for messages passed between these clients and servers

## Message-Handling Controller

```java
import com.poogle.websocketprac.domain.Message;
import com.poogle.websocketprac.domain.OutputMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.text.SimpleDateFormat;
import java.util.Date;

@Controller
public class ChatController {

    //Spring's approach to working with STOMP message
    @MessageMapping("/chat")
    //destination
    @SendTo("/topic/message")
    public OutputMessage send(final Message message) throws Exception {
        final String time = new SimpleDateFormat("HH:mm").format(new Date());
        return new OutputMessage(message.getFrom(), message.getText(), time);

    }
}
```