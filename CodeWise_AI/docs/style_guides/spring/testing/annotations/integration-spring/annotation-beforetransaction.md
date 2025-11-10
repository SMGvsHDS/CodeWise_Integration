# Annotation Beforetransaction

Search
⌘ + k
@BeforeTransaction
@BeforeTransaction
indicates that the annotated
void
method should be run before a
transaction is started, for test methods that have been configured to run within a
transaction by using Spring’s
@Transactional
annotation.
@BeforeTransaction
methods
are not required to be
public
and may be declared on Java 8-based interface default
methods.
The following example shows how to use the
@BeforeTransaction
annotation:
Java
Kotlin
```
@BeforeTransaction
(
1
)
void
beforeTransaction
()
{
// logic to be run before a transaction is started
}
Copied!
```
1
Run this method before a transaction.
```
@BeforeTransaction
(
1
)
fun
beforeTransaction
()
{
// logic to be run before a transaction is started
}
Copied!
```
1
Run this method before a transaction.