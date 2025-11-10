# Annotation Activeprofiles

Search
⌘ + k
@ActiveProfiles
@ActiveProfiles
is an annotation that can be applied to a test class to declare which
bean definition profiles should be active when loading an
ApplicationContext
for an
integration test.
The following example indicates that the
dev
profile should be active:
Java
Kotlin
```
@ContextConfiguration
@ActiveProfiles
(
"dev"
)
(
1
)
class
DeveloperTests
{
// class body...
}
Copied!
```
1
Indicate that the
dev
profile should be active.
```
@ContextConfiguration
@ActiveProfiles(
"dev"
)
(
1
)
class
DeveloperTests
{
// class body...
}
Copied!
```
1
Indicate that the
dev
profile should be active.
The following example indicates that both the
dev
and the
integration
profiles should
be active:
Java
Kotlin
```
@ContextConfiguration
@ActiveProfiles
({
"dev"
,
"integration"
})
(
1
)
class
DeveloperIntegrationTests
{
// class body...
}
Copied!
```
1
Indicate that the
dev
and
integration
profiles should be active.
```
@ContextConfiguration
@ActiveProfiles([
"dev"
,
"integration"
])
(
1
)
class
DeveloperIntegrationTests
{
// class body...
}
Copied!
```
1
Indicate that the
dev
and
integration
profiles should be active.
@ActiveProfiles
provides support for inheriting active bean definition profiles
declared by superclasses and enclosing classes by default. You can also resolve active
bean definition profiles programmatically by implementing a custom
ActiveProfilesResolver
and registering it by using the
resolver
attribute of
@ActiveProfiles
.
See
Context Configuration with Environment Profiles
,
@Nested
test class configuration
, and the
@ActiveProfiles
javadoc for
examples and further details.