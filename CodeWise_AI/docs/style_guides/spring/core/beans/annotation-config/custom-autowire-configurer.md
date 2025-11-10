# Custom Autowire Configurer

Search
⌘ + k
Using
CustomAutowireConfigurer
CustomAutowireConfigurer
is a
BeanFactoryPostProcessor
that lets you register your own custom qualifier
annotation types, even if they are not annotated with Spring’s
@Qualifier
annotation.
The following example shows how to use
CustomAutowireConfigurer
:
```
<
bean
id
=
"customAutowireConfigurer"
class
=
"org.springframework.beans.factory.annotation.CustomAutowireConfigurer"
>
<
property
name
=
"customQualifierTypes"
>
<
set
>
<
value
>
example.CustomQualifier
</
value
>
</
set
>
</
property
>
</
bean
>
Copied!
```
The
AutowireCandidateResolver
determines autowire candidates by:
The
autowire-candidate
value of each bean definition
Any
default-autowire-candidates
patterns available on the
<beans/>
element
The presence of
@Qualifier
annotations and any custom annotations registered
with the
CustomAutowireConfigurer
When multiple beans qualify as autowire candidates, the determination of a “primary” is
as follows: If exactly one bean definition among the candidates has a
primary
attribute set to
true
, it is selected.