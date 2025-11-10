# Solutions To Common Problems

Search
⌘ + k
Solutions to Common Problems
This section describes solutions to some common problems.
Using the Wrong Transaction Manager for a Specific
DataSource
Use the correct
PlatformTransactionManager
implementation based on your choice of
transactional technologies and requirements. Used properly, the Spring Framework merely
provides a straightforward and portable abstraction. If you use global
transactions, you must use the
org.springframework.transaction.jta.JtaTransactionManager
class (or an
application server-specific subclass
of
it) for all your transactional operations. Otherwise, the transaction infrastructure
tries to perform local transactions on such resources as container
DataSource
instances. Such local transactions do not make sense, and a good application server
treats them as errors.