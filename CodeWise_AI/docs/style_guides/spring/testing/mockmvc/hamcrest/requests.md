# Requests

Search
⌘ + k
Performing Requests
This section shows how to use MockMvc on its own to perform requests and verify responses.
If using MockMvc through the
WebTestClient
please see the corresponding section on
Writing Tests
instead.
To perform requests that use any HTTP method, as the following example shows:
Java
Kotlin
```
// static import of MockMvcRequestBuilders.*
mockMvc.perform(post(
"/hotels/{id}"
,
42
).accept(MediaType.APPLICATION_JSON));
Copied!
```
```
import
org.springframework.test.web.servlet.post
mockMvc.post(
"/hotels/{id}"
,
42
) {
accept = MediaType.APPLICATION_JSON
}
Copied!
```
You can also perform file upload requests that internally use
MockMultipartHttpServletRequest
so that there is no actual parsing of a multipart
request. Rather, you have to set it up to be similar to the following example:
Java
Kotlin
```
mockMvc.perform(multipart(
"/doc"
).file(
"a1"
,
"ABC"
.getBytes(
"UTF-8"
)));
Copied!
```
```
import
org.springframework.test.web.servlet.multipart
mockMvc.multipart(
"/doc"
) {
file(
"a1"
,
"ABC"
.toByteArray(charset(
"UTF8"
)))
}
Copied!
```
You can specify query parameters in URI template style, as the following example shows:
Java
Kotlin
```
mockMvc.perform(get(
"/hotels?thing={thing}"
,
"somewhere"
));
Copied!
```
```
mockMvc.
get
(
"/hotels?thing={thing}"
,
"somewhere"
)
Copied!
```
You can also add Servlet request parameters that represent either query or form
parameters, as the following example shows:
Java
Kotlin
```
mockMvc.perform(get(
"/hotels"
).param(
"thing"
,
"somewhere"
));
Copied!
```
```
import
org.springframework.test.web.servlet.
get
mockMvc.
get
(
"/hotels"
) {
param(
"thing"
,
"somewhere"
)
}
Copied!
```
If application code relies on Servlet request parameters and does not check the query
string explicitly (as is most often the case), it does not matter which option you use.
Keep in mind, however, that query parameters provided with the URI template are decoded
while request parameters provided through the
param(…​)
method are expected to already
be decoded.
In most cases, it is preferable to leave the context path and the Servlet path out of the
request URI. If you must test with the full request URI, be sure to set the
contextPath
and
servletPath
accordingly so that request mappings work, as the following example
shows:
Java
Kotlin
```
mockMvc.perform(get(
"/app/main/hotels/{id}"
).contextPath(
"/app"
).servletPath(
"/main"
))
Copied!
```
```
import
org.springframework.test.web.servlet.
get
mockMvc.
get
(
"/app/main/hotels/{id}"
) {
contextPath =
"/app"
servletPath =
"/main"
}
Copied!
```
In the preceding example, it would be cumbersome to set the
contextPath
and
servletPath
with every performed request. Instead, you can set up default request
properties, as the following example shows:
Java
Kotlin
```
class
MyWebTests
{
MockMvc mockMvc;
@BeforeEach
void
setup
()
{
mockMvc = standaloneSetup(
new
AccountController())
.defaultRequest(get(
"/"
)
.contextPath(
"/app"
).servletPath(
"/main"
)
.accept(MediaType.APPLICATION_JSON)).build();
}
}
Copied!
```
```
// Not possible in Kotlin until {kotlin-issues}/KT-22208 is fixed
Copied!
```
The preceding properties affect every request performed through the
MockMvc
instance.
If the same property is also specified on a given request, it overrides the default
value. That is why the HTTP method and URI in the default request do not matter, since
they must be specified on every request.