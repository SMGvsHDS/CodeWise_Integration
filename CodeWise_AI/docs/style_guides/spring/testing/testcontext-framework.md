# Testcontext Framework

Search
⌘ + k
Spring TestContext Framework
The Spring TestContext Framework (located in the
org.springframework.test.context
package) provides generic, annotation-driven unit and integration testing support that is
agnostic of the testing framework in use. The TestContext framework also places a great
deal of importance on convention over configuration, with reasonable defaults that you
can override through annotation-based configuration.
In addition to generic testing infrastructure, the TestContext framework provides
explicit support for JUnit 4, JUnit Jupiter (AKA JUnit 5), and TestNG. For JUnit 4 and
TestNG, Spring provides
abstract
support classes. Furthermore, Spring provides a custom
JUnit
Runner
and custom JUnit
Rules
for JUnit 4 and a custom
Extension
for JUnit
Jupiter that let you write so-called POJO test classes. POJO test classes are not
required to extend a particular class hierarchy, such as the
abstract
support classes.
The following section provides an overview of the internals of the TestContext framework.
If you are interested only in using the framework and are not interested in extending it
with your own custom listeners or custom loaders, feel free to go directly to the
configuration (
context management
,
dependency injection
,
transaction management
),
support classes
, and
annotation support
sections.
Section Summary
Key Abstractions
Bootstrapping the TestContext Framework
TestExecutionListener
Configuration
Application Events
Test Execution Events
Context Management
Dependency Injection of Test Fixtures
Bean Overriding in Tests
Testing Request- and Session-scoped Beans
Transaction Management
Executing SQL Scripts
Parallel Test Execution
TestContext Framework Support Classes
Ahead of Time Support for Tests