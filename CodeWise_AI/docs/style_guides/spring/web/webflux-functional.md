# Webflux Functional

Search
⌘ + k
Functional Endpoints
See equivalent in the Servlet stack
Spring WebFlux includes WebFlux.fn, a lightweight functional programming model in which functions
are used to route and handle requests and contracts are designed for immutability.
It is an alternative to the annotation-based programming model but otherwise runs on
the same
Reactive Core
foundation.
Overview
See equivalent in the Servlet stack
In WebFlux.fn, an HTTP request is handled with a
HandlerFunction
: a function that takes
ServerRequest
and returns a delayed
ServerResponse
(i.e.
Mono<ServerResponse>
).
Both the request and the response object have immutable contracts that offer JDK 8-friendly
access to the HTTP request and response.
HandlerFunction
is the equivalent of the body of a
@RequestMapping
method in the
annotation-based programming model.
Incoming requests are routed to a handler function with a
RouterFunction
: a function that
takes
ServerRequest
and returns a delayed
HandlerFunction
(i.e.
Mono<HandlerFunction>
).
When the router function matches, a handler function is returned; otherwise an empty Mono.
RouterFunction
is the equivalent of a
@RequestMapping
annotation, but with the major
difference that router functions provide not just data, but also behavior.
RouterFunctions.route()
provides a router builder that facilitates the creation of routers,
as the following example shows:
Java
Kotlin
```
import
static
org.springframework.http.MediaType.APPLICATION_JSON;
import
static
org.springframework.web.reactive.function.server.RequestPredicates.*;
import
static
org.springframework.web.reactive.function.server.RouterFunctions.route;
PersonRepository repository = ...
PersonHandler handler =
new
PersonHandler(repository);
RouterFunction<ServerResponse> route = route()
(
1
)
.GET(
"/person/{id}"
, accept(APPLICATION_JSON), handler::getPerson)
.GET(
"/person"
, accept(APPLICATION_JSON), handler::listPeople)
.POST(
"/person"
, handler::createPerson)
.build();
public
class
PersonHandler
{
// ...
public
Mono<ServerResponse>
listPeople
(ServerRequest request)
{
// ...
}
public
Mono<ServerResponse>
createPerson
(ServerRequest request)
{
// ...
}
public
Mono<ServerResponse>
getPerson
(ServerRequest request)
{
// ...
}
}
Copied!
```
1
Create router using
route()
.
```
val
repository: PersonRepository = ...
val
handler = PersonHandler(repository)
val
route = coRouter {
(
1
)
accept(APPLICATION_JSON).nest {
GET(
"/person/{id}"
, handler::getPerson)
GET(
"/person"
, handler::listPeople)
}
POST(
"/person"
, handler::createPerson)
}
class
PersonHandler
(
private
val
repository: PersonRepository) {
// ...
suspend
fun
listPeople
(request:
ServerRequest
)
: ServerResponse {
// ...
}
suspend
fun
createPerson
(request:
ServerRequest
)
: ServerResponse {
// ...
}
suspend
fun
getPerson
(request:
ServerRequest
)
: ServerResponse {
// ...
}
}
Copied!
```
1
Create router using Coroutines router DSL; a Reactive alternative is also available via
router { }
.
One way to run a
RouterFunction
is to turn it into an
HttpHandler
and install it
through one of the built-in
server adapters
:
RouterFunctions.toHttpHandler(RouterFunction)
RouterFunctions.toHttpHandler(RouterFunction, HandlerStrategies)
Most applications can run through the WebFlux Java configuration, see
Running a Server
.
HandlerFunction
See equivalent in the Servlet stack
ServerRequest
and
ServerResponse
are immutable interfaces that offer JDK 8-friendly
access to the HTTP request and response.
Both request and response provide
Reactive Streams
back pressure
against the body streams.
The request body is represented with a Reactor
Flux
or
Mono
.
The response body is represented with any Reactive Streams
Publisher
, including
Flux
and
Mono
.
For more on that, see
Reactive Libraries
.
ServerRequest
ServerRequest
provides access to the HTTP method, URI, headers, and query parameters,
while access to the body is provided through the
body
methods.
The following example extracts the request body to a
Mono<String>
:
Java
Kotlin
```
Mono<String> string = request.bodyToMono(String
.
class
)
;
Copied!
```
```
val
string = request.awaitBody<String>()
Copied!
```
The following example extracts the body to a
Flux<Person>
(or a
Flow<Person>
in Kotlin),
where
Person
objects are decoded from some serialized form, such as JSON or XML:
Java
Kotlin
```
Flux<Person> people = request.bodyToFlux(Person
.
class
)
;
Copied!
```
```
val
people = request.bodyToFlow<Person>()
Copied!
```
The preceding examples are shortcuts that use the more general
ServerRequest.body(BodyExtractor)
,
which accepts the
BodyExtractor
functional strategy interface. The utility class
BodyExtractors
provides access to a number of instances. For example, the preceding examples can
also be written as follows:
Java
Kotlin
```
Mono<String> string = request.body(BodyExtractors.toMono(String
.
class
))
;
Flux<Person> people = request.body(BodyExtractors.toFlux(Person
.
class
))
;
Copied!
```
```
val
string = request.body(BodyExtractors.toMono(String::
class
.
java
)).
awaitSingle
()
val
people = request.body(BodyExtractors.toFlux(Person::
class
.
java
)).
asFlow
()
Copied!
```
The following example shows how to access form data:
Java
Kotlin
```
Mono<MultiValueMap<String, String>> map = request.formData();
Copied!
```
```
val
map = request.awaitFormData()
Copied!
```
The following example shows how to access multipart data as a map:
Java
Kotlin
```
Mono<MultiValueMap<String, Part>> map = request.multipartData();
Copied!
```
```
val
map = request.awaitMultipartData()
Copied!
```
The following example shows how to access multipart data, one at a time, in streaming fashion:
Java
Kotlin
```
Flux<PartEvent> allPartEvents = request.bodyToFlux(PartEvent
.
class
)
;
allPartsEvents.windowUntil(PartEvent::isLast)
.concatMap(p -> p.switchOnFirst((signal, partEvents) -> {
if
(signal.hasValue()) {
PartEvent event = signal.get();
if
(event
instanceof
FormPartEvent formEvent) {
String value = formEvent.value();
// handle form field
}
else
if
(event
instanceof
FilePartEvent fileEvent) {
String filename = fileEvent.filename();
Flux<DataBuffer> contents = partEvents.map(PartEvent::content);
// handle file upload
}
else
{
return
Mono.error(
new
RuntimeException(
"Unexpected event: "
+ event));
}
}
else
{
return
partEvents;
// either complete or error signal
}
}));
Copied!
```
```
val
parts = request.bodyToFlux<PartEvent>()
allPartsEvents.windowUntil(PartEvent::isLast)
.concatMap {
it.switchOnFirst { signal, partEvents ->
if
(signal.hasValue()) {
val
event = signal.
get
()
if
(event
is
FormPartEvent) {
val
value: String = event.value();
// handle form field
}
else
if
(event
is
FilePartEvent) {
val
filename: String = event.filename();
val
contents: Flux<DataBuffer> = partEvents.map(PartEvent::content);
// handle file upload
}
else
{
return
Mono.error(RuntimeException(
"Unexpected event: "
+ event));
}
}
else
{
return
partEvents;
// either complete or error signal
}
}
}
}
Copied!
```
The body contents of the
PartEvent
objects must be completely consumed, relayed, or released to avoid memory leaks.
The following shows how to bind request parameters, including an optional
DataBinder
customization:
Java
Kotlin
```
Pet pet = request.bind(Pet
.
class
,
dataBinder
->
dataBinder
.
setAllowedFields
("
name
"))
;
Copied!
```
```
val
pet = request.bind(Pet::
class
.
java
,
{dataBinder -> dataBinder.setAllowedFields
(
"name"
)})
Copied!
```
ServerResponse
ServerResponse
provides access to the HTTP response and, since it is immutable, you can use
a
build
method to create it. You can use the builder to set the response status, to add response
headers, or to provide a body. The following example creates a 200 (OK) response with JSON
content:
Java
Kotlin
```
Mono<Person> person = ...
ServerResponse.ok().contentType(MediaType.APPLICATION_JSON).body(person, Person
.
class
)
;
Copied!
```
```
val
person: Person = ...
ServerResponse.ok().contentType(MediaType.APPLICATION_JSON).bodyValue(person)
Copied!
```
The following example shows how to build a 201 (CREATED) response with a
Location
header and no body:
Java
Kotlin
```
URI location = ...
ServerResponse.created(location).build();
Copied!
```
```
val
location: URI = ...
ServerResponse.created(location).build()
Copied!
```
Depending on the codec used, it is possible to pass hint parameters to customize how the
body is serialized or deserialized. For example, to specify a
Jackson JSON view
:
Java
Kotlin
```
ServerResponse.ok().hint(Jackson2CodecSupport.JSON_VIEW_HINT, MyJacksonView
.
class
).
body
(...)
;
Copied!
```
```
ServerResponse.ok().hint(Jackson2CodecSupport.JSON_VIEW_HINT, MyJacksonView::
class
.
java
).
body
(...)
Copied!
```
Handler Classes
We can write a handler function as a lambda, as the following example shows:
Java
Kotlin
```
HandlerFunction<ServerResponse> helloWorld =
request -> ServerResponse.ok().bodyValue(
"Hello World"
);
Copied!
```
```
val
helloWorld = HandlerFunction<ServerResponse> { ServerResponse.ok().bodyValue(
"Hello World"
) }
Copied!
```
That is convenient, but in an application we need multiple functions, and multiple inline
lambda’s can get messy.
Therefore, it is useful to group related handler functions together into a handler class, which
has a similar role as
@Controller
in an annotation-based application.
For example, the following class exposes a reactive
Person
repository:
Java
Kotlin
```
import
static
org.springframework.http.MediaType.APPLICATION_JSON;
import
static
org.springframework.web.reactive.function.server.ServerResponse.ok;
public
class
PersonHandler
{
private
final
PersonRepository repository;
public
PersonHandler
(PersonRepository repository)
{
this
.repository = repository;
}
public
Mono<ServerResponse>
listPeople
(ServerRequest request)
{
(
1
)
Flux<Person> people = repository.allPeople();
return
ok().contentType(APPLICATION_JSON).body(people, Person
.
class
)
;
}
public
Mono<ServerResponse>
createPerson
(ServerRequest request)
{
(
2
)
Mono<Person> person = request.bodyToMono(Person
.
class
)
;
return
ok().build(repository.savePerson(person));
}
public
Mono<ServerResponse>
getPerson
(ServerRequest request)
{
(
3
)
int
personId = Integer.valueOf(request.pathVariable(
"id"
));
return
repository.getPerson(personId)
.flatMap(person -> ok().contentType(APPLICATION_JSON).bodyValue(person))
.switchIfEmpty(ServerResponse.notFound().build());
}
}
Copied!
```
1
listPeople
is a handler function that returns all
Person
objects found in the repository as
JSON.
2
createPerson
is a handler function that stores a new
Person
contained in the request body.
Note that
PersonRepository.savePerson(Person)
returns
Mono<Void>
: an empty
Mono
that emits
a completion signal when the person has been read from the request and stored. So we use the
build(Publisher<Void>)
method to send a response when that completion signal is received (that is,
when the
Person
has been saved).
3
getPerson
is a handler function that returns a single person, identified by the
id
path
variable. We retrieve that
Person
from the repository and create a JSON response, if it is
found. If it is not found, we use
switchIfEmpty(Mono<T>)
to return a 404 Not Found response.
```
class
PersonHandler
(
private
val
repository: PersonRepository) {
suspend
fun
listPeople
(request:
ServerRequest
)
: ServerResponse {
(
1
)
val
people: Flow<Person> = repository.allPeople()
return
ok().contentType(APPLICATION_JSON).bodyAndAwait(people);
}
suspend
fun
createPerson
(request:
ServerRequest
)
: ServerResponse {
(
2
)
val
person = request.awaitBody<Person>()
repository.savePerson(person)
return
ok().buildAndAwait()
}
suspend
fun
getPerson
(request:
ServerRequest
)
: ServerResponse {
(
3
)
val
personId = request.pathVariable(
"id"
).toInt()
return
repository.getPerson(personId)?.let { ok().contentType(APPLICATION_JSON).bodyValueAndAwait(it) }
?: ServerResponse.notFound().buildAndAwait()
}
}
Copied!
```
1
listPeople
is a handler function that returns all
Person
objects found in the repository as
JSON.
2
createPerson
is a handler function that stores a new
Person
contained in the request body.
Note that
PersonRepository.savePerson(Person)
is a suspending function with no return type.
3
getPerson
is a handler function that returns a single person, identified by the
id
path
variable. We retrieve that
Person
from the repository and create a JSON response, if it is
found. If it is not found, we return a 404 Not Found response.
Validation
A functional endpoint can use Spring’s
validation facilities
to
apply validation to the request body. For example, given a custom Spring
Validator
implementation for a
Person
:
Java
Kotlin
```
public
class
PersonHandler
{
private
final
Validator validator =
new
PersonValidator();
(
1
)
// ...
public
Mono<ServerResponse>
createPerson
(ServerRequest request)
{
Mono<Person> person = request.bodyToMono(Person
.
class
).
doOnNext
(
this
::
validate
)
;
(
2
)
return
ok().build(repository.savePerson(person));
}
private
void
validate
(Person person)
{
Errors errors =
new
BeanPropertyBindingResult(person,
"person"
);
validator.validate(person, errors);
if
(errors.hasErrors()) {
throw
new
ServerWebInputException(errors.toString());
(
3
)
}
}
}
Copied!
```
1
Create
Validator
instance.
2
Apply validation.
3
Raise exception for a 400 response.
```
class
PersonHandler
(
private
val
repository: PersonRepository) {
private
val
validator = PersonValidator()
(
1
)
// ...
suspend
fun
createPerson
(request:
ServerRequest
)
: ServerResponse {
val
person = request.awaitBody<Person>()
validate(person)
(
2
)
repository.savePerson(person)
return
ok().buildAndAwait()
}
private
fun
validate
(person:
Person
)
{
val
errors: Errors = BeanPropertyBindingResult(person,
"person"
);
validator.validate(person, errors);
if
(errors.hasErrors()) {
throw
ServerWebInputException(errors.toString())
(
3
)
}
}
}
Copied!
```
1
Create
Validator
instance.
2
Apply validation.
3
Raise exception for a 400 response.
Handlers can also use the standard bean validation API (JSR-303) by creating and injecting
a global
Validator
instance based on
LocalValidatorFactoryBean
.
See
Spring Validation
.
RouterFunction
See equivalent in the Servlet stack
Router functions are used to route the requests to the corresponding
HandlerFunction
.
Typically, you do not write router functions yourself, but rather use a method on the
RouterFunctions
utility class to create one.
RouterFunctions.route()
(no parameters) provides you with a fluent builder for creating a router
function, whereas
RouterFunctions.route(RequestPredicate, HandlerFunction)
offers a direct way
to create a router.
Generally, it is recommended to use the
route()
builder, as it provides
convenient short-cuts for typical mapping scenarios without requiring hard-to-discover
static imports.
For instance, the router function builder offers the method
GET(String, HandlerFunction)
to create a mapping for GET requests; and
POST(String, HandlerFunction)
for POSTs.
Besides HTTP method-based mapping, the route builder offers a way to introduce additional
predicates when mapping to requests.
For each HTTP method there is an overloaded variant that takes a
RequestPredicate
as a
parameter, though which additional constraints can be expressed.
Predicates
You can write your own
RequestPredicate
, but the
RequestPredicates
utility class
offers commonly used implementations, based on the request path, HTTP method, content-type,
and so on.
The following example uses a request predicate to create a constraint based on the
Accept
header:
Java
Kotlin
```
RouterFunction<ServerResponse> route = RouterFunctions.route()
.GET(
"/hello-world"
, accept(MediaType.TEXT_PLAIN),
request -> ServerResponse.ok().bodyValue(
"Hello World"
)).build();
Copied!
```
```
val
route = coRouter {
GET(
"/hello-world"
, accept(TEXT_PLAIN)) {
ServerResponse.ok().bodyValueAndAwait(
"Hello World"
)
}
}
Copied!
```
You can compose multiple request predicates together by using:
RequestPredicate.and(RequestPredicate)
— both must match.
RequestPredicate.or(RequestPredicate)
— either can match.
Many of the predicates from
RequestPredicates
are composed.
For example,
RequestPredicates.GET(String)
is composed from
RequestPredicates.method(HttpMethod)
and
RequestPredicates.path(String)
.
The example shown above also uses two request predicates, as the builder uses
RequestPredicates.GET
internally, and composes that with the
accept
predicate.
Routes
Router functions are evaluated in order: if the first route does not match, the
second is evaluated, and so on.
Therefore, it makes sense to declare more specific routes before general ones.
This is also important when registering router functions as Spring beans, as will
be described later.
Note that this behavior is different from the annotation-based programming model, where the
"most specific" controller method is picked automatically.
When using the router function builder, all defined routes are composed into one
RouterFunction
that is returned from
build()
.
There are also other ways to compose multiple router functions together:
add(RouterFunction)
on the
RouterFunctions.route()
builder
RouterFunction.and(RouterFunction)
RouterFunction.andRoute(RequestPredicate, HandlerFunction)
— shortcut for
RouterFunction.and()
with nested
RouterFunctions.route()
.
The following example shows the composition of four routes:
Java
Kotlin
```
import
static
org.springframework.http.MediaType.APPLICATION_JSON;
import
static
org.springframework.web.reactive.function.server.RequestPredicates.*;
PersonRepository repository = ...
PersonHandler handler =
new
PersonHandler(repository);
RouterFunction<ServerResponse> otherRoute = ...
RouterFunction<ServerResponse> route = route()
.GET(
"/person/{id}"
, accept(APPLICATION_JSON), handler::getPerson)
(
1
)
.GET(
"/person"
, accept(APPLICATION_JSON), handler::listPeople)
(
2
)
.POST(
"/person"
, handler::createPerson)
(
3
)
.add(otherRoute)
(
4
)
.build();
Copied!
```
1
GET /person/{id}
with an
Accept
header that matches JSON is routed to
PersonHandler.getPerson
2
GET /person
with an
Accept
header that matches JSON is routed to
PersonHandler.listPeople
3
POST /person
with no additional predicates is mapped to
PersonHandler.createPerson
, and
4
otherRoute
is a router function that is created elsewhere, and added to the route built.
```
import
org.springframework.http.MediaType.APPLICATION_JSON
val
repository: PersonRepository = ...
val
handler = PersonHandler(repository);
val
otherRoute: RouterFunction<ServerResponse> = coRouter {  }
val
route = coRouter {
GET(
"/person/{id}"
, accept(APPLICATION_JSON), handler::getPerson)
(
1
)
GET(
"/person"
, accept(APPLICATION_JSON), handler::listPeople)
(
2
)
POST(
"/person"
, handler::createPerson)
(
3
)
}.and(otherRoute)
(
4
)
Copied!
```
1
GET /person/{id}
with an
Accept
header that matches JSON is routed to
PersonHandler.getPerson
2
GET /person
with an
Accept
header that matches JSON is routed to
PersonHandler.listPeople
3
POST /person
with no additional predicates is mapped to
PersonHandler.createPerson
, and
4
otherRoute
is a router function that is created elsewhere, and added to the route built.
Nested Routes
It is common for a group of router functions to have a shared predicate, for instance a
shared path. In the example above, the shared predicate would be a path predicate that
matches
/person
, used by three of the routes. When using annotations, you would remove
this duplication by using a type-level
@RequestMapping
annotation that maps to
/person
. In WebFlux.fn, path predicates can be shared through the
path
method on the
router function builder. For instance, the last few lines of the example above can be
improved in the following way by using nested routes:
Java
Kotlin
```
RouterFunction<ServerResponse> route = route()
.path(
"/person"
, builder -> builder
(
1
)
.GET(
"/{id}"
, accept(APPLICATION_JSON), handler::getPerson)
.GET(accept(APPLICATION_JSON), handler::listPeople)
.POST(handler::createPerson))
.build();
Copied!
```
1
Note that second parameter of
path
is a consumer that takes the router builder.
```
val
route = coRouter {
(
1
)
"/person"
.nest {
GET(
"/{id}"
, accept(APPLICATION_JSON), handler::getPerson)
GET(accept(APPLICATION_JSON), handler::listPeople)
POST(handler::createPerson)
}
}
Copied!
```
1
Create router using Coroutines router DSL; a Reactive alternative is also available via
router { }
.
Though path-based nesting is the most common, you can nest on any kind of predicate by using
the
nest
method on the builder.
The above still contains some duplication in the form of the shared
Accept
-header predicate.
We can further improve by using the
nest
method together with
accept
:
Java
Kotlin
```
RouterFunction<ServerResponse> route = route()
.path(
"/person"
, b1 -> b1
.nest(accept(APPLICATION_JSON), b2 -> b2
.GET(
"/{id}"
, handler::getPerson)
.GET(handler::listPeople))
.POST(handler::createPerson))
.build();
Copied!
```
```
val
route = coRouter {
"/person"
.nest {
accept(APPLICATION_JSON).nest {
GET(
"/{id}"
, handler::getPerson)
GET(handler::listPeople)
POST(handler::createPerson)
}
}
}
Copied!
```
Serving Resources
WebFlux.fn provides built-in support for serving resources.
In addition to the capabilities described below, it is possible to implement even more flexible resource handling thanks to
RouterFunctions#resource(java.util.function.Function)
.
Redirecting to a resource
It is possible to redirect requests matching a specified predicate to a resource. This can be useful, for example,
for handling redirects in Single Page Applications.
Java
Kotlin
```
ClassPathResource index =
new
ClassPathResource(
"static/index.html"
);
List<String> extensions = List.of(
"js"
,
"css"
,
"ico"
,
"png"
,
"jpg"
,
"gif"
);
RequestPredicate spaPredicate = path(
"/api/**"
).or(path(
"/error"
)).or(pathExtension(extensions::contains)).negate();
RouterFunction<ServerResponse> redirectToIndex = route()
.resource(spaPredicate, index)
.build();
Copied!
```
```
val
redirectToIndex = router {
val
index = ClassPathResource(
"static/index.html"
)
val
extensions = listOf(
"js"
,
"css"
,
"ico"
,
"png"
,
"jpg"
,
"gif"
)
val
spaPredicate = !(path(
"/api/**"
) or path(
"/error"
) or
pathExtension(extensions::contains))
resource(spaPredicate, index)
}
Copied!
```
Serving resources from a root location
It is also possible to route requests that match a given pattern to resources relative to a given root location.
Java
Kotlin
```
Resource location =
new
FileUrlResource(
"public-resources/"
);
RouterFunction<ServerResponse> resources = RouterFunctions.resources(
"/resources/**"
, location);
Copied!
```
```
val
location = FileUrlResource(
"public-resources/"
)
val
resources = router { resources(
"/resources/**"
, location) }
Copied!
```
Running a Server
See equivalent in the Servlet stack
How do you run a router function in an HTTP server? A simple option is to convert a router
function to an
HttpHandler
by using one of the following:
RouterFunctions.toHttpHandler(RouterFunction)
RouterFunctions.toHttpHandler(RouterFunction, HandlerStrategies)
You can then use the returned
HttpHandler
with a number of server adapters by following
HttpHandler
for server-specific instructions.
A more typical option, also used by Spring Boot, is to run with a
DispatcherHandler
-based setup through the
WebFlux Config
, which uses Spring configuration to declare the
components required to process requests. The WebFlux Java configuration declares the following
infrastructure components to support functional endpoints:
RouterFunctionMapping
: Detects one or more
RouterFunction<?>
beans in the Spring
configuration,
orders them
, combines them through
RouterFunction.andOther
, and routes requests to the resulting composed
RouterFunction
.
HandlerFunctionAdapter
: Simple adapter that lets
DispatcherHandler
invoke
a
HandlerFunction
that was mapped to a request.
ServerResponseResultHandler
: Handles the result from the invocation of a
HandlerFunction
by invoking the
writeTo
method of the
ServerResponse
.
The preceding components let functional endpoints fit within the
DispatcherHandler
request
processing lifecycle and also (potentially) run side by side with annotated controllers, if
any are declared. It is also how functional endpoints are enabled by the Spring Boot WebFlux
starter.
The following example shows a WebFlux Java configuration (see
DispatcherHandler
for how to run it):
Java
Kotlin
```
@Configuration
@EnableWebFlux
public
class
WebConfig
implements
WebFluxConfigurer
{
@Bean
public
RouterFunction<?> routerFunctionA() {
// ...
}
@Bean
public
RouterFunction<?> routerFunctionB() {
// ...
}
// ...
@Override
public
void
configureHttpMessageCodecs
(ServerCodecConfigurer configurer)
{
// configure message conversion...
}
@Override
public
void
addCorsMappings
(CorsRegistry registry)
{
// configure CORS...
}
@Override
public
void
configureViewResolvers
(ViewResolverRegistry registry)
{
// configure view resolution for HTML rendering...
}
}
Copied!
```
```
@Configuration
@EnableWebFlux
class
WebConfig
:
WebFluxConfigurer {
@Bean
fun
routerFunctionA
()
: RouterFunction<*> {
// ...
}
@Bean
fun
routerFunctionB
()
: RouterFunction<*> {
// ...
}
// ...
override
fun
configureHttpMessageCodecs
(configurer:
ServerCodecConfigurer
)
{
// configure message conversion...
}
override
fun
addCorsMappings
(registry:
CorsRegistry
)
{
// configure CORS...
}
override
fun
configureViewResolvers
(registry:
ViewResolverRegistry
)
{
// configure view resolution for HTML rendering...
}
}
Copied!
```
Filtering Handler Functions
See equivalent in the Servlet stack
You can filter handler functions by using the
before
,
after
, or
filter
methods on the routing
function builder.
With annotations, you can achieve similar functionality by using
@ControllerAdvice
, a
ServletFilter
, or both.
The filter will apply to all routes that are built by the builder.
This means that filters defined in nested routes do not apply to "top-level" routes.
For instance, consider the following example:
Java
Kotlin
```
RouterFunction<ServerResponse> route = route()
.path(
"/person"
, b1 -> b1
.nest(accept(APPLICATION_JSON), b2 -> b2
.GET(
"/{id}"
, handler::getPerson)
.GET(handler::listPeople)
.before(request -> ServerRequest.from(request)
(
1
)
.header(
"X-RequestHeader"
,
"Value"
)
.build()))
.POST(handler::createPerson))
.after((request, response) -> logResponse(response))
(
2
)
.build();
Copied!
```
1
The
before
filter that adds a custom request header is only applied to the two GET routes.
2
The
after
filter that logs the response is applied to all routes, including the nested ones.
```
val
route = router {
"/person"
.nest {
GET(
"/{id}"
, handler::getPerson)
GET(
""
, handler::listPeople)
before {
(
1
)
ServerRequest.from(it)
.header(
"X-RequestHeader"
,
"Value"
).build()
}
POST(handler::createPerson)
after { _, response ->
(
2
)
logResponse(response)
}
}
}
Copied!
```
1
The
before
filter that adds a custom request header is only applied to the two GET routes.
2
The
after
filter that logs the response is applied to all routes, including the nested ones.
The
filter
method on the router builder takes a
HandlerFilterFunction
: a
function that takes a
ServerRequest
and
HandlerFunction
and returns a
ServerResponse
.
The handler function parameter represents the next element in the chain.
This is typically the handler that is routed to, but it can also be another
filter if multiple are applied.
Now we can add a simple security filter to our route, assuming that we have a
SecurityManager
that
can determine whether a particular path is allowed.
The following example shows how to do so:
Java
Kotlin
```
SecurityManager securityManager = ...
RouterFunction<ServerResponse> route = route()
.path(
"/person"
, b1 -> b1
.nest(accept(APPLICATION_JSON), b2 -> b2
.GET(
"/{id}"
, handler::getPerson)
.GET(handler::listPeople))
.POST(handler::createPerson))
.filter((request, next) -> {
if
(securityManager.allowAccessTo(request.path())) {
return
next.handle(request);
}
else
{
return
ServerResponse.status(UNAUTHORIZED).build();
}
})
.build();
Copied!
```
```
val
securityManager: SecurityManager = ...
val
route = router {
(
"/person"
and accept(APPLICATION_JSON)).nest {
GET(
"/{id}"
, handler::getPerson)
GET(
""
, handler::listPeople)
POST(handler::createPerson)
filter { request, next ->
if
(securityManager.allowAccessTo(request.path())) {
next(request)
}
else
{
status(UNAUTHORIZED).build();
}
}
}
}
Copied!
```
The preceding example demonstrates that invoking the
next.handle(ServerRequest)
is optional.
We only let the handler function be run when access is allowed.
Besides using the
filter
method on the router function builder, it is possible to apply a
filter to an existing router function via
RouterFunction.filter(HandlerFilterFunction)
.
CORS support for functional endpoints is provided through a dedicated
CorsWebFilter
.