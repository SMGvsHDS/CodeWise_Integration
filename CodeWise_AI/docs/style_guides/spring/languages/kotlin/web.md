# Web

Search
⌘ + k
Web
Router DSL
Spring Framework comes with a Kotlin router DSL available in 3 flavors:
WebMvc.fn DSL
with
router { }
WebFlux.fn Reactive DSL
with
router { }
WebFlux.fn Coroutines DSL
with
coRouter { }
These DSL let you write clean and idiomatic Kotlin code to build a
RouterFunction
instance as the following example shows:
```
@Configuration
class
RouterRouterConfiguration
{
@Bean
fun
mainRouter
(userHandler:
UserHandler
)
= router {
accept(TEXT_HTML).nest {
GET(
"/"
) { ok().render(
"index"
) }
GET(
"/sse"
) { ok().render(
"sse"
) }
GET(
"/users"
, userHandler::findAllView)
}
"/api"
.nest {
accept(APPLICATION_JSON).nest {
GET(
"/users"
, userHandler::findAll)
}
accept(TEXT_EVENT_STREAM).nest {
GET(
"/users"
, userHandler::stream)
}
}
resources(
"/**"
, ClassPathResource(
"static/"
))
}
}
Copied!
```
This DSL is programmatic, meaning that it allows custom registration logic of beans
through an
if
expression, a
for
loop, or any other Kotlin constructs. That can be useful
when you need to register routes depending on dynamic data (for example, from a database).
See
MiXiT project
for a concrete example.
MockMvc DSL
A Kotlin DSL is provided via
MockMvc
Kotlin extensions in order to provide a more
idiomatic Kotlin API and to allow better discoverability (no usage of static methods).
```
val
mockMvc: MockMvc = ...
mockMvc.
get
(
"/person/{name}"
,
"Lee"
) {
secure =
true
accept = APPLICATION_JSON
headers {
contentLanguage = Locale.FRANCE
}
principal = Principal {
"foo"
}
}.andExpect {
status { isOk }
content { contentType(APPLICATION_JSON) }
jsonPath(
"$.name"
) { value(
"Lee"
) }
content { json(
"""{"someBoolean": false}"""
,
false
) }
}.andDo {
print()
}
Copied!
```
Kotlin Script Templates
Spring Framework provides a
ScriptTemplateView
which supports
JSR-223
to render templates by using script engines.
By leveraging
scripting-jsr223
dependencies, it
is possible to use such feature to render Kotlin-based templates with
kotlinx.html
DSL or Kotlin multiline interpolated
String
.
build.gradle.kts
```
dependencies {
runtime(
"org.jetbrains.kotlin:kotlin-scripting-jsr223:
${kotlinVersion}
"
)
}
Copied!
```
Configuration is usually done with
ScriptTemplateConfigurer
and
ScriptTemplateViewResolver
beans.
KotlinScriptConfiguration.kt
```
@Configuration
class
KotlinScriptConfiguration
{
@Bean
fun
kotlinScriptConfigurer
()
= ScriptTemplateConfigurer().apply {
engineName =
"kotlin"
setScripts(
"scripts/render.kts"
)
renderFunction =
"render"
isSharedEngine =
false
}
@Bean
fun
kotlinScriptViewResolver
()
= ScriptTemplateViewResolver().apply {
setPrefix(
"templates/"
)
setSuffix(
".kts"
)
}
}
Copied!
```
See the
kotlin-script-templating
example
project for more details.
Kotlin multiplatform serialization
Kotlin multiplatform serialization
is
supported in Spring MVC, Spring WebFlux and Spring Messaging (RSocket). The built-in support currently targets CBOR, JSON, and ProtoBuf formats.
To enable it, follow
those instructions
to add the related dependency and plugin.
With Spring MVC and WebFlux, both Kotlin serialization and Jackson will be configured by default if they are in the classpath since
Kotlin serialization is designed to serialize only Kotlin classes annotated with
@Serializable
.
With Spring Messaging (RSocket), make sure that neither Jackson, GSON or JSONB are in the classpath if you want automatic configuration,
if Jackson is needed configure
KotlinSerializationJsonMessageConverter
manually.