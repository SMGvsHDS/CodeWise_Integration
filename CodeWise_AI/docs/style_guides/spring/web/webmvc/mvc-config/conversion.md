# Conversion

Search
⌘ + k
Type Conversion
See equivalent in the Reactive stack
By default, formatters for various number and date types are installed, along with support
for customization via
@NumberFormat
,
@DurationFormat
, and
@DateTimeFormat
on fields
and parameters.
To register custom formatters and converters, use the following:
Java
Kotlin
Xml
```
@Configuration
public
class
WebConfiguration
implements
WebMvcConfigurer
{
@Override
public
void
addFormatters
(FormatterRegistry registry)
{
// ...
}
}
Copied!
```
```
@Configuration
class
WebConfiguration
:
WebMvcConfigurer {
override
fun
addFormatters
(registry:
FormatterRegistry
)
{
// ...
}
}
Copied!
```
```
<
mvc:annotation-driven
conversion-service
=
"conversionService"
/>
<
bean
id
=
"conversionService"
class
=
"org.springframework.format.support.FormattingConversionServiceFactoryBean"
>
<
property
name
=
"converters"
>
<
set
>
<
bean
class
=
"org.example.MyConverter"
/>
</
set
>
</
property
>
<
property
name
=
"formatters"
>
<
set
>
<
bean
class
=
"org.example.MyFormatter"
/>
<
bean
class
=
"org.example.MyAnnotationFormatterFactory"
/>
</
set
>
</
property
>
<
property
name
=
"formatterRegistrars"
>
<
set
>
<
bean
class
=
"org.example.MyFormatterRegistrar"
/>
</
set
>
</
property
>
</
bean
>
Copied!
```
By default Spring MVC considers the request Locale when parsing and formatting date
values. This works for forms where dates are represented as Strings with "input" form
fields. For "date" and "time" form fields, however, browsers use a fixed format defined
in the HTML spec. For such cases date and time formatting can be customized as follows:
Java
Kotlin
```
@Configuration
public
class
DateTimeWebConfiguration
implements
WebMvcConfigurer
{
@Override
public
void
addFormatters
(FormatterRegistry registry)
{
DateTimeFormatterRegistrar registrar =
new
DateTimeFormatterRegistrar();
registrar.setUseIsoFormat(
true
);
registrar.registerFormatters(registry);
}
}
Copied!
```
```
@Configuration
class
DateTimeWebConfiguration
:
WebMvcConfigurer {
override
fun
addFormatters
(registry:
FormatterRegistry
)
{
DateTimeFormatterRegistrar().apply {
setUseIsoFormat(
true
)
registerFormatters(registry)
}
}
}
Copied!
```
See
the
FormatterRegistrar
SPI
and the
FormattingConversionServiceFactoryBean
for more information on when to use
FormatterRegistrar implementations.