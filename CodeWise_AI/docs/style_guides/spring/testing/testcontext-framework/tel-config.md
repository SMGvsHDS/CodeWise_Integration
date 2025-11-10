# Tel Config

Search
⌘ + k
TestExecutionListener
Configuration
Spring provides the following
TestExecutionListener
implementations that are registered
by default, exactly in the following order:
ServletTestExecutionListener
: Configures Servlet API mocks for a
WebApplicationContext
.
DirtiesContextBeforeModesTestExecutionListener
: Handles the
@DirtiesContext
annotation for "before" modes.
ApplicationEventsTestExecutionListener
: Provides support for
ApplicationEvents
.
BeanOverrideTestExecutionListener
: Provides support for
Bean Overriding in Tests
.
DependencyInjectionTestExecutionListener
: Provides dependency injection for the test
instance.
MicrometerObservationRegistryTestExecutionListener
: Provides support for
Micrometer’s
ObservationRegistry
.
DirtiesContextTestExecutionListener
: Handles the
@DirtiesContext
annotation for
"after" modes.
CommonCachesTestExecutionListener
: Clears resource caches in the test’s
ApplicationContext
if necessary.
TransactionalTestExecutionListener
: Provides transactional test execution with
default rollback semantics.
SqlScriptsTestExecutionListener
: Runs SQL scripts configured by using the
@Sql
annotation.
EventPublishingTestExecutionListener
: Publishes test execution events to the test’s
ApplicationContext
(see
Test Execution Events
).
MockitoResetTestExecutionListener
: Resets mocks as configured by
@MockitoBean
or
@MockitoSpyBean
.
Registering
TestExecutionListener
Implementations
You can register
TestExecutionListener
implementations explicitly for a test class, its
subclasses, and its nested classes by using the
@TestExecutionListeners
annotation. See
annotation support
and the javadoc for
@TestExecutionListeners
for details and examples.
Switching to default
TestExecutionListener
implementations
If you extend a class that is annotated with
@TestExecutionListeners
and you need to
switch to using the default set of listeners, you can annotate your class with the
following.
Java
Kotlin
```
// Switch to default listeners
@TestExecutionListeners
(
listeners = {},
inheritListeners =
false
,
mergeMode = MERGE_WITH_DEFAULTS)
class
MyTest
extends
BaseTest
{
// class body...
}
Copied!
```
```
// Switch to default listeners
@TestExecutionListeners(
listeners = [],
inheritListeners = false,
mergeMode = MERGE_WITH_DEFAULTS)
class
MyTest
:
BaseTest {
// class body...
}
Copied!
```
Automatic Discovery of Default
TestExecutionListener
Implementations
Registering
TestExecutionListener
implementations by using
@TestExecutionListeners
is
suitable for custom listeners that are used in limited testing scenarios. However, it can
become cumbersome if a custom listener needs to be used across an entire test suite. This
issue is addressed through support for automatic discovery of default
TestExecutionListener
implementations through the
SpringFactoriesLoader
mechanism.
For example, the
spring-test
module declares all core default
TestExecutionListener
implementations under the
org.springframework.test.context.TestExecutionListener
key in
its
META-INF/spring.factories
properties file
. Third-party frameworks and developers can contribute their own
TestExecutionListener
implementations to the list of default listeners in the same
manner through their own
spring.factories
files.
Ordering
TestExecutionListener
Implementations
When the TestContext framework discovers default
TestExecutionListener
implementations
through the
aforementioned
SpringFactoriesLoader
mechanism, the instantiated listeners are sorted by using
Spring’s
AnnotationAwareOrderComparator
, which honors Spring’s
Ordered
interface and
@Order
annotation for ordering.
AbstractTestExecutionListener
and all default
TestExecutionListener
implementations provided by Spring implement
Ordered
with
appropriate values. Third-party frameworks and developers should therefore make sure that
their default
TestExecutionListener
implementations are registered in the proper order
by implementing
Ordered
or declaring
@Order
. See the javadoc for the
getOrder()
methods of the core default
TestExecutionListener
implementations for details on what
values are assigned to each core listener.
Merging
TestExecutionListener
Implementations
If a custom
TestExecutionListener
is registered via
@TestExecutionListeners
, the
default listeners are not registered. In most common testing scenarios, this effectively
forces the developer to manually declare all default listeners in addition to any custom
listeners. The following listing demonstrates this style of configuration:
Java
Kotlin
```
@ContextConfiguration
@TestExecutionListeners
({
MyCustomTestExecutionListener
.
class
,
ServletTestExecutionListener
.
class
,
DirtiesContextBeforeModesTestExecutionListener
.
class
,
DependencyInjectionTestExecutionListener
.
class
,
DirtiesContextTestExecutionListener
.
class
,
TransactionalTestExecutionListener
.
class
,
SqlScriptsTestExecutionListener
.
class
})
class
MyTest
{
// class body...
}
Copied!
```
```
@ContextConfiguration
@TestExecutionListeners(
MyCustomTestExecutionListener::class,
ServletTestExecutionListener::class,
DirtiesContextBeforeModesTestExecutionListener::class,
DependencyInjectionTestExecutionListener::class,
DirtiesContextTestExecutionListener::class,
TransactionalTestExecutionListener::class,
SqlScriptsTestExecutionListener::class
)
class
MyTest
{
// class body...
}
Copied!
```
The challenge with this approach is that it requires that the developer know exactly
which listeners are registered by default. Moreover, the set of default listeners can
change from release to release — for example,
SqlScriptsTestExecutionListener
was
introduced in Spring Framework 4.1, and
DirtiesContextBeforeModesTestExecutionListener
was introduced in Spring Framework 4.2. Furthermore, third-party frameworks like Spring
Boot and Spring Security register their own default
TestExecutionListener
implementations by using the aforementioned
automatic discovery mechanism
.
To avoid having to be aware of and re-declare all default listeners, you can set the
mergeMode
attribute of
@TestExecutionListeners
to
MergeMode.MERGE_WITH_DEFAULTS
.
MERGE_WITH_DEFAULTS
indicates that locally declared listeners should be merged with the
default listeners. The merging algorithm ensures that duplicates are removed from the
list and that the resulting set of merged listeners is sorted according to the semantics
of
AnnotationAwareOrderComparator
, as described in
Ordering
TestExecutionListener
Implementations
.
If a listener implements
Ordered
or is annotated with
@Order
, it can influence the
position in which it is merged with the defaults. Otherwise, locally declared listeners
are appended to the list of default listeners when merged.
For example, if the
MyCustomTestExecutionListener
class in the previous example
configures its
order
value (for example,
500
) to be less than the order of the
ServletTestExecutionListener
(which happens to be
1000
), the
MyCustomTestExecutionListener
can then be automatically merged with the list of
defaults in front of the
ServletTestExecutionListener
, and the previous example could
be replaced with the following:
Java
Kotlin
```
@ContextConfiguration
@TestExecutionListeners
(
listeners = MyCustomTestExecutionListener
.
class
,
mergeMode
= MERGE_WITH_DEFAULTS
)
class
MyTest
{
// class body...
}
Copied!
```
```
@ContextConfiguration
@TestExecutionListeners(
listeners = [MyCustomTestExecutionListener::class],
mergeMode = MERGE_WITH_DEFAULTS
)
class
MyTest
{
// class body...
}
Copied!
```