# Htmlunit

Search
⌘ + k
HtmlUnit Integration
Spring provides integration between
MockMvc
and
HtmlUnit
. This simplifies performing end-to-end testing
when using HTML-based views. This integration lets you:
Easily test HTML pages by using tools such as
HtmlUnit
,
WebDriver
, and
Geb
without the need to
deploy to a Servlet container.
Test JavaScript within pages.
Optionally, test using mock services to speed up testing.
Share logic between in-container end-to-end tests and out-of-container integration tests.
MockMvc works with templating technologies that do not rely on a Servlet Container
(for example, Thymeleaf, FreeMarker, and others), but it does not work with JSPs, since
they rely on the Servlet container.
Section Summary
Why HtmlUnit Integration?
MockMvc and HtmlUnit
MockMvc and WebDriver
MockMvc and Geb