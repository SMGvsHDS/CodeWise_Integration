# Ann Modelattrib Methods

Search
⌘ + k
Model
See equivalent in the Servlet stack
You can use the
@ModelAttribute
annotation:
On a
method argument
in
@RequestMapping
methods to create or access an Object from the model and to bind it
to the request through a
WebDataBinder
.
As a method-level annotation in
@Controller
or
@ControllerAdvice
classes, helping
to initialize the model prior to any
@RequestMapping
method invocation.
On a
@RequestMapping
method to mark its return value as a model attribute.
This section discusses
@ModelAttribute
methods, or the second item from the preceding list.
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
methods (except for
@ModelAttribute
itself and anything
related to the request body).
The following example uses a
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
The following example adds one attribute only:
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
accountRepository.findAccount(number);
}
Copied!
```
When a name is not explicitly specified, a default name is chosen based on the type,
as explained in the javadoc for
Conventions
.
You can always assign an explicit name by using the overloaded
addAttribute
method or
through the name attribute on
@ModelAttribute
(for a return value).
Spring WebFlux, unlike Spring MVC, explicitly supports reactive types in the model
(for example,
Mono<Account>
or
io.reactivex.Single<Account>
). Such asynchronous model
attributes can be transparently resolved (and the model updated) to their actual values
at the time of
@RequestMapping
invocation, provided a
@ModelAttribute
argument is
declared without a wrapper, as the following example shows:
Java
Kotlin
```
@ModelAttribute
public
void
addAccount
(@RequestParam String number)
{
Mono<Account> accountMono = accountRepository.findAccount(number);
model.addAttribute(
"account"
, accountMono);
}
@PostMapping
(
"/accounts"
)
public
String
handle
(@ModelAttribute Account account, BindingResult errors)
{
// ...
}
Copied!
```
```
import
org.springframework.ui.
set
@ModelAttribute
fun
addAccount
(
@RequestParam
number:
String
)
{
val
accountMono: Mono<Account> = accountRepository.findAccount(number)
model[
"account"
] = accountMono
}
@PostMapping(
"/accounts"
)
fun
handle
(
@ModelAttribute
account:
Account
, errors:
BindingResult
)
: String {
// ...
}
Copied!
```
In addition, any model attributes that have a reactive type wrapper are resolved to their
actual values (and the model updated) just prior to view rendering.
You can also use
@ModelAttribute
as a method-level annotation on
@RequestMapping
methods, in which case the return value of the
@RequestMapping
method is interpreted as a
model attribute. This is typically not required, as it is the default behavior in HTML
controllers, unless the return value is a
String
that would otherwise be interpreted
as a view name.
@ModelAttribute
can also help to customize the model attribute name,
as the following example shows:
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