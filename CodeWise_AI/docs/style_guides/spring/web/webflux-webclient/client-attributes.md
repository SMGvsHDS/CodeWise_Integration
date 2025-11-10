# Client Attributes

Search
⌘ + k
Attributes
You can add attributes to a request. This is convenient if you want to pass information
through the filter chain and influence the behavior of filters for a given request.
For example:
Java
Kotlin
```
WebClient client = WebClient.builder()
.filter((request, next) -> {
Optional<Object> usr = request.attribute(
"myAttribute"
);
// ...
})
.build();
client.get().uri(
"https://example.org/"
)
.attribute(
"myAttribute"
,
"..."
)
.retrieve()
.bodyToMono(Void
.
class
)
;
}
Copied!
```
```
val
client = WebClient.builder()
.filter { request, _ ->
val
usr = request.attributes()[
"myAttribute"
];
// ...
}
.build()
client.
get
().uri(
"https://example.org/"
)
.attribute(
"myAttribute"
,
"..."
)
.retrieve()
.awaitBody<
Unit
>()
Copied!
```
Note that you can configure a
defaultRequest
callback globally at the
WebClient.Builder
level which lets you insert attributes into all requests,
which could be used for example in a Spring MVC application to populate
request attributes based on
ThreadLocal
data.