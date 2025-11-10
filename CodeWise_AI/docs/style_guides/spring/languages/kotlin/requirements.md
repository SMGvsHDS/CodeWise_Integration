# Requirements

Search
⌘ + k
Requirements
Spring Framework supports Kotlin 1.7+ and requires
kotlin-stdlib
and
kotlin-reflect
to be present on the classpath. They are provided by default if you bootstrap a Kotlin project on
start.spring.io
.
The
Jackson Kotlin module
is required
for serializing or deserializing JSON data for Kotlin classes with Jackson, so make sure to add the
com.fasterxml.jackson.module:jackson-module-kotlin
dependency to your project if you have such need.
It is automatically registered when found in the classpath.