# Ann Modelattrib Methods

Search
⌘ + k
Model
See equivalent in the Reactive stack
You can use the
@ModelAttribute
annotation:
On a
method argument
in
@RequestMapping
methods
to create or access an
Object
from the model and to bind it to the request through a
WebDataBinder
.
As a method-level annotation in
@Controller
or
@ControllerAdvice
classes that help
to initialize the model prior to any
@RequestMapping
method invocation.
On a
@RequestMapping
method to mark its return value is a model attribute.
This section discusses
@ModelAttribute
methods — the second item in the preceding list.
A controller can have any number of
@ModelAttribute
methods. All such methods are
invoked before
@RequestMapping
methods in the same controller. A
@ModelAttribute
method can also be shared across controllers through
@ControllerAdvice
. See the section on
Controller Advice
for more details.
@ModelAttribute
methods have flexible method signatures. They support many of the same
arguments as
@RequestMapping
methods, except for
@ModelAttribute
itself or anything
related to the request body.
The following example shows a
@ModelAttribute
method:
Java
Kotlin
```
@ModelAttribute
public
void
populateModel
(@RequestParam String number, Model model)
{
model.addAttribute(accountRepository.findAccount(number));
// add more ...
}
Copied!
```
```
@ModelAttribute
fun
populateModel
(
@RequestParam
number:
String
, model:
Model
)
{
model.addAttribute(accountRepository.findAccount(number))
// add more ...
}
Copied!
```
The following example adds only one attribute:
Java
Kotlin
```
@ModelAttribute
public
Account
addAccount
(@RequestParam String number)
{
return
accountRepository.findAccount(number);
}
Copied!
```
```
@ModelAttribute
fun
addAccount
(
@RequestParam
number:
String
)
: Account {
return
accountRepository.findAccount(number)
}
Copied!
```
When a name is not explicitly specified, a default name is chosen based on the
Object
type, as explained in the javadoc for
Conventions
.
You can always assign an explicit name by using the overloaded
addAttribute
method or
through the
name
attribute on
@ModelAttribute
(for a return value).
You can also use
@ModelAttribute
as a method-level annotation on
@RequestMapping
methods,
in which case the return value of the
@RequestMapping
method is interpreted as a model
attribute. This is typically not required, as it is the default behavior in HTML controllers,
unless the return value is a
String
that would otherwise be interpreted as a view name.
@ModelAttribute
can also customize the model attribute name, as the following example shows:
Java
Kotlin
```
@GetMapping
(
"/accounts/{id}"
)
@ModelAttribute
(
"myAccount"
)
public
Account
handle
()
{
// ...
return
account;
}
Copied!
```
```
@GetMapping(
"/accounts/{id}"
)
@ModelAttribute(
"myAccount"
)
fun
handle
()
: Account {
// ...
return
account
}
Copied!
```