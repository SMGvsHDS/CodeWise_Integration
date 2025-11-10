# Handle Broker Relay

Search
⌘ + k
External Broker
The simple broker is great for getting started but supports only a subset of
STOMP commands (it does not support acks, receipts, and some other features),
relies on a simple message-sending loop, and is not suitable for clustering.
As an alternative, you can upgrade your applications to use a full-featured
message broker.
See the STOMP documentation for your message broker of choice (such as
RabbitMQ
,
ActiveMQ
, and others), install the broker,
and run it with STOMP support enabled. Then you can enable the STOMP broker relay
(instead of the simple broker) in the Spring configuration.
The following example configuration enables a full-featured broker:
Java
Kotlin
Xml
```
@Configuration
@EnableWebSocketMessageBroker
public
class
WebSocketConfiguration
implements
WebSocketMessageBrokerConfigurer
{
@Override
public
void
registerStompEndpoints
(StompEndpointRegistry registry)
{
registry.addEndpoint(
"/portfolio"
).withSockJS();
}
@Override
public
void
configureMessageBroker
(MessageBrokerRegistry registry)
{
registry.enableStompBrokerRelay(
"/topic"
,
"/queue"
);
registry.setApplicationDestinationPrefixes(
"/app"
);
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
override
fun
registerStompEndpoints
(registry:
StompEndpointRegistry
)
{
registry.addEndpoint(
"/portfolio"
).withSockJS()
}
override
fun
configureMessageBroker
(registry:
MessageBrokerRegistry
)
{
registry.enableStompBrokerRelay(
"/topic"
,
"/queue"
)
registry.setApplicationDestinationPrefixes(
"/app"
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
application-destination-prefix
=
"/app"
>
<
websocket:stomp-endpoint
path
=
"/portfolio"
>
<
websocket:sockjs
/>
</
websocket:stomp-endpoint
>
<
websocket:stomp-broker-relay
prefix
=
"/topic,/queue"
/>
</
websocket:message-broker
>
</
beans
>
Copied!
```
The STOMP broker relay in the preceding configuration is a Spring
MessageHandler
that handles messages by forwarding them to an external message broker.
To do so, it establishes TCP connections to the broker, forwards all messages to it,
and then forwards all messages received from the broker to clients through their
WebSocket sessions. Essentially, it acts as a “relay” that forwards messages
in both directions.
Add
io.projectreactor.netty:reactor-netty
and
io.netty:netty-all
dependencies to your project for TCP connection management.
Furthermore, application components (such as HTTP request handling methods,
business services, and others) can also send messages to the broker relay, as described
in
Sending Messages
, to broadcast messages to subscribed WebSocket clients.
In effect, the broker relay enables robust and scalable message broadcasting.