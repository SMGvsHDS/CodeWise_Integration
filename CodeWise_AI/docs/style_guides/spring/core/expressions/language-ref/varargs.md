# Varargs

Search
⌘ + k
Varargs Invocations
The Spring Expression Language supports
varargs
invocations for
constructors
,
methods
, and user-defined
functions
.
The following example shows how to invoke the
java.lang.String#formatted(Object…​)
varargs
method within an expression by supplying the variable argument list as separate
arguments (
'blue', 1
).
Java
Kotlin
```
// evaluates to "blue is color #1"
String expression =
"'%s is color #%d'.formatted('blue', 1)"
;
String message = parser.parseExpression(expression).getValue(String
.
class
)
;
Copied!
```
```
// evaluates to "blue is color #1"
val
expression =
"'%s is color #%d'.formatted('blue', 1)"
val
message = parser.parseExpression(expression).getValue(String::
class
.
java
)
Copied!
```
A variable argument list can also be supplied as an array, as demonstrated in the
following example (
new Object[] {'blue', 1}
).
Java
Kotlin
```
// evaluates to "blue is color #1"
String expression =
"'%s is color #%d'.formatted(new Object[] {'blue', 1})"
;
String message = parser.parseExpression(expression).getValue(String
.
class
)
;
Copied!
```
```
// evaluates to "blue is color #1"
val
expression =
"'%s is color #%d'.formatted(new Object[] {'blue', 1})"
val
message = parser.parseExpression(expression).getValue(String::
class
.
java
)
Copied!
```
As an alternative, a variable argument list can be supplied as a
java.util.List
– for
example, as an
inline list
(
{'blue', 1}
). The following example shows how to do that.
Java
Kotlin
```
// evaluates to "blue is color #1"
String expression =
"'%s is color #%d'.formatted({'blue', 1})"
;
String message = parser.parseExpression(expression).getValue(String
.
class
)
;
Copied!
```
```
// evaluates to "blue is color #1"
val
expression =
"'%s is color #%d'.formatted({'blue', 1})"
val
message = parser.parseExpression(expression).getValue(String::
class
.
java
)
Copied!
```
Varargs Type Conversion
In contrast to the standard support for varargs invocations in Java,
type conversion
may be
applied to the individual arguments when invoking varargs constructors, methods, or
functions in SpEL.
For example, if we have registered a custom
function
in the
EvaluationContext
under the name
#reverseStrings
for a method with the signature
String reverseStrings(String…​ strings)
, we can invoke that function within a SpEL
expression with any argument that can be converted to a
String
, as demonstrated in the
following example.
Java
Kotlin
```
// evaluates to "3.0, 2.0, 1, SpEL"
String expression =
"#reverseStrings('SpEL', 1, 10F / 5, 3.0000)"
;
String message = parser.parseExpression(expression)
.getValue(evaluationContext, String
.
class
)
;
Copied!
```
```
// evaluates to "3.0, 2.0, 1, SpEL"
val
expression =
"#reverseStrings('SpEL', 1, 10F / 5, 3.0000)"
val
message = parser.parseExpression(expression)
.getValue(evaluationContext, String::
class
.
java
)
Copied!
```
Similarly, any array whose component type is a subtype of the required varargs type can
be supplied as the variable argument list for a varargs invocation. For example, a
String[]
array can be supplied to a varargs invocation that accepts an
Object…​
argument list.
The following listing demonstrates that we can supply a
String[]
array to the
java.lang.String#formatted(Object…​)
varargs
method. It also highlights that
1
will be automatically converted to
"1"
.
Java
Kotlin
```
// evaluates to "blue is color #1"
String expression =
"'%s is color #%s'.formatted(new String[] {'blue', 1})"
;
String message = parser.parseExpression(expression).getValue(String
.
class
)
;
Copied!
```
```
// evaluates to "blue is color #1"
val
expression =
"'%s is color #%s'.formatted(new String[] {'blue', 1})"
val
message = parser.parseExpression(expression).getValue(String::
class
.
java
)
Copied!
```