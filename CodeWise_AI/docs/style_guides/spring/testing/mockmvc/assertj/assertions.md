# Assertions

Search
⌘ + k
Defining Expectations
Assertions work the same way as any AssertJ assertions. The support provides dedicated
assert objects for the various pieces of the
MvcTestResult
, as shown in the following
example:
Java
Kotlin
```
assertThat(mockMvc.get().uri(
"/hotels/{id}"
,
42
))
.hasStatusOk()
.hasContentTypeCompatibleWith(MediaType.APPLICATION_JSON)
.bodyJson().isLenientlyEqualTo(
"sample/hotel-42.json"
);
Copied!
```
```
assertThat(mockMvc.
get
().uri(
"/hotels/{id}"
,
42
))
.hasStatusOk()
.hasContentTypeCompatibleWith(MediaType.APPLICATION_JSON)
.bodyJson().isLenientlyEqualTo(
"sample/hotel-42.json"
)
Copied!
```
If a request fails, the exchange does not throw the exception. Rather, you can assert
that the result of the exchange has failed:
Java
Kotlin
```
assertThat(mockMvc.get().uri(
"/hotels/{id}"
, -
1
))
.hasFailed()
.hasStatus(HttpStatus.BAD_REQUEST)
.failure().hasMessageContaining(
"Identifier should be positive"
);
Copied!
```
```
assertThat(mockMvc.
get
().uri(
"/hotels/{id}"
, -
1
))
.hasFailed()
.hasStatus(HttpStatus.BAD_REQUEST)
.failure().hasMessageContaining(
"Identifier should be positive"
)
Copied!
```
The request could also fail unexpectedly, that is the exception thrown by the handler
has not been handled and is thrown as is. You can still use
.hasFailed()
and
.failure()
but any attempt to access part of the result will throw an exception as
the exchange hasn’t completed.
JSON Support
The AssertJ support for
MvcTestResult
provides JSON support via
bodyJson()
.
If
JSONPath
is available, you can apply an expression
on the JSON document. The returned value provides convenient methods to return a dedicated
assert object for the various supported JSON data types:
Java
Kotlin
```
assertThat(mockMvc.get().uri(
"/family"
)).bodyJson()
.extractingPath(
"$.members[0]"
)
.asMap()
.contains(entry(
"name"
,
"Homer"
));
Copied!
```
```
assertThat(mockMvc.
get
().uri(
"/family"
)).bodyJson()
.extractingPath(
"$.members[0]"
)
.asMap()
.contains(entry(
"name"
,
"Homer"
))
Copied!
```
You can also convert the raw content to any of your data types as long as the message
converter is configured properly:
Java
Kotlin
```
assertThat(mockMvc.get().uri(
"/family"
)).bodyJson()
.extractingPath(
"$.members[0]"
)
.convertTo(Member
.
class
)
.
satisfies
(
member
->
assertThat
(
member
.
name
).
isEqualTo
("
Homer
"))
;
Copied!
```
```
assertThat(mockMvc.
get
().uri(
"/family"
)).bodyJson()
.extractingPath(
"$.members[0]"
)
.convertTo(Member::
class
.
java
)
.satisfies(ThrowingConsumer { member: Member ->
assertThat(member.name).isEqualTo(
"Homer"
)
})
Copied!
```
Converting to a target
Class
provides a generic assert object. For more complex types,
you may want to use
AssertFactory
instead that returns a dedicated assert type, if
possible:
Java
Kotlin
```
assertThat(mockMvc.get().uri(
"/family"
)).bodyJson()
.extractingPath(
"$.members"
)
.convertTo(InstanceOfAssertFactories.list(Member
.
class
))
.
hasSize
(5)
.
element
(0).
satisfies
(
member
->
assertThat
(
member
.
name
).
isEqualTo
("
Homer
"))
;
Copied!
```
```
assertThat(mockMvc.
get
().uri(
"/family"
)).bodyJson()
.extractingPath(
"$.members"
)
.convertTo(InstanceOfAssertFactories.list(Member::
class
.
java
))
.hasSize(
5
)
.element(
0
).satisfies(ThrowingConsumer { member: Member ->
assertThat(member.name).isEqualTo(
"Homer"
)
})
Copied!
```
JSONAssert
is also supported. The body of the
response can be matched against a
Resource
or a content. If the content ends with
`.json ` we look for a file matching that name on the classpath:
Java
Kotlin
```
assertThat(mockMvc.get().uri(
"/family"
)).bodyJson()
.isStrictlyEqualTo(
"sample/simpsons.json"
);
Copied!
```
```
assertThat(mockMvc.
get
().uri(
"/family"
)).bodyJson()
.isStrictlyEqualTo(
"sample/simpsons.json"
)
Copied!
```
If you prefer to use another library, you can provide an implementation of
JsonComparator
.