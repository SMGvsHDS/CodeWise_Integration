# Validation

Search
⌘ + k
Validation
See equivalent in the Reactive stack
By default, if
Bean Validation
is present
on the classpath (for example, Hibernate Validator), the
LocalValidatorFactoryBean
is
registered as a global
Validator
for use with
@Valid
and
@Validated
on controller method arguments.
You can customize the global
Validator
instance, as the
following example shows:
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
Validator
getValidator
()
{
Validator validator =
new
OptionalValidatorFactoryBean();
// ...
return
validator;
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
getValidator
()
: Validator {
val
validator = OptionalValidatorFactoryBean()
// ...
return
validator
}
}
Copied!
```
```
<
mvc:annotation-driven
validator
=
"globalValidator"
/>
Copied!
```
Note that you can also register
Validator
implementations locally, as the following
example shows:
Java
Kotlin
```
@Controller
public
class
MyController
{
@InitBinder
public
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
in order to avoid conflict with the one declared in the MVC configuration.