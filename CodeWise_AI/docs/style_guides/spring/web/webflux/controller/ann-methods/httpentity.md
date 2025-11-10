# Httpentity

Search
⌘ + k
HttpEntity
See equivalent in the Servlet stack
HttpEntity
is more or less identical to using
@RequestBody
but is based on a
container object that exposes request headers and the body. The following example uses an
HttpEntity
:
Java
Kotlin
```
@PostMapping
(
"/accounts"
)
public
void
handle
(HttpEntity<Account> entity)
{
// ...
}
Copied!
```
```
@PostMapping(
"/accounts"
)
fun
handle
(entity:
HttpEntity
<
Account
>)
{
// ...
}
Copied!
```