# Requestbody

Search
⌘ + k
@RequestBody
See equivalent in the Reactive stack
You can use the
@RequestBody
annotation to have the request body read and deserialized into an
Object
through an
HttpMessageConverter
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
You can use the
Message Converters
option of the
MVC Config
to configure or customize message conversion.
Form data should be read using
@RequestParam
,
not with
@RequestBody
which can’t always be used reliably since in the Servlet API, request parameter
access causes the request body to be parsed, and it can’t be read again.
You can use
@RequestBody
in combination with
jakarta.validation.Valid
or Spring’s
@Validated
annotation, both of which cause Standard Bean Validation to be applied.
By default, validation errors cause a
MethodArgumentNotValidException
, which is turned
into a 400 (BAD_REQUEST) response. Alternatively, you can handle validation errors locally
within the controller through an
Errors
or
BindingResult
argument,
as the following example shows:
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
@Valid
@RequestBody
account:
Account
, errors:
Errors
)
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