# Arguments

Search
⌘ + k
Method Arguments
See equivalent in the Servlet stack
The following table shows the supported controller method arguments.
Reactive types (Reactor, RxJava,
or other
) are
supported on arguments that require blocking I/O (for example, reading the request body) to
be resolved. This is marked in the Description column. Reactive types are not expected
on arguments that do not require blocking.
JDK 1.8’s
java.util.Optional
is supported as a method argument in combination with
annotations that have a
required
attribute (for example,
@RequestParam
,
@RequestHeader
,
and others) and is equivalent to
required=false
.
Controller method argument
Description
ServerWebExchange
Access to the full
ServerWebExchange
— container for the HTTP request and response,
request and session attributes,
checkNotModified
methods, and others.
ServerHttpRequest
,
ServerHttpResponse
Access to the HTTP request or response.
WebSession
Access to the session. This does not force the start of a new session unless attributes
are added. Supports reactive types.
java.security.Principal
The currently authenticated user — possibly a specific
Principal
implementation class if known.
Supports reactive types.
org.springframework.http.HttpMethod
The HTTP method of the request.
java.util.Locale
The current request locale, determined by the most specific
LocaleResolver
available — in
effect, the configured
LocaleResolver
/
LocaleContextResolver
.
java.util.TimeZone
+
java.time.ZoneId
The time zone associated with the current request, as determined by a
LocaleContextResolver
.
@PathVariable
For access to URI template variables. See
URI Patterns
.
@MatrixVariable
For access to name-value pairs in URI path segments. See
Matrix Variables
.
@RequestParam
For access to query parameters. Parameter values are converted to the declared method argument
type. See
@RequestParam
.
Note that use of
@RequestParam
is optional — for example, to set its attributes.
See “Any other argument” later in this table.
@RequestHeader
For access to request headers. Header values are converted to the declared method argument
type. See
@RequestHeader
.
@CookieValue
For access to cookies. Cookie values are converted to the declared method argument type.
See
@CookieValue
.
@RequestBody
For access to the HTTP request body. Body content is converted to the declared method
argument type by using
HttpMessageReader
instances. Supports reactive types.
See
@RequestBody
.
HttpEntity<B>
For access to request headers and body. The body is converted with
HttpMessageReader
instances.
Supports reactive types. See
HttpEntity
.
@RequestPart
For access to a part in  a
multipart/form-data
request. Supports reactive types.
See
Multipart Content
and
Multipart Data
.
java.util.Map
or
org.springframework.ui.Model
For access to the model that is used in HTML controllers and is exposed to templates as
part of view rendering.
@ModelAttribute
For access to an existing attribute in the model (instantiated if not present) with
data binding and validation applied. See
@ModelAttribute
as well
as
Model
and
DataBinder
.
Note that use of
@ModelAttribute
is optional — for example, to set its attributes.
See “Any other argument” later in this table.
Errors
or
BindingResult
For access to errors from validation and data binding for a command object, i.e. a
@ModelAttribute
argument. An
Errors
or
BindingResult
argument must be declared
immediately after the validated method argument.
SessionStatus
+ class-level
@SessionAttributes
For marking form processing complete, which triggers cleanup of session attributes
declared through a class-level
@SessionAttributes
annotation.
See
@SessionAttributes
for more details.
UriComponentsBuilder
For preparing a URL relative to the current request’s host, port, scheme, and
context path. See
URI Links
.
@SessionAttribute
For access to any session attribute — in contrast to model attributes stored in the session
as a result of a class-level
@SessionAttributes
declaration. See
@SessionAttribute
for more details.
@RequestAttribute
For access to request attributes. See
@RequestAttribute
for more details.
Any other argument
If a method argument is not matched to any of the above, it is, by default, resolved as
a
@RequestParam
if it is a simple type, as determined by
BeanUtils#isSimpleProperty
,
or as a
@ModelAttribute
, otherwise.