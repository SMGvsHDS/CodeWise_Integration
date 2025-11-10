# Server Config

Search
⌘ + k
WebSocket Transport
This section explains how to configure the underlying WebSocket server transport.
For Jakarta WebSocket servers, add a
ServletServerContainerFactoryBean
to your
configuration. For examples, see
Configuring the Server
under the WebSocket section.
For Jetty WebSocket servers, customize the
JettyRequestUpgradeStrategy
as follows:
Java
Kotlin
```
@Configuration
@EnableWebSocketMessageBroker
public
class
JettyWebSocketConfiguration
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
).setHandshakeHandler(handshakeHandler());
}
@Bean
public
DefaultHandshakeHandler
handshakeHandler
()
{
JettyRequestUpgradeStrategy strategy =
new
JettyRequestUpgradeStrategy();
strategy.addWebSocketConfigurer(configurable -> {
configurable.setInputBufferSize(
4
*
8192
);
configurable.setIdleTimeout(Duration.ofSeconds(
600
));
});
return
new
DefaultHandshakeHandler(strategy);
}
}
Copied!
```
```
@Configuration
@EnableWebSocketMessageBroker
class
JettyWebSocketConfiguration
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
).setHandshakeHandler(handshakeHandler())
}
@Bean
fun
handshakeHandler
()
: DefaultHandshakeHandler {
val
strategy = JettyRequestUpgradeStrategy()
strategy.addWebSocketConfigurer {
it.inputBufferSize =
4
*
8192
it.idleTimeout = Duration.ofSeconds(
600
)
}
return
DefaultHandshakeHandler(strategy)
}
}
Copied!
```
In addition to WebSocket server properties, there are also STOMP WebSocket transport properties
to customize as follows:
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
@Override
public
void
configureWebSocketTransport
(WebSocketTransportRegistration registry)
{
registry.setMessageSizeLimit(
4
*
8192
);
registry.setTimeToFirstMessage(
30000
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
configureWebSocketTransport
(registry:
WebSocketTransportRegistration
)
{
registry.setMessageSizeLimit(
4
*
8192
)
registry.setTimeToFirstMessage(
30000
)
}
}
Copied!
```