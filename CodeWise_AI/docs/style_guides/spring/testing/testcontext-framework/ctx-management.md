# Ctx Management

Search
⌘ + k
Context Management
Each
TestContext
provides context management and caching support for the test instance
for which it is responsible. Test instances do not automatically receive access to the
configured
ApplicationContext
. However, if a test class implements the
ApplicationContextAware
interface, a reference to the
ApplicationContext
is supplied
to the test instance. Note that
AbstractJUnit4SpringContextTests
and
AbstractTestNGSpringContextTests
implement
ApplicationContextAware
and, therefore,
provide access to the
ApplicationContext
automatically.
@Autowired ApplicationContext
As an alternative to implementing the
ApplicationContextAware
interface, you can inject
the application context for your test class through the
@Autowired
annotation on either
a field or setter method, as the following example shows:
Java
Kotlin
```
@SpringJUnitConfig
class
MyTest
{
@Autowired
(
1
)
ApplicationContext applicationContext;
// class body...
}
Copied!
```
1
Injecting the
ApplicationContext
.
```
@SpringJUnitConfig
class
MyTest
{
@Autowired
(
1
)
lateinit
var
applicationContext: ApplicationContext
// class body...
}
Copied!
```
1
Injecting the
ApplicationContext
.
Similarly, if your test is configured to load a
WebApplicationContext
, you can inject
the web application context into your test, as follows:
Java
Kotlin
```
@SpringJUnitWebConfig
(
1
)
class
MyWebAppTest
{
@Autowired
(
2
)
WebApplicationContext wac;
// class body...
}
Copied!
```
1
Configuring the
WebApplicationContext
.
2
Injecting the
WebApplicationContext
.
```
@SpringJUnitWebConfig
(
1
)
class
MyWebAppTest
{
@Autowired
(
2
)
lateinit
var
wac: WebApplicationContext
// class body...
}
Copied!
```
1
Configuring the
WebApplicationContext
.
2
Injecting the
WebApplicationContext
.
Dependency injection by using
@Autowired
is provided by the
DependencyInjectionTestExecutionListener
, which is configured by default
(see
Dependency Injection of Test Fixtures
).
Test classes that use the TestContext framework do not need to extend any particular
class or implement a specific interface to configure their application context. Instead,
configuration is achieved by declaring the
@ContextConfiguration
annotation at the
class level. If your test class does not explicitly declare application context resource
locations or component classes, the configured
ContextLoader
determines how to load a
context from a default location or default configuration classes. In addition to context
resource locations and component classes, an application context can also be configured
through application context initializers.
The following sections explain how to use Spring’s
@ContextConfiguration
annotation to
configure a test
ApplicationContext
by using XML configuration files, Groovy scripts,
component classes (typically
@Configuration
classes), or context initializers.
Alternatively, you can implement and configure your own custom
SmartContextLoader
for
advanced use cases.
Context Configuration with XML resources
Context Configuration with Groovy Scripts
Context Configuration with Component Classes
Mixing XML, Groovy Scripts, and Component Classes
Context Configuration with Context Customizers
Context Configuration with Context Initializers
Context Configuration Inheritance
Context Configuration with Environment Profiles
Context Configuration with Test Property Sources
Context Configuration with Dynamic Property Sources
Loading a
WebApplicationContext
Context Caching
Context Failure Threshold
Context Hierarchies