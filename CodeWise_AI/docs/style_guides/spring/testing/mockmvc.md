# Mockmvc

Search
⌘ + k
MockMvc
MockMvc provides support for testing Spring MVC applications. It performs full Spring MVC
request handling but via mock request and response objects instead of a running server.
MockMvc can be used on its own to perform requests and verify responses using Hamcrest or
through
MockMvcTester
which provides a fluent API using AssertJ. It can also be used
through the
WebTestClient
where MockMvc is plugged in as
the server to handle requests. The advantage of using
WebTestClient
is that it provides
you the option of working with higher level objects instead of raw data as well as the
ability to switch to full, end-to-end HTTP tests against a live server and use the same
test API.
Section Summary
Overview
Setup Options
Hamcrest Integration
AssertJ Integration
HtmlUnit Integration
MockMvc vs End-to-End Tests
Further Examples