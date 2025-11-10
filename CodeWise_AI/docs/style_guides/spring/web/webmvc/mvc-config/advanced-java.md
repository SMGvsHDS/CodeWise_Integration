# Advanced Java

Search
⌘ + k
Advanced Java Config
See equivalent in the Reactive stack
@EnableWebMvc
imports
DelegatingWebMvcConfiguration
, which:
Provides default Spring configuration for Spring MVC applications
Detects and delegates to
WebMvcConfigurer
implementations to customize that configuration.
For advanced mode, you can remove
@EnableWebMvc
and extend directly from
DelegatingWebMvcConfiguration
instead of implementing
WebMvcConfigurer
,
as the following example shows:
Java
Kotlin
```
@Configuration
public
class
WebConfiguration
extends
DelegatingWebMvcConfiguration
{
// ...
}
Copied!
```
```
@Configuration
class
WebConfiguration
:
DelegatingWebMvcConfiguration
() {
// ...
}
Copied!
```
You can keep existing methods in
WebConfig
, but you can now also override bean declarations
from the base class, and you can still have any number of other
WebMvcConfigurer
implementations on
the classpath.