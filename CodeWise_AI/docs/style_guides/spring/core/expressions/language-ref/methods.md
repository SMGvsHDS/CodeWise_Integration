# Methods

Search
⌘ + k
Methods
You can invoke methods by using the typical Java programming syntax. You can also invoke
methods directly on literals such as strings or numbers.
Varargs
are supported as well.
The following examples show how to invoke methods.
Java
Kotlin
```
// string literal, evaluates to "bc"
String bc = parser.parseExpression(
"'abc'.substring(1, 3)"
).getValue(String
.
class
)
;
// evaluates to true
boolean
isMember = parser.parseExpression(
"isMember('Mihajlo Pupin')"
).getValue(
societyContext, Boolean
.
class
)
;
Copied!
```
```
// string literal, evaluates to "bc"
val
bc = parser.parseExpression(
"'abc'.substring(1, 3)"
).getValue(String::
class
.
java
)
// evaluates to true
val
isMember = parser.parseExpression(
"isMember('Mihajlo Pupin')"
).getValue(
societyContext,
Boolean
::
class
.
java
)
Copied!
```