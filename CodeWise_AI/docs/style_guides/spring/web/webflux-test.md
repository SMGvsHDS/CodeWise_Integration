# Webflux Test

Search
⌘ + k
Testing
The
spring-test
module provides mock implementations of
ServerHttpRequest
,
ServerHttpResponse
, and
ServerWebExchange
.
See
Spring Web Reactive
for a
discussion of mock objects.
WebTestClient
builds on these mock request and
response objects to provide support for testing WebFlux applications without an HTTP
server. You can use the
WebTestClient
for end-to-end integration tests, too.