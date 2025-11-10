# Requestattrib

Search
⌘ + k
@RequestAttribute
See equivalent in the Servlet stack
Similarly to
@SessionAttribute
, you can use the
@RequestAttribute
annotation to
access pre-existing request attributes created earlier (for example, by a
WebFilter
),
as the following example shows:
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
Using
@RequestAttribute
.
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
Using
@RequestAttribute
.