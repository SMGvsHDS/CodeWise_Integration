# Annotation Testpropertysource

Search
⌘ + k
@TestPropertySource
@TestPropertySource
is an annotation that can be applied to a test class to configure
the locations of properties files and inlined properties to be added to the set of
PropertySources
in the
Environment
for an
ApplicationContext
loaded for an
integration test.
The following example demonstrates how to declare a properties file from the classpath:
Java
Kotlin
```
@ContextConfiguration
@TestPropertySource
(
"/test.properties"
)
(
1
)
class
MyIntegrationTests
{
// class body...
}
Copied!
```
1
Get properties from
test.properties
in the root of the classpath.
```
@ContextConfiguration
@TestPropertySource(
"/test.properties"
)
(
1
)
class
MyIntegrationTests
{
// class body...
}
Copied!
```
1
Get properties from
test.properties
in the root of the classpath.
The following example demonstrates how to declare inlined properties:
Java
Kotlin
```
@ContextConfiguration
@TestPropertySource
(properties = {
"timezone = GMT"
,
"port: 4242"
})
(
1
)
class
MyIntegrationTests
{
// class body...
}
Copied!
```
1
Declare
timezone
and
port
properties.
```
@ContextConfiguration
@TestPropertySource(properties = [
"timezone = GMT"
,
"port: 4242"
])
(
1
)
class
MyIntegrationTests
{
// class body...
}
Copied!
```
1
Declare
timezone
and
port
properties.
See
Context Configuration with Test Property Sources
for examples and further details.