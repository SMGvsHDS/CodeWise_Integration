# Customize

Search
⌘ + k
MVC Config API
See equivalent in the Reactive stack
In Java configuration, you can implement the
WebMvcConfigurer
interface, as the
following example shows:
Java
Kotlin
```
@Configuration
public
class
WebConfiguration
implements
WebMvcConfigurer
{
// Implement configuration methods...
}
Copied!
```
```
@Configuration
class
WebConfiguration
:
WebMvcConfigurer {
// Implement configuration methods...
}
Copied!
```
In XML, you can check attributes and sub-elements of
<mvc:annotation-driven/>
. You can
view the
Spring MVC XML schema
or use
the code completion feature of your IDE to discover what attributes and
sub-elements are available.