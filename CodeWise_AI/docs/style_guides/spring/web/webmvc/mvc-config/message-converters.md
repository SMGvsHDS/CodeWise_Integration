# Message Converters

Search
⌘ + k
Message Converters
See equivalent in the Reactive stack
You can set the
HttpMessageConverter
instances to use in Java configuration,
replacing the ones used by default, by overriding
configureMessageConverters()
.
You can also customize the list of configured message converters at the end by overriding
extendMessageConverters()
.
In a Spring Boot application, the
WebMvcAutoConfiguration
adds any
HttpMessageConverter
beans it detects, in addition to default converters. Hence, in a
Boot application, prefer to use the
HttpMessageConverters
mechanism. Or alternatively, use
extendMessageConverters
to modify message converters
at the end.
The following example adds XML and Jackson JSON converters with a customized
ObjectMapper
instead of the default ones:
Java
Kotlin
Xml
```
@Configuration
public
class
WebConfiguration
implements
WebMvcConfigurer
{
@Override
public
void
configureMessageConverters
(List<HttpMessageConverter<?>> converters)
{
Jackson2ObjectMapperBuilder builder =
new
Jackson2ObjectMapperBuilder()
.indentOutput(
true
)
.dateFormat(
new
SimpleDateFormat(
"yyyy-MM-dd"
))
.modulesToInstall(
new
ParameterNamesModule());
converters.add(
new
MappingJackson2HttpMessageConverter(builder.build()));
converters.add(
new
MappingJackson2XmlHttpMessageConverter(builder.createXmlMapper(
true
).build()));
}
}
Copied!
```
```
@Configuration
class
WebConfiguration
:
WebMvcConfigurer {
override
fun
configureMessageConverters
(converters:
MutableList
<
HttpMessageConverter
<*>>)
{
val
builder = Jackson2ObjectMapperBuilder()
.indentOutput(
true
)
.dateFormat(SimpleDateFormat(
"yyyy-MM-dd"
))
.modulesToInstall(ParameterNamesModule())
converters.add(MappingJackson2HttpMessageConverter(builder.build()))
converters.add(MappingJackson2XmlHttpMessageConverter(builder.createXmlMapper(
true
).build()))
}
}
Copied!
```
```
<
mvc:annotation-driven
>
<
mvc:message-converters
>
<
bean
class
=
"org.springframework.http.converter.json.MappingJackson2HttpMessageConverter"
>
<
property
name
=
"objectMapper"
ref
=
"objectMapper"
/>
</
bean
>
<
bean
class
=
"org.springframework.http.converter.xml.MappingJackson2XmlHttpMessageConverter"
>
<
property
name
=
"objectMapper"
ref
=
"xmlMapper"
/>
</
bean
>
</
mvc:message-converters
>
</
mvc:annotation-driven
>
<
bean
id
=
"objectMapper"
class
=
"org.springframework.http.converter.json.Jackson2ObjectMapperFactoryBean"
p:indentOutput
=
"true"
p:simpleDateFormat
=
"yyyy-MM-dd"
p:modulesToInstall
=
"com.fasterxml.jackson.module.paramnames.ParameterNamesModule"
/>
<
bean
id
=
"xmlMapper"
parent
=
"objectMapper"
p:createXmlMapper
=
"true"
/>
Copied!
```
In the preceding example,
Jackson2ObjectMapperBuilder
is used to create a common configuration for both
MappingJackson2HttpMessageConverter
and
MappingJackson2XmlHttpMessageConverter
with indentation enabled, a customized date format,
and the registration of
jackson-module-parameter-names
,
Which adds support for accessing parameter names (a feature added in Java 8).
This builder customizes Jackson’s default properties as follows:
DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES
is disabled.
MapperFeature.DEFAULT_VIEW_INCLUSION
is disabled.
It also automatically registers the following well-known modules if they are detected on the classpath:
jackson-datatype-jsr310
: Support for Java 8 Date and Time API types.
jackson-datatype-jdk8
: Support for other Java 8 types, such as
Optional
.
jackson-module-kotlin
: Support for Kotlin classes and data classes.
Enabling indentation with Jackson XML support requires
woodstox-core-asl
dependency in addition to
jackson-dataformat-xml
one.
Other interesting Jackson modules are available:
jackson-datatype-money
: Support for
javax.money
types (unofficial module).
jackson-datatype-hibernate
: Support for Hibernate-specific types and properties (including lazy-loading aspects).