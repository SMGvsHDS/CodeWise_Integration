# Requestattrib

Search
⌘ + k
@RequestAttribute
See equivalent in the Reactive stack
Similar to
@SessionAttribute
, you can use the
@RequestAttribute
annotations to
access pre-existing request attributes created earlier (for example, by a Servlet
Filter
or
HandlerInterceptor
):
Java
Kotlin
```
@GetMapping
(
"/"
)
public
String
handle
(@RequestAttribute Client client)
{
(
1
)
// ...
}
Copied!
```
1
Using the
@RequestAttribute
annotation.
```
@GetMapping(
"/"
)
fun
handle
(
@RequestAttribute
client:
Client
)
: String {
(
1
)
// ...
}
Copied!
```
1
Using the
@RequestAttribute
annotation.