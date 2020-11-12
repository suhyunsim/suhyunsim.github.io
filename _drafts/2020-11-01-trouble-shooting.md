---
layout: post
title: "MySQL Connection"
author: "Poogle"
categories: [BackEnd]
comments: true
tag: [MySQL, Trouble-shooting]

---

# MySQL Connection error

### 에러 메세지
{% highlight plain %}
com.mysql.cj.jdbc.exceptions.CommunicationsException: Communications link failure

The last packet successfully received from the server was 6 milliseconds ago. The last packet sent successfully to the server was 6 milliseconds ago.
	at com.mysql.cj.jdbc.exceptions.SQLError.createCommunicationsException(SQLError.java:174) ~[mysql-connector-java-8.0.21.jar:8.0.21]
	at com.mysql.cj.jdbc.exceptions.SQLExceptionsMapping.translateException(SQLExceptionsMapping.java:64) ~[mysql-connector-java-8.0.21.jar:8.0.21]
	at com.mysql.cj.jdbc.StatementImpl.executeInternal(StatementImpl.java:764) ~[mysql-connector-java-8.0.21.jar:8.0.21]
	at com.mysql.cj.jdbc.StatementImpl.execute(StatementImpl.java:648) ~[mysql-connector-java-8.0.21.jar:8.0.21]
	at com.zaxxer.hikari.pool.ProxyStatement.execute(ProxyStatement.java:95) ~[HikariCP-3.4.5.jar:na]
	at com.zaxxer.hikari.pool.HikariProxyStatement.execute(HikariProxyStatement.java) [HikariCP-3.4.5.jar:na]
	at org.springframework.jdbc.datasource.init.ScriptUtils.executeSqlScript(ScriptUtils.java:601) [spring-jdbc-5.2.9.RELEASE.jar:5.2.9.RELEASE]
	at org.springframework.jdbc.datasource.init.ResourceDatabasePopulator.populate(ResourceDatabasePopulator.java:254) [spring-jdbc-5.2.9.RELEASE.jar:5.2.9.RELEASE]
	at org.springframework.jdbc.datasource.init.DatabasePopulatorUtils.execute(DatabasePopulatorUtils.java:49) [spring-jdbc-5.2.9.RELEASE.jar:5.2.9.RELEASE]
	at org.springframework.boot.autoconfigure.jdbc.DataSourceInitializer.runScripts(DataSourceInitializer.java:202) [spring-boot-autoconfigure-2.3.4.RELEASE.jar:2.3.4.RELEASE]
	at org.springframework.boot.autoconfigure.jdbc.DataSourceInitializer.initSchema(DataSourceInitializer.java:119) [spring-boot-autoconfigure-2.3.4.RELEASE.jar:2.3.4.RELEASE]
	at org.springframework.boot.autoconfigure.jdbc.DataSourceInitializerInvoker.onApplicationEvent(DataSourceInitializerInvoker.java:91) [spring-boot-autoconfigure-2.3.4.RELEASE.jar:2.3.4.RELEASE]
	at org.springframework.boot.autoconfigure.jdbc.DataSourceInitializerInvoker.onApplicationEvent(DataSourceInitializerInvoker.java:38) [spring-boot-autoconfigure-2.3.4.RELEASE.jar:2.3.4.RELEASE]
	at org.springframework.context.event.SimpleApplicationEventMulticaster.doInvokeListener(SimpleApplicationEventMulticaster.java:172) [spring-context-5.2.9.RELEASE.jar:5.2.9.RELEASE]
	at org.springframework.context.event.SimpleApplicationEventMulticaster.invokeListener(SimpleApplicationEventMulticaster.java:165) [spring-context-5.2.9.RELEASE.jar:5.2.9.RELEASE]
	at org.springframework.context.event.SimpleApplicationEventMulticaster.multicastEvent(SimpleApplicationEventMulticaster.java:139) [spring-context-5.2.9.RELEASE.jar:5.2.9.RELEASE]
	at org.springframework.context.support.AbstractApplicationContext.publishEvent(AbstractApplicationContext.java:404) [spring-context-5.2.9.RELEASE.jar:5.2.9.RELEASE]
	at org.springframework.context.support.AbstractApplicationContext.publishEvent(AbstractApplicationContext.java:361) [spring-context-5.2.9.RELEASE.jar:5.2.9.RELEASE]
	at org.springframework.boot.autoconfigure.orm.jpa.DataSourceInitializedPublisher.publishEventIfRequired(DataSourceInitializedPublisher.java:99) [spring-boot-autoconfigure-2.3.4.RELEASE.jar:2.3.4.RELEASE]
	at org.springframework.boot.autoconfigure.orm.jpa.DataSourceInitializedPublisher.access$100(DataSourceInitializedPublisher.java:50) [spring-boot-autoconfigure-2.3.4.RELEASE.jar:2.3.4.RELEASE]
	at org.springframework.boot.autoconfigure.orm.jpa.DataSourceInitializedPublisher$DataSourceSchemaCreatedPublisher.lambda$postProcessEntityManagerFactory$0(DataSourceInitializedPublisher.java:200) [spring-boot-autoconfigure-2.3.4.RELEASE.jar:2.3.4.RELEASE]
	at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1149) ~[na:1.8.0_272]
	at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624) ~[na:1.8.0_272]
	at java.lang.Thread.run(Thread.java:748) ~[na:1.8.0_272]
Caused by: com.mysql.cj.exceptions.CJCommunicationsException: Communications link failure

{% endhighlight %}

