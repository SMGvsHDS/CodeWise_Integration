# Coroutines

Search
⌘ + k
Coroutines
Kotlin
Coroutines
are Kotlin
lightweight threads allowing to write non-blocking code in an imperative way. On language side,
suspending functions provides an abstraction for asynchronous operations while on library side
kotlinx.coroutines
provides functions like
async { }
and types like
Flow
.
Spring Framework provides support for Coroutines on the following scope:
Deferred
and
Flow
return values support in Spring MVC and WebFlux annotated
@Controller
Suspending function support in Spring MVC and WebFlux annotated
@Controller
Extensions for WebFlux
client
and
server
functional API.
WebFlux.fn
coRouter { }
DSL
WebFlux
CoWebFilter
Suspending function and
Flow
support in RSocket
@MessageMapping
annotated methods
Extensions for
RSocketRequester
Spring AOP
Dependencies
Coroutines support is enabled when
kotlinx-coroutines-core
and
kotlinx-coroutines-reactor
dependencies are in the classpath:
build.gradle.kts
```
dependencies {
implementation(
"org.jetbrains.kotlinx:kotlinx-coroutines-core:
${coroutinesVersion}
"
)
implementation(
"org.jetbrains.kotlinx:kotlinx-coroutines-reactor:
${coroutinesVersion}
"
)
}
Copied!
```
Version
1.4.0
and above are supported.
How Reactive translates to Coroutines?
For return values, the translation from Reactive to Coroutines APIs is the following:
fun handler(): Mono<Void>
becomes
suspend fun handler()
fun handler(): Mono<T>
becomes
suspend fun handler(): T
or
suspend fun handler(): T?
depending on if the
Mono
can be empty or not (with the advantage of being more statically typed)
fun handler(): Flux<T>
becomes
fun handler(): Flow<T>
For input parameters:
If laziness is not needed,
fun handler(mono: Mono<T>)
becomes
fun handler(value: T)
since a suspending functions can be invoked to get the value parameter.
If laziness is needed,
fun handler(mono: Mono<T>)
becomes
fun handler(supplier: suspend () → T)
or
fun handler(supplier: suspend () → T?)
Flow
is
Flux
equivalent in Coroutines world, suitable for hot or cold stream, finite or infinite streams, with the following main differences:
Flow
is push-based while
Flux
is push-pull hybrid
Backpressure is implemented via suspending functions
Flow
has only a
single suspending
collect
method
and operators are implemented as
extensions
Operators are easy to implement
thanks to Coroutines
Extensions allow to add custom operators to
Flow
Collect operations are suspending functions
map
operator
supports asynchronous operation (no need for
flatMap
) since it takes a suspending function parameter
Read this blog post about
Going Reactive with Spring, Coroutines and Kotlin Flow
for more details, including how to run code concurrently with Coroutines.
Controllers
Here is an example of a Coroutines
@RestController
.
```
@RestController
class
CoroutinesRestController
(client: WebClient, banner: Banner) {
@GetMapping(
"/suspend"
)
suspend
fun
suspendingEndpoint
()
: Banner {
delay(
10
)
return
banner
}
@GetMapping(
"/flow"
)
fun
flowEndpoint
()
= flow {
delay(
10
)
emit(banner)
delay(
10
)
emit(banner)
}
@GetMapping(
"/deferred"
)
fun
deferredEndpoint
()
= GlobalScope.async {
delay(
10
)
banner
}
@GetMapping(
"/sequential"
)
suspend
fun
sequential
()
: List<Banner> {
val
banner1 = client
.
get
()
.uri(
"/suspend"
)
.accept(MediaType.APPLICATION_JSON)
.awaitExchange()
.awaitBody<Banner>()
val
banner2 = client
.
get
()
.uri(
"/suspend"
)
.accept(MediaType.APPLICATION_JSON)
.awaitExchange()
.awaitBody<Banner>()
return
listOf(banner1, banner2)
}
@GetMapping(
"/parallel"
)
suspend
fun
parallel
()
: List<Banner> = coroutineScope {
val
deferredBanner1: Deferred<Banner> = async {
client
.
get
()
.uri(
"/suspend"
)
.accept(MediaType.APPLICATION_JSON)
.awaitExchange()
.awaitBody<Banner>()
}
val
deferredBanner2: Deferred<Banner> = async {
client
.
get
()
.uri(
"/suspend"
)
.accept(MediaType.APPLICATION_JSON)
.awaitExchange()
.awaitBody<Banner>()
}
listOf(deferredBanner1.await(), deferredBanner2.await())
}
@GetMapping(
"/error"
)
suspend
fun
error
()
{
throw
IllegalStateException()
}
@GetMapping(
"/cancel"
)
suspend
fun
cancel
()
{
throw
CancellationException()
}
}
Copied!
```
View rendering with a
@Controller
is also supported.
```
@Controller
class
CoroutinesViewController
(banner: Banner) {
@GetMapping(
"/"
)
suspend
fun
render
(model:
Model
)
: String {
delay(
10
)
model[
"banner"
] = banner
return
"index"
}
}
Copied!
```
WebFlux.fn
Here is an example of Coroutines router defined via the
coRouter { }
DSL and related handlers.
```
@Configuration
class
RouterConfiguration
{
@Bean
fun
mainRouter
(userHandler:
UserHandler
)
= coRouter {
GET(
"/"
, userHandler::listView)
GET(
"/api/user"
, userHandler::listApi)
}
}
Copied!
```
```
class
UserHandler
(builder: WebClient.Builder) {
private
val
client = builder.baseUrl(
"..."
).build()
suspend
fun
listView
(request:
ServerRequest
)
: ServerResponse =
ServerResponse.ok().renderAndAwait(
"users"
, mapOf(
"users"
to
client.
get
().uri(
"..."
).awaitExchange().awaitBody<User>()))
suspend
fun
listApi
(request:
ServerRequest
)
: ServerResponse =
ServerResponse.ok().contentType(MediaType.APPLICATION_JSON).bodyAndAwait(
client.
get
().uri(
"..."
).awaitExchange().awaitBody<User>())
}
Copied!
```
Transactions
Transactions on Coroutines are supported via the programmatic variant of the Reactive
transaction management.
For suspending functions, a
TransactionalOperator.executeAndAwait
extension is provided.
```
import
org.springframework.transaction.reactive.executeAndAwait
class
PersonRepository
(
private
val
operator
: TransactionalOperator) {
suspend
fun
initDatabase
()
=
operator
.executeAndAwait {
insertPerson1()
insertPerson2()
}
private
suspend
fun
insertPerson1
()
{
// INSERT SQL statement
}
private
suspend
fun
insertPerson2
()
{
// INSERT SQL statement
}
}
Copied!
```
For Kotlin
Flow
, a
Flow<T>.transactional
extension is provided.
```
import
org.springframework.transaction.reactive.transactional
class
PersonRepository
(
private
val
operator
: TransactionalOperator) {
fun
updatePeople
()
= findPeople().map(::updatePerson).transactional(
operator
)
private
fun
findPeople
()
: Flow<Person> {
// SELECT SQL statement
}
private
suspend
fun
updatePerson
(person:
Person
)
: Person {
// UPDATE SQL statement
}
}
Copied!
```