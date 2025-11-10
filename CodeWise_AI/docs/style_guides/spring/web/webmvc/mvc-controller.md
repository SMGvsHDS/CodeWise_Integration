# Mvc Controller

Search
⌘ + k
Annotated Controllers
See equivalent in the Reactive stack
Spring MVC provides an annotation-based programming model where
@Controller
and
@RestController
components use annotations to express request mappings, request input,
exception handling, and more. Annotated controllers have flexible method signatures and
do not have to extend base classes nor implement specific interfaces.
The following example shows a controller defined by annotations:
Java
Kotlin
```
@Controller
public
class
HelloController
{
@GetMapping
(
"/hello"
)
public
String
handle
(Model model)
{
model.addAttribute(
"message"
,
"Hello World!"
);
return
"index"
;
}
}
Copied!
```
```
import
org.springframework.ui.
set
@Controller
class
HelloController
{
@GetMapping(
"/hello"
)
fun
handle
(model:
Model
)
: String {
model[
"message"
] =
"Hello World!"
return
"index"
}
}
Copied!
```
In the preceding example, the method accepts a
Model
and returns a view name as a
String
,
but many other options exist and are explained later in this chapter.
Guides and tutorials on
spring.io
use the annotation-based
programming model described in this section.