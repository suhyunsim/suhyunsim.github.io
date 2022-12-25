---
layout: post
title: "Tips for System Design Interview"
author: "Poogle"
categories: [BackEnd]
sitemap:
changefreq: daily
priority: 1.0
comments: true
tag: [System Design Interview, Horizontal, Vertical, Scale-Up, Scale-Out, Load Balancer, Database, Sharding, Cache, CDN, Stateless, Bandwidth, Throughput, Latency, MapReduce]

---

> 참고 링크
> 
> [책 - 가상 면접 사례로 배우는 대규모 시스템 설계 기초](http://www.yes24.com/Product/Goods/102819435)
> 
> [책 - Cracking the Coding Interview](http://www.yes24.com/Product/Goods/19603610)

# 2 power n

|**2^n**|**estimate**|**name**|**type**|
|:-:|:-:|:-:|:-:|
|2^10|_1,000_|1천(thousand)|1KB|
|2^20|_1,000,000_|1백만(million)|1MB|
|2^30|_100,000,000_|10억(billion)|1GB|
|2^40|_1,000,000,000,000_|1조(trillion)|1TB|
|2^40|_1,000,000,000,000,000_|1000조(quadrillion)|1PB|

---

<br>

# 4 Steps for interview
## Step 1. 문제 이해 및 설계 범위 확정 (3 ~ 10min)
### Good questions to ask
- Main features in detail
- How many users?
- How fast the size of service will grow?
- What are the main technology stacks for the company?

## Step 2. 개략적인 설계안 제시 및 동의 구하기 (10 ~ 15min)
- Make a blueprint -> ask
- Draw a diagram
  - Clients(Mobile/Web)
  - API
  - Web Server
  - Database
  - Cache
  - CDN
  - Message queue...
- Calculate estimation(ask) and speak loud
- Consider real example
- API endpoints or DB Schema(ask)

## Step 3. 상세 설계 (10 ~ 25min)
### Accomplished Goals
- Main features
- Blueprint of total system
- Interviewer's opinion
- Parts to deep dive

## Step 4. 마무리 (3 ~ 5min)
### Follow-up Questions
- System Bottleneck
- Refactoring Points
- Summary
- Error(Server Error, Network Problems...) -> What will happen?
- Operation Issues
  - Metric, Log, Roll-out(배포)
- How to expand service
  - what if user * 10

## TODO
- Clarification w. Questions
- Understand Requirements
- There is no perfect answer(Design could be different - start-up / big company)
- Communication -> Interviewer should understand Interviewee
- Suggest various answers together
- Move on to the detail only after Interviewer agreed to the blueprint
  - Focus on main components
- Derive Interviewer's ideas
- Be prepared
- Question all the requirements and assumptions
- Ask Hint!

---

<br>

# Key Concepts

![system - Page 1 (1)](https://user-images.githubusercontent.com/58318786/209446558-ecef38e3-16c2-4d36-8fc9-e36c5c7c0250.png)

<br>

## Single Server Setup
1. **Users** - _access_ -> **websites** (through domain names)
2. **Domain Name System (DNS)**: paid service provided by 3rd parties and not hosted by our servers
3. **Internet Protocol (IP) address** - _returned_ -> **browser** / **mobile app**
5. Once IP obtained, **Hypertext Transfer Protocol (HTTP) requests**  - are _sent_ directly -> **web server**
6. **Web server** - _returns_ -> **HTML pages or JSON response** for rendering.
* In Single Server design
  * users are connected to the web server directly
  * X access the website if the web server is offline
  * 🤔 if many users access the web server simultaneously
    * reaches the web server’s load limit
    * users generally experience slower response or fail to connect to the server
* => ✨ load balancer is the best technique to address these problems

---

<br>

## Horizontal vs Vertical Scaling
### Horizontal = Scale Out
* adding more power (CPU, RAM, etc.) to servers
* desirable for large scale applications due to the limitations of vertical scaling
* DB Scale Out: **Sharding**
  * Sharding separates large databases into smaller, more easily managed parts called **shards**
  * Each shard shares the **same schema**, though the actual **data** on each shard is **unique** to the shard.
  * **Vertical Partitioning**
    * partitioning by feature
    * drawback: if one of these tables gets very large, you might need to repartition that database (possibly using a different partitioning scheme)
  * **Key-Based (or Hash-Based) Partitioning**
    * uses some part of the data (ex. ID) to partion
    * allocate N servers and put the data on `mod(key, n)`
    * the number of servers you have is effectively fixed
    * Adding additional servers  == reallocating all the data-a very expensive task
  * **Directory-Based Partitioning**
    * maintain a lookup table for where the data can be found
    * easy
    * drawbacks: (1) lookup table can be a single point of failure (2) constantly accessing this table impacts performance
  * Choice of the **Sharding Key** (partition key)
    * consists of one or more columns that determine how data is distributed
    * retrieve and modify data efficiently by routing database queries to the correct database
    * choose a key that can evenly distributed data
  * introduces complexities and new challenges to the system:
    * **Resharding data**: Resharding data is needed when
      * 1) a single shard could **no longer hold more data** due to rapid growth. 
      * 2) Certain shards might experience **shard exhaustion** faster than others due to uneven data distribution. When shard exhaustion happens, it requires updating the sharding function and moving data around. 
    * **Celebrity problem**: hotspot key problem
      * Excessive access to a specific shard could cause server overload
        * need to allocate a shard for each celebrity -> Each shard might even require further partition.
    * **Join and de-normalization**: 
      * Once a database has been sharded across multiple servers, it is hard to perform join operations across database shards. 
      * **de-normalize** the database -> queries can be performed in a single table.
        * adding redundant information into a database to speed up reads

### Vertical = Scale Up
* scale by adding more servers into your pool of resources 
* When traffic is low -> vertical scaling is a great option
* simplicity
* ⚠️ -> hard limit
* impossible to add unlimited CPU and memory to a single server
* does not hav failover and redundancy
  * 🥲 If one server goes down, the website/app goes down with it completely

---

<br>


## Load Balancer
* evenly _distributes_ incoming traffic among web servers that are defined in a load-balanced set
* web servers are unreachable directly by clients anymore
* load balancer communicates with web servers through **private IPs**
* 🙌 When web server are added (with load balancer)
  * => successfully **solved no failover issue** and **improved the availability** of the web tier

---

<br>

## Database
- With the growth of the user base -> need multiple servers
- Separating web/mobile traffic (web tier) and database (data tier) servers allows them to be scaled independently.

## Which DB to use?
### Relational databases, Relational database management system (RDBMS), SQL database
* MySQL, Oracle database, PostgreSQL, etc. 
* represent and store data in tables and rows
* Perform join operations using SQL across different database tables

### Non-Relational databases, NoSQL databases
* CouchDB, Neo4j, Cassandra, HBase, Amazon DynamoDB, etc
* 4 categories: 
  * key-value stores
  * graph stores
  * column stores
  * document stores
* Join operations -> generally X supported
* When to use?
  * Application requires super-low latency
  * Data are unstructured, or X have any relational data
  * Need to serialize and deserialize data (JSON, XML, YAML, etc.)
  * Need to store a massive amount of data
  
<br>

### Database replication
* master/slave relationship between the original (master) and the copies (slaves)
* master database
  * generally only supports write operations
  * **data-modifying commands (insert, delete, or update)** must be sent to the master database
* slave database
  * gets copies of the data from the master database
  * only supports **read operations** (**higher ratio of reads to writes**)
  * => slave > master databases
* 👍 Advantages
  * Better performance
    * all writes & updates ->  master nodes
    * read operations -> slave nodes
    * improves performance (=> allows more queries to be processed in parallel)
  * Reliability
    * If one of your database servers is destroyed by a natural disaster(typhoon, earthquake...) -> data is still preserved
    * X worry about data loss -> data is replicated across multiple locations 
  * High availability
    * By replicating data across different locations -> website remains in operation 
    * even if offline -> can access data stored in another database server
* What if one of the databases goes offline?
  * if) only 1 slave DB is available & goes offline
    * read operations -> master DB temporarily
    * after issue found -> a new slave DB will replace the old one
  * if) multiple slave DBs are available
    * read operations are redirected to other healthy slave DB
    * new database server will replace the old one
  * if) master DB goes offline
    * slave DB will be promoted to be the new master
    * all operations -> temporarily executed on the new master DB
    * new slave database will replace the old one for data replication immediately
  * if) production systems -> more complicated: data in a slave DB X up to date
    * missing data needs to be updated by running data recovery scripts
    * +) multi-masters and circular replication

<br>

---

<br>

## Cache
* temporary storage area
  * stores the result of expensive responses or frequently accessed data in memory 
  * -> subsequent requests are served more quickly

### Cash Tier
* temporary data store layer, much faster than the database
* better system performance
* ability to reduce database workloads
* ability to scale the cache tier independently

### Considerations
* Decide **when to use** cache
  * Consider using cache when data is **read frequently but modified infrequently**
  * volatile memory -> X ideal for persisting data
* **Expiration policy**
  * Once expired -> removed from the cache
  * X make the expiration date too short -> the system to reload data from the database too frequently
  * X make the expiration date too long -> data can become stale
* **Consistency**
  * involves keeping the data store and the cache **in sync**
  * Inconsistency <- data-modifying operations on the data store and cache are **not in a single transaction**
  * when scaling across multiple regions -> maintaining consistency: difficult
* **Mitigating failures**
  * single cache server represents a potential single point of failure (SPOF)
    * if it fails, will stop the entire system from working => avoid SPOF by multiple cache servers across different data centers
  * overprovision the required memory by certain percentages
    * provides a buffer as the memory usage increases
* **Eviction Policy**
  * Once full -> add -> cause existing items to be removed
  * Least-recently-used (LRU)
  * Least Frequently Used (LFU)
  * First in First Out (FIFO)

---

<br>

## CDN
* network of geographically dispersed servers used to deliver **static content**
* ex. CDN servers cache static content like images, videos, CSS, JavaScript files, etc.

### Considerations
* Cost
  * run by third-party providers -> charged for data transfers in and out of the CDN
* Setting an appropriate cache expiry
  * time-sensitive content -> setting a cache expiry time is important
* CDN fallback
* Invalidating files
  * remove a file from the CDN before it expires
* serve different version by object versions

---

<br>

## Stateless
- consider scaling the web tier horizontally ->  move state (for instance user session data) out of the web tier
- store session data in the persistent storage (ex. relational database or NoSQL)
- each web server in the cluster -> access state data from databases: **stateless web tier**

### Stateful Server vs Stateless Server
- **stateful server**: remembers client data (state) from one request to the next
  - every request from the same client must be routed to the same server
  - sticky sessions in most load balancers -> ⚠️ however, this adds the overhead
  - Adding or removing servers is much more difficult
  - challenging to handle server failures
- **stateless server**: keeps no state information
  - HTTP requests from users can be sent to any web servers
    - fetch state data from a shared data store
  - State data is stored in a shared data store and kept out of web servers
  - simpler, more robust, and scalable

- move session data -> out of the web tier & store them in the persistent data store -> **auto-scaling** of the web tier is easily achieved by adding or removing servers based on traffic load
  - autoscaling: adding or removing web servers automatically based on the traffic load
- shared data store: ex. _relational database, Memcached/Redis, NoSQL(easy to scale), etc._

---

<br>

## Data center
- To improve availability and provide a better user experience across wider geographical areas -> supporting **multiple data centers** is crucial.
- in normal operation: users are geoDNS-routed(geo-routed), to the closest data center, with a split traffic of x% in US-East and (100 – x)% in US-West
  - geoDNS: DNS service that allows domain names to be resolved to IP addresses based on the location of a user

### Technical challenges to achieve multi-data center
- Traffic redirection
  - GeoDNS can be used to direct traffic to the nearest data center depending on where a user is located
- Data synchronization
  - Users from different regions could use different local databases or caches
  - Failover -> traffic might be routed to a data center where data is unavailable
  - **replicate** data across multiple data centers
- Test and deployment
  - test website/application at different locations
  - **automated deployment tools** are vital to keep services consistent through all the data centers

---

<br>

## Message Queue, Asynchronous
- Message Queue
  - durable component, stored in memory, that supports asynchronous communication
  - serves as a buffer and distributes asynchronous requests
  - Structure
    - Input services(**producers**/**publishers**): create messages, and publish them to a message queue
    - **consumers**/**subscribers**: connect to the queue, and perform actions defined by the messages
  - **Decoupling** makes the message queue a preferred architecture for building a **scalable** and **reliable** application
  - **producer** can post a message to the queue when the consumer is unavailable to process it
  - **consumer** can read messages from the queue even when the producer is unavailable

---

<br>

## Log, Metric, Automation
### Logging
- Monitoring error logs is important -> helps to identify errors and problems in the system
- monitor error logs at per server level 
- use tools to aggregate them to a centralized service for easy search and viewing

### Metrics
- Collecting different types of metrics help us to gain business insights and understand the health status of the system
  - Host level metrics: CPU, Memory, disk I/O, etc.
  - Aggregated level metrics: the performance of the entire database tier, cache tier, etc.
  - Key business metrics: daily active users, retention, revenue, etc.
  
### Automation
- build or leverage automation tools to improve productivity
- Continuous integration: each code check-in is verified through automation, allowing teams to detect problems early
- automating your build, test, deploy process, etc. -> could improve developer productivity significantly

---

<br>

## Network
### Bandwidth
* maximum amount of data that can be transferred in a unit of time
* typically expressed in bits per second (or GB per second)

### Throughput
* the actual amount of data that is transferred

### Latency
* how long it takes data to go from one end to the other
* delay between the sender sending information (even a very small chunk of data) and the receiver receiving it

### Example - Conveyor Belt; transfers items across a factory
* Latency: time it takes an item to go from one side to another
* Throughput: the number of items that roll off the conveyor belt per second
* _Building a fatter conveyor belt_ ...
  * will **not** **change** **latency**
  * however will **change** **throughput** and **bandwidth**
  * get more items on the belt, thus transferring more in a given unit of time
* _Shortening the belt..._
  * will **decrease** **latency**, since items spend less time in transit
  * will **not change** the **throughput** or **bandwidth**
  * the same number of items will roll off the belt per unit of time.
* _Making a faster conveyor belt_...
  * will **change** **all** three
  * time it takes an item to travel across the factory decreases
  * more items will also roll off the conveyor belt per unit of time
* _Bandwidth_...
  * is the number of items that can be transferred per unit of time, in the best possible conditions
* _Throughput_...
  * is the time it really takes, when the machines perhaps aren't operating smoothly.

---

<br>

## Map Reduce
* associated with Google + used broadly
* typically used to process large amounts of data.
* requires you to write a Map step and a Reduce step. 
* The rest is handled by the system.
* Map takes in some data and emits a `<key, value>` pair.
* Reduce takes a key and a set of associated values and "reduces" them in some way, emitting a new key and value.
* The results of this might be fed back into the Reduce program for more reducing.
* MapReduce allows us to do a lot of processing in parallel, which makes processing huge amounts of data more scalable.