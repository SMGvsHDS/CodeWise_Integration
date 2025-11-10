# Aspectj Programmatic

Search
⌘ + k
Programmatic Creation of @AspectJ Proxies
In addition to declaring aspects in your configuration by using either
<aop:config>
or
<aop:aspectj-autoproxy>
, it is also possible to programmatically create proxies
that advise target objects. For the full details of Spring’s AOP API, see the
next chapter
. Here, we want to focus on the ability to automatically
create proxies by using @AspectJ aspects.
You can use the
org.springframework.aop.aspectj.annotation.AspectJProxyFactory
class
to create a proxy for a target object that is advised by one or more @AspectJ aspects.
The basic usage for this class is very simple, as the following example shows:
Java
Kotlin
```
// create a factory that can generate a proxy for the given target object
AspectJProxyFactory factory =
new
AspectJProxyFactory(targetObject);
// add an aspect, the class must be an @AspectJ aspect
// you can call this as many times as you need with different aspects
factory.addAspect(SecurityManager
.
class
)
;
// you can also add existing aspect instances, the type of the object supplied
// must be an @AspectJ aspect
factory.addAspect(usageTracker);
// now get the proxy object...
MyInterfaceType proxy = factory.getProxy();
Copied!
```
```
// create a factory that can generate a proxy for the given target object
val
factory = AspectJProxyFactory(targetObject)
// add an aspect, the class must be an @AspectJ aspect
// you can call this as many times as you need with different aspects
factory.addAspect(SecurityManager::
class
.
java
)
// you can also add existing aspect instances, the type of the object supplied
// must be an @AspectJ aspect
factory.addAspect(usageTracker)
// now get the proxy object...
val
proxy = factory.getProxy<Any>()
Copied!
```
See the
javadoc
for more information.