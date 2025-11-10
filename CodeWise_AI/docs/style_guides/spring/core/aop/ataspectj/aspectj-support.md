# Aspectj Support

Search
⌘ + k
Enabling @AspectJ Support
To use @AspectJ aspects in a Spring configuration, you need to enable Spring support for
configuring Spring AOP based on @AspectJ aspects and auto-proxying beans based on
whether or not they are advised by those aspects. By auto-proxying, we mean that, if Spring
determines that a bean is advised by one or more aspects, it automatically generates
a proxy for that bean to intercept method invocations and ensures that advice is run
as needed.
The @AspectJ support can be enabled with programmatic or XML configuration. In either
case, you also need to ensure that AspectJ’s
org.aspectj:aspectjweaver
library is on the
classpath of your application (version 1.9 or later).
Java
Kotlin
Xml
```
@Configuration
@EnableAspectJAutoProxy
public
class
ApplicationConfiguration
{
}
Copied!
```
```
@Configuration
@EnableAspectJAutoProxy
class
ApplicationConfiguration
Copied!
```
```
<
beans
xmlns
=
"http://www.springframework.org/schema/beans"
xmlns:xsi
=
"http://www.w3.org/2001/XMLSchema-instance"
xmlns:aop
=
"http://www.springframework.org/schema/aop"
xsi:schemaLocation
=
"http://www.springframework.org/schema/beans
https://www.springframework.org/schema/beans/spring-beans.xsd
http://www.springframework.org/schema/aop
https://www.springframework.org/schema/aop/spring-aop.xsd"
>
<
aop:aspectj-autoproxy
/>
</
beans
>
Copied!
```