# Client Testing

Search
⌘ + k
Testing
To test code that uses the
WebClient
, you can use a mock web server, such as
OkHttp MockWebServer
or
WireMock
. Mock web servers accept requests over HTTP like a regular
server, and that means you can test with the same HTTP client that is also configured in
the same way as in production, which is important because there are often subtle
differences in the way different clients handle network I/O. Another advantage of mock
web servers is the ability to simulate specific network issues and conditions at the
transport level, in combination with the client used in production.
For example use of MockWebServer, see
WebClientIntegrationTests
in the Spring Framework test suite or the
static-server
sample in the OkHttp repository.