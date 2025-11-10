# Annotation Config

Search
⌘ + k
Annotation-based Container Configuration
Spring provides comprehensive support for annotation-based configuration, operating on
metadata in the component class itself by using annotations on the relevant class,
method, or field declaration. As mentioned in
Example: The
AutowiredAnnotationBeanPostProcessor
,
Spring uses
BeanPostProcessors
in conjunction with annotations to make the core IOC
container aware of specific annotations.
For example, the
@Autowired
annotation provides the same capabilities as described in
Autowiring Collaborators
but
with more fine-grained control and wider applicability. In addition, Spring provides
support for JSR-250 annotations, such as
@PostConstruct
and
@PreDestroy
, as well as
support for JSR-330 (Dependency Injection for Java) annotations contained in the
jakarta.inject
package such as
@Inject
and
@Named
. Details about those annotations
can be found in the
relevant section
.
Annotation injection is performed before external property injection. Thus, external
configuration (for example, XML-specified bean properties) effectively overrides the annotations
for properties when wired through mixed approaches.
Technically, you can register the post-processors as individual bean definitions, but they
are implicitly registered in an
AnnotationConfigApplicationContext
already.
In an XML-based Spring setup, you may include the following configuration tag to enable
mixing and matching with annotation-based configuration:
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
</
beans
>
Copied!
```
The
<context:annotation-config/>
element implicitly registers the following post-processors:
ConfigurationClassPostProcessor
AutowiredAnnotationBeanPostProcessor
CommonAnnotationBeanPostProcessor
PersistenceAnnotationBeanPostProcessor
EventListenerMethodProcessor
<context:annotation-config/>
only looks for annotations on beans in the same
application context in which it is defined. This means that, if you put
<context:annotation-config/>
in a
WebApplicationContext
for a
DispatcherServlet
,
it only checks for
@Autowired
beans in your controllers, and not your services. See
The DispatcherServlet
for more information.