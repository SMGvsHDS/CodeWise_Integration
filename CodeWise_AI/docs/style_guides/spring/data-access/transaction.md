# Transaction

Search
⌘ + k
Transaction Management
Comprehensive transaction support is among the most compelling reasons to use the Spring
Framework. The Spring Framework provides a consistent abstraction for transaction
management that delivers the following benefits:
A consistent programming model across different transaction APIs, such as Java
Transaction API (JTA), JDBC, Hibernate, and the Java Persistence API (JPA).
Support for
declarative transaction management
.
A simpler API for
programmatic
transaction management
than complex transaction APIs, such as JTA.
Excellent integration with Spring’s data access abstractions.
The following sections describe the Spring Framework’s transaction features and technologies:
Advantages of the Spring Framework’s transaction support model
describes why you would use the Spring Framework’s transaction abstraction instead of EJB
Container-Managed Transactions (CMT) or choosing to drive transactions through a proprietary API.
Understanding the Spring Framework transaction abstraction
outlines the core classes and describes how to configure and obtain
DataSource
instances
from a variety of sources.
Synchronizing resources with transactions
describes how the application code ensures that resources are created, reused, and cleaned up properly.
Declarative transaction management
describes support for
declarative transaction management.
Programmatic transaction management
covers support for
programmatic (that is, explicitly coded) transaction management.
Transaction bound event
describes how you could use application
events within a transaction.
The chapter also includes discussions of best practices,
application server integration
,
and
solutions to common problems
.