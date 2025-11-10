# Requestbody

Search
⌘ + k
@RequestBody
See equivalent in the Servlet stack
You can use the
@RequestBody
annotation to have the request body read and deserialized into an
Object
through an
HttpMessageReader
.
The following example uses a
@RequestBody
argument:
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
(@RequestBody Account account)
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
(
@RequestBody
account:
Account
)
{
// ...
}
Copied!
```
Unlike Spring MVC, in WebFlux, the
@RequestBody
method argument supports reactive types
and fully non-blocking reading and (client-to-server) streaming.
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
(@RequestBody Mono<Account> account)
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
(
@RequestBody
accounts:
Flow
<
Account
>)
{
// ...
}
Copied!
```
You can use the
HTTP message codecs
option of the
WebFlux Config
to
configure or customize message readers.
You can use
@RequestBody
in combination with
jakarta.validation.Valid
or Spring’s
@Validated
annotation, which causes Standard Bean Validation to be applied. Validation
errors cause a
WebExchangeBindException
, which results in a 400 (BAD_REQUEST) response.
The exception contains a
BindingResult
with error details and can be handled in the
controller method by declaring the argument with an async wrapper and then using error
related operators:
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
(@Valid @RequestBody Mono<Account> account)
{
// use one of the onError* operators...
}
Copied!
```
```
@PostMapping(
"/accounts"
)
fun
handle
(
@Valid
@RequestBody
account:
Mono
<
Account
>)
{
// ...
}
Copied!
```
You can also declare an
Errors
parameter for access to validation errors, but in
that case the request body must not be a
Mono
, and will be resolved first:
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
(@Valid @RequestBody Account account, Errors errors)
{
// use one of the onError* operators...
}
Copied!
```
```
@PostMapping(
"/accounts"
)
fun
handle
(
@Valid
@RequestBody
account:
Mono
<
Account
>)
{
// ...
}
Copied!
```
If method validation applies because other parameters have
@Constraint
annotations,
then
HandlerMethodValidationException
is raised instead. For more details, see the
section on
Validation
.