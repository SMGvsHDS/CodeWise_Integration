# Annotation Sqlconfig

Search
⌘ + k
@SqlConfig
@SqlConfig
defines metadata that is used to determine how to parse and run SQL scripts
configured with the
@Sql
annotation. The following example shows how to use it:
Java
Kotlin
```
@Test
@Sql
(
scripts =
"/test-user-data.sql"
,
config =
@SqlConfig
(commentPrefix =
"`"
, separator =
"@@"
)
(
1
)
)
void
userTest
()
{
// run code that relies on the test data
}
Copied!
```
1
Set the comment prefix and the separator in SQL scripts.
```
@Test
@Sql(
"/test-user-data.sql"
, config = SqlConfig(commentPrefix =
"`"
, separator =
"@@"
)
)
(
1
)
fun
userTest
()
{
// run code that relies on the test data
}
Copied!
```
1
Set the comment prefix and the separator in SQL scripts.