# Webflux Webclient

Search
⌘ + k
WebClient
Spring WebFlux includes a client to perform HTTP requests.
WebClient
has a
functional, fluent API based on Reactor (see
Reactive Libraries
)
which enables declarative composition of asynchronous logic without the need to deal with
threads or concurrency. It is fully non-blocking, supports streaming, and relies on
the same
codecs
that are also used to encode and
decode request and response content on the server side.
WebClient
needs an HTTP client library to perform requests. There is built-in
support for the following:
Reactor Netty
JDK HttpClient
Jetty Reactive HttpClient
Apache HttpComponents
Others can be plugged in via
ClientHttpConnector
.
Section Summary
Configuration
retrieve()
Exchange
Request Body
Filters
Attributes
Context
Synchronous Use
Testing