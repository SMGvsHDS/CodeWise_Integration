# Responsebody

Search
⌘ + k
@ResponseBody
See equivalent in the Servlet stack
You can use the
@ResponseBody
annotation on a method to have the return serialized
to the response body through an
HttpMessageWriter
. The following
example shows how to do so:
Java
Kotlin
```
@GetMapping
(
"/accounts/{id}"
)
@ResponseBody
public
Account
handle
()
{
// ...
}
Copied!
```
```
@GetMapping(
"/accounts/{id}"
)
@ResponseBody
fun
handle
()
: Account {
// ...
}
Copied!
```
@ResponseBody
is also supported at the class level, in which case it is inherited by
all controller methods. This is the effect of
@RestController
, which is nothing more
than a meta-annotation marked with
@Controller
and
@ResponseBody
.
@ResponseBody
supports reactive types, which means you can return Reactor or RxJava
types and have the asynchronous values they produce rendered to the response.
For additional details, see
Streaming
and
JSON rendering
.
You can combine
@ResponseBody
methods with JSON serialization views.
See
Jackson JSON
for details.
You can use the
HTTP message codecs
option of the
WebFlux Config
to configure or customize message writing.