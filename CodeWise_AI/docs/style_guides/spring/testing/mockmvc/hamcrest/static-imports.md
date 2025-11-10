# Static Imports

Search
⌘ + k
Static Imports
When using MockMvc directly to perform requests, you’ll need static imports for:
MockMvcBuilders.*
MockMvcRequestBuilders.*
MockMvcResultMatchers.*
MockMvcResultHandlers.*
An easy way to remember that is search for
MockMvc*
. If using Eclipse be sure to also
add the above as “favorite static members” in the Eclipse preferences.
When using MockMvc through the
WebTestClient
you do not need static imports.
The
WebTestClient
provides a fluent API without static imports.