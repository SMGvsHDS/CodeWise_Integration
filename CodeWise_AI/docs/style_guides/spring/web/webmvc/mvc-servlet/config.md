# Config

Search
⌘ + k
Web MVC Config
See equivalent in the Reactive stack
Applications can declare the infrastructure beans listed in
Special Bean Types
that are required to process requests. The
DispatcherServlet
checks the
WebApplicationContext
for each special bean. If there are no matching bean types,
it falls back on the default types listed in
DispatcherServlet.properties
.
In most cases, the
MVC Config
is the best starting point. It declares the required
beans in either Java or XML and provides a higher-level configuration callback API to
customize it.
Spring Boot relies on the MVC Java configuration to configure Spring MVC and
provides many extra convenient options.