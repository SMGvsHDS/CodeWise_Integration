# Responseentity

Search
⌘ + k
ResponseEntity
See equivalent in the Servlet stack
ResponseEntity
is like
@ResponseBody
but with status and headers. For example:
Java
Kotlin
```
@GetMapping
(
"/something"
)
public
ResponseEntity<String>
handle
()
{
String body = ... ;
String etag = ... ;
return
ResponseEntity.ok().eTag(etag).body(body);
}
Copied!
```
```
@GetMapping(
"/something"
)
fun
handle
()
: ResponseEntity<String> {
val
body: String = ...
val
etag: String = ...
return
ResponseEntity.ok().eTag(etag).build(body)
}
Copied!
```
WebFlux supports using a single value
reactive type
to
produce the
ResponseEntity
asynchronously, and/or single and multi-value reactive types
for the body. This allows a variety of async responses with
ResponseEntity
as follows:
ResponseEntity<Mono<T>>
or
ResponseEntity<Flux<T>>
make the response status and
headers known immediately while the body is provided asynchronously at a later point.
Use
Mono
if the body consists of 0..1 values or
Flux
if it can produce multiple values.
Mono<ResponseEntity<T>>
provides all three — response status, headers, and body,
asynchronously at a later point. This allows the response status and headers to vary
depending on the outcome of asynchronous request handling.
Mono<ResponseEntity<Mono<T>>>
or
Mono<ResponseEntity<Flux<T>>>
are yet another
possible, albeit less common alternative. They provide the response status and headers
asynchronously first and then the response body, also asynchronously, second.