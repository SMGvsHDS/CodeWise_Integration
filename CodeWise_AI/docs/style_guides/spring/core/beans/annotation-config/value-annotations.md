# Value Annotations

Search
⌘ + k
Using
@Value
@Value
is typically used to inject externalized properties:
Java
Kotlin
```
@Component
public
class
MovieRecommender
{
private
final
String catalog;
public
MovieRecommender
(@Value(
"${catalog.name}"
)
String catalog)
{
this
.catalog = catalog;
}
}
Copied!
```
```
@Component
class
MovieRecommender
(
@Value(
"\${catalog.name}"
)
private
val
catalog: String)
Copied!
```
With the following configuration:
Java
Kotlin
```
@Configuration
@PropertySource
(
"classpath:application.properties"
)
public
class
AppConfig
{ }
Copied!
```
```
@Configuration
@PropertySource(
"classpath:application.properties"
)
class
AppConfig
Copied!
```
And the following
application.properties
file:
```
catalog.name=MovieCatalog
Copied!
```
In that case, the
catalog
parameter and field will be equal to the
MovieCatalog
value.
A default lenient embedded value resolver is provided by Spring. It will try to resolve the
property value and if it cannot be resolved, the property name (for example
${catalog.name}
)
will be injected as the value. If you want to maintain strict control over nonexistent
values, you should declare a
PropertySourcesPlaceholderConfigurer
bean, as the following
example shows:
Java
Kotlin
```
@Configuration
public
class
AppConfig
{
@Bean
public
static
PropertySourcesPlaceholderConfigurer
propertyPlaceholderConfigurer
()
{
return
new
PropertySourcesPlaceholderConfigurer();
}
}
Copied!
```
```
@Configuration
class
AppConfig
{
@Bean
fun
propertyPlaceholderConfigurer
()
= PropertySourcesPlaceholderConfigurer()
}
Copied!
```
When configuring a
PropertySourcesPlaceholderConfigurer
using JavaConfig, the
@Bean
method must be
static
.
Using the above configuration ensures Spring initialization failure if any
${}
placeholder could not be resolved. It is also possible to use methods like
setPlaceholderPrefix()
,
setPlaceholderSuffix()
,
setValueSeparator()
, or
setEscapeCharacter()
to customize the placeholder syntax. In addition, the default
escape character can be changed or disabled globally by setting the
spring.placeholder.escapeCharacter.default
property via a JVM system property (or via
the
SpringProperties
mechanism).
Spring Boot configures by default a
PropertySourcesPlaceholderConfigurer
bean that
will get properties from
application.properties
and
application.yml
files.
Built-in converter support provided by Spring allows simple type conversion (to
Integer
or
int
for example) to be automatically handled. Multiple comma-separated values can be
automatically converted to
String
array without extra effort.
It is possible to provide a default value as following:
Java
Kotlin
```
@Component
public
class
MovieRecommender
{
private
final
String catalog;
public
MovieRecommender
(@Value(
"${catalog.name:defaultCatalog}"
)
String catalog)
{
this
.catalog = catalog;
}
}
Copied!
```
```
@Component
class
MovieRecommender
(
@Value(
"\${catalog.name:defaultCatalog}"
)
private
val
catalog: String)
Copied!
```
A Spring
BeanPostProcessor
uses a
ConversionService
behind the scenes to handle the
process for converting the
String
value in
@Value
to the target type. If you want to
provide conversion support for your own custom type, you can provide your own
ConversionService
bean instance as the following example shows:
Java
Kotlin
```
@Configuration
public
class
AppConfig
{
@Bean
public
ConversionService
conversionService
()
{
DefaultFormattingConversionService conversionService =
new
DefaultFormattingConversionService();
conversionService.addConverter(
new
MyCustomConverter());
return
conversionService;
}
}
Copied!
```
```
@Configuration
class
AppConfig
{
@Bean
fun
conversionService
()
: ConversionService {
return
DefaultFormattingConversionService().apply {
addConverter(MyCustomConverter())
}
}
}
Copied!
```
When
@Value
contains a
SpEL
expression
the value will be dynamically
computed at runtime as the following example shows:
Java
Kotlin
```
@Component
public
class
MovieRecommender
{
private
final
String catalog;
public
MovieRecommender
(@Value(
"#{systemProperties['user.catalog'] + 'Catalog' }"
)
String catalog)
{
this
.catalog = catalog;
}
}
Copied!
```
```
@Component
class
MovieRecommender
(
@Value(
"#{systemProperties['user.catalog'] + 'Catalog' }"
)
private
val
catalog: String)
Copied!
```
SpEL also enables the use of more complex data structures:
Java
Kotlin
```
@Component
public
class
MovieRecommender
{
private
final
Map<String, Integer> countOfMoviesPerCatalog;
public
MovieRecommender
(
@Value(
"#{{'Thriller': 100, 'Comedy': 300}}"
)
Map<String, Integer> countOfMoviesPerCatalog)
{
this
.countOfMoviesPerCatalog = countOfMoviesPerCatalog;
}
}
Copied!
```
```
@Component
class
MovieRecommender
(
@Value(
"#{{'Thriller': 100, 'Comedy': 300}}"
)
private
val
countOfMoviesPerCatalog: Map<String,
Int
>)
Copied!
```