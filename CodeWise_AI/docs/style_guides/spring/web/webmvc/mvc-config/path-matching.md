# Path Matching

Search
⌘ + k
Path Matching
See equivalent in the Reactive stack
You can customize options related to path matching and treatment of the URL.
For details on the individual options, see the
PathMatchConfigurer
javadoc.
The following example shows how to customize path matching:
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
configurePathMatch
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
private
PathPatternParser
patternParser
()
{
PathPatternParser pathPatternParser =
new
PathPatternParser();
// ...
return
pathPatternParser;
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
configurePathMatch
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
fun
patternParser
()
: PathPatternParser {
val
pathPatternParser = PathPatternParser()
//...
return
pathPatternParser
}
}
Copied!
```
```
<
mvc:annotation-driven
>
<
mvc:path-matching
path-helper
=
"pathHelper"
path-matcher
=
"pathMatcher"
/>
</
mvc:annotation-driven
>
<
bean
id
=
"pathHelper"
class
=
"org.example.app.MyPathHelper"
/>
<
bean
id
=
"pathMatcher"
class
=
"org.example.app.MyPathMatcher"
/>
Copied!
```