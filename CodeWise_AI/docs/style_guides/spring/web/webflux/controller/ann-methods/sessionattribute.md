# Sessionattribute

Search
⌘ + k
@SessionAttribute
See equivalent in the Servlet stack
If you need access to pre-existing session attributes that are managed globally
(that is, outside the controller — for example, by a filter) and may or may not be present,
you can use the
@SessionAttribute
annotation on a method parameter, as the following example shows:
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
(@SessionAttribute User user)
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
@SessionAttribute
.
```
@GetMapping(
"/"
)
fun
handle
(
@SessionAttribute
user:
User
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
@SessionAttribute
.
For use cases that require adding or removing session attributes, consider injecting
WebSession
into the controller method.
For temporary storage of model attributes in the session as part of a controller
workflow, consider using
SessionAttributes
, as described in
@SessionAttributes
.