# Handle Simple Broker

Search
⌘ + k
Simple Broker
The built-in simple message broker handles subscription requests from clients,
stores them in memory, and broadcasts messages to connected clients that have matching
destinations. The broker supports path-like destinations, including subscriptions
to Ant-style destination patterns.
Applications can also use dot-separated (rather than slash-separated) destinations.
See
Dots as Separators
.
If configured with a task scheduler, the simple broker supports
STOMP heartbeats
.
To configure a scheduler, you can declare your own
TaskScheduler
bean and set it through
the
MessageBrokerRegistry
. Alternatively, you can use the one that is automatically
declared in the built-in WebSocket configuration, however, you’ll need
@Lazy
to avoid
a cycle between the built-in WebSocket configuration and your
WebSocketMessageBrokerConfigurer
. For example:
Java
Kotlin
```
@Configuration
@EnableWebSocketMessageBroker
public
class
WebSocketConfiguration
implements
WebSocketMessageBrokerConfigurer
{
private
TaskScheduler messageBrokerTaskScheduler;
@Autowired
public
void
setMessageBrokerTaskScheduler
(@Lazy TaskScheduler taskScheduler)
{
this
.messageBrokerTaskScheduler = taskScheduler;
}
@Override
public
void
configureMessageBroker
(MessageBrokerRegistry registry)
{
registry.enableSimpleBroker(
"/queue/"
,
"/topic/"
)
.setHeartbeatValue(
new
long
[] {
10000
,
20000
})
.setTaskScheduler(
this
.messageBrokerTaskScheduler);
// ...
}
}
Copied!
```
```
@Configuration
@EnableWebSocketMessageBroker
class
WebSocketConfiguration
:
WebSocketMessageBrokerConfigurer {
private
lateinit
var
messageBrokerTaskScheduler: TaskScheduler
@Autowired
fun
setMessageBrokerTaskScheduler
(
@Lazy
taskScheduler:
TaskScheduler
)
{
this
.messageBrokerTaskScheduler = taskScheduler
}
override
fun
configureMessageBroker
(registry:
MessageBrokerRegistry
)
{
registry.enableSimpleBroker(
"/queue/"
,
"/topic/"
)
.setHeartbeatValue(longArrayOf(
10000
,
20000
))
.setTaskScheduler(messageBrokerTaskScheduler)
// ...
}
}
Copied!
```