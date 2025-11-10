# Setup

Search
⌘ + k
Configuring MockMvc
MockMvc can be setup in one of two ways. One is to point directly to the controllers you
want to test and programmatically configure Spring MVC infrastructure. The second is to
point to Spring configuration with Spring MVC and controller infrastructure in it.
For a comparison of those two modes, check
Setup Options
.
To set up MockMvc for testing a specific controller, use the following:
Java
Kotlin
```
class
MyWebTests
{
MockMvc mockMvc;
@BeforeEach
void
setup
()
{
this
.mockMvc = MockMvcBuilders.standaloneSetup(
new
AccountController()).build();
}
// ...
}
Copied!
```
```
class
MyWebTests
{
lateinit
var
mockMvc : MockMvc
@BeforeEach
fun
setup
()
{
mockMvc = MockMvcBuilders.standaloneSetup(AccountController()).build()
}
// ...
}
Copied!
```
Or you can also use this setup when testing through the
WebTestClient
which delegates to the same builder
as shown above.
To set up MockMvc through Spring configuration, use the following:
Java
Kotlin
```
@SpringJUnitWebConfig
(locations =
"my-servlet-context.xml"
)
class
MyWebTests
{
MockMvc mockMvc;
@BeforeEach
void
setup
(WebApplicationContext wac)
{
this
.mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
}
// ...
}
Copied!
```
```
@SpringJUnitWebConfig(locations = [
"my-servlet-context.xml"
])
class
MyWebTests
{
lateinit
var
mockMvc: MockMvc
@BeforeEach
fun
setup
(wac:
WebApplicationContext
)
{
mockMvc = MockMvcBuilders.webAppContextSetup(wac).build()
}
// ...
}
Copied!
```
Or you can also use this setup when testing through the
WebTestClient
which delegates to the same builder as shown above.