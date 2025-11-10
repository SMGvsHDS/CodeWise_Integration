# Ordered Messages

Search
⌘ + k
Order of Messages
Messages from the broker are published to the
clientOutboundChannel
, from where they are
written to WebSocket sessions. As the channel is backed by a
ThreadPoolExecutor
, messages
are processed in different threads, and the resulting sequence received by the client may
not match the exact order of publication.
To enable ordered publishing, set the
setPreservePublishOrder
flag as follows:
Java
Kotlin
Xml
```
@Configuration
@EnableWebSocketMessageBroker
public
class
PublishOrderWebSocketConfiguration
implements
WebSocketMessageBrokerConfigurer
{
@Override
public
void
configureMessageBroker
(MessageBrokerRegistry registry)
{
// ...
registry.setPreservePublishOrder(
true
);
}
}
Copied!
```
```
@Configuration
@EnableWebSocketMessageBroker
class
PublishOrderWebSocketConfiguration
:
WebSocketMessageBrokerConfigurer {
override
fun
configureMessageBroker
(registry:
MessageBrokerRegistry
)
{
// ...
registry.setPreservePublishOrder(
true
)
}
}
Copied!
```
```
<
beans
xmlns
=
"http://www.springframework.org/schema/beans"
xmlns:xsi
=
"http://www.w3.org/2001/XMLSchema-instance"
xmlns:websocket
=
"http://www.springframework.org/schema/websocket"
xsi:schemaLocation
=
"
http://www.springframework.org/schema/beans
https://www.springframework.org/schema/beans/spring-beans.xsd
http://www.springframework.org/schema/websocket
https://www.springframework.org/schema/websocket/spring-websocket.xsd"
>
<
websocket:message-broker
preserve-publish-order
=
"true"
>
<!-- ... -->
</
websocket:message-broker
>
</
beans
>
Copied!
```
When the flag is set, messages within the same client session are published to the
clientOutboundChannel
one at a time, so that the order of publication is guaranteed.
Note that this incurs a small performance overhead, so you should enable it only if it is required.
The same also applies to messages from the client, which are sent to the
clientInboundChannel
,
from where they are handled according to their destination prefix. As the channel is backed by
a
ThreadPoolExecutor
, messages are processed in different threads, and the resulting sequence
of handling may not match the exact order in which they were received.
To enable ordered receiving, set the
setPreserveReceiveOrder
flag as follows:
Java
Kotlin
```
@Configuration
@EnableWebSocketMessageBroker
public
class
ReceiveOrderWebSocketConfiguration
implements
WebSocketMessageBrokerConfigurer
{
@Override
public
void
registerStompEndpoints
(StompEndpointRegistry registry)
{
registry.setPreserveReceiveOrder(
true
);
}
}
Copied!
```
```
@Configuration
@EnableWebSocketMessageBroker
class
ReceiveOrderWebSocketConfiguration
:
WebSocketMessageBrokerConfigurer {
override
fun
registerStompEndpoints
(registry:
StompEndpointRegistry
)
{
registry.setPreserveReceiveOrder(
true
)
}
}
Copied!
```