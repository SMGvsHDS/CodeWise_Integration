# Return Types

Search
⌘ + k
Return Values
See equivalent in the Reactive stack
The next table describes the supported controller method return values. Reactive types are
supported for all return values.
Controller method return value
Description
@ResponseBody
The return value is converted through
HttpMessageConverter
implementations and written to the
response. See
@ResponseBody
.
HttpEntity<B>
,
ResponseEntity<B>
The return value that specifies the full response (including HTTP headers and body) is to be converted
through
HttpMessageConverter
implementations and written to the response.
See
ResponseEntity
.
HttpHeaders
For returning a response with headers and no body.
ErrorResponse
,
ProblemDetail
To render an RFC 9457 error response with details in the body,
see
Error Responses
String
A view name to be resolved with
ViewResolver
implementations and used together with the implicit
model — determined through command objects and
@ModelAttribute
methods. The handler
method can also programmatically enrich the model by declaring a
Model
argument
(see
Explicit Registrations
).
View
A
View
instance to use for rendering together with the implicit model — determined
through command objects and
@ModelAttribute
methods. The handler method can also
programmatically enrich the model by declaring a
Model
argument
(see
Explicit Registrations
).
java.util.Map
,
org.springframework.ui.Model
Attributes to be added to the implicit model, with the view name implicitly determined
through a
RequestToViewNameTranslator
.
@ModelAttribute
An attribute to be added to the model, with the view name implicitly determined through
a
RequestToViewNameTranslator
.
Note that
@ModelAttribute
is optional. See "Any other return value" at the end of
this table.
ModelAndView
object
The view and model attributes to use and, optionally, a response status.
FragmentsRendering
,
Collection<ModelAndView>
For rendering one or more fragments each with its own view and model.
See
HTML Fragments
for more details.
void
A method with a
void
return type (or
null
return value) is considered to have fully
handled the response if it also has a
ServletResponse
, an
OutputStream
argument, or
an
@ResponseStatus
annotation. The same is also true if the controller has made a positive
ETag
or
lastModified
timestamp check (see
Controllers
for details).
If none of the above is true, a
void
return type can also indicate “no response body” for
REST controllers or a default view name selection for HTML controllers.
DeferredResult<V>
Produce any of the preceding return values asynchronously from any thread — for example, as a
result of some event or callback. See
Asynchronous Requests
and
DeferredResult
.
Callable<V>
Produce any of the above return values asynchronously in a Spring MVC-managed thread.
See
Asynchronous Requests
and
Callable
.
ListenableFuture<V>
,
java.util.concurrent.CompletionStage<V>
,
java.util.concurrent.CompletableFuture<V>
Alternative to
DeferredResult
, as a convenience (for example, when an underlying service
returns one of those).
ResponseBodyEmitter
,
SseEmitter
Emit a stream of objects asynchronously to be written to the response with
HttpMessageConverter
implementations. Also supported as the body of a
ResponseEntity
.
See
Asynchronous Requests
and
HTTP Streaming
.
StreamingResponseBody
Write to the response
OutputStream
asynchronously. Also supported as the body of a
ResponseEntity
. See
Asynchronous Requests
and
HTTP Streaming
.
Reactor and other reactive types registered via
ReactiveAdapterRegistry
A single value type, for example,
Mono
, is comparable to returning
DeferredResult
.
A multi-value type, for example,
Flux
, may be treated as a stream depending on the requested
media type, for example, "text/event-stream", "application/json+stream", or otherwise is
collected to a List and rendered as a single value. See
Asynchronous Requests
and
Reactive Types
.
Other return values
If a return value remains unresolved in any other way, it is treated as a model
attribute, unless it is a simple type as determined by
BeanUtils#isSimpleProperty
,
in which case it remains unresolved.