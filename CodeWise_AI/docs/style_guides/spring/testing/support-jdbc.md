# Support Jdbc

Search
⌘ + k
JDBC Testing Support
JdbcTestUtils
The
org.springframework.test.jdbc
package contains
JdbcTestUtils
, which is a
collection of JDBC-related utility functions intended to simplify standard database
testing scenarios. Specifically,
JdbcTestUtils
provides the following static utility
methods.
countRowsInTable(..)
: Counts the number of rows in the given table.
countRowsInTableWhere(..)
: Counts the number of rows in the given table by using the
provided
WHERE
clause.
deleteFromTables(..)
: Deletes all rows from the specified tables.
deleteFromTableWhere(..)
: Deletes rows from the given table by using the provided
WHERE
clause.
dropTables(..)
: Drops the specified tables.
AbstractTransactionalJUnit4SpringContextTests
and
AbstractTransactionalTestNGSpringContextTests
provide convenience methods that delegate to the aforementioned methods in
JdbcTestUtils
.
Embedded Databases
The
spring-jdbc
module provides support for configuring and launching an embedded
database, which you can use in integration tests that interact with a database.
For details, see
Embedded Database Support
and
Testing Data Access
Logic with an Embedded Database
.