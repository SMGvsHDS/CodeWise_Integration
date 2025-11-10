# Collection Selection

Search
⌘ + k
Collection Selection
Selection is a powerful expression language feature that lets you transform a
source collection into another collection by selecting from its entries.
Selection uses a syntax of
.?[selectionExpression]
. It filters the collection and
returns a new collection that contains a subset of the original elements. For example,
selection lets us easily get a list of Serbian inventors, as the following example shows:
Java
Kotlin
```
List<Inventor> list = (List<Inventor>) parser.parseExpression(
"members.?[nationality == 'Serbian']"
).getValue(societyContext);
Copied!
```
```
val
list = parser.parseExpression(
"members.?[nationality == 'Serbian']"
).getValue(societyContext)
as
List<Inventor>
Copied!
```
Selection is supported for arrays and anything that implements
java.lang.Iterable
or
java.util.Map
. For an array or
Iterable
, the selection expression is evaluated
against each individual element. Against a map, the selection expression is evaluated
against each map entry (objects of the Java type
Map.Entry
). Each map entry has its
key
and
value
accessible as properties for use in the selection.
Given a
Map
stored in a variable named
#map
, the following expression returns a new
map that consists of those elements of the original map where the entry’s value is less
than 27:
Java
Kotlin
```
Map newMap = parser.parseExpression(
"#map.?[value < 27]"
).getValue(Map
.
class
)
;
Copied!
```
```
val
newMap = parser.parseExpression(
"#map.?[value < 27]"
).getValue()
as
Map
Copied!
```
In addition to returning all the selected elements, you can retrieve only the first or
the last element. To obtain the first element matching the selection expression, the
syntax is
.^[selectionExpression]
. To obtain the last element matching the selection
expression, the syntax is
.$[selectionExpression]
.
The Spring Expression Language also supports safe navigation for collection selection.
See
Safe Collection Selection and Projection
for details.