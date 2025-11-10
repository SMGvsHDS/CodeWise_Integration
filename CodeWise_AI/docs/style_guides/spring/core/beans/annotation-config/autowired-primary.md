# Autowired Primary

Search
⌘ + k
Fine-tuning Annotation-based Autowiring with
@Primary
or
@Fallback
Because autowiring by type may lead to multiple candidates, it is often necessary to have
more control over the selection process. One way to accomplish this is with Spring’s
@Primary
annotation.
@Primary
indicates that a particular bean should be given
preference when multiple beans are candidates to be autowired to a single-valued
dependency. If exactly one primary bean exists among the candidates, it becomes the
autowired value.
Consider the following configuration that defines
firstMovieCatalog
as the
primary
MovieCatalog
:
Java
Kotlin
```
@Configuration
public
class
MovieConfiguration
{
@Bean
@Primary
public
MovieCatalog
firstMovieCatalog
()
{ ... }
@Bean
public
MovieCatalog
secondMovieCatalog
()
{ ... }
// ...
}
Copied!
```
```
@Configuration
class
MovieConfiguration
{
@Bean
@Primary
fun
firstMovieCatalog
()
: MovieCatalog { ... }
@Bean
fun
secondMovieCatalog
()
: MovieCatalog { ... }
// ...
}
Copied!
```
Alternatively, as of 6.2, there is a
@Fallback
annotation for demarcating
any beans other than the regular ones to be injected. If only one regular
bean is left, it is effectively primary as well:
Java
Kotlin
```
@Configuration
public
class
MovieConfiguration
{
@Bean
public
MovieCatalog
firstMovieCatalog
()
{ ... }
@Bean
@Fallback
public
MovieCatalog
secondMovieCatalog
()
{ ... }
// ...
}
Copied!
```
```
@Configuration
class
MovieConfiguration
{
@Bean
fun
firstMovieCatalog
()
: MovieCatalog { ... }
@Bean
@Fallback
fun
secondMovieCatalog
()
: MovieCatalog { ... }
// ...
}
Copied!
```
With both variants of the preceding configuration, the following
MovieRecommender
is autowired with the
firstMovieCatalog
:
Java
Kotlin
```
public
class
MovieRecommender
{
@Autowired
private
MovieCatalog movieCatalog;
// ...
}
Copied!
```
```
class
MovieRecommender
{
@Autowired
private
lateinit
var
movieCatalog: MovieCatalog
// ...
}
Copied!
```
The corresponding bean definitions follow:
```
<?xml version="1.0" encoding="UTF-8"?>
<
beans
xmlns
=
"http://www.springframework.org/schema/beans"
xmlns:xsi
=
"http://www.w3.org/2001/XMLSchema-instance"
xmlns:context
=
"http://www.springframework.org/schema/context"
xsi:schemaLocation
=
"http://www.springframework.org/schema/beans
https://www.springframework.org/schema/beans/spring-beans.xsd
http://www.springframework.org/schema/context
https://www.springframework.org/schema/context/spring-context.xsd"
>
<
context:annotation-config
/>
<
bean
class
=
"example.SimpleMovieCatalog"
primary
=
"true"
>
<!-- inject any dependencies required by this bean -->
</
bean
>
<
bean
class
=
"example.SimpleMovieCatalog"
>
<!-- inject any dependencies required by this bean -->
</
bean
>
<
bean
id
=
"movieRecommender"
class
=
"example.MovieRecommender"
/>
</
beans
>
Copied!
```