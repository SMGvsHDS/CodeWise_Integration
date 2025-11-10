# Dynamic Property Sources

Search
⌘ + k
Context Configuration with Dynamic Property Sources
The Spring TestContext Framework provides support for
dynamic
properties via the
DynamicPropertyRegistry
, the
@DynamicPropertySource
annotation, and the
DynamicPropertyRegistrar
API.
The dynamic property source infrastructure was originally designed to allow properties
from
Testcontainers
based tests to be exposed easily to Spring
integration tests. However, these features may be used with any form of external resource
whose lifecycle is managed outside the test’s
ApplicationContext
or with beans whose
lifecycle is managed by the test’s
ApplicationContext
.
Precedence
Dynamic properties have higher precedence than those loaded from
@TestPropertySource
,
the operating system’s environment, Java system properties, or property sources added by
the application declaratively by using
@PropertySource
or programmatically. Thus,
dynamic properties can be used to selectively override properties loaded via
@TestPropertySource
, system property sources, and application property sources.
DynamicPropertyRegistry
A
DynamicPropertyRegistry
is used to add
name-value
pairs to the
Environment
.
Values are dynamic and provided via a
Supplier
which is only invoked when the property
is resolved. Typically, method references are used to supply values. The following
sections provide examples of how to use the
DynamicPropertyRegistry
.
@DynamicPropertySource
In contrast to the
@TestPropertySource
annotation that is applied at the class level,
@DynamicPropertySource
can be applied to
static
methods in integration test classes in order to add properties with dynamic
values to the set of
PropertySources
in the
Environment
for the
ApplicationContext
loaded for the integration test.
Methods in integration test classes that are annotated with
@DynamicPropertySource
must
be
static
and must accept a single
DynamicPropertyRegistry
argument. See the
class-level javadoc for
DynamicPropertyRegistry
for further details.
If you use
@DynamicPropertySource
in a base class and discover that tests in subclasses
fail because the dynamic properties change between subclasses, you may need to annotate
your base class with
@DirtiesContext
to ensure that each subclass gets its own
ApplicationContext
with the correct dynamic
properties.
The following example uses the Testcontainers project to manage a Redis container outside
of the Spring
ApplicationContext
. The IP address and port of the managed Redis
container are made available to components within the test’s
ApplicationContext
via the
redis.host
and
redis.port
properties. These properties can be accessed via Spring’s
Environment
abstraction or injected directly into Spring-managed components – for
example, via
@Value("${redis.host}")
and
@Value("${redis.port}")
, respectively.
Java
Kotlin
```
@SpringJUnitConfig
(
/* ... */
)
@Testcontainers
class
ExampleIntegrationTests
{
@Container
static
GenericContainer redis =
new
GenericContainer(
"redis:5.0.3-alpine"
).withExposedPorts(
6379
);
@DynamicPropertySource
static
void
redisProperties
(DynamicPropertyRegistry registry)
{
registry.add(
"redis.host"
, redis::getHost);
registry.add(
"redis.port"
, redis::getFirstMappedPort);
}
// tests ...
}
Copied!
```
```
@SpringJUnitConfig(/* ... */)
@Testcontainers
class
ExampleIntegrationTests
{
companion
object
{
@Container
@JvmStatic
val
redis: GenericContainer =
GenericContainer(
"redis:5.0.3-alpine"
).withExposedPorts(
6379
)
@DynamicPropertySource
@JvmStatic
fun
redisProperties
(registry:
DynamicPropertyRegistry
)
{
registry.add(
"redis.host"
, redis::getHost)
registry.add(
"redis.port"
, redis::getFirstMappedPort)
}
}
// tests ...
}
Copied!
```
DynamicPropertyRegistrar
As an alternative to implementing
@DynamicPropertySource
methods in integration test
classes, you can register implementations of the
DynamicPropertyRegistrar
API as beans
within the test’s
ApplicationContext
. Doing so allows you to support additional use
cases that are not possible with a
@DynamicPropertySource
method. For example, since a
DynamicPropertyRegistrar
is itself a bean in the
ApplicationContext
, it can interact
with other beans in the context and register dynamic properties that are sourced from
those beans.
Any bean in a test’s
ApplicationContext
that implements the
DynamicPropertyRegistrar
interface will be automatically detected and eagerly initialized before the singleton
pre-instantiation phase, and the
accept()
methods of such beans will be invoked with a
DynamicPropertyRegistry
that performs the actual dynamic property registration on
behalf of the registrar.
Any interaction with other beans results in eager initialization of those other
beans and their dependencies.
The following example demonstrates how to implement a
DynamicPropertyRegistrar
as a
lambda expression that registers a dynamic property for the
ApiServer
bean. The
api.url
property can be accessed via Spring’s
Environment
abstraction or injected
directly into other Spring-managed components – for example, via
@Value("${api.url}")
,
and the value of the
api.url
property will be dynamically retrieved from the
ApiServer
bean.
Java
Kotlin
```
@Configuration
class
TestConfig
{
@Bean
ApiServer
apiServer
()
{
return
new
ApiServer();
}
@Bean
DynamicPropertyRegistrar
apiPropertiesRegistrar
(ApiServer apiServer)
{
return
registry -> registry.add(
"api.url"
, apiServer::getUrl);
}
}
Copied!
```
```
@Configuration
class
TestConfig
{
@Bean
fun
apiServer
()
: ApiServer {
return
ApiServer()
}
@Bean
fun
apiPropertiesRegistrar
(apiServer:
ApiServer
)
: DynamicPropertyRegistrar {
return
registry -> registry.add(
"api.url"
, apiServer::getUrl)
}
}
Copied!
```