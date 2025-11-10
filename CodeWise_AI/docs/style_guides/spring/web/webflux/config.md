# Config

Search
⌘ + k
WebFlux Config
See equivalent in the Servlet stack
The WebFlux Java configuration declares the components that are required to process
requests with annotated controllers or functional endpoints, and it offers an API to
customize the configuration. That means you do not need to understand the underlying
beans created by the Java configuration. However, if you want to understand them,
you can see them in
WebFluxConfigurationSupport
or read more about what they are
in
Special Bean Types
.
For more advanced customizations, not available in the configuration API, you can
gain full control over the configuration through the
Advanced Configuration Mode
.
Enabling WebFlux Config
See equivalent in the Servlet stack
You can use the
@EnableWebFlux
annotation in your Java config, as the following example shows:
Java
Kotlin
```
@Configuration
@EnableWebFlux
public
class
WebConfig
{
}
Copied!
```
```
@Configuration
@EnableWebFlux
class
WebConfig
Copied!
```
When using Spring Boot, you may want to use
@Configuration
classes of type
WebFluxConfigurer
but without
@EnableWebFlux
to keep Spring Boot WebFlux customizations. See more details in
the WebFlux config API section
and in
the dedicated Spring Boot documentation
.
The preceding example registers a number of Spring WebFlux
infrastructure beans
and adapts to dependencies
available on the classpath — for JSON, XML, and others.
WebFlux config API
See equivalent in the Servlet stack
In your Java configuration, you can implement the
WebFluxConfigurer
interface,
as the following example shows:
Java
Kotlin
```
@Configuration
public
class
WebConfig
implements
WebFluxConfigurer
{
// Implement configuration methods...
}
Copied!
```
```
@Configuration
class
WebConfig
:
WebFluxConfigurer {
// Implement configuration methods...
}
Copied!
```
Conversion, formatting
See equivalent in the Servlet stack
By default, formatters for various number and date types are installed, along with support
for customization via
@NumberFormat
,
@DurationFormat
, and
@DateTimeFormat
on fields
and parameters.
To register custom formatters and converters in Java config, use the following:
Java
Kotlin
```
@Configuration
public
class
WebConfig
implements
WebFluxConfigurer
{
@Override
public
void
addFormatters
(FormatterRegistry registry)
{
// ...
}
}
Copied!
```
```
@Configuration
class
WebConfig
:
WebFluxConfigurer {
override
fun
addFormatters
(registry:
FormatterRegistry
)
{
// ...
}
}
Copied!
```
By default Spring WebFlux considers the request Locale when parsing and formatting date
values. This works for forms where dates are represented as Strings with "input" form
fields. For "date" and "time" form fields, however, browsers use a fixed format defined
in the HTML spec. For such cases date and time formatting can be customized as follows:
Java
Kotlin
```
@Configuration
public
class
WebConfig
implements
WebFluxConfigurer
{
@Override
public
void
addFormatters
(FormatterRegistry registry)
{
DateTimeFormatterRegistrar registrar =
new
DateTimeFormatterRegistrar();
registrar.setUseIsoFormat(
true
);
registrar.registerFormatters(registry);
}
}
Copied!
```
```
@Configuration
class
WebConfig
:
WebFluxConfigurer {
override
fun
addFormatters
(registry:
FormatterRegistry
)
{
val
registrar = DateTimeFormatterRegistrar()
registrar.setUseIsoFormat(
true
)
registrar.registerFormatters(registry)
}
}
Copied!
```
See
FormatterRegistrar
SPI
and the
FormattingConversionServiceFactoryBean
for more information on when to
use
FormatterRegistrar
implementations.
Validation
See equivalent in the Servlet stack
By default, if
Bean Validation
is present
on the classpath (for example, the Hibernate Validator), the
LocalValidatorFactoryBean
is registered as a global
validator
for use with
@Valid
and
@Validated
on
@Controller
method arguments.
In your Java configuration, you can customize the global
Validator
instance,
as the following example shows:
Java
Kotlin
```
@Configuration
public
class
WebConfig
implements
WebFluxConfigurer
{
@Override
public
Validator
getValidator
()
{
// ...
}
}
Copied!
```
```
@Configuration
class
WebConfig
:
WebFluxConfigurer {
override
fun
getValidator
()
: Validator {
// ...
}
}
Copied!
```
Note that you can also register
Validator
implementations locally,
as the following example shows:
Java
Kotlin
```
@Controller
public
class
MyController
{
@InitBinder
protected
void
initBinder
(WebDataBinder binder)
{
binder.addValidators(
new
FooValidator());
}
}
Copied!
```
```
@Controller
class
MyController
{
@InitBinder
protected
fun
initBinder
(binder:
WebDataBinder
)
{
binder.addValidators(FooValidator())
}
}
Copied!
```
If you need to have a
LocalValidatorFactoryBean
injected somewhere, create a bean and
mark it with
@Primary
in order to avoid conflict with the one declared in the MVC config.
Content Type Resolvers
See equivalent in the Servlet stack
You can configure how Spring WebFlux determines the requested media types for
@Controller
instances from the request. By default, only the
Accept
header is checked,
but you can also enable a query parameter-based strategy.
The following example shows how to customize the requested content type resolution:
Java
Kotlin
```
@Configuration
public
class
WebConfig
implements
WebFluxConfigurer
{
@Override
public
void
configureContentTypeResolver
(RequestedContentTypeResolverBuilder builder)
{
// ...
}
}
Copied!
```
```
@Configuration
class
WebConfig
:
WebFluxConfigurer {
override
fun
configureContentTypeResolver
(builder:
RequestedContentTypeResolverBuilder
)
{
// ...
}
}
Copied!
```
HTTP message codecs
See equivalent in the Servlet stack
The following example shows how to customize how the request and response body are read and written:
Java
Kotlin
```
@Configuration
public
class
WebConfig
implements
WebFluxConfigurer
{
@Override
public
void
configureHttpMessageCodecs
(ServerCodecConfigurer configurer)
{
configurer.defaultCodecs().maxInMemorySize(
512
*
1024
);
}
}
Copied!
```
```
@Configuration
class
WebConfig
:
WebFluxConfigurer {
override
fun
configureHttpMessageCodecs
(configurer:
ServerCodecConfigurer
)
{
configurer.defaultCodecs().maxInMemorySize(
512
*
1024
)
}
}
Copied!
```
ServerCodecConfigurer
provides a set of default readers and writers. You can use it to add
more readers and writers, customize the default ones, or replace the default ones completely.
For Jackson JSON and XML, consider using
Jackson2ObjectMapperBuilder
,
which customizes Jackson’s default properties with the following ones:
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
View Resolvers
See equivalent in the Servlet stack
The following example shows how to configure view resolution:
Java
Kotlin
```
@Configuration
public
class
WebConfig
implements
WebFluxConfigurer
{
@Override
public
void
configureViewResolvers
(ViewResolverRegistry registry)
{
// ...
}
}
Copied!
```
```
@Configuration
class
WebConfig
:
WebFluxConfigurer {
override
fun
configureViewResolvers
(registry:
ViewResolverRegistry
)
{
// ...
}
}
Copied!
```
The
ViewResolverRegistry
has shortcuts for view technologies with which the Spring Framework
integrates. The following example uses FreeMarker (which also requires configuring the
underlying FreeMarker view technology):
Java
Kotlin
```
@Configuration
public
class
WebConfig
implements
WebFluxConfigurer
{
@Override
public
void
configureViewResolvers
(ViewResolverRegistry registry)
{
registry.freeMarker();
}
// Configure Freemarker...
@Bean
public
FreeMarkerConfigurer
freeMarkerConfigurer
()
{
FreeMarkerConfigurer configurer =
new
FreeMarkerConfigurer();
configurer.setTemplateLoaderPath(
"classpath:/templates"
);
return
configurer;
}
}
Copied!
```
```
@Configuration
class
WebConfig
:
WebFluxConfigurer {
override
fun
configureViewResolvers
(registry:
ViewResolverRegistry
)
{
registry.freeMarker()
}
// Configure Freemarker...
@Bean
fun
freeMarkerConfigurer
()
= FreeMarkerConfigurer().apply {
setTemplateLoaderPath(
"classpath:/templates"
)
}
}
Copied!
```
You can also plug in any
ViewResolver
implementation, as the following example shows:
Java
Kotlin
```
@Configuration
public
class
WebConfig
implements
WebFluxConfigurer
{
@Override
public
void
configureViewResolvers
(ViewResolverRegistry registry)
{
ViewResolver resolver = ... ;
registry.viewResolver(resolver);
}
}
Copied!
```
```
@Configuration
class
WebConfig
:
WebFluxConfigurer {
override
fun
configureViewResolvers
(registry:
ViewResolverRegistry
)
{
val
resolver: ViewResolver = ...
registry.viewResolver(resolver
}
}
Copied!
```
To support
Content Negotiation
and rendering other formats
through view resolution (besides HTML), you can configure one or more default views based
on the
HttpMessageWriterView
implementation, which accepts any of the available
Codecs
from
spring-web
. The following example shows how to do so:
Java
Kotlin
```
@Configuration
public
class
WebConfig
implements
WebFluxConfigurer
{
@Override
public
void
configureViewResolvers
(ViewResolverRegistry registry)
{
registry.freeMarker();
Jackson2JsonEncoder encoder =
new
Jackson2JsonEncoder();
registry.defaultViews(
new
HttpMessageWriterView(encoder));
}
// ...
}
Copied!
```
```
@Configuration
class
WebConfig
:
WebFluxConfigurer {
override
fun
configureViewResolvers
(registry:
ViewResolverRegistry
)
{
registry.freeMarker()
val
encoder = Jackson2JsonEncoder()
registry.defaultViews(HttpMessageWriterView(encoder))
}
// ...
}
Copied!
```
See
View Technologies
for more on the view technologies that are integrated with Spring WebFlux.
Static Resources
See equivalent in the Servlet stack
This option provides a convenient way to serve static resources from a list of
Resource
-based locations.
In the next example, given a request that starts with
/resources
, the relative path is
used to find and serve static resources relative to
/static
on the classpath. Resources
are served with a one-year future expiration to ensure maximum use of the browser cache
and a reduction in HTTP requests made by the browser. The
Last-Modified
header is also
evaluated and, if present, a
304
status code is returned. The following listing shows
the example:
Java
Kotlin
```
@Configuration
public
class
WebConfig
implements
WebFluxConfigurer
{
@Override
public
void
addResourceHandlers
(ResourceHandlerRegistry registry)
{
registry.addResourceHandler(
"/resources/**"
)
.addResourceLocations(
"/public"
,
"classpath:/static/"
)
.setCacheControl(CacheControl.maxAge(
365
, TimeUnit.DAYS));
}
}
Copied!
```
```
@Configuration
class
WebConfig
:
WebFluxConfigurer {
override
fun
addResourceHandlers
(registry:
ResourceHandlerRegistry
)
{
registry.addResourceHandler(
"/resources/**"
)
.addResourceLocations(
"/public"
,
"classpath:/static/"
)
.setCacheControl(CacheControl.maxAge(
365
, TimeUnit.DAYS))
}
}
Copied!
```
See also
HTTP caching support for static resources
.
The resource handler also supports a chain of
ResourceResolver
implementations and
ResourceTransformer
implementations,
which can be used to create a toolchain for working with optimized resources.
You can use the
VersionResourceResolver
for versioned resource URLs based on an MD5 hash
computed from the content, a fixed application version, or other information. A
ContentVersionStrategy
(MD5 hash) is a good choice with some notable exceptions (such as
JavaScript resources used with a module loader).
The following example shows how to use
VersionResourceResolver
in your Java configuration:
Java
Kotlin
```
@Configuration
public
class
WebConfig
implements
WebFluxConfigurer
{
@Override
public
void
addResourceHandlers
(ResourceHandlerRegistry registry)
{
registry.addResourceHandler(
"/resources/**"
)
.addResourceLocations(
"/public/"
)
.resourceChain(
true
)
.addResolver(
new
VersionResourceResolver().addContentVersionStrategy(
"/**"
));
}
}
Copied!
```
```
@Configuration
class
WebConfig
:
WebFluxConfigurer {
override
fun
addResourceHandlers
(registry:
ResourceHandlerRegistry
)
{
registry.addResourceHandler(
"/resources/**"
)
.addResourceLocations(
"/public/"
)
.resourceChain(
true
)
.addResolver(VersionResourceResolver().addContentVersionStrategy(
"/**"
))
}
}
Copied!
```
You can use
ResourceUrlProvider
to rewrite URLs and apply the full chain of resolvers and
transformers (for example, to insert versions). The WebFlux configuration provides a
ResourceUrlProvider
so that it can be injected into others.
Unlike Spring MVC, at present, in WebFlux, there is no way to transparently rewrite static
resource URLs, since there are no view technologies that can make use of a non-blocking chain
of resolvers and transformers. When serving only local resources, the workaround is to use
ResourceUrlProvider
directly (for example, through a custom element) and block.
Note that, when using both
EncodedResourceResolver
(for example, Gzip, Brotli encoded) and
VersionedResourceResolver
, they must be registered in that order, to ensure content-based
versions are always computed reliably based on the unencoded file.
For
WebJars
, versioned URLs like
/webjars/jquery/1.2.0/jquery.min.js
are the recommended and most efficient way to use them.
The related resource location is configured out of the box with Spring Boot (or can be configured
manually via
ResourceHandlerRegistry
) and does not require to add the
org.webjars:webjars-locator-core
dependency.
Version-less URLs like
/webjars/jquery/jquery.min.js
are supported through the
WebJarsResourceResolver
which is automatically registered when the
org.webjars:webjars-locator-core
library is present on the classpath, at the cost of a
classpath scanning that could slow down application startup. The resolver can re-write URLs to
include the version of the jar and can also match against incoming URLs without versions — for example, from
/webjars/jquery/jquery.min.js
to
/webjars/jquery/1.2.0/jquery.min.js
.
The Java configuration based on
ResourceHandlerRegistry
provides further options
for fine-grained control, for example, last-modified behavior and optimized resource resolution.
Path Matching
See equivalent in the Servlet stack
You can customize options related to path matching. For details on the individual options, see the
PathMatchConfigurer
javadoc.
The following example shows how to use
PathMatchConfigurer
:
Java
Kotlin
```
import
org.springframework.context.annotation.Configuration;
import
org.springframework.web.bind.annotation.RestController;
import
org.springframework.web.method.HandlerTypePredicate;
import
org.springframework.web.reactive.config.PathMatchConfigurer;
import
org.springframework.web.reactive.config.WebFluxConfigurer;
@Configuration
public
class
WebConfig
implements
WebFluxConfigurer
{
@Override
public
void
configurePathMatching
(PathMatchConfigurer configurer)
{
configurer.addPathPrefix(
"/api"
, HandlerTypePredicate.forAnnotation(RestController
.
class
))
;
}
}
Copied!
```
```
import
org.springframework.context.
annotation
.Configuration
import
org.springframework.web.bind.
annotation
.RestController
import
org.springframework.web.method.HandlerTypePredicate
import
org.springframework.web.reactive.config.PathMatchConfigurer
import
org.springframework.web.reactive.config.WebFluxConfigurer
@Configuration
class
WebConfig
:
WebFluxConfigurer {
override
fun
configurePathMatching
(configurer:
PathMatchConfigurer
)
{
configurer.addPathPrefix(
"/api"
, HandlerTypePredicate.forAnnotation(RestController::
class
.
java
))
}
}
Copied!
```
Spring WebFlux relies on a parsed representation of the request path called
RequestPath
for access to decoded path segment values, with semicolon content removed
(that is, path or matrix variables). That means, unlike in Spring MVC, you need not indicate
whether to decode the request path nor whether to remove semicolon content for
path matching purposes.
Spring WebFlux also does not support suffix pattern matching, unlike in Spring MVC, where we
are also
recommend
moving away from
reliance on it.
Blocking Execution
The WebFlux Java config allows you to customize blocking execution in WebFlux.
You can have blocking controller methods called on a separate thread by providing
an
AsyncTaskExecutor
such as the
VirtualThreadTaskExecutor
as follows:
Java
Kotlin
```
@Configuration
public
class
WebConfig
implements
WebFluxConfigurer
{
@Override
public
void
configureBlockingExecution
(BlockingExecutionConfigurer configurer)
{
AsyncTaskExecutor executor = ...
configurer.setExecutor(executor);
}
}
Copied!
```
```
@Configuration
class
WebConfig
:
WebFluxConfigurer {
@Override
fun
configureBlockingExecution
(configurer:
BlockingExecutionConfigurer
)
{
val
executor = ...
configurer.setExecutor(executor)
}
}
Copied!
```
By default, controller methods whose return type is not recognized by the configured
ReactiveAdapterRegistry
are considered blocking, but you can set a custom controller
method predicate via
BlockingExecutionConfigurer
.
WebSocketService
The WebFlux Java config declares of a
WebSocketHandlerAdapter
bean which provides
support for the invocation of WebSocket handlers. That means all that remains to do in
order to handle a WebSocket handshake request is to map a
WebSocketHandler
to a URL
via
SimpleUrlHandlerMapping
.
In some cases it may be necessary to create the
WebSocketHandlerAdapter
bean with a
provided
WebSocketService
service which allows configuring WebSocket server properties.
For example:
Java
Kotlin
```
@Configuration
public
class
WebConfig
implements
WebFluxConfigurer
{
@Override
public
WebSocketService
getWebSocketService
()
{
TomcatRequestUpgradeStrategy strategy =
new
TomcatRequestUpgradeStrategy();
strategy.setMaxSessionIdleTimeout(
0L
);
return
new
HandshakeWebSocketService(strategy);
}
}
Copied!
```
```
@Configuration
class
WebConfig
:
WebFluxConfigurer {
@Override
fun
webSocketService
()
: WebSocketService {
val
strategy = TomcatRequestUpgradeStrategy().apply {
setMaxSessionIdleTimeout(
0L
)
}
return
HandshakeWebSocketService(strategy)
}
}
Copied!
```
Advanced Configuration Mode
See equivalent in the Servlet stack
@EnableWebFlux
imports
DelegatingWebFluxConfiguration
that:
Provides default Spring configuration for WebFlux applications
detects and delegates to
WebFluxConfigurer
implementations to customize that configuration.
For advanced mode, you can remove
@EnableWebFlux
and extend directly from
DelegatingWebFluxConfiguration
instead of implementing
WebFluxConfigurer
,
as the following example shows:
Java
Kotlin
```
@Configuration
public
class
WebConfig
extends
DelegatingWebFluxConfiguration
{
// ...
}
Copied!
```
```
@Configuration
class
WebConfig
:
DelegatingWebFluxConfiguration {
// ...
}
Copied!
```
You can keep existing methods in
WebConfig
, but you can now also override bean declarations
from the base class and still have any number of other
WebMvcConfigurer
implementations on
the classpath.