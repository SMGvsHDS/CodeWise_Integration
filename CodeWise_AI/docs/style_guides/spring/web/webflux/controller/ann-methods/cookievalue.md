# Cookievalue

Search
⌘ + k
@CookieValue
See equivalent in the Servlet stack
You can use the
@CookieValue
annotation to bind the value of an HTTP cookie to a method argument
in a controller.
The following example shows a request with a cookie:
```
JSESSIONID=415A4AC178C59DACE0B2C9CA727CDD84
```
The following code sample demonstrates how to get the cookie value:
Java
Kotlin
```
@GetMapping
(
"/demo"
)
public
void
handle
(@CookieValue(
"JSESSIONID"
)
String cookie)
{
(
1
)
//...
}
Copied!
```
1
Get the cookie value.
```
@GetMapping(
"/demo"
)
fun
handle
(
@CookieValue(
"JSESSIONID"
)
cookie:
String
)
{
(
1
)
//...
}
Copied!
```
1
Get the cookie value.
Type conversion is applied automatically if the target method parameter type is not
String
. See
Type Conversion
.