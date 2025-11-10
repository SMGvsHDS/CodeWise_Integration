# Annotation Testexecutionlisteners

Search
⌘ + k
@TestExecutionListeners
@TestExecutionListeners
is used to register listeners for the annotated test class, its
subclasses, and its nested classes. If you wish to register a listener globally, you
should register it via the automatic discovery mechanism described in
TestExecutionListener
Configuration
.
The following example shows how to register two
TestExecutionListener
implementations:
Java
Kotlin
```
@ContextConfiguration
@TestExecutionListeners
({CustomTestExecutionListener
.
class
,
AnotherTestExecutionListener
.
class
})
(1)
class
CustomTestExecutionListenerTests
{
// class body...
}
Copied!
```
1
Register two
TestExecutionListener
implementations.
```
@ContextConfiguration
@TestExecutionListeners(CustomTestExecutionListener::class, AnotherTestExecutionListener::class)
(
1
)
class
CustomTestExecutionListenerTests
{
// class body...
}
Copied!
```
1
Register two
TestExecutionListener
implementations.
By default,
@TestExecutionListeners
provides support for inheriting listeners from
superclasses or enclosing classes. See
@Nested
test class configuration
and the
@TestExecutionListeners
javadoc
for an example and further details. If you discover that you need to switch
back to using the default
TestExecutionListener
implementations, see the note in
Registering
TestExecutionListener
Implementations
.