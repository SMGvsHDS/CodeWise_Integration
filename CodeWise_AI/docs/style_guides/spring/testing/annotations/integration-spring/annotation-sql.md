# Annotation Sql

Search
⌘ + k
@Sql
@Sql
is used to annotate a test class or test method to configure SQL scripts to be run
against a given database during integration tests. The following example shows how to use
it:
Java
Kotlin
```
@Test
@Sql
({
"/test-schema.sql"
,
"/test-user-data.sql"
})
(
1
)
void
userTest
()
{
// run code that relies on the test schema and test data
}
Copied!
```
1
Run two scripts for this test.
```
@Test
@Sql(
"/test-schema.sql"
,
"/test-user-data.sql"
)
(
1
)
fun
userTest
()
{
// run code that relies on the test schema and test data
}
Copied!
```
1
Run two scripts for this test.
See
Executing SQL scripts declaratively with @Sql
for further details.