# Enable

Search
⌘ + k
Enable STOMP
STOMP over WebSocket support is available in the
spring-messaging
and
spring-websocket
modules. Once you have those dependencies, you can expose a STOMP
endpoint over WebSocket, as the following example shows:
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
// /portfolio is the HTTP URL for the endpoint to which a WebSocket (or SockJS)
// client needs to connect for the WebSocket handshake
registry.addEndpoint(
"/portfolio"
);
}
@Override
public
void
configureMessageBroker
(MessageBrokerRegistry config)
{
// STOMP messages whose destination header begins with /app are routed to
// @MessageMapping methods in @Controller classes
config.setApplicationDestinationPrefixes(
"/app"
);
// Use the built-in message broker for subscriptions and broadcasting and
// route messages whose destination header begins with /topic or /queue to the broker
config.enableSimpleBroker(
"/topic"
,
"/queue"
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
// /portfolio is the HTTP URL for the endpoint to which a WebSocket (or SockJS)
// client needs to connect for the WebSocket handshake
registry.addEndpoint(
"/portfolio"
)
}
override
fun
configureMessageBroker
(config:
MessageBrokerRegistry
)
{
// STOMP messages whose destination header begins with /app are routed to
// @MessageMapping methods in @Controller classes
config.setApplicationDestinationPrefixes(
"/app"
)
// Use the built-in message broker for subscriptions and broadcasting and
// route messages whose destination header begins with /topic or /queue to the broker
config.enableSimpleBroker(
"/topic"
,
"/queue"
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
/>
<
websocket:simple-broker
prefix
=
"/topic, /queue"
/>
</
websocket:message-broker
>
</
beans
>
Copied!
```
For the built-in simple broker, the
/topic
and
/queue
prefixes do not have any special
meaning. They are merely a convention to differentiate between pub-sub versus point-to-point
messaging (that is, many subscribers versus one consumer). When you use an external broker,
check the STOMP page of the broker to understand what kind of STOMP destinations and
prefixes it supports.
To connect from a browser, for STOMP, you can use
stomp-js/stompjs
which is the most
actively maintained JavaScript library.
The following example code is based on it:
```
const
stompClient =
new
StompJs.Client({
brokerURL
:
'ws://domain.com/portfolio'
,
onConnect
:
()
=>
{
// ...
}
});
Copied!
```
Alternatively, if you connect through SockJS, you can enable the
SockJS Fallback
on server-side with
registry.addEndpoint("/portfolio").withSockJS()
and on JavaScript side,
by following
those instructions
.
Note that
stompClient
in the preceding example does not need to specify
login
and
passcode
headers. Even if it did, they would be ignored (or, rather,
overridden) on the server side. See
Connecting to a Broker
and
Authentication
for more information on authentication.
For more example code see:
Using WebSocket to build an
interactive web application
— a getting started guide.
Stock Portfolio
— a sample
application.