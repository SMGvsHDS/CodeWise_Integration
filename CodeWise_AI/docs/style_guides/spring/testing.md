# Testing

Search
⌘ + k
Testing
This chapter covers Spring’s support for integration testing and best practices for unit
testing. The Spring team advocates test-driven development (TDD). The Spring team has
found that the correct use of inversion of control (IoC) certainly does make both unit
and integration testing easier (in that the presence of setter methods and appropriate
constructors on classes makes them easier to wire together in a test without having to
set up service locator registries and similar structures).
Section Summary
Introduction to Spring Testing
Unit Testing
Integration Testing
JDBC Testing Support
Spring TestContext Framework
WebTestClient
MockMvc
Testing Client Applications
Appendix