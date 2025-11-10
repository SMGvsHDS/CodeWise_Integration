# Jca Message Endpoint Manager

Search
⌘ + k
Support for JCA Message Endpoints
Beginning with version 2.5, Spring also provides support for a JCA-based
MessageListener
container. The
JmsMessageEndpointManager
tries to
automatically determine the
ActivationSpec
class name from the provider’s
ResourceAdapter
class name. Therefore, it is typically possible to provide
Spring’s generic
JmsActivationSpecConfig
, as the following example shows:
Java
Kotlin
Xml
```
@Bean
public
JmsMessageEndpointManager
jmsMessageEndpointManager
(ResourceAdapter resourceAdapter,
MessageListener myMessageListener)
{
JmsActivationSpecConfig specConfig =
new
JmsActivationSpecConfig();
specConfig.setDestinationName(
"myQueue"
);
JmsMessageEndpointManager endpointManager =
new
JmsMessageEndpointManager();
endpointManager.setResourceAdapter(resourceAdapter);
endpointManager.setActivationSpecConfig(specConfig);
endpointManager.setMessageListener(myMessageListener);
return
endpointManager;
}
Copied!
```
```
@Bean
fun
jmsMessageEndpointManager
(
resourceAdapter:
ResourceAdapter
, myMessageListener:
MessageListener
)
= JmsMessageEndpointManager().apply {
setResourceAdapter(resourceAdapter)
activationSpecConfig = JmsActivationSpecConfig().apply {
destinationName =
"myQueue"
}
messageListener = myMessageListener
}
Copied!
```
```
<
bean
class
=
"org.springframework.jms.listener.endpoint.JmsMessageEndpointManager"
>
<
property
name
=
"resourceAdapter"
ref
=
"resourceAdapter"
/>
<
property
name
=
"activationSpecConfig"
>
<
bean
class
=
"org.springframework.jms.listener.endpoint.JmsActivationSpecConfig"
>
<
property
name
=
"destinationName"
value
=
"myQueue"
/>
</
bean
>
</
property
>
<
property
name
=
"messageListener"
ref
=
"myMessageListener"
/>
</
bean
>
Copied!
```
Alternatively, you can set up a
JmsMessageEndpointManager
with a given
ActivationSpec
object. The
ActivationSpec
object may also come from a JNDI lookup
(using
<jee:jndi-lookup>
). The following example shows how to do so:
Java
Kotlin
Xml
```
@Bean
JmsMessageEndpointManager
jmsMessageEndpointManager
(ResourceAdapter resourceAdapter,
MessageListener myMessageListener)
{
ActiveMQActivationSpec spec =
new
ActiveMQActivationSpec();
spec.setDestination(
"myQueue"
);
spec.setDestinationType(
"jakarta.jms.Queue"
);
JmsMessageEndpointManager endpointManager =
new
JmsMessageEndpointManager();
endpointManager.setResourceAdapter(resourceAdapter);
endpointManager.setActivationSpec(spec);
endpointManager.setMessageListener(myMessageListener);
return
endpointManager;
}
Copied!
```
```
@Bean
fun
jmsMessageEndpointManager
(
resourceAdapter:
ResourceAdapter
, myMessageListener:
MessageListener
)
= JmsMessageEndpointManager().apply {
setResourceAdapter(resourceAdapter)
activationSpec = ActiveMQActivationSpec().apply {
destination =
"myQueue"
destinationType =
"jakarta.jms.Queue"
}
messageListener = myMessageListener
}
Copied!
```
```
<
bean
class
=
"org.springframework.jms.listener.endpoint.JmsMessageEndpointManager"
>
<
property
name
=
"resourceAdapter"
ref
=
"resourceAdapter"
/>
<
property
name
=
"activationSpec"
>
<
bean
class
=
"org.apache.activemq.ra.ActiveMQActivationSpec"
>
<
property
name
=
"destination"
value
=
"myQueue"
/>
<
property
name
=
"destinationType"
value
=
"jakarta.jms.Queue"
/>
</
bean
>
</
property
>
<
property
name
=
"messageListener"
ref
=
"myMessageListener"
/>
</
bean
>
Copied!
```
See the javadoc for
JmsMessageEndpointManager
,
JmsActivationSpecConfig
,
and
ResourceAdapterFactoryBean
for more details.
Spring also provides a generic JCA message endpoint manager that is not tied to JMS:
org.springframework.jca.endpoint.GenericMessageEndpointManager
. This component allows
for using any message listener type (such as a JMS
MessageListener
) and any
provider-specific
ActivationSpec
object. See your JCA provider’s documentation to
find out about the actual capabilities of your connector, and see the
GenericMessageEndpointManager
javadoc for the Spring-specific configuration details.
JCA-based message endpoint management is very analogous to EJB 2.1 Message-Driven Beans.
It uses the same underlying resource provider contract. As with EJB 2.1 MDBs, you can use any
message listener interface supported by your JCA provider in the Spring context as well.
Spring nevertheless provides explicit “convenience” support for JMS, because JMS is the
most common endpoint API used with the JCA endpoint management contract.