# Annotation Aftertransaction

Search
⌘ + k
@AfterTransaction
@AfterTransaction
indicates that the annotated
void
method should be run after a
transaction is ended, for test methods that have been configured to run within a
transaction by using Spring’s
@Transactional
annotation.
@AfterTransaction
methods
are not required to be
public
and may be declared on Java 8-based interface default
methods.
Java
Kotlin
```
@AfterTransaction
(
1
)
void
afterTransaction
()
{
// logic to be run after a transaction has ended
}
Copied!
```
1
Run this method after a transaction.
```
@AfterTransaction
(
1
)
fun
afterTransaction
()
{
// logic to be run after a transaction has ended
}
Copied!
```
1
Run this method after a transaction.