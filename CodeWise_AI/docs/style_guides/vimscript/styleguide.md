# Vimscript Style Guide

> 원문: https://google.github.io/styleguide/vimscriptguide.xml


Double quoted strings are semantically different in vimscript, and
          you probably don't want them (they break regexes).


Use double quoted strings when you need an escape sequence (such as"\n") or if you know it doesn't matter and you need to
          embed single quotes.
