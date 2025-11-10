# Setup

Search
⌘ + k
Configuring MockMvcTester
MockMvcTester
can be setup in one of two ways. One is to point directly to the
controllers you want to test and programmatically configure Spring MVC infrastructure.
The second is to point to Spring configuration with Spring MVC and controller
infrastructure in it.
For a comparison of those two modes, check
Setup Options
.
To set up
MockMvcTester
for testing a specific controller, use the following:
Java
Kotlin
```
public
class
AccountControllerStandaloneTests
{
private
final
MockMvcTester mockMvc = MockMvcTester.of(
new
AccountController());
// ...
}
Copied!
```
```
class
AccountControllerStandaloneTests
{
val
mockMvc = MockMvcTester.of(AccountController())
// ...
}
Copied!
```
To set up
MockMvcTester
through Spring configuration, use the following:
Java
Kotlin
```
@SpringJUnitWebConfig
(ApplicationWebConfiguration
.
class
)
class
AccountControllerIntegrationTests
{
private
final
MockMvcTester mockMvc;
AccountControllerIntegrationTests(
@Autowired
WebApplicationContext wac) {
this
.mockMvc = MockMvcTester.from(wac);
}
// ...
}
Copied!
```
```
@SpringJUnitWebConfig(ApplicationWebConfiguration::class)
class
AccountControllerIntegrationTests
(
@Autowired
wac: WebApplicationContext) {
private
val
mockMvc = MockMvcTester.from(wac)
// ...
}
Copied!
```
MockMvcTester
can convert the JSON response body, or the result of a JSONPath expression,
to one of your domain object as long as the relevant
HttpMessageConverter
is registered.
If you use Jackson to serialize content to JSON, the following example registers the
converter:
Java
Kotlin
```
@SpringJUnitWebConfig
(ApplicationWebConfiguration
.
class
)
class
AccountControllerIntegrationTests
{
private
final
MockMvcTester mockMvc;
AccountControllerIntegrationTests(
@Autowired
WebApplicationContext wac) {
this
.mockMvc = MockMvcTester.from(wac).withHttpMessageConverters(
List.of(wac.getBean(AbstractJackson2HttpMessageConverter
.
class
)))
;
}
// ...
}
Copied!
```
```
@SpringJUnitWebConfig(ApplicationWebConfiguration::class)
class
AccountControllerIntegrationTests
(
@Autowired
wac: WebApplicationContext) {
private
val
mockMvc = MockMvcTester.from(wac).withHttpMessageConverters(
listOf(wac.getBean(AbstractJackson2HttpMessageConverter::
class
.
java
)))
// ...
}
Copied!
```
The above assumes the converter has been registered as a Bean.
Finally, if you have a
MockMvc
instance handy, you can create a
MockMvcTester
by
providing the
MockMvc
instance to use using the
create
factory method.