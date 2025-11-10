# Client Builder

Search
⌘ + k
Configuration
The simplest way to create a
WebClient
is through one of the static factory methods:
WebClient.create()
WebClient.create(String baseUrl)
You can also use
WebClient.builder()
with further options:
uriBuilderFactory
: Customized
UriBuilderFactory
to use as a base URL.
defaultUriVariables
: default values to use when expanding URI templates.
defaultHeader
: Headers for every request.
defaultCookie
: Cookies for every request.
defaultRequest
:
Consumer
to customize every request.
filter
: Client filter for every request.
exchangeStrategies
: HTTP message reader/writer customizations.
clientConnector
: HTTP client library settings.
observationRegistry
: the registry to use for enabling
Observability support
.
observationConvention
:
an optional, custom convention to extract metadata
for recorded observations.
For example:
Java
Kotlin
```
WebClient client = WebClient.builder()
.codecs(configurer -> ... )
.build();
Copied!
```
```
val
webClient = WebClient.builder()
.codecs { configurer -> ... }
.build()
Copied!
```
Once built, a
WebClient
is immutable. However, you can clone it and build a
modified copy as follows:
Java
Kotlin
```
WebClient client1 = WebClient.builder()
.filter(filterA).filter(filterB).build();
WebClient client2 = client1.mutate()
.filter(filterC).filter(filterD).build();
// client1 has filterA, filterB
// client2 has filterA, filterB, filterC, filterD
Copied!
```
```
val
client1 = WebClient.builder()
.filter(filterA).filter(filterB).build()
val
client2 = client1.mutate()
.filter(filterC).filter(filterD).build()
// client1 has filterA, filterB
// client2 has filterA, filterB, filterC, filterD
Copied!
```
MaxInMemorySize
Codecs have
limits
for buffering data in
memory to avoid application memory issues. By default those are set to 256KB.
If that’s not enough you’ll get the following error:
```
org.springframework.core.io.buffer.DataBufferLimitException: Exceeded limit on max bytes to buffer
```
To change the limit for default codecs, use the following:
Java
Kotlin
```
WebClient webClient = WebClient.builder()
.codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(
2
*
1024
*
1024
))
.build();
Copied!
```
```
val
webClient = WebClient.builder()
.codecs { configurer -> configurer.defaultCodecs().maxInMemorySize(
2
*
1024
*
1024
) }
.build()
Copied!
```
Reactor Netty
To customize Reactor Netty settings, provide a pre-configured
HttpClient
:
Java
Kotlin
```
HttpClient httpClient = HttpClient.create().secure(sslSpec -> ...);
WebClient webClient = WebClient.builder()
.clientConnector(
new
ReactorClientHttpConnector(httpClient))
.build();
Copied!
```
```
val
httpClient = HttpClient.create().secure { ... }
val
webClient = WebClient.builder()
.clientConnector(ReactorClientHttpConnector(httpClient))
.build()
Copied!
```
Resources
By default,
HttpClient
participates in the global Reactor Netty resources held in
reactor.netty.http.HttpResources
, including event loop threads and a connection pool.
This is the recommended mode, since fixed, shared resources are preferred for event loop
concurrency. In this mode global resources remain active until the process exits.
If the server is timed with the process, there is typically no need for an explicit
shutdown. However, if the server can start or stop in-process (for example, a Spring MVC
application deployed as a WAR), you can declare a Spring-managed bean of type
ReactorResourceFactory
with
globalResources=true
(the default) to ensure that the Reactor
Netty global resources are shut down when the Spring
ApplicationContext
is closed,
as the following example shows:
Java
Kotlin
```
@Bean
public
ReactorResourceFactory
reactorResourceFactory
()
{
return
new
ReactorResourceFactory();
}
Copied!
```
```
@Bean
fun
reactorResourceFactory
()
= ReactorResourceFactory()
Copied!
```
You can also choose not to participate in the global Reactor Netty resources. However,
in this mode, the burden is on you to ensure that all Reactor Netty client and server
instances use shared resources, as the following example shows:
Java
Kotlin
```
@Bean
public
ReactorResourceFactory
resourceFactory
()
{
ReactorResourceFactory factory =
new
ReactorResourceFactory();
factory.setUseGlobalResources(
false
);
(
1
)
return
factory;
}
@Bean
public
WebClient
webClient
()
{
Function<HttpClient, HttpClient> mapper = client -> {
// Further customizations...
};
ClientHttpConnector connector =
new
ReactorClientHttpConnector(resourceFactory(), mapper);
(
2
)
return
WebClient.builder().clientConnector(connector).build();
(
3
)
}
Copied!
```
1
Create resources independent of global ones.
2
Use the
ReactorClientHttpConnector
constructor with resource factory.
3
Plug the connector into the
WebClient.Builder
.
```
@Bean
fun
resourceFactory
()
= ReactorResourceFactory().apply {
isUseGlobalResources =
false
(
1
)
}
@Bean
fun
webClient
()
: WebClient {
val
mapper: (HttpClient) -> HttpClient = {
// Further customizations...
}
val
connector = ReactorClientHttpConnector(resourceFactory(), mapper)
(
2
)
return
WebClient.builder().clientConnector(connector).build()
(
3
)
}
Copied!
```
1
Create resources independent of global ones.
2
Use the
ReactorClientHttpConnector
constructor with resource factory.
3
Plug the connector into the
WebClient.Builder
.
Timeouts
To configure a connection timeout:
Java
Kotlin
```
import
io.netty.channel.ChannelOption;
HttpClient httpClient = HttpClient.create()
.option(ChannelOption.CONNECT_TIMEOUT_MILLIS,
10000
);
WebClient webClient = WebClient.builder()
.clientConnector(
new
ReactorClientHttpConnector(httpClient))
.build();
Copied!
```
```
import
io.netty.channel.ChannelOption
val
httpClient = HttpClient.create()
.option(ChannelOption.CONNECT_TIMEOUT_MILLIS,
10000
);
val
webClient = WebClient.builder()
.clientConnector(ReactorClientHttpConnector(httpClient))
.build();
Copied!
```
To configure a read or write timeout:
Java
Kotlin
```
import
io.netty.handler.timeout.ReadTimeoutHandler;
import
io.netty.handler.timeout.WriteTimeoutHandler;
HttpClient httpClient = HttpClient.create()
.doOnConnected(conn -> conn
.addHandlerLast(
new
ReadTimeoutHandler(
10
))
.addHandlerLast(
new
WriteTimeoutHandler(
10
)));
// Create WebClient...
Copied!
```
```
import
io.netty.handler.timeout.ReadTimeoutHandler
import
io.netty.handler.timeout.WriteTimeoutHandler
val
httpClient = HttpClient.create()
.doOnConnected { conn -> conn
.addHandlerLast(ReadTimeoutHandler(
10
))
.addHandlerLast(WriteTimeoutHandler(
10
))
}
// Create WebClient...
Copied!
```
To configure a response timeout for all requests:
Java
Kotlin
```
HttpClient httpClient = HttpClient.create()
.responseTimeout(Duration.ofSeconds(
2
));
// Create WebClient...
Copied!
```
```
val
httpClient = HttpClient.create()
.responseTimeout(Duration.ofSeconds(
2
));
// Create WebClient...
Copied!
```
To configure a response timeout for a specific request:
Java
Kotlin
```
WebClient.create().get()
.uri(
"https://example.org/path"
)
.httpRequest(httpRequest -> {
HttpClientRequest reactorRequest = httpRequest.getNativeRequest();
reactorRequest.responseTimeout(Duration.ofSeconds(
2
));
})
.retrieve()
.bodyToMono(String
.
class
)
;
Copied!
```
```
WebClient.create().
get
()
.uri(
"https://example.org/path"
)
.httpRequest { httpRequest: ClientHttpRequest ->
val
reactorRequest = httpRequest.getNativeRequest<HttpClientRequest>()
reactorRequest.responseTimeout(Duration.ofSeconds(
2
))
}
.retrieve()
.bodyToMono(String::
class
.
java
)
Copied!
```
JDK HttpClient
The following example shows how to customize the JDK
HttpClient
:
Java
Kotlin
```
HttpClient httpClient = HttpClient.newBuilder()
.followRedirects(Redirect.NORMAL)
.connectTimeout(Duration.ofSeconds(
20
))
.build();
ClientHttpConnector connector =
new
JdkClientHttpConnector(httpClient,
new
DefaultDataBufferFactory());
WebClient webClient = WebClient.builder().clientConnector(connector).build();
Copied!
```
```
val
httpClient = HttpClient.newBuilder()
.followRedirects(Redirect.NORMAL)
.connectTimeout(Duration.ofSeconds(
20
))
.build()
val
connector = JdkClientHttpConnector(httpClient, DefaultDataBufferFactory())
val
webClient = WebClient.builder().clientConnector(connector).build()
Copied!
```
Jetty
The following example shows how to customize Jetty
HttpClient
settings:
Java
Kotlin
```
HttpClient httpClient =
new
HttpClient();
httpClient.setCookieStore(...);
WebClient webClient = WebClient.builder()
.clientConnector(
new
JettyClientHttpConnector(httpClient))
.build();
Copied!
```
```
val
httpClient = HttpClient()
httpClient.cookieStore = ...
val
webClient = WebClient.builder()
.clientConnector(JettyClientHttpConnector(httpClient))
.build();
Copied!
```
By default,
HttpClient
creates its own resources (
Executor
,
ByteBufferPool
,
Scheduler
),
which remain active until the process exits or
stop()
is called.
You can share resources between multiple instances of the Jetty client (and server) and
ensure that the resources are shut down when the Spring
ApplicationContext
is closed by
declaring a Spring-managed bean of type
JettyResourceFactory
, as the following example
shows:
Java
Kotlin
```
@Bean
public
JettyResourceFactory
resourceFactory
()
{
return
new
JettyResourceFactory();
}
@Bean
public
WebClient
webClient
()
{
HttpClient httpClient =
new
HttpClient();
// Further customizations...
ClientHttpConnector connector =
new
JettyClientHttpConnector(httpClient, resourceFactory());
(
1
)
return
WebClient.builder().clientConnector(connector).build();
(
2
)
}
Copied!
```
1
Use the
JettyClientHttpConnector
constructor with resource factory.
2
Plug the connector into the
WebClient.Builder
.
```
@Bean
fun
resourceFactory
()
= JettyResourceFactory()
@Bean
fun
webClient
()
: WebClient {
val
httpClient = HttpClient()
// Further customizations...
val
connector = JettyClientHttpConnector(httpClient, resourceFactory())
(
1
)
return
WebClient.builder().clientConnector(connector).build()
(
2
)
}
Copied!
```
1
Use the
JettyClientHttpConnector
constructor with resource factory.
2
Plug the connector into the
WebClient.Builder
.
HttpComponents
The following example shows how to customize Apache HttpComponents
HttpClient
settings:
Java
Kotlin
```
HttpAsyncClientBuilder clientBuilder = HttpAsyncClients.custom();
clientBuilder.setDefaultRequestConfig(...);
CloseableHttpAsyncClient client = clientBuilder.build();
ClientHttpConnector connector =
new
HttpComponentsClientHttpConnector(client);
WebClient webClient = WebClient.builder().clientConnector(connector).build();
Copied!
```
```
val
client = HttpAsyncClients.custom().apply {
setDefaultRequestConfig(...)
}.build()
val
connector = HttpComponentsClientHttpConnector(client)
val
webClient = WebClient.builder().clientConnector(connector).build()
Copied!
```