# Typeconversion

Search
⌘ + k
Type Conversion
See equivalent in the Servlet stack
Some annotated controller method arguments that represent String-based request input (for example,
@RequestParam
,
@RequestHeader
,
@PathVariable
,
@MatrixVariable
, and
@CookieValue
)
can require type conversion if the argument is declared as something other than
String
.
For such cases, type conversion is automatically applied based on the configured converters.
By default, simple types (such as
int
,
long
,
Date
, and others) are supported. Type conversion
can be customized through a
WebDataBinder
(see
DataBinder
)
or by registering
Formatters
with the
FormattingConversionService
(see
Spring Field Formatting
).
A practical issue in type conversion is the treatment of an empty String source value.
Such a value is treated as missing if it becomes
null
as a result of type conversion.
This can be the case for
Long
,
UUID
, and other target types. If you want to allow
null
to be injected, either use the
required
flag on the argument annotation, or declare the
argument as
@Nullable
.