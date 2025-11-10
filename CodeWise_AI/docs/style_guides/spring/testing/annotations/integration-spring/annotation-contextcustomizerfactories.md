# Annotation Contextcustomizerfactories

Search
⌘ + k
@ContextCustomizerFactories
@ContextCustomizerFactories
is an annotation that can be applied to a test class to
register
ContextCustomizerFactory
implementations for the particular test class, its
subclasses, and its nested classes. If you wish to register a factory globally, you
should register it via the automatic discovery mechanism described in
ContextCustomizerFactory
Configuration
.
The following example shows how to register two
ContextCustomizerFactory
implementations:
Java
Kotlin
```
@ContextConfiguration
@ContextCustomizerFactories
({CustomContextCustomizerFactory
.
class
,
AnotherContextCustomizerFactory
.
class
})
(1)
class
CustomContextCustomizerFactoryTests
{
// class body...
}
Copied!
```
1
Register two
ContextCustomizerFactory
implementations.
```
@ContextConfiguration
@ContextCustomizerFactories([CustomContextCustomizerFactory::class, AnotherContextCustomizerFactory::class])
(
1
)
class
CustomContextCustomizerFactoryTests
{
// class body...
}
Copied!
```
1
Register two
ContextCustomizerFactory
implementations.
By default,
@ContextCustomizerFactories
provides support for inheriting factories from
superclasses or enclosing classes. See
@Nested
test class configuration
and the
@ContextCustomizerFactories
javadoc
for an example and further details.