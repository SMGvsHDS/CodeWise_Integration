# Store Configuration

Search
⌘ + k
Configuring the Cache Storage
The cache abstraction provides several storage integration options. To use them, you need
to declare an appropriate
CacheManager
(an entity that controls and manages
Cache
instances and that can be used to retrieve these for storage).
JDK
ConcurrentMap
-based Cache
The JDK-based
Cache
implementation resides under
org.springframework.cache.concurrent
package. It lets you use
ConcurrentHashMap
as a backing
Cache
store. The following example shows how to configure two caches:
Java
Kotlin
Xml
```
@Bean
ConcurrentMapCacheFactoryBean
defaultCache
()
{
ConcurrentMapCacheFactoryBean cache =
new
ConcurrentMapCacheFactoryBean();
cache.setName(
"default"
);
return
cache;
}
@Bean
ConcurrentMapCacheFactoryBean
booksCache
()
{
ConcurrentMapCacheFactoryBean cache =
new
ConcurrentMapCacheFactoryBean();
cache.setName(
"books"
);
return
cache;
}
@Bean
CacheManager
cacheManager
(ConcurrentMapCache defaultCache, ConcurrentMapCache booksCache)
{
SimpleCacheManager cacheManager =
new
SimpleCacheManager();
cacheManager.setCaches(Set.of(defaultCache, booksCache));
return
cacheManager;
}
Copied!
```
```
@Bean
fun
defaultCache
()
: ConcurrentMapCacheFactoryBean {
return
ConcurrentMapCacheFactoryBean().apply {
setName(
"default"
)
}
}
@Bean
fun
booksCache
()
: ConcurrentMapCacheFactoryBean {
return
ConcurrentMapCacheFactoryBean().apply {
setName(
"books"
)
}
}
@Bean
fun
cacheManager
(defaultCache:
ConcurrentMapCache
, booksCache:
ConcurrentMapCache
)
: CacheManager {
return
SimpleCacheManager().apply {
setCaches(setOf(defaultCache, booksCache))
}
}
Copied!
```
```
<!-- simple cache manager -->
<
bean
id
=
"cacheManager"
class
=
"org.springframework.cache.support.SimpleCacheManager"
>
<
property
name
=
"caches"
>
<
set
>
<
bean
class
=
"org.springframework.cache.concurrent.ConcurrentMapCacheFactoryBean"
name
=
"default"
/>
<
bean
class
=
"org.springframework.cache.concurrent.ConcurrentMapCacheFactoryBean"
name
=
"books"
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
The preceding snippet uses the
SimpleCacheManager
to create a
CacheManager
for the
two nested
ConcurrentMapCache
instances named
default
and
books
. Note that the
names are configured directly for each cache.
As the cache is created by the application, it is bound to its lifecycle, making it
suitable for basic use cases, tests, or simple applications. The cache scales well
and is very fast, but it does not provide any management, persistence capabilities,
or eviction contracts.
Ehcache-based Cache
Ehcache 3.x is fully JSR-107 compliant and no dedicated support is required for it. See
JSR-107 Cache
for details.
Caffeine Cache
Caffeine is a Java 8 rewrite of Guava’s cache, and its implementation is located in the
org.springframework.cache.caffeine
package and provides access to several features
of Caffeine.
The following example configures a
CacheManager
that creates the cache on demand:
Java
Kotlin
Xml
```
@Bean
CacheManager
cacheManager
()
{
return
new
CaffeineCacheManager();
}
Copied!
```
```
@Bean
fun
cacheManager
()
: CacheManager {
return
CaffeineCacheManager()
}
Copied!
```
```
<
bean
id
=
"cacheManager"
class
=
"org.springframework.cache.caffeine.CaffeineCacheManager"
/>
Copied!
```
You can also provide the caches to use explicitly. In that case, only those
are made available by the manager. The following example shows how to do so:
Java
Kotlin
Xml
```
@Bean
CacheManager
cacheManager
()
{
CaffeineCacheManager cacheManager =
new
CaffeineCacheManager();
cacheManager.setCacheNames(List.of(
"default"
,
"books"
));
return
cacheManager;
}
Copied!
```
```
@Bean
fun
cacheManager
()
: CacheManager {
return
CaffeineCacheManager().apply {
cacheNames = listOf(
"default"
,
"books"
)
}
}
Copied!
```
```
<
bean
id
=
"cacheManager"
class
=
"org.springframework.cache.caffeine.CaffeineCacheManager"
>
<
property
name
=
"cacheNames"
>
<
set
>
<
value
>
default
</
value
>
<
value
>
books
</
value
>
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
The Caffeine
CacheManager
also supports custom
Caffeine
and
CacheLoader
.
See the
Caffeine documentation
for more information about those.
GemFire-based Cache
GemFire is a memory-oriented, disk-backed, elastically scalable, continuously available,
active (with built-in pattern-based subscription notifications), globally replicated
database and provides fully-featured edge caching. For further information on how to
use GemFire as a
CacheManager
(and more), see the
Spring Data GemFire reference documentation
.
JSR-107 Cache
Spring’s caching abstraction can also use JSR-107-compliant caches. The JCache
implementation is located in the
org.springframework.cache.jcache
package.
Again, to use it, you need to declare the appropriate
CacheManager
.
The following example shows how to do so:
Java
Kotlin
Xml
```
@Bean
javax.cache.
CacheManager
jCacheManager
()
{
CachingProvider cachingProvider = Caching.getCachingProvider();
return
cachingProvider.getCacheManager();
}
@Bean
org.springframework.cache.
CacheManager
cacheManager
(javax.cache.CacheManager jCacheManager)
{
return
new
JCacheCacheManager(jCacheManager);
}
Copied!
```
```
@Bean
fun
jCacheManager
()
: javax.cache.CacheManager {
val
cachingProvider = Caching.getCachingProvider()
return
cachingProvider.getCacheManager()
}
@Bean
fun
cacheManager
(jCacheManager:
javax
.
cache
.
CacheManager
)
: org.springframework.cache.CacheManager {
return
JCacheCacheManager(jCacheManager)
}
Copied!
```
```
<
bean
id
=
"cacheManager"
class
=
"org.springframework.cache.jcache.JCacheCacheManager"
p:cache-manager-ref
=
"jCacheManager"
/>
<!-- JSR-107 cache manager setup  -->
<
bean
id
=
"jCacheManager"
...
/>
Copied!
```
Dealing with Caches without a Backing Store
Sometimes, when switching environments or doing testing, you might have cache
declarations without having an actual backing cache configured. As this is an invalid
configuration, an exception is thrown at runtime, since the caching infrastructure
is unable to find a suitable store. In situations like this, rather than removing the
cache declarations (which can prove tedious), you can wire in a simple dummy cache that
performs no caching — that is, it forces the cached methods to be invoked every time.
The following example shows how to do so:
Java
Kotlin
Xml
```
@Bean
CacheManager
cacheManager
(CacheManager jdkCache, CacheManager gemfireCache)
{
CompositeCacheManager cacheManager =
new
CompositeCacheManager();
cacheManager.setCacheManagers(List.of(jdkCache, gemfireCache));
cacheManager.setFallbackToNoOpCache(
true
);
return
cacheManager;
}
Copied!
```
```
@Bean
fun
cacheManager
(jdkCache:
CacheManager
, gemfireCache:
CacheManager
)
: CacheManager {
return
CompositeCacheManager().apply {
setCacheManagers(listOf(jdkCache, gemfireCache))
setFallbackToNoOpCache(
true
)
}
}
Copied!
```
```
<
bean
id
=
"cacheManager"
class
=
"org.springframework.cache.support.CompositeCacheManager"
>
<
property
name
=
"cacheManagers"
>
<
list
>
<
ref
bean
=
"jdkCache"
/>
<
ref
bean
=
"gemfireCache"
/>
</
list
>
</
property
>
<
property
name
=
"fallbackToNoOpCache"
value
=
"true"
/>
</
bean
>
Copied!
```
The
CompositeCacheManager
in the preceding chains multiple
CacheManager
instances and,
through the
fallbackToNoOpCache
flag, adds a no-op cache for all the definitions not
handled by the configured cache managers. That is, every cache definition not found in
either
jdkCache
or
gemfireCache
(configured earlier in the example) is handled by
the no-op cache, which does not store any information, causing the target method to be
invoked every time.