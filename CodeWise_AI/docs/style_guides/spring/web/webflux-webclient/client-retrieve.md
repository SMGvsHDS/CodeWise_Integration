# Client Retrieve

Search
⌘ + k
retrieve()
The
retrieve()
method can be used to declare how to extract the response. For example:
Java
Kotlin
```
WebClient client = WebClient.create(
"https://example.org"
);
Mono<ResponseEntity<Person>> result = client.get()
.uri(
"/persons/{id}"
, id).accept(MediaType.APPLICATION_JSON)
.retrieve()
.toEntity(Person
.
class
)
;
Copied!
```
```
val
client = WebClient.create(
"https://example.org"
)
val
result = client.
get
()
.uri(
"/persons/{id}"
, id).accept(MediaType.APPLICATION_JSON)
.retrieve()
.toEntity<Person>().awaitSingle()
Copied!
```
Or to get only the body:
Java
Kotlin
```
WebClient client = WebClient.create(
"https://example.org"
);
Mono<Person> result = client.get()
.uri(
"/persons/{id}"
, id).accept(MediaType.APPLICATION_JSON)
.retrieve()
.bodyToMono(Person
.
class
)
;
Copied!
```
```
val
client = WebClient.create(
"https://example.org"
)
val
result = client.
get
()
.uri(
"/persons/{id}"
, id).accept(MediaType.APPLICATION_JSON)
.retrieve()
.awaitBody<Person>()
Copied!
```
To get a stream of decoded objects:
Java
Kotlin
```
Flux<Quote> result = client.get()
.uri(
"/quotes"
).accept(MediaType.TEXT_EVENT_STREAM)
.retrieve()
.bodyToFlux(Quote
.
class
)
;
Copied!
```
```
val
result = client.
get
()
.uri(
"/quotes"
).accept(MediaType.TEXT_EVENT_STREAM)
.retrieve()
.bodyToFlow<Quote>()
Copied!
```
By default, 4xx or 5xx responses result in an
WebClientResponseException
, including
sub-classes for specific HTTP status codes. To customize the handling of error
responses, use
onStatus
handlers as follows:
Java
Kotlin
```
Mono<Person> result = client.get()
.uri(
"/persons/{id}"
, id).accept(MediaType.APPLICATION_JSON)
.retrieve()
.onStatus(HttpStatusCode::is4xxClientError, response -> ...)
.onStatus(HttpStatusCode::is5xxServerError, response -> ...)
.bodyToMono(Person
.
class
)
;
Copied!
```
```
val
result = client.
get
()
.uri(
"/persons/{id}"
, id).accept(MediaType.APPLICATION_JSON)
.retrieve()
.onStatus(HttpStatusCode::is4xxClientError) { ... }
.onStatus(HttpStatusCode::is5xxServerError) { ... }
.awaitBody<Person>()
Copied!
```