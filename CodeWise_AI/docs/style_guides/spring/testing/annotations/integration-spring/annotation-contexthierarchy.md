# Annotation Contexthierarchy

Search
⌘ + k
@ContextHierarchy
@ContextHierarchy
is an annotation that can be applied to a test class to define a
hierarchy of
ApplicationContext
instances for integration tests.
@ContextHierarchy
should be declared with a list of one or more
@ContextConfiguration
instances, each of
which defines a level in the context hierarchy. The following examples demonstrate the
use of
@ContextHierarchy
within a single test class (
@ContextHierarchy
can also be
used within a test class hierarchy):
Java
Kotlin
```
@ContextHierarchy
({
@ContextConfiguration
(
"/parent-config.xml"
),
@ContextConfiguration
(
"/child-config.xml"
)
})
class
ContextHierarchyTests
{
// class body...
}
Copied!
```
```
@ContextHierarchy(
ContextConfiguration(
"/parent-config.xml"
)
,
ContextConfiguration(
"/child-config.xml"
))
class
ContextHierarchyTests
{
// class body...
}
Copied!
```
Java
Kotlin
```
@WebAppConfiguration
@ContextHierarchy
({
@ContextConfiguration
(classes = AppConfig
.
class
),
@
ContextConfiguration
(
classes
= WebConfig
.
class
)
})
class
WebIntegrationTests
{
// class body...
}
Copied!
```
```
@WebAppConfiguration
@ContextHierarchy(
ContextConfiguration(classes = [AppConfig::class])
,
ContextConfiguration(classes = [WebConfig::
class
]))
class
WebIntegrationTests
{
// class body...
}
Copied!
```
If you need to merge or override the configuration for a given level of the context
hierarchy within a test class hierarchy, you must explicitly name that level by supplying
the same value to the
name
attribute in
@ContextConfiguration
at each corresponding
level in the class hierarchy. See
Context Hierarchies
and the
@ContextHierarchy
javadoc
for further examples.