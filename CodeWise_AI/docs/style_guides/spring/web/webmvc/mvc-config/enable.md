# Enable

Search
⌘ + k
Enable MVC Configuration
See equivalent in the Reactive stack
You can use the
@EnableWebMvc
annotation to enable MVC configuration with programmatic configuration, or
<mvc:annotation-driven>
with XML configuration, as the following example shows:
Java
Kotlin
Xml
```
@Configuration
@EnableWebMvc
public
class
WebConfiguration
{
}
Copied!
```
```
@Configuration
@EnableWebMvc
class
WebConfiguration
{
}
Copied!
```
```
<
beans
xmlns
=
"http://www.springframework.org/schema/beans"
xmlns:mvc
=
"http://www.springframework.org/schema/mvc"
xmlns:xsi
=
"http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation
=
"
http://www.springframework.org/schema/beans
https://www.springframework.org/schema/beans/spring-beans.xsd
http://www.springframework.org/schema/mvc
https://www.springframework.org/schema/mvc/spring-mvc.xsd"
>
<
mvc:annotation-driven
/>
</
beans
>
Copied!
```
When using Spring Boot, you may want to use
@Configuration
classes of type
WebMvcConfigurer
but without
@EnableWebMvc
to keep Spring Boot MVC customizations. See more details in
the MVC Config API section
and in
the dedicated Spring Boot documentation
.
The preceding example registers a number of Spring MVC
infrastructure beans
and adapts to dependencies
available on the classpath (for example, payload converters for JSON, XML, and others).