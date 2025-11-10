# Webtestclient

Search
⌘ + k
WebTestClient
WebTestClient
is an HTTP client designed for testing server applications. It wraps
Spring’s
WebClient
and uses it to perform requests
but exposes a testing facade for verifying responses.
WebTestClient
can be used to
perform end-to-end HTTP tests. It can also be used to test Spring MVC and Spring WebFlux
applications without a running server via mock server request and response objects.
Setup
To set up a
WebTestClient
you need to choose a server setup to bind to. This can be one
of several mock server setup choices or a connection to a live server.
Bind to Controller
This setup allows you to test specific controller(s) via mock request and response objects,
without a running server.
For WebFlux applications, use the following which loads infrastructure equivalent to the
WebFlux Java config
, registers the given
controller(s), and creates a
WebHandler chain
to handle requests:
Java
Kotlin
```
WebTestClient client =
WebTestClient.bindToController(
new
TestController()).build();
Copied!
```
```
val
client = WebTestClient.bindToController(TestController()).build()
Copied!
```
For Spring MVC, use the following which delegates to the
StandaloneMockMvcBuilder
to load infrastructure equivalent to the
WebMvc Java config
,
registers the given controller(s), and creates an instance of
MockMvc
to handle requests:
Java
Kotlin
```
WebTestClient client =
MockMvcWebTestClient.bindToController(
new
TestController()).build();
Copied!
```
```
val
client = MockMvcWebTestClient.bindToController(TestController()).build()
Copied!
```
Bind to
ApplicationContext
This setup allows you to load Spring configuration with Spring MVC or Spring WebFlux
infrastructure and controller declarations and use it to handle requests via mock request
and response objects, without a running server.
For WebFlux, use the following where the Spring
ApplicationContext
is passed to
WebHttpHandlerBuilder
to create the
WebHandler chain
to handle
requests:
Java
Kotlin
```
@SpringJUnitConfig
(WebConfig
.
class
)
(1)
class
MyTests
{
WebTestClient client;
@BeforeEach
void
setUp
(ApplicationContext context)
{
(
2
)
client = WebTestClient.bindToApplicationContext(context).build();
(
3
)
}
}
Copied!
```
1
Specify the configuration to load
2
Inject the configuration
3
Create the
WebTestClient
```
@SpringJUnitConfig(WebConfig::class)
(
1
)
class
MyTests
{
lateinit
var
client: WebTestClient
@BeforeEach
fun
setUp
(context:
ApplicationContext
)
{
(
2
)
client = WebTestClient.bindToApplicationContext(context).build()
(
3
)
}
}
Copied!
```
1
Specify the configuration to load
2
Inject the configuration
3
Create the
WebTestClient
For Spring MVC, use the following where the Spring
ApplicationContext
is passed to
MockMvcBuilders.webAppContextSetup
to create a
MockMvc
instance to handle
requests:
Java
Kotlin
```
@ExtendWith
(SpringExtension
.
class
)
@
WebAppConfiguration
("
classpath
:
META
-
INF
/
web
-
resources
")
(1)
@
ContextHierarchy
(
{
@ContextConfiguration
(classes = RootConfig
.
class
),
@
ContextConfiguration
(
classes
= WebConfig
.
class
)
})
class
MyTests
{
@Autowired
WebApplicationContext wac;
(
2
)
WebTestClient client;
@BeforeEach
void
setUp
()
{
client = MockMvcWebTestClient.bindToApplicationContext(
this
.wac).build();
(
3
)
}
}
Copied!
```
1
Specify the configuration to load
2
Inject the configuration
3
Create the
WebTestClient
```
@ExtendWith(SpringExtension.class)
@WebAppConfiguration(
"classpath:META-INF/web-resources"
)
(
1
)
@ContextHierarchy({
@ContextConfiguration(classes = RootConfig.class)
,
@ContextConfiguration(classes = WebConfig.class)
})
class
MyTests
{
@Autowired
lateinit
var
wac: WebApplicationContext;
(
2
)
lateinit
var
client: WebTestClient
@BeforeEach
fun
setUp
()
{
(
2
)
client = MockMvcWebTestClient.bindToApplicationContext(wac).build()
(
3
)
}
}
Copied!
```
1
Specify the configuration to load
2
Inject the configuration
3
Create the
WebTestClient
Bind to Router Function
This setup allows you to test
functional endpoints
via
mock request and response objects, without a running server.
For WebFlux, use the following which delegates to
RouterFunctions.toWebHandler
to
create a server setup to handle requests:
Java
Kotlin
```
RouterFunction<?> route = ...
client = WebTestClient.bindToRouterFunction(route).build();
Copied!
```
```
val
route: RouterFunction<*> = ...
val
client = WebTestClient.bindToRouterFunction(route).build()
Copied!
```
For Spring MVC there are currently no options to test
WebMvc functional endpoints
.
Bind to Server
This setup connects to a running server to perform full, end-to-end HTTP tests:
Java
Kotlin
```
client = WebTestClient.bindToServer().baseUrl(
"http://localhost:8080"
).build();
Copied!
```
```
client = WebTestClient.bindToServer().baseUrl(
"http://localhost:8080"
).build()
Copied!
```
Client Config
In addition to the server setup options described earlier, you can also configure client
options, including base URL, default headers, client filters, and others. These options
are readily available following
bindToServer()
. For all other configuration options,
you need to use
configureClient()
to transition from server to client configuration, as
follows:
Java
Kotlin
```
client = WebTestClient.bindToController(
new
TestController())
.configureClient()
.baseUrl(
"/test"
)
.build();
Copied!
```
```
client = WebTestClient.bindToController(TestController())
.configureClient()
.baseUrl(
"/test"
)
.build()
Copied!
```
Writing Tests
WebTestClient
provides an API identical to
WebClient
up to the point of performing a request by using
exchange()
. See the
WebClient
documentation for examples on how to
prepare a request with any content including form data, multipart data, and more.
After the call to
exchange()
,
WebTestClient
diverges from the
WebClient
and
instead continues with a workflow to verify responses.
To assert the response status and headers, use the following:
Java
Kotlin
```
client.get().uri(
"/persons/1"
)
.accept(MediaType.APPLICATION_JSON)
.exchange()
.expectStatus().isOk()
.expectHeader().contentType(MediaType.APPLICATION_JSON);
Copied!
```
```
client.
get
().uri(
"/persons/1"
)
.accept(MediaType.APPLICATION_JSON)
.exchange()
.expectStatus().isOk()
.expectHeader().contentType(MediaType.APPLICATION_JSON)
Copied!
```
If you would like for all expectations to be asserted even if one of them fails, you can
use
expectAll(..)
instead of multiple chained
expect*(..)
calls. This feature is
similar to the
soft assertions
support in AssertJ and the
assertAll()
support in
JUnit Jupiter.
Java
Kotlin
```
client.get().uri(
"/persons/1"
)
.accept(MediaType.APPLICATION_JSON)
.exchange()
.expectAll(
spec -> spec.expectStatus().isOk(),
spec -> spec.expectHeader().contentType(MediaType.APPLICATION_JSON)
);
Copied!
```
```
client.
get
().uri(
"/persons/1"
)
.accept(MediaType.APPLICATION_JSON)
.exchange()
.expectAll(
{ spec -> spec.expectStatus().isOk() },
{ spec -> spec.expectHeader().contentType(MediaType.APPLICATION_JSON) }
)
Copied!
```
You can then choose to decode the response body through one of the following:
expectBody(Class<T>)
: Decode to single object.
expectBodyList(Class<T>)
: Decode and collect objects to
List<T>
.
expectBody()
: Decode to
byte[]
for
JSON Content
or an empty body.
And perform assertions on the resulting higher level Object(s):
Java
Kotlin
```
client.get().uri(
"/persons"
)
.exchange()
.expectStatus().isOk()
.expectBodyList(Person
.
class
).
hasSize
(3).
contains
(
person
)
;
Copied!
```
```
import
org.springframework.test.web.reactive.server.expectBodyList
client.
get
().uri(
"/persons"
)
.exchange()
.expectStatus().isOk()
.expectBodyList<Person>().hasSize(
3
).contains(person)
Copied!
```
If the built-in assertions are insufficient, you can consume the object instead and
perform any other assertions:
Java
Kotlin
```
import
org.springframework.test.web.reactive.server.expectBody
client.get().uri(
"/persons/1"
)
.exchange()
.expectStatus().isOk()
.expectBody(Person
.
class
)
.
consumeWith
(
result
->
{
// custom assertions (for example, AssertJ)...
});
Copied!
```
```
client.
get
().uri(
"/persons/1"
)
.exchange()
.expectStatus().isOk()
.expectBody<Person>()
.consumeWith {
// custom assertions (for example, AssertJ)...
}
Copied!
```
Or you can exit the workflow and obtain an
EntityExchangeResult
:
Java
Kotlin
```
EntityExchangeResult<Person> result = client.get().uri(
"/persons/1"
)
.exchange()
.expectStatus().isOk()
.expectBody(Person
.
class
)
.
returnResult
()
;
Copied!
```
```
import
org.springframework.test.web.reactive.server.expectBody
val
result = client.
get
().uri(
"/persons/1"
)
.exchange()
.expectStatus().isOk
.expectBody<Person>()
.returnResult()
Copied!
```
When you need to decode to a target type with generics, look for the overloaded methods
that accept
ParameterizedTypeReference
instead of
Class<T>
.
No Content
If the response is not expected to have content, you can assert that as follows:
Java
Kotlin
```
client.post().uri(
"/persons"
)
.body(personMono, Person
.
class
)
.
exchange
()
.
expectStatus
().
isCreated
()
.
expectBody
().
isEmpty
()
;
Copied!
```
```
client.post().uri(
"/persons"
)
.bodyValue(person)
.exchange()
.expectStatus().isCreated()
.expectBody().isEmpty()
Copied!
```
If you want to ignore the response content, the following releases the content without
any assertions:
Java
Kotlin
```
client.get().uri(
"/persons/123"
)
.exchange()
.expectStatus().isNotFound()
.expectBody(Void
.
class
)
;
Copied!
```
```
client.
get
().uri(
"/persons/123"
)
.exchange()
.expectStatus().isNotFound
.expectBody<
Unit
>()
Copied!
```
JSON Content
You can use
expectBody()
without a target type to perform assertions on the raw
content rather than through higher level Object(s).
To verify the full JSON content with
JSONAssert
:
Java
Kotlin
```
client.get().uri(
"/persons/1"
)
.exchange()
.expectStatus().isOk()
.expectBody()
.json(
"{\"name\":\"Jane\"}"
)
Copied!
```
```
client.
get
().uri(
"/persons/1"
)
.exchange()
.expectStatus().isOk()
.expectBody()
.json(
"{\"name\":\"Jane\"}"
)
Copied!
```
To verify JSON content with
JSONPath
:
Java
Kotlin
```
client.get().uri(
"/persons"
)
.exchange()
.expectStatus().isOk()
.expectBody()
.jsonPath(
"$[0].name"
).isEqualTo(
"Jane"
)
.jsonPath(
"$[1].name"
).isEqualTo(
"Jason"
);
Copied!
```
```
client.
get
().uri(
"/persons"
)
.exchange()
.expectStatus().isOk()
.expectBody()
.jsonPath(
"$[0].name"
).isEqualTo(
"Jane"
)
.jsonPath(
"$[1].name"
).isEqualTo(
"Jason"
)
Copied!
```
Streaming Responses
To test potentially infinite streams such as
"text/event-stream"
or
"application/x-ndjson"
, start by verifying the response status and headers, and then
obtain a
FluxExchangeResult
:
Java
Kotlin
```
FluxExchangeResult<MyEvent> result = client.get().uri(
"/events"
)
.accept(TEXT_EVENT_STREAM)
.exchange()
.expectStatus().isOk()
.returnResult(MyEvent
.
class
)
;
Copied!
```
```
import
org.springframework.test.web.reactive.server.returnResult
val
result = client.
get
().uri(
"/events"
)
.accept(TEXT_EVENT_STREAM)
.exchange()
.expectStatus().isOk()
.returnResult<MyEvent>()
Copied!
```
Now you’re ready to consume the response stream with
StepVerifier
from
reactor-test
:
Java
Kotlin
```
Flux<Event> eventFlux = result.getResponseBody();
StepVerifier.create(eventFlux)
.expectNext(person)
.expectNextCount(
4
)
.consumeNextWith(p -> ...)
.thenCancel()
.verify();
Copied!
```
```
val
eventFlux = result.getResponseBody()
StepVerifier.create(eventFlux)
.expectNext(person)
.expectNextCount(
4
)
.consumeNextWith { p -> ... }
.thenCancel()
.verify()
Copied!
```
MockMvc Assertions
WebTestClient
is an HTTP client and as such it can only verify what is in the client
response including status, headers, and body.
When testing a Spring MVC application with a MockMvc server setup, you have the extra
choice to perform further assertions on the server response. To do that start by
obtaining an
ExchangeResult
after asserting the body:
Java
Kotlin
```
// For a response with a body
EntityExchangeResult<Person> result = client.get().uri(
"/persons/1"
)
.exchange()
.expectStatus().isOk()
.expectBody(Person
.
class
)
.
returnResult
()
;
// For a response without a body
EntityExchangeResult<Void> result = client.get().uri(
"/path"
)
.exchange()
.expectBody().isEmpty();
Copied!
```
```
// For a response with a body
val
result = client.
get
().uri(
"/persons/1"
)
.exchange()
.expectStatus().isOk()
.expectBody<Person>()
.returnResult()
// For a response without a body
val
result = client.
get
().uri(
"/path"
)
.exchange()
.expectBody().isEmpty()
Copied!
```
Then switch to MockMvc server response assertions:
Java
Kotlin
```
MockMvcWebTestClient.resultActionsFor(result)
.andExpect(model().attribute(
"integer"
,
3
))
.andExpect(model().attribute(
"string"
,
"a string value"
));
Copied!
```
```
MockMvcWebTestClient.resultActionsFor(result)
.andExpect(model().attribute(
"integer"
,
3
))
.andExpect(model().attribute(
"string"
,
"a string value"
));
Copied!
```