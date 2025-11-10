# Cookievalue

Search
⌘ + k
@CookieValue
See equivalent in the Reactive stack
You can use the
@CookieValue
annotation to bind the value of an HTTP cookie to a method argument
in a controller.
Consider a request with the following cookie:
```
JSESSIONID=415A4AC178C59DACE0B2C9CA727CDD84
```
The following example shows how to get the cookie value:
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
Get the value of the
JSESSIONID
cookie.
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
Get the value of the
JSESSIONID
cookie.
If the target method parameter type is not
String
, type conversion is applied automatically.
See
Type Conversion
.