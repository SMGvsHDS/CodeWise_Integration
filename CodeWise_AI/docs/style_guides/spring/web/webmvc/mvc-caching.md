# Mvc Caching

Search
⌘ + k
HTTP Caching
See equivalent in the Reactive stack
HTTP caching can significantly improve the performance of a web application. HTTP caching
revolves around the
Cache-Control
response header and, subsequently, conditional request
headers (such as
Last-Modified
and
ETag
).
Cache-Control
advises private (for example, browser)
and public (for example, proxy) caches on how to cache and re-use responses. An
ETag
header is used
to make a conditional request that may result in a 304 (NOT_MODIFIED) without a body,
if the content has not changed.
ETag
can be seen as a more sophisticated successor to
the
Last-Modified
header.
This section describes the HTTP caching-related options that are available in Spring Web MVC.
CacheControl
See equivalent in the Reactive stack
CacheControl
provides support for
configuring settings related to the
Cache-Control
header and is accepted as an argument
in a number of places:
WebContentInterceptor
WebContentGenerator
Controllers
Static Resources
While
RFC 7234
describes all possible
directives for the
Cache-Control
response header, the
CacheControl
type takes a
use case-oriented approach that focuses on the common scenarios:
Java
Kotlin
```
// Cache for an hour - "Cache-Control: max-age=3600"
CacheControl ccCacheOneHour = CacheControl.maxAge(
1
, TimeUnit.HOURS);
// Prevent caching - "Cache-Control: no-store"
CacheControl ccNoStore = CacheControl.noStore();
// Cache for ten days in public and private caches,
// public caches should not transform the response
// "Cache-Control: max-age=864000, public, no-transform"
CacheControl ccCustom = CacheControl.maxAge(
10
, TimeUnit.DAYS).noTransform().cachePublic();
Copied!
```
```
// Cache for an hour - "Cache-Control: max-age=3600"
val
ccCacheOneHour = CacheControl.maxAge(
1
, TimeUnit.HOURS)
// Prevent caching - "Cache-Control: no-store"
val
ccNoStore = CacheControl.noStore()
// Cache for ten days in public and private caches,
// public caches should not transform the response
// "Cache-Control: max-age=864000, public, no-transform"
val
ccCustom = CacheControl.maxAge(
10
, TimeUnit.DAYS).noTransform().cachePublic()
Copied!
```
WebContentGenerator
also accepts a simpler
cachePeriod
property (defined in seconds) that
works as follows:
A
-1
value does not generate a
Cache-Control
response header.
A
0
value prevents caching by using the
'Cache-Control: no-store'
directive.
An
n > 0
value caches the given response for
n
seconds by using the
'Cache-Control: max-age=n'
directive.
Controllers
See equivalent in the Reactive stack
Controllers can add explicit support for HTTP caching. We recommended doing so, since the
lastModified
or
ETag
value for a resource needs to be calculated before it can be compared
against conditional request headers. A controller can add an
ETag
header and
Cache-Control
settings to a
ResponseEntity
, as the following example shows:
Java
Kotlin
```
@GetMapping
(
"/book/{id}"
)
public
ResponseEntity<Book>
showBook
(@PathVariable Long id)
{
Book book = findBook(id);
String version = book.getVersion();
return
ResponseEntity
.ok()
.cacheControl(CacheControl.maxAge(
30
, TimeUnit.DAYS))
.eTag(version)
// lastModified is also available
.body(book);
}
Copied!
```
```
@GetMapping(
"/book/{id}"
)
fun
showBook
(
@PathVariable
id:
Long
)
: ResponseEntity<Book> {
val
book = findBook(id);
val
version = book.getVersion()
return
ResponseEntity
.ok()
.cacheControl(CacheControl.maxAge(
30
, TimeUnit.DAYS))
.eTag(version)
// lastModified is also available
.body(book)
}
Copied!
```
The preceding example sends a 304 (NOT_MODIFIED) response with an empty body if the comparison
to the conditional request headers indicates that the content has not changed. Otherwise, the
ETag
and
Cache-Control
headers are added to the response.
You can also make the check against conditional request headers in the controller,
as the following example shows:
Java
Kotlin
```
@RequestMapping
public
String
myHandleMethod
(WebRequest request, Model model)
{
long
eTag = ...
(
1
)
if
(request.checkNotModified(eTag)) {
return
null
;
(
2
)
}
model.addAttribute(...);
(
3
)
return
"myViewName"
;
}
Copied!
```
1
Application-specific calculation.
2
The response has been set to 304 (NOT_MODIFIED) — no further processing.
3
Continue with the request processing.
```
@RequestMapping
fun
myHandleMethod
(request:
WebRequest
, model:
Model
)
: String? {
val
eTag:
Long
= ...
(
1
)
if
(request.checkNotModified(eTag)) {
return
null
(
2
)
}
model[...] = ...
(
3
)
return
"myViewName"
}
Copied!
```
1
Application-specific calculation.
2
The response has been set to 304 (NOT_MODIFIED) — no further processing.
3
Continue with the request processing.
There are three variants for checking conditional requests against
eTag
values,
lastModified
values, or both. For conditional
GET
and
HEAD
requests, you can set the response to
304 (NOT_MODIFIED). For conditional
POST
,
PUT
, and
DELETE
, you can instead set the response
to 412 (PRECONDITION_FAILED), to prevent concurrent modification.
Static Resources
See equivalent in the Reactive stack
You should serve static resources with a
Cache-Control
and conditional response headers
for optimal performance. See the section on configuring
Static Resources
.
ETag
Filter
You can use the
ShallowEtagHeaderFilter
to add “shallow”
eTag
values that are computed from the
response content and, thus, save bandwidth but not CPU time. See
Shallow ETag
.