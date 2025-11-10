# Integration Junit Jupiter

Search
⌘ + k
Spring JUnit Jupiter Testing Annotations
The following annotations are supported when used in conjunction with the
SpringExtension
and JUnit Jupiter
(that is, the programming model in JUnit 5):
@SpringJUnitConfig
@SpringJUnitWebConfig
@TestConstructor
@NestedTestConfiguration
@EnabledIf
@DisabledIf
@DisabledInAotMode
@SpringJUnitConfig
@SpringJUnitConfig
is a composed annotation that combines
@ExtendWith(SpringExtension.class)
from JUnit Jupiter with
@ContextConfiguration
from
the Spring TestContext Framework. It can be used at the class level as a drop-in
replacement for
@ContextConfiguration
. With regard to configuration options, the only
difference between
@ContextConfiguration
and
@SpringJUnitConfig
is that component
classes may be declared with the
value
attribute in
@SpringJUnitConfig
.
The following example shows how to use the
@SpringJUnitConfig
annotation to specify a
configuration class:
Java
Kotlin
```
@SpringJUnitConfig
(TestConfig
.
class
)
(1)
class
ConfigurationClassJUnitJupiterSpringTests
{
// class body...
}
Copied!
```
1
Specify the configuration class.
```
@SpringJUnitConfig(TestConfig::class)
(
1
)
class
ConfigurationClassJUnitJupiterSpringTests
{
// class body...
}
Copied!
```
1
Specify the configuration class.
The following example shows how to use the
@SpringJUnitConfig
annotation to specify the
location of a configuration file:
Java
Kotlin
```
@SpringJUnitConfig
(locations =
"/test-config.xml"
)
(
1
)
class
XmlJUnitJupiterSpringTests
{
// class body...
}
Copied!
```
1
Specify the location of a configuration file.
```
@SpringJUnitConfig(locations = [
"/test-config.xml"
])
(
1
)
class
XmlJUnitJupiterSpringTests
{
// class body...
}
Copied!
```
1
Specify the location of a configuration file.
See
Context Management
as well as the javadoc for
@SpringJUnitConfig
and
@ContextConfiguration
for further details.
@SpringJUnitWebConfig
@SpringJUnitWebConfig
is a composed annotation that combines
@ExtendWith(SpringExtension.class)
from JUnit Jupiter with
@ContextConfiguration
and
@WebAppConfiguration
from the Spring TestContext Framework. You can use it at the class
level as a drop-in replacement for
@ContextConfiguration
and
@WebAppConfiguration
.
With regard to configuration options, the only difference between
@ContextConfiguration
and
@SpringJUnitWebConfig
is that you can declare component classes by using the
value
attribute in
@SpringJUnitWebConfig
. In addition, you can override the
value
attribute from
@WebAppConfiguration
only by using the
resourcePath
attribute in
@SpringJUnitWebConfig
.
The following example shows how to use the
@SpringJUnitWebConfig
annotation to specify
a configuration class:
Java
Kotlin
```
@SpringJUnitWebConfig
(TestConfig
.
class
)
(1)
class
ConfigurationClassJUnitJupiterSpringWebTests
{
// class body...
}
Copied!
```
1
Specify the configuration class.
```
@SpringJUnitWebConfig(TestConfig::class)
(
1
)
class
ConfigurationClassJUnitJupiterSpringWebTests
{
// class body...
}
Copied!
```
1
Specify the configuration class.
The following example shows how to use the
@SpringJUnitWebConfig
annotation to specify the
location of a configuration file:
Java
Kotlin
```
@SpringJUnitWebConfig
(locations =
"/test-config.xml"
)
(
1
)
class
XmlJUnitJupiterSpringWebTests
{
// class body...
}
Copied!
```
1
Specify the location of a configuration file.
```
@SpringJUnitWebConfig(locations = [
"/test-config.xml"
])
(
1
)
class
XmlJUnitJupiterSpringWebTests
{
// class body...
}
Copied!
```
1
Specify the location of a configuration file.
See
Context Management
as well as the javadoc for
@SpringJUnitWebConfig
,
@ContextConfiguration
, and
@WebAppConfiguration
for further details.
@TestConstructor
@TestConstructor
is an annotation that can be applied to a test class to configure how
the parameters of a test class constructor are autowired from components in the test’s
ApplicationContext
.
If
@TestConstructor
is not present or meta-present on a test class, the default
test
constructor autowire mode
will be used. See the tip below for details on how to change
the default mode. Note, however, that a local declaration of
@Autowired
,
@jakarta.inject.Inject
, or
@javax.inject.Inject
on a constructor takes precedence
over both
@TestConstructor
and the default mode.
Changing the default test constructor autowire mode
The default
test constructor autowire mode
can be changed by setting the
spring.test.constructor.autowire.mode
JVM system property to
all
. Alternatively, the
default mode may be set via the
SpringProperties
mechanism.
The default mode may also be configured as a
JUnit Platform configuration parameter
.
If the
spring.test.constructor.autowire.mode
property is not set, test class
constructors will not be automatically autowired.
@TestConstructor
is only supported in conjunction with the
SpringExtension
for
use with JUnit Jupiter. Note that the
SpringExtension
is often automatically registered
for you – for example, when using annotations such as
@SpringJUnitConfig
and
@SpringJUnitWebConfig
or various test-related annotations from Spring Boot Test.
@NestedTestConfiguration
@NestedTestConfiguration
is an annotation that can be applied to a test class to
configure how Spring test configuration annotations are processed within enclosing class
hierarchies for inner test classes.
If
@NestedTestConfiguration
is not present or meta-present on a test class, in its
supertype hierarchy, or in its enclosing class hierarchy, the default
enclosing
configuration inheritance mode
will be used. See the tip below for details on how to
change the default mode.
Changing the default enclosing configuration inheritance mode
The default
enclosing configuration inheritance mode
is
INHERIT
, but it can be
changed by setting the
spring.test.enclosing.configuration
JVM system property to
OVERRIDE
. Alternatively, the default mode may be set via the
SpringProperties
mechanism.
The
Spring TestContext Framework
honors
@NestedTestConfiguration
semantics for the
following annotations.
@BootstrapWith
@ContextConfiguration
@WebAppConfiguration
@ContextHierarchy
@ContextCustomizerFactories
@ActiveProfiles
@TestPropertySource
@DynamicPropertySource
@DirtiesContext
@TestExecutionListeners
@RecordApplicationEvents
@Transactional
@Commit
@Rollback
@Sql
@SqlConfig
@SqlMergeMode
@TestConstructor
The use of
@NestedTestConfiguration
typically only makes sense in conjunction
with
@Nested
test classes in JUnit Jupiter; however, there may be other testing
frameworks with support for Spring and nested test classes that make use of this
annotation.
See
@Nested
test class configuration
for an example and further details.
@EnabledIf
@EnabledIf
is used to signal that the annotated JUnit Jupiter test class or test method
is enabled and should be run if the supplied
expression
evaluates to
true
.
Specifically, if the expression evaluates to
Boolean.TRUE
or a
String
equal to
true
(ignoring case), the test is enabled. When applied at the class level, all test methods
within that class are automatically enabled by default as well.
Expressions can be any of the following:
Spring Expression Language
(SpEL) expression. For example:
@EnabledIf("#{systemProperties['os.name'].toLowerCase().contains('mac')}")
Placeholder for a property available in the Spring
Environment
.
For example:
@EnabledIf("${smoke.tests.enabled}")
Text literal. For example:
@EnabledIf("true")
Note, however, that a text literal that is not the result of dynamic resolution of a
property placeholder is of zero practical value, since
@EnabledIf("false")
is
equivalent to
@Disabled
and
@EnabledIf("true")
is logically meaningless.
You can use
@EnabledIf
as a meta-annotation to create custom composed annotations. For
example, you can create a custom
@EnabledOnMac
annotation as follows:
Java
Kotlin
```
@Target
({ElementType.TYPE, ElementType.METHOD})
@Retention
(RetentionPolicy.RUNTIME)
@EnabledIf
(
expression =
"#{systemProperties['os.name'].toLowerCase().contains('mac')}"
,
reason =
"Enabled on Mac OS"
)
public
@interface
EnabledOnMac {}
Copied!
```
```
@Target(AnnotationTarget.TYPE, AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
@EnabledIf(
expression =
"#{systemProperties['os.name'].toLowerCase().contains('mac')}"
,
reason =
"Enabled on Mac OS"
)
annotation
class
EnabledOnMac
{}
Copied!
```
@EnabledOnMac
is meant only as an example of what is possible. If you have that exact
use case, please use the built-in
@EnabledOnOs(MAC)
support in JUnit Jupiter.
Since JUnit 5.7, JUnit Jupiter also has a condition annotation named
@EnabledIf
. Thus,
if you wish to use Spring’s
@EnabledIf
support make sure you import the annotation type
from the correct package.
@DisabledIf
@DisabledIf
is used to signal that the annotated JUnit Jupiter test class or test
method is disabled and should not be run if the supplied
expression
evaluates to
true
. Specifically, if the expression evaluates to
Boolean.TRUE
or a
String
equal
to
true
(ignoring case), the test is disabled. When applied at the class level, all
test methods within that class are automatically disabled as well.
Expressions can be any of the following:
Spring Expression Language
(SpEL) expression. For example:
@DisabledIf("#{systemProperties['os.name'].toLowerCase().contains('mac')}")
Placeholder for a property available in the Spring
Environment
.
For example:
@DisabledIf("${smoke.tests.disabled}")
Text literal. For example:
@DisabledIf("true")
Note, however, that a text literal that is not the result of dynamic resolution of a
property placeholder is of zero practical value, since
@DisabledIf("true")
is
equivalent to
@Disabled
and
@DisabledIf("false")
is logically meaningless.
You can use
@DisabledIf
as a meta-annotation to create custom composed annotations. For
example, you can create a custom
@DisabledOnMac
annotation as follows:
Java
Kotlin
```
@Target
({ElementType.TYPE, ElementType.METHOD})
@Retention
(RetentionPolicy.RUNTIME)
@DisabledIf
(
expression =
"#{systemProperties['os.name'].toLowerCase().contains('mac')}"
,
reason =
"Disabled on Mac OS"
)
public
@interface
DisabledOnMac {}
Copied!
```
```
@Target(AnnotationTarget.TYPE, AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
@DisabledIf(
expression =
"#{systemProperties['os.name'].toLowerCase().contains('mac')}"
,
reason =
"Disabled on Mac OS"
)
annotation
class
DisabledOnMac
{}
Copied!
```
@DisabledOnMac
is meant only as an example of what is possible. If you have that exact
use case, please use the built-in
@DisabledOnOs(MAC)
support in JUnit Jupiter.
Since JUnit 5.7, JUnit Jupiter also has a condition annotation named
@DisabledIf
. Thus,
if you wish to use Spring’s
@DisabledIf
support make sure you import the annotation type
from the correct package.