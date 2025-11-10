# Context Load Time Weaver

Search
⌘ + k
Registering a
LoadTimeWeaver
The
LoadTimeWeaver
is used by Spring to dynamically transform classes as they are
loaded into the Java virtual machine (JVM).
To enable load-time weaving, you can add the
@EnableLoadTimeWeaving
to one of your
@Configuration
classes, as the following example shows:
Java
Kotlin
```
@Configuration
@EnableLoadTimeWeaving
public
class
AppConfig
{
}
Copied!
```
```
@Configuration
@EnableLoadTimeWeaving
class
AppConfig
Copied!
```
Alternatively, for XML configuration, you can use the
context:load-time-weaver
element:
```
<
beans
>
<
context:load-time-weaver
/>
</
beans
>
Copied!
```
Once configured for the
ApplicationContext
, any bean within that
ApplicationContext
may implement
LoadTimeWeaverAware
, thereby receiving a reference to the load-time
weaver instance. This is particularly useful in combination with
Spring’s JPA support
where load-time weaving may be
necessary for JPA class transformation.
Consult the
LocalContainerEntityManagerFactoryBean
javadoc for more detail. For more on AspectJ load-time weaving, see
Load-time Weaving with AspectJ in the Spring Framework
.