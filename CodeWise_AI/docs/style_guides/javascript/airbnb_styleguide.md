# Airbnb JavaScript Style Guide

> 원문: https://github.com/airbnb/javascript

JavaScript / React 프로젝트를 위한 Airbnb의 공식 코드 스타일 가이드 요약입니다.


# Airbnb JavaScript Style Guide() {


A mostly reasonable approach to JavaScript


Note: this guide assumes you are usingBabel, and requires that you usebabel-preset-airbnbor the equivalent. It also assumes you are installing shims/polyfills in your app, withairbnb-browser-shimsor the equivalent.


This guide is available in other languages too. SeeTranslation


Other Style Guides

- ES5 (Deprecated)
- React
- CSS-in-JavaScript
- CSS & Sass
- Ruby

## Table of Contents

- Types
- References
- Objects
- Arrays
- Destructuring
- Strings
- Functions
- Arrow Functions
- Classes & Constructors
- Modules
- Iterators and Generators
- Properties
- Variables
- Hoisting
- Comparison Operators & Equality
- Blocks
- Control Statements
- Comments
- Whitespace
- Commas
- Semicolons
- Type Casting & Coercion
- Naming Conventions
- Accessors
- Events
- jQuery
- ECMAScript 5 Compatibility
- ECMAScript 6+ (ES 2015+) Styles
- Standard Library
- Testing
- Performance
- Resources
- In the Wild
- Translation
- The JavaScript Style Guide Guide
- Chat With Us About JavaScript
- Contributors
- License
- Amendments

## Types

- 1.1Primitives: When you access a primitive type you work directly on its value.stringnumberbooleannullundefinedsymbolbigintconstfoo=1;letbar=foo;bar=9;console.log(foo,bar);// => 1, 9Symbols and BigInts cannot be faithfully polyfilled, so they should not be used when targeting browsers/environments that don’t support them natively.
- string
- number
- boolean
- null
- undefined
- symbol
- bigint
- Symbols and BigInts cannot be faithfully polyfilled, so they should not be used when targeting browsers/environments that don’t support them natively.

1.1Primitives: When you access a primitive type you work directly on its value.

- string
- number
- boolean
- null
- undefined
- symbol
- bigint

```javascript
const foo = 1;
let bar = foo;

bar = 9;

console.log(foo, bar); // => 1, 9
```

- Symbols and BigInts cannot be faithfully polyfilled, so they should not be used when targeting browsers/environments that don’t support them natively.
- 1.2Complex: When you access a complex type you work on a reference to its value.objectarrayfunctionconstfoo=[1,2];constbar=foo;bar[0]=9;console.log(foo[0],bar[0]);// => 9, 9
- object
- array
- function

1.2Complex: When you access a complex type you work on a reference to its value.

- object
- array
- function

```javascript
const foo = [1, 2];
const bar = foo;

bar[0] = 9;

console.log(foo[0], bar[0]); // => 9, 9
```


⬆ back to top


## References

- 2.1Useconstfor all of your references; avoid usingvar. eslint:prefer-const,no-const-assignWhy? This ensures that you can’t reassign your references, which can lead to bugs and difficult to comprehend code.// badvara=1;varb=2;// goodconsta=1;constb=2;

2.1Useconstfor all of your references; avoid usingvar. eslint:prefer-const,no-const-assign


Why? This ensures that you can’t reassign your references, which can lead to bugs and difficult to comprehend code.


```javascript
// bad
var a = 1;
var b = 2;

// good
const a = 1;
const b = 2;
```

- 2.2If you must reassign references, useletinstead ofvar. eslint:no-varWhy?letis block-scoped rather than function-scoped likevar.// badvarcount=1;if(true){count+=1;}// good, use the let.letcount=1;if(true){count+=1;}

2.2If you must reassign references, useletinstead ofvar. eslint:no-var


Why?letis block-scoped rather than function-scoped likevar.


```javascript
// bad
var count = 1;
if (true) {
  count += 1;
}

// good, use the let.
let count = 1;
if (true) {
  count += 1;
}
```

- 2.3Note that bothletandconstare block-scoped, whereasvaris function-scoped.// const and let only exist in the blocks they are defined in.{leta=1;constb=1;varc=1;}console.log(a);// ReferenceErrorconsole.log(b);// ReferenceErrorconsole.log(c);// Prints 1In the above code, you can see that referencingaandbwill produce a ReferenceError, whileccontains the number. This is becauseaandbare block scoped, whilecis scoped to the containing function.

2.3Note that bothletandconstare block-scoped, whereasvaris function-scoped.


```javascript
// const and let only exist in the blocks they are defined in.
{
  let a = 1;
  const b = 1;
  var c = 1;
}
console.log(a); // ReferenceError
console.log(b); // ReferenceError
console.log(c); // Prints 1
```


In the above code, you can see that referencingaandbwill produce a ReferenceError, whileccontains the number. This is becauseaandbare block scoped, whilecis scoped to the containing function.


⬆ back to top


## Objects

- 3.1Use the literal syntax for object creation. eslint:no-new-object// badconstitem=newObject();// goodconstitem={};

3.1Use the literal syntax for object creation. eslint:no-new-object


```javascript
// bad
const item = new Object();

// good
const item = {};
```

- 3.2Use computed property names when creating objects with dynamic property names.Why? They allow you to define all the properties of an object in one place.functiongetKey(k){return`a key named${k}`;}// badconstobj={id:5,name:'San Francisco',};obj[getKey('enabled')]=true;// goodconstobj={id:5,name:'San Francisco',[getKey('enabled')]:true,};

3.2Use computed property names when creating objects with dynamic property names.


Why? They allow you to define all the properties of an object in one place.


```javascript
function getKey(k) {
  return `a key named ${k}`;
}

// bad
const obj = {
  id: 5,
  name: 'San Francisco',
};
obj[getKey('enabled')] = true;

// good
const obj = {
  id: 5,
  name: 'San Francisco',
  [getKey('enabled')]: true,
};
```

- 3.3Use object method shorthand. eslint:object-shorthand// badconstatom={value:1,addValue:function(value){returnatom.value+value;},};// goodconstatom={value:1,addValue(value){returnatom.value+value;},};

3.3Use object method shorthand. eslint:object-shorthand


```javascript
// bad
const atom = {
  value: 1,

  addValue: function (value) {
    return atom.value + value;
  },
};

// good
const atom = {
  value: 1,

  addValue(value) {
    return atom.value + value;
  },
};
```

- 3.4Use property value shorthand. eslint:object-shorthandWhy? It is shorter and descriptive.constlukeSkywalker='Luke Skywalker';// badconstobj={lukeSkywalker:lukeSkywalker,};// goodconstobj={lukeSkywalker,};

3.4Use property value shorthand. eslint:object-shorthand


Why? It is shorter and descriptive.


```javascript
const lukeSkywalker = 'Luke Skywalker';

// bad
const obj = {
  lukeSkywalker: lukeSkywalker,
};

// good
const obj = {
  lukeSkywalker,
};
```

- 3.5Group your shorthand properties at the beginning of your object declaration.Why? It’s easier to tell which properties are using the shorthand.constanakinSkywalker='Anakin Skywalker';constlukeSkywalker='Luke Skywalker';// badconstobj={episodeOne:1,twoJediWalkIntoACantina:2,lukeSkywalker,episodeThree:3,mayTheFourth:4,anakinSkywalker,};// goodconstobj={lukeSkywalker,anakinSkywalker,episodeOne:1,twoJediWalkIntoACantina:2,episodeThree:3,mayTheFourth:4,};

3.5Group your shorthand properties at the beginning of your object declaration.


Why? It’s easier to tell which properties are using the shorthand.


```javascript
const anakinSkywalker = 'Anakin Skywalker';
const lukeSkywalker = 'Luke Skywalker';

// bad
const obj = {
  episodeOne: 1,
  twoJediWalkIntoACantina: 2,
  lukeSkywalker,
  episodeThree: 3,
  mayTheFourth: 4,
  anakinSkywalker,
};

// good
const obj = {
  lukeSkywalker,
  anakinSkywalker,
  episodeOne: 1,
  twoJediWalkIntoACantina: 2,
  episodeThree: 3,
  mayTheFourth: 4,
};
```

- 3.6Only quote properties that are invalid identifiers. eslint:quote-propsWhy? In general we consider it subjectively easier to read. It improves syntax highlighting, and is also more easily optimized by many JS engines.// badconstbad={'foo':3,'bar':4,'data-blah':5,};// goodconstgood={foo:3,bar:4,'data-blah':5,};

3.6Only quote properties that are invalid identifiers. eslint:quote-props


Why? In general we consider it subjectively easier to read. It improves syntax highlighting, and is also more easily optimized by many JS engines.


```javascript
// bad
const bad = {
  'foo': 3,
  'bar': 4,
  'data-blah': 5,
};

// good
const good = {
  foo: 3,
  bar: 4,
  'data-blah': 5,
};
```

- 3.7Do not callObject.prototypemethods directly, such ashasOwnProperty,propertyIsEnumerable, andisPrototypeOf. eslint:no-prototype-builtinsWhy? These methods may be shadowed by properties on the object in question - consider{ hasOwnProperty: false }- or, the object may be a null object (Object.create(null)). In modern browsers that support ES2022, or with a polyfill such ashttps://npmjs.com/object.hasown,Object.hasOwncan also be used as an alternative toObject.prototype.hasOwnProperty.call.// badconsole.log(object.hasOwnProperty(key));// goodconsole.log(Object.prototype.hasOwnProperty.call(object,key));// betterconsthas=Object.prototype.hasOwnProperty;// cache the lookup once, in module scope.console.log(has.call(object,key));// bestconsole.log(Object.hasOwn(object,key));// only supported in browsers that support ES2022/* or */importhasfrom'has';// https://www.npmjs.com/package/hasconsole.log(has(object,key));/* or */console.log(Object.hasOwn(object,key));// https://www.npmjs.com/package/object.hasown

3.7Do not callObject.prototypemethods directly, such ashasOwnProperty,propertyIsEnumerable, andisPrototypeOf. eslint:no-prototype-builtins


Why? These methods may be shadowed by properties on the object in question - consider{ hasOwnProperty: false }- or, the object may be a null object (Object.create(null)). In modern browsers that support ES2022, or with a polyfill such ashttps://npmjs.com/object.hasown,Object.hasOwncan also be used as an alternative toObject.prototype.hasOwnProperty.call.


```javascript
// bad
console.log(object.hasOwnProperty(key));

// good
console.log(Object.prototype.hasOwnProperty.call(object, key));

// better
const has = Object.prototype.hasOwnProperty; // cache the lookup once, in module scope.
console.log(has.call(object, key));

// best
console.log(Object.hasOwn(object, key)); // only supported in browsers that support ES2022

/* or */
import has from 'has'; // https://www.npmjs.com/package/has
console.log(has(object, key));
/* or */
console.log(Object.hasOwn(object, key)); // https://www.npmjs.com/package/object.hasown
```

- 3.8Prefer the object spread syntax overObject.assignto shallow-copy objects. Use the object rest parameter syntax to get a new object with certain properties omitted. eslint:prefer-object-spread// very badconstoriginal={a:1,b:2};constcopy=Object.assign(original,{c:3});// this mutates `original` ಠ_ಠdeletecopy.a;// so does this// badconstoriginal={a:1,b:2};constcopy=Object.assign({},original,{c:3});// copy => { a: 1, b: 2, c: 3 }// goodconstoriginal={a:1,b:2};constcopy={...original,c:3};// copy => { a: 1, b: 2, c: 3 }const{a,...noA}=copy;// noA => { b: 2, c: 3 }

3.8Prefer the object spread syntax overObject.assignto shallow-copy objects. Use the object rest parameter syntax to get a new object with certain properties omitted. eslint:prefer-object-spread


```javascript
// very bad
const original = { a: 1, b: 2 };
const copy = Object.assign(original, { c: 3 }); // this mutates `original` ಠ_ಠ
delete copy.a; // so does this

// bad
const original = { a: 1, b: 2 };
const copy = Object.assign({}, original, { c: 3 }); // copy => { a: 1, b: 2, c: 3 }

// good
const original = { a: 1, b: 2 };
const copy = { ...original, c: 3 }; // copy => { a: 1, b: 2, c: 3 }

const { a, ...noA } = copy; // noA => { b: 2, c: 3 }
```


⬆ back to top


## Arrays

- 4.1Use the literal syntax for array creation. eslint:no-array-constructor// badconstitems=newArray();// goodconstitems=[];

4.1Use the literal syntax for array creation. eslint:no-array-constructor


```javascript
// bad
const items = new Array();

// good
const items = [];
```

- 4.2UseArray#pushinstead of direct assignment to add items to an array.constsomeStack=[];// badsomeStack[someStack.length]='abracadabra';// goodsomeStack.push('abracadabra');

4.2UseArray#pushinstead of direct assignment to add items to an array.


```javascript
const someStack = [];

// bad
someStack[someStack.length] = 'abracadabra';

// good
someStack.push('abracadabra');
```

- 4.3Use array spreads...to copy arrays.// badconstlen=items.length;constitemsCopy=[];leti;for(i=0;i<len;i+=1){itemsCopy[i]=items[i];}// goodconstitemsCopy=[...items];

4.3Use array spreads...to copy arrays.


```javascript
// bad
const len = items.length;
const itemsCopy = [];
let i;

for (i = 0; i < len; i += 1) {
  itemsCopy[i] = items[i];
}

// good
const itemsCopy = [...items];
```

- 4.4To convert an iterable object to an array, use spreads...instead ofArray.fromconstfoo=document.querySelectorAll('.foo');// goodconstnodes=Array.from(foo);// bestconstnodes=[...foo];

4.4To convert an iterable object to an array, use spreads...instead ofArray.from


```javascript
const foo = document.querySelectorAll('.foo');

// good
const nodes = Array.from(foo);

// best
const nodes = [...foo];
```

- 4.5UseArray.fromfor converting an array-like object to an array.constarrLike={0:'foo',1:'bar',2:'baz',length:3};// badconstarr=Array.prototype.slice.call(arrLike);// goodconstarr=Array.from(arrLike);

4.5UseArray.fromfor converting an array-like object to an array.


```javascript
const arrLike = { 0: 'foo', 1: 'bar', 2: 'baz', length: 3 };

// bad
const arr = Array.prototype.slice.call(arrLike);

// good
const arr = Array.from(arrLike);
```

- 4.6UseArray.frominstead of spread...for mapping over iterables, because it avoids creating an intermediate array.// badconstbaz=[...foo].map(bar);// goodconstbaz=Array.from(foo,bar);

4.6UseArray.frominstead of spread...for mapping over iterables, because it avoids creating an intermediate array.


```javascript
// bad
const baz = [...foo].map(bar);

// good
const baz = Array.from(foo, bar);
```

- 4.7Use return statements in array method callbacks. It’s ok to omit the return if the function body consists of a single statement returning an expression without side effects, following8.2. eslint:array-callback-return// good[1,2,3].map((x)=>{consty=x+1;returnx*y;});// good[1,2,3].map((x)=>x+1);// bad - no returned value means `acc` becomes undefined after the first iteration[[0,1],[2,3],[4,5]].reduce((acc,item,index)=>{constflatten=acc.concat(item);});// good[[0,1],[2,3],[4,5]].reduce((acc,item,index)=>{constflatten=acc.concat(item);returnflatten;});// badinbox.filter((msg)=>{const{subject,author}=msg;if(subject==='Mockingbird'){returnauthor==='Harper Lee';}else{returnfalse;}});// goodinbox.filter((msg)=>{const{subject,author}=msg;if(subject==='Mockingbird'){returnauthor==='Harper Lee';}returnfalse;});

4.7Use return statements in array method callbacks. It’s ok to omit the return if the function body consists of a single statement returning an expression without side effects, following8.2. eslint:array-callback-return


```javascript
// good
[1, 2, 3].map((x) => {
  const y = x + 1;
  return x * y;
});

// good
[1, 2, 3].map((x) => x + 1);

// bad - no returned value means `acc` becomes undefined after the first iteration
[[0, 1], [2, 3], [4, 5]].reduce((acc, item, index) => {
  const flatten = acc.concat(item);
});

// good
[[0, 1], [2, 3], [4, 5]].reduce((acc, item, index) => {
  const flatten = acc.concat(item);
  return flatten;
});

// bad
inbox.filter((msg) => {
  const { subject, author } = msg;
  if (subject === 'Mockingbird') {
    return author === 'Harper Lee';
  } else {
    return false;
  }
});

// good
inbox.filter((msg) => {
  const { subject, author } = msg;
  if (subject === 'Mockingbird') {
    return author === 'Harper Lee';
  }

  return false;
});
```

- 4.8Use line breaks after opening array brackets and before closing array brackets, if an array has multiple lines// badconstarr=[[0,1],[2,3],[4,5],];constobjectInArray=[{id:1,},{id:2,}];constnumberInArray=[1,2,];// goodconstarr=[[0,1],[2,3],[4,5]];constobjectInArray=[{id:1,},{id:2,},];constnumberInArray=[1,2,];

4.8Use line breaks after opening array brackets and before closing array brackets, if an array has multiple lines


```javascript
// bad
const arr = [
  [0, 1], [2, 3], [4, 5],
];

const objectInArray = [{
  id: 1,
}, {
  id: 2,
}];

const numberInArray = [
  1, 2,
];

// good
const arr = [[0, 1], [2, 3], [4, 5]];

const objectInArray = [
  {
    id: 1,
  },
  {
    id: 2,
  },
];

const numberInArray = [
  1,
  2,
];
```


⬆ back to top


## Destructuring

- 5.1Use object destructuring when accessing and using multiple properties of an object. eslint:prefer-destructuringWhy? Destructuring saves you from creating temporary references for those properties, and from repetitive access of the object. Repeating object access creates more repetitive code, requires more reading, and creates more opportunities for mistakes. Destructuring objects also provides a single site of definition of the object structure that is used in the block, rather than requiring reading the entire block to determine what is used.// badfunctiongetFullName(user){constfirstName=user.firstName;constlastName=user.lastName;return`${firstName}${lastName}`;}// goodfunctiongetFullName(user){const{firstName,lastName}=user;return`${firstName}${lastName}`;}// bestfunctiongetFullName({firstName,lastName}){return`${firstName}${lastName}`;}

5.1Use object destructuring when accessing and using multiple properties of an object. eslint:prefer-destructuring


Why? Destructuring saves you from creating temporary references for those properties, and from repetitive access of the object. Repeating object access creates more repetitive code, requires more reading, and creates more opportunities for mistakes. Destructuring objects also provides a single site of definition of the object structure that is used in the block, rather than requiring reading the entire block to determine what is used.


```javascript
// bad
function getFullName(user) {
  const firstName = user.firstName;
  const lastName = user.lastName;

  return `${firstName} ${lastName}`;
}

// good
function getFullName(user) {
  const { firstName, lastName } = user;
  return `${firstName} ${lastName}`;
}

// best
function getFullName({ firstName, lastName }) {
  return `${firstName} ${lastName}`;
}
```

- 5.2Use array destructuring. eslint:prefer-destructuringconstarr=[1,2,3,4];// badconstfirst=arr[0];constsecond=arr[1];// goodconst[first,second]=arr;

5.2Use array destructuring. eslint:prefer-destructuring


```javascript
const arr = [1, 2, 3, 4];

// bad
const first = arr[0];
const second = arr[1];

// good
const [first, second] = arr;
```

- 5.3Use object destructuring for multiple return values, not array destructuring.Why? You can add new properties over time or change the order of things without breaking call sites.// badfunctionprocessInput(input){// then a miracle occursreturn[left,right,top,bottom];}// the caller needs to think about the order of return dataconst[left,__,top]=processInput(input);// goodfunctionprocessInput(input){// then a miracle occursreturn{left,right,top,bottom};}// the caller selects only the data they needconst{left,top}=processInput(input);

5.3Use object destructuring for multiple return values, not array destructuring.


Why? You can add new properties over time or change the order of things without breaking call sites.


```javascript
// bad
function processInput(input) {
  // then a miracle occurs
  return [left, right, top, bottom];
}

// the caller needs to think about the order of return data
const [left, __, top] = processInput(input);

// good
function processInput(input) {
  // then a miracle occurs
  return { left, right, top, bottom };
}

// the caller selects only the data they need
const { left, top } = processInput(input);
```


⬆ back to top


## Strings

- 6.1Use single quotes''for strings. eslint:quotes// badconstname="Capt. Janeway";// bad - template literals should contain interpolation or newlinesconstname=`Capt. Janeway`;// goodconstname='Capt. Janeway';

6.1Use single quotes''for strings. eslint:quotes


```javascript
// bad
const name = "Capt. Janeway";

// bad - template literals should contain interpolation or newlines
const name = `Capt. Janeway`;

// good
const name = 'Capt. Janeway';
```

- 6.2Strings that cause the line to go over 100 characters should not be written across multiple lines using string concatenation.Why? Broken strings are painful to work with and make code less searchable.// badconsterrorMessage='This is a super long error that was thrown because \of Batman. When you stop to think about how Batman had anything to do \with this, you would get nowhere \fast.';// badconsterrorMessage='This is a super long error that was thrown because '+'of Batman. When you stop to think about how Batman had anything to do '+'with this, you would get nowhere fast.';// goodconsterrorMessage='This is a super long error that was thrown because of Batman. When you stop to think about how Batman had anything to do with this, you would get nowhere fast.';

6.2Strings that cause the line to go over 100 characters should not be written across multiple lines using string concatenation.


Why? Broken strings are painful to work with and make code less searchable.


```javascript
// bad
const errorMessage = 'This is a super long error that was thrown because \
of Batman. When you stop to think about how Batman had anything to do \
with this, you would get nowhere \
fast.';

// bad
const errorMessage = 'This is a super long error that was thrown because ' +
  'of Batman. When you stop to think about how Batman had anything to do ' +
  'with this, you would get nowhere fast.';

// good
const errorMessage = 'This is a super long error that was thrown because of Batman. When you stop to think about how Batman had anything to do with this, you would get nowhere fast.';
```

- 6.3When programmatically building up strings, use template strings instead of concatenation. eslint:prefer-templatetemplate-curly-spacingWhy? Template strings give you a readable, concise syntax with proper newlines and string interpolation features.// badfunctionsayHi(name){return'How are you, '+name+'?';}// badfunctionsayHi(name){return['How are you, ',name,'?'].join();}// badfunctionsayHi(name){return`How are you,${name}?`;}// goodfunctionsayHi(name){return`How are you,${name}?`;}

6.3When programmatically building up strings, use template strings instead of concatenation. eslint:prefer-templatetemplate-curly-spacing


Why? Template strings give you a readable, concise syntax with proper newlines and string interpolation features.


```javascript
// bad
function sayHi(name) {
  return 'How are you, ' + name + '?';
}

// bad
function sayHi(name) {
  return ['How are you, ', name, '?'].join();
}

// bad
function sayHi(name) {
  return `How are you, ${ name }?`;
}

// good
function sayHi(name) {
  return `How are you, ${name}?`;
}
```

- 6.4Never useeval()on a string; it opens too many vulnerabilities. eslint:no-eval
- 6.5Do not unnecessarily escape characters in strings. eslint:no-useless-escapeWhy? Backslashes harm readability, thus they should only be present when necessary.// badconstfoo='\'this\' \i\s \"quoted\"';// goodconstfoo='\'this\' is "quoted"';constfoo=`my name is '${name}'`;

6.5Do not unnecessarily escape characters in strings. eslint:no-useless-escape


Why? Backslashes harm readability, thus they should only be present when necessary.


```javascript
// bad
const foo = '\'this\' \i\s \"quoted\"';

// good
const foo = '\'this\' is "quoted"';
const foo = `my name is '${name}'`;
```


⬆ back to top


## Functions

- 7.1Use named function expressions instead of function declarations. eslint:func-style,func-namesWhy? Function declarations are hoisted, which means that it’s easy - too easy - to reference the function before it is defined in the file. This harms readability and maintainability. If you find that a function’s definition is large or complex enough that it is interfering with understanding the rest of the file, then perhaps it’s time to extract it to its own module! Don’t forget to explicitly name the expression, regardless of whether or not the name is inferred from the containing variable (which is often the case in modern browsers or when using compilers such as Babel). This eliminates any assumptions made about the Error’s call stack. (Discussion)// badfunctionfoo(){// ...}// badconstfoo=function(){// ...};// good// lexical name distinguished from the variable-referenced invocation(s)constshort=functionlongUniqueMoreDescriptiveLexicalFoo(){// ...};

7.1Use named function expressions instead of function declarations. eslint:func-style,func-names


Why? Function declarations are hoisted, which means that it’s easy - too easy - to reference the function before it is defined in the file. This harms readability and maintainability. If you find that a function’s definition is large or complex enough that it is interfering with understanding the rest of the file, then perhaps it’s time to extract it to its own module! Don’t forget to explicitly name the expression, regardless of whether or not the name is inferred from the containing variable (which is often the case in modern browsers or when using compilers such as Babel). This eliminates any assumptions made about the Error’s call stack. (Discussion)


```javascript
// bad
function foo() {
  // ...
}

// bad
const foo = function () {
  // ...
};

// good
// lexical name distinguished from the variable-referenced invocation(s)
const short = function longUniqueMoreDescriptiveLexicalFoo() {
  // ...
};
```

- 7.2Wrap immediately invoked function expressions in parentheses. eslint:wrap-iifeWhy? An immediately invoked function expression is a single unit - wrapping both it, and its invocation parens, in parens, cleanly expresses this. Note that in a world with modules everywhere, you almost never need an IIFE.// immediately-invoked function expression (IIFE)(function(){console.log('Welcome to the Internet. Please follow me.');}());

7.2Wrap immediately invoked function expressions in parentheses. eslint:wrap-iife


Why? An immediately invoked function expression is a single unit - wrapping both it, and its invocation parens, in parens, cleanly expresses this. Note that in a world with modules everywhere, you almost never need an IIFE.


```javascript
// immediately-invoked function expression (IIFE)
(function () {
  console.log('Welcome to the Internet. Please follow me.');
}());
```

- 7.3Never declare a function in a non-function block (if,while, etc). Assign the function to a variable instead. Browsers will allow you to do it, but they all interpret it differently, which is bad news bears. eslint:no-loop-func
- 7.4Note:ECMA-262 defines ablockas a list of statements. A function declaration is not a statement.// badif(currentUser){functiontest(){console.log('Nope.');}}// goodlettest;if(currentUser){test=()=>{console.log('Yup.');};}

7.4Note:ECMA-262 defines ablockas a list of statements. A function declaration is not a statement.


```javascript
// bad
if (currentUser) {
  function test() {
    console.log('Nope.');
  }
}

// good
let test;
if (currentUser) {
  test = () => {
    console.log('Yup.');
  };
}
```

- 7.5Never name a parameterarguments. This will take precedence over theargumentsobject that is given to every function scope.// badfunctionfoo(name,options,arguments){// ...}// goodfunctionfoo(name,options,args){// ...}

7.5Never name a parameterarguments. This will take precedence over theargumentsobject that is given to every function scope.


```javascript
// bad
function foo(name, options, arguments) {
  // ...
}

// good
function foo(name, options, args) {
  // ...
}
```

- 7.6Never usearguments, opt to use rest syntax...instead. eslint:prefer-rest-paramsWhy?...is explicit about which arguments you want pulled. Plus, rest arguments are a real Array, and not merely Array-like likearguments.// badfunctionconcatenateAll(){constargs=Array.prototype.slice.call(arguments);returnargs.join('');}// goodfunctionconcatenateAll(...args){returnargs.join('');}

7.6Never usearguments, opt to use rest syntax...instead. eslint:prefer-rest-params


Why?...is explicit about which arguments you want pulled. Plus, rest arguments are a real Array, and not merely Array-like likearguments.


```javascript
// bad
function concatenateAll() {
  const args = Array.prototype.slice.call(arguments);
  return args.join('');
}

// good
function concatenateAll(...args) {
  return args.join('');
}
```

- 7.7Use default parameter syntax rather than mutating function arguments.// really badfunctionhandleThings(opts){// No! We shouldn’t mutate function arguments.// Double bad: if opts is falsy it'll be set to an object which may// be what you want but it can introduce subtle bugs.opts=opts||{};// ...}// still badfunctionhandleThings(opts){if(opts===void0){opts={};}// ...}// goodfunctionhandleThings(opts={}){// ...}

7.7Use default parameter syntax rather than mutating function arguments.


```javascript
// really bad
function handleThings(opts) {
  // No! We shouldn’t mutate function arguments.
  // Double bad: if opts is falsy it'll be set to an object which may
  // be what you want but it can introduce subtle bugs.
  opts = opts || {};
  // ...
}

// still bad
function handleThings(opts) {
  if (opts === void 0) {
    opts = {};
  }
  // ...
}

// good
function handleThings(opts = {}) {
  // ...
}
```

- 7.8Avoid side effects with default parameters.Why? They are confusing to reason about.letb=1;// badfunctioncount(a=b++){console.log(a);}count();// 1count();// 2count(3);// 3count();// 3

7.8Avoid side effects with default parameters.


Why? They are confusing to reason about.


```javascript
let b = 1;
// bad
function count(a = b++) {
  console.log(a);
}
count();  // 1
count();  // 2
count(3); // 3
count();  // 3
```

- 7.9Always put default parameters last. eslint:default-param-last// badfunctionhandleThings(opts={},name){// ...}// goodfunctionhandleThings(name,opts={}){// ...}

7.9Always put default parameters last. eslint:default-param-last


```javascript
// bad
function handleThings(opts = {}, name) {
  // ...
}

// good
function handleThings(name, opts = {}) {
  // ...
}
```

- 7.10Never use the Function constructor to create a new function. eslint:no-new-funcWhy? Creating a function in this way evaluates a string similarly toeval(), which opens vulnerabilities.// badconstadd=newFunction('a','b','return a + b');// still badconstsubtract=Function('a','b','return a - b');

7.10Never use the Function constructor to create a new function. eslint:no-new-func


Why? Creating a function in this way evaluates a string similarly toeval(), which opens vulnerabilities.


```javascript
// bad
const add = new Function('a', 'b', 'return a + b');

// still bad
const subtract = Function('a', 'b', 'return a - b');
```

- 7.11Spacing in a function signature. eslint:space-before-function-parenspace-before-blocksWhy? Consistency is good, and you shouldn’t have to add or remove a space when adding or removing a name.// badconstf=function(){};constg=function(){};consth=function(){};// goodconstx=function(){};consty=functiona(){};

7.11Spacing in a function signature. eslint:space-before-function-parenspace-before-blocks


Why? Consistency is good, and you shouldn’t have to add or remove a space when adding or removing a name.


```javascript
// bad
const f = function(){};
const g = function (){};
const h = function() {};

// good
const x = function () {};
const y = function a() {};
```

- 7.12Never mutate parameters. eslint:no-param-reassignWhy? Manipulating objects passed in as parameters can cause unwanted variable side effects in the original caller.// badfunctionf1(obj){obj.key=1;}// goodfunctionf2(obj){constkey=Object.prototype.hasOwnProperty.call(obj,'key')?obj.key:1;}

7.12Never mutate parameters. eslint:no-param-reassign


Why? Manipulating objects passed in as parameters can cause unwanted variable side effects in the original caller.


```javascript
// bad
function f1(obj) {
  obj.key = 1;
}

// good
function f2(obj) {
  const key = Object.prototype.hasOwnProperty.call(obj, 'key') ? obj.key : 1;
}
```

- 7.13Never reassign parameters. eslint:no-param-reassignWhy? Reassigning parameters can lead to unexpected behavior, especially when accessing theargumentsobject. It can also cause optimization issues, especially in V8.// badfunctionf1(a){a=1;// ...}functionf2(a){if(!a){a=1;}// ...}// goodfunctionf3(a){constb=a||1;// ...}functionf4(a=1){// ...}

7.13Never reassign parameters. eslint:no-param-reassign


Why? Reassigning parameters can lead to unexpected behavior, especially when accessing theargumentsobject. It can also cause optimization issues, especially in V8.


```javascript
// bad
function f1(a) {
  a = 1;
  // ...
}

function f2(a) {
  if (!a) { a = 1; }
  // ...
}

// good
function f3(a) {
  const b = a || 1;
  // ...
}

function f4(a = 1) {
  // ...
}
```

- 7.14Prefer the use of the spread syntax...to call variadic functions. eslint:prefer-spreadWhy? It’s cleaner, you don’t need to supply a context, and you can not easily composenewwithapply.// badconstx=[1,2,3,4,5];console.log.apply(console,x);// goodconstx=[1,2,3,4,5];console.log(...x);// badnew(Function.prototype.bind.apply(Date,[null,2016,8,5]));// goodnewDate(...[2016,8,5]);

7.14Prefer the use of the spread syntax...to call variadic functions. eslint:prefer-spread


Why? It’s cleaner, you don’t need to supply a context, and you can not easily composenewwithapply.


```javascript
// bad
const x = [1, 2, 3, 4, 5];
console.log.apply(console, x);

// good
const x = [1, 2, 3, 4, 5];
console.log(...x);

// bad
new (Function.prototype.bind.apply(Date, [null, 2016, 8, 5]));

// good
new Date(...[2016, 8, 5]);
```

- 7.15Functions with multiline signatures, or invocations, should be indented just like every other multiline list in this guide: with each item on a line by itself, with a trailing comma on the last item. eslint:function-paren-newline// badfunctionfoo(bar,baz,quux){// ...}// goodfunctionfoo(bar,baz,quux,){// ...}// badconsole.log(foo,bar,baz);// goodconsole.log(foo,bar,baz,);

7.15Functions with multiline signatures, or invocations, should be indented just like every other multiline list in this guide: with each item on a line by itself, with a trailing comma on the last item. eslint:function-paren-newline


```javascript
// bad
function foo(bar,
             baz,
             quux) {
  // ...
}

// good
function foo(
  bar,
  baz,
  quux,
) {
  // ...
}

// bad
console.log(foo,
  bar,
  baz);

// good
console.log(
  foo,
  bar,
  baz,
);
```


⬆ back to top


## Arrow Functions

- 8.1When you must use an anonymous function (as when passing an inline callback), use arrow function notation. eslint:prefer-arrow-callback,arrow-spacingWhy? It creates a version of the function that executes in the context ofthis, which is usually what you want, and is a more concise syntax.Why not? If you have a fairly complicated function, you might move that logic out into its own named function expression.// bad[1,2,3].map(function(x){consty=x+1;returnx*y;});// good[1,2,3].map((x)=>{consty=x+1;returnx*y;});

8.1When you must use an anonymous function (as when passing an inline callback), use arrow function notation. eslint:prefer-arrow-callback,arrow-spacing


Why? It creates a version of the function that executes in the context ofthis, which is usually what you want, and is a more concise syntax.


Why not? If you have a fairly complicated function, you might move that logic out into its own named function expression.


```javascript
// bad
[1, 2, 3].map(function (x) {
  const y = x + 1;
  return x * y;
});

// good
[1, 2, 3].map((x) => {
  const y = x + 1;
  return x * y;
});
```

- 8.2If the function body consists of a single statement returning anexpressionwithout side effects, omit the braces and use the implicit return. Otherwise, keep the braces and use areturnstatement. eslint:arrow-parens,arrow-body-styleWhy? Syntactic sugar. It reads well when multiple functions are chained together.// bad[1,2,3].map((number)=>{constnextNumber=number+1;`A string containing the${nextNumber}.`;});// good[1,2,3].map((number)=>`A string containing the${number+1}.`);// good[1,2,3].map((number)=>{constnextNumber=number+1;return`A string containing the${nextNumber}.`;});// good[1,2,3].map((number,index)=>({[index]:number,}));// No implicit return with side effectsfunctionfoo(callback){constval=callback();if(val===true){// Do something if callback returns true}}letbool=false;// badfoo(()=>bool=true);// goodfoo(()=>{bool=true;});

8.2If the function body consists of a single statement returning anexpressionwithout side effects, omit the braces and use the implicit return. Otherwise, keep the braces and use areturnstatement. eslint:arrow-parens,arrow-body-style


Why? Syntactic sugar. It reads well when multiple functions are chained together.


```javascript
// bad
[1, 2, 3].map((number) => {
  const nextNumber = number + 1;
  `A string containing the ${nextNumber}.`;
});

// good
[1, 2, 3].map((number) => `A string containing the ${number + 1}.`);

// good
[1, 2, 3].map((number) => {
  const nextNumber = number + 1;
  return `A string containing the ${nextNumber}.`;
});

// good
[1, 2, 3].map((number, index) => ({
  [index]: number,
}));

// No implicit return with side effects
function foo(callback) {
  const val = callback();
  if (val === true) {
    // Do something if callback returns true
  }
}

let bool = false;

// bad
foo(() => bool = true);

// good
foo(() => {
  bool = true;
});
```

- 8.3In case the expression spans over multiple lines, wrap it in parentheses for better readability.Why? It shows clearly where the function starts and ends.// bad['get','post','put'].map((httpMethod)=>Object.prototype.hasOwnProperty.call(httpMagicObjectWithAVeryLongName,httpMethod,));// good['get','post','put'].map((httpMethod)=>(Object.prototype.hasOwnProperty.call(httpMagicObjectWithAVeryLongName,httpMethod,)));

8.3In case the expression spans over multiple lines, wrap it in parentheses for better readability.


Why? It shows clearly where the function starts and ends.


```javascript
// bad
['get', 'post', 'put'].map((httpMethod) => Object.prototype.hasOwnProperty.call(
    httpMagicObjectWithAVeryLongName,
    httpMethod,
  )
);

// good
['get', 'post', 'put'].map((httpMethod) => (
  Object.prototype.hasOwnProperty.call(
    httpMagicObjectWithAVeryLongName,
    httpMethod,
  )
));
```

- 8.4Always include parentheses around arguments for clarity and consistency. eslint:arrow-parensWhy? Minimizes diff churn when adding or removing arguments.// bad[1,2,3].map(x=>x*x);// good[1,2,3].map((x)=>x*x);// bad[1,2,3].map(number=>(`A long string with the${number}. It’s so long that we don’t want it to take up space on the .map line!`));// good[1,2,3].map((number)=>(`A long string with the${number}. It’s so long that we don’t want it to take up space on the .map line!`));// bad[1,2,3].map(x=>{consty=x+1;returnx*y;});// good[1,2,3].map((x)=>{consty=x+1;returnx*y;});

8.4Always include parentheses around arguments for clarity and consistency. eslint:arrow-parens


Why? Minimizes diff churn when adding or removing arguments.


```javascript
// bad
[1, 2, 3].map(x => x * x);

// good
[1, 2, 3].map((x) => x * x);

// bad
[1, 2, 3].map(number => (
  `A long string with the ${number}. It’s so long that we don’t want it to take up space on the .map line!`
));

// good
[1, 2, 3].map((number) => (
  `A long string with the ${number}. It’s so long that we don’t want it to take up space on the .map line!`
));

// bad
[1, 2, 3].map(x => {
  const y = x + 1;
  return x * y;
});

// good
[1, 2, 3].map((x) => {
  const y = x + 1;
  return x * y;
});
```

- 8.5Avoid confusing arrow function syntax (=>) with comparison operators (<=,>=). eslint:no-confusing-arrow// badconstitemHeight=(item)=>item.height<=256?item.largeSize:item.smallSize;// badconstitemHeight=(item)=>item.height>=256?item.largeSize:item.smallSize;// goodconstitemHeight=(item)=>(item.height<=256?item.largeSize:item.smallSize);// goodconstitemHeight=(item)=>{const{height,largeSize,smallSize}=item;returnheight<=256?largeSize:smallSize;};

8.5Avoid confusing arrow function syntax (=>) with comparison operators (<=,>=). eslint:no-confusing-arrow


```javascript
// bad
const itemHeight = (item) => item.height <= 256 ? item.largeSize : item.smallSize;

// bad
const itemHeight = (item) => item.height >= 256 ? item.largeSize : item.smallSize;

// good
const itemHeight = (item) => (item.height <= 256 ? item.largeSize : item.smallSize);

// good
const itemHeight = (item) => {
  const { height, largeSize, smallSize } = item;
  return height <= 256 ? largeSize : smallSize;
};
```

- 8.6Enforce the location of arrow function bodies with implicit returns. eslint:implicit-arrow-linebreak// bad(foo)=>bar;(foo)=>(bar);// good(foo)=>bar;(foo)=>(bar);(foo)=>(bar)

8.6Enforce the location of arrow function bodies with implicit returns. eslint:implicit-arrow-linebreak


```javascript
// bad
(foo) =>
  bar;

(foo) =>
  (bar);

// good
(foo) => bar;
(foo) => (bar);
(foo) => (
   bar
)
```


⬆ back to top


## Classes & Constructors

- 9.1Always useclass. Avoid manipulatingprototypedirectly.Why?classsyntax is more concise and easier to reason about.// badfunctionQueue(contents=[]){this.queue=[...contents];}Queue.prototype.pop=function(){constvalue=this.queue[0];this.queue.splice(0,1);returnvalue;};// goodclassQueue{constructor(contents=[]){this.queue=[...contents];}pop(){constvalue=this.queue[0];this.queue.splice(0,1);returnvalue;}}

9.1Always useclass. Avoid manipulatingprototypedirectly.


Why?classsyntax is more concise and easier to reason about.


```javascript
// bad
function Queue(contents = []) {
  this.queue = [...contents];
}
Queue.prototype.pop = function () {
  const value = this.queue[0];
  this.queue.splice(0, 1);
  return value;
};

// good
class Queue {
  constructor(contents = []) {
    this.queue = [...contents];
  }
  pop() {
    const value = this.queue[0];
    this.queue.splice(0, 1);
    return value;
  }
}
```

- 9.2Useextendsfor inheritance.Why? It is a built-in way to inherit prototype functionality without breakinginstanceof.// badconstinherits=require('inherits');functionPeekableQueue(contents){Queue.apply(this,contents);}inherits(PeekableQueue,Queue);PeekableQueue.prototype.peek=function(){returnthis.queue[0];};// goodclassPeekableQueueextendsQueue{peek(){returnthis.queue[0];}}

9.2Useextendsfor inheritance.


Why? It is a built-in way to inherit prototype functionality without breakinginstanceof.


```javascript
// bad
const inherits = require('inherits');
function PeekableQueue(contents) {
  Queue.apply(this, contents);
}
inherits(PeekableQueue, Queue);
PeekableQueue.prototype.peek = function () {
  return this.queue[0];
};

// good
class PeekableQueue extends Queue {
  peek() {
    return this.queue[0];
  }
}
```

- 9.3Methods can returnthisto help with method chaining.// badJedi.prototype.jump=function(){this.jumping=true;returntrue;};Jedi.prototype.setHeight=function(height){this.height=height;};constluke=newJedi();luke.jump();// => trueluke.setHeight(20);// => undefined// goodclassJedi{jump(){this.jumping=true;returnthis;}setHeight(height){this.height=height;returnthis;}}constluke=newJedi();luke.jump().setHeight(20);

9.3Methods can returnthisto help with method chaining.


```javascript
// bad
Jedi.prototype.jump = function () {
  this.jumping = true;
  return true;
};

Jedi.prototype.setHeight = function (height) {
  this.height = height;
};

const luke = new Jedi();
luke.jump(); // => true
luke.setHeight(20); // => undefined

// good
class Jedi {
  jump() {
    this.jumping = true;
    return this;
  }

  setHeight(height) {
    this.height = height;
    return this;
  }
}

const luke = new Jedi();

luke.jump()
  .setHeight(20);
```

- 9.4It’s okay to write a customtoString()method, just make sure it works successfully and causes no side effects.classJedi{constructor(options={}){this.name=options.name||'no name';}getName(){returnthis.name;}toString(){return`Jedi -${this.getName()}`;}}

9.4It’s okay to write a customtoString()method, just make sure it works successfully and causes no side effects.


```javascript
class Jedi {
  constructor(options = {}) {
    this.name = options.name || 'no name';
  }

  getName() {
    return this.name;
  }

  toString() {
    return `Jedi - ${this.getName()}`;
  }
}
```

- 9.5Classes have a default constructor if one is not specified. An empty constructor function or one that just delegates to a parent class is unnecessary. eslint:no-useless-constructor// badclassJedi{constructor(){}getName(){returnthis.name;}}// badclassReyextendsJedi{constructor(...args){super(...args);}}// goodclassReyextendsJedi{constructor(...args){super(...args);this.name='Rey';}}

9.5Classes have a default constructor if one is not specified. An empty constructor function or one that just delegates to a parent class is unnecessary. eslint:no-useless-constructor


```javascript
// bad
class Jedi {
  constructor() {}

  getName() {
    return this.name;
  }
}

// bad
class Rey extends Jedi {
  constructor(...args) {
    super(...args);
  }
}

// good
class Rey extends Jedi {
  constructor(...args) {
    super(...args);
    this.name = 'Rey';
  }
}
```

- 9.6Avoid duplicate class members. eslint:no-dupe-class-membersWhy? Duplicate class member declarations will silently prefer the last one - having duplicates is almost certainly a bug.// badclassFoo{bar(){return1;}bar(){return2;}}// goodclassFoo{bar(){return1;}}// goodclassFoo{bar(){return2;}}

9.6Avoid duplicate class members. eslint:no-dupe-class-members


Why? Duplicate class member declarations will silently prefer the last one - having duplicates is almost certainly a bug.


```javascript
// bad
class Foo {
  bar() { return 1; }
  bar() { return 2; }
}

// good
class Foo {
  bar() { return 1; }
}

// good
class Foo {
  bar() { return 2; }
}
```

- 9.7Class methods should usethisor be made into a static method unless an external library or framework requires using specific non-static methods. Being an instance method should indicate that it behaves differently based on properties of the receiver. eslint:class-methods-use-this// badclassFoo{bar(){console.log('bar');}}// good - this is usedclassFoo{bar(){console.log(this.bar);}}// good - constructor is exemptclassFoo{constructor(){// ...}}// good - static methods aren't expected to use thisclassFoo{staticbar(){console.log('bar');}}

9.7Class methods should usethisor be made into a static method unless an external library or framework requires using specific non-static methods. Being an instance method should indicate that it behaves differently based on properties of the receiver. eslint:class-methods-use-this


```javascript
// bad
class Foo {
  bar() {
    console.log('bar');
  }
}

// good - this is used
class Foo {
  bar() {
    console.log(this.bar);
  }
}

// good - constructor is exempt
class Foo {
  constructor() {
    // ...
  }
}

// good - static methods aren't expected to use this
class Foo {
  static bar() {
    console.log('bar');
  }
}
```


⬆ back to top


## Modules

- 10.1Always use modules (import/export) over a non-standard module system. You can always transpile to your preferred module system.Why? Modules are the future, let’s start using the future now.// badconstAirbnbStyleGuide=require('./AirbnbStyleGuide');module.exports=AirbnbStyleGuide.es6;// okimportAirbnbStyleGuidefrom'./AirbnbStyleGuide';exportdefaultAirbnbStyleGuide.es6;// bestimport{es6}from'./AirbnbStyleGuide';exportdefaultes6;

10.1Always use modules (import/export) over a non-standard module system. You can always transpile to your preferred module system.


Why? Modules are the future, let’s start using the future now.


```javascript
// bad
const AirbnbStyleGuide = require('./AirbnbStyleGuide');
module.exports = AirbnbStyleGuide.es6;

// ok
import AirbnbStyleGuide from './AirbnbStyleGuide';
export default AirbnbStyleGuide.es6;

// best
import { es6 } from './AirbnbStyleGuide';
export default es6;
```

- 10.2Do not use wildcard imports.Why? This makes sure you have a single default export.// badimport*asAirbnbStyleGuidefrom'./AirbnbStyleGuide';// goodimportAirbnbStyleGuidefrom'./AirbnbStyleGuide';

10.2Do not use wildcard imports.


Why? This makes sure you have a single default export.


```javascript
// bad
import * as AirbnbStyleGuide from './AirbnbStyleGuide';

// good
import AirbnbStyleGuide from './AirbnbStyleGuide';
```

- 10.3And do not export directly from an import.Why? Although the one-liner is concise, having one clear way to import and one clear way to export makes things consistent.// bad// filename es6.jsexport{es6asdefault}from'./AirbnbStyleGuide';// good// filename es6.jsimport{es6}from'./AirbnbStyleGuide';exportdefaultes6;

10.3And do not export directly from an import.


Why? Although the one-liner is concise, having one clear way to import and one clear way to export makes things consistent.


```javascript
// bad
// filename es6.js
export { es6 as default } from './AirbnbStyleGuide';

// good
// filename es6.js
import { es6 } from './AirbnbStyleGuide';
export default es6;
```

- 10.4Only import from a path in one place.
eslint:no-duplicate-importsWhy? Having multiple lines that import from the same path can make code harder to maintain.// badimportfoofrom'foo';// … some other imports … //import{named1,named2}from'foo';// goodimportfoo,{named1,named2}from'foo';// goodimportfoo,{named1,named2,}from'foo';

10.4Only import from a path in one place.
eslint:no-duplicate-imports


Why? Having multiple lines that import from the same path can make code harder to maintain.


```javascript
// bad
import foo from 'foo';
// … some other imports … //
import { named1, named2 } from 'foo';

// good
import foo, { named1, named2 } from 'foo';

// good
import foo, {
  named1,
  named2,
} from 'foo';
```

- 10.5Do not export mutable bindings.
eslint:import/no-mutable-exportsWhy? Mutation should be avoided in general, but in particular when exporting mutable bindings. While this technique may be needed for some special cases, in general, only constant references should be exported.// badletfoo=3;export{foo};// goodconstfoo=3;export{foo};

10.5Do not export mutable bindings.
eslint:import/no-mutable-exports


Why? Mutation should be avoided in general, but in particular when exporting mutable bindings. While this technique may be needed for some special cases, in general, only constant references should be exported.


```javascript
// bad
let foo = 3;
export { foo };

// good
const foo = 3;
export { foo };
```

- 10.6In modules with a single export, prefer default export over named export.
eslint:import/prefer-default-exportWhy? To encourage more files that only ever export one thing, which is better for readability and maintainability.// badexportfunctionfoo(){}// goodexportdefaultfunctionfoo(){}

10.6In modules with a single export, prefer default export over named export.
eslint:import/prefer-default-export


Why? To encourage more files that only ever export one thing, which is better for readability and maintainability.


```javascript
// bad
export function foo() {}

// good
export default function foo() {}
```

- 10.7Put allimports above non-import statements.
eslint:import/firstWhy? Sinceimports are hoisted, keeping them all at the top prevents surprising behavior.// badimportfoofrom'foo';foo.init();importbarfrom'bar';// goodimportfoofrom'foo';importbarfrom'bar';foo.init();

10.7Put allimports above non-import statements.
eslint:import/first


Why? Sinceimports are hoisted, keeping them all at the top prevents surprising behavior.


```javascript
// bad
import foo from 'foo';
foo.init();

import bar from 'bar';

// good
import foo from 'foo';
import bar from 'bar';

foo.init();
```

- 10.8Multiline imports should be indented just like multiline array and object literals.
eslint:object-curly-newlineWhy? The curly braces follow the same indentation rules as every other curly brace block in the style guide, as do the trailing commas.// badimport{longNameA,longNameB,longNameC,longNameD,longNameE}from'path';// goodimport{longNameA,longNameB,longNameC,longNameD,longNameE,}from'path';

10.8Multiline imports should be indented just like multiline array and object literals.
eslint:object-curly-newline


Why? The curly braces follow the same indentation rules as every other curly brace block in the style guide, as do the trailing commas.


```javascript
// bad
import {longNameA, longNameB, longNameC, longNameD, longNameE} from 'path';

// good
import {
  longNameA,
  longNameB,
  longNameC,
  longNameD,
  longNameE,
} from 'path';
```

- 10.9Disallow Webpack loader syntax in module import statements.
eslint:import/no-webpack-loader-syntaxWhy? Since using Webpack syntax in the imports couples the code to a module bundler. Prefer using the loader syntax inwebpack.config.js.// badimportfooSassfrom'css!sass!foo.scss';importbarCssfrom'style!css!bar.css';// goodimportfooSassfrom'foo.scss';importbarCssfrom'bar.css';

10.9Disallow Webpack loader syntax in module import statements.
eslint:import/no-webpack-loader-syntax


Why? Since using Webpack syntax in the imports couples the code to a module bundler. Prefer using the loader syntax inwebpack.config.js.


```javascript
// bad
import fooSass from 'css!sass!foo.scss';
import barCss from 'style!css!bar.css';

// good
import fooSass from 'foo.scss';
import barCss from 'bar.css';
```

- 10.10Do not include JavaScript filename extensions
eslint:import/extensionsWhy? Including extensions inhibits refactoring, and inappropriately hardcodes implementation details of the module you're importing in every consumer.// badimportfoofrom'./foo.js';importbarfrom'./bar.jsx';importbazfrom'./baz/index.jsx';// goodimportfoofrom'./foo';importbarfrom'./bar';importbazfrom'./baz';

10.10Do not include JavaScript filename extensions
eslint:import/extensions


Why? Including extensions inhibits refactoring, and inappropriately hardcodes implementation details of the module you're importing in every consumer.


```javascript
// bad
import foo from './foo.js';
import bar from './bar.jsx';
import baz from './baz/index.jsx';

// good
import foo from './foo';
import bar from './bar';
import baz from './baz';
```


⬆ back to top


## Iterators and Generators

- 11.1Don’t use iterators. Prefer JavaScript’s higher-order functions instead of loops likefor-inorfor-of. eslint:no-iteratorno-restricted-syntaxWhy? This enforces our immutable rule. Dealing with pure functions that return values is easier to reason about than side effects.Usemap()/every()/filter()/find()/findIndex()/reduce()/some()/ ... to iterate over arrays, andObject.keys()/Object.values()/Object.entries()to produce arrays so you can iterate over objects.constnumbers=[1,2,3,4,5];// badletsum=0;for(letnumofnumbers){sum+=num;}sum===15;// goodletsum=0;numbers.forEach((num)=>{sum+=num;});sum===15;// best (use the functional force)constsum=numbers.reduce((total,num)=>total+num,0);sum===15;// badconstincreasedByOne=[];for(leti=0;i<numbers.length;i++){increasedByOne.push(numbers[i]+1);}// goodconstincreasedByOne=[];numbers.forEach((num)=>{increasedByOne.push(num+1);});// best (keeping it functional)constincreasedByOne=numbers.map((num)=>num+1);

11.1Don’t use iterators. Prefer JavaScript’s higher-order functions instead of loops likefor-inorfor-of. eslint:no-iteratorno-restricted-syntax


Why? This enforces our immutable rule. Dealing with pure functions that return values is easier to reason about than side effects.


Usemap()/every()/filter()/find()/findIndex()/reduce()/some()/ ... to iterate over arrays, andObject.keys()/Object.values()/Object.entries()to produce arrays so you can iterate over objects.


```javascript
const numbers = [1, 2, 3, 4, 5];

// bad
let sum = 0;
for (let num of numbers) {
  sum += num;
}
sum === 15;

// good
let sum = 0;
numbers.forEach((num) => {
  sum += num;
});
sum === 15;

// best (use the functional force)
const sum = numbers.reduce((total, num) => total + num, 0);
sum === 15;

// bad
const increasedByOne = [];
for (let i = 0; i < numbers.length; i++) {
  increasedByOne.push(numbers[i] + 1);
}

// good
const increasedByOne = [];
numbers.forEach((num) => {
  increasedByOne.push(num + 1);
});

// best (keeping it functional)
const increasedByOne = numbers.map((num) => num + 1);
```

- 11.2Don’t use generators for now.Why? They don’t transpile well to ES5.

11.2Don’t use generators for now.


Why? They don’t transpile well to ES5.

- 11.3If you must use generators, or if you disregardour advice, make sure their function signature is spaced properly. eslint:generator-star-spacingWhy?functionand*are part of the same conceptual keyword -*is not a modifier forfunction,function*is a unique construct, different fromfunction.// badfunction*foo(){// ...}// badconstbar=function*(){// ...};// badconstbaz=function*(){// ...};// badconstquux=function*(){// ...};// badfunction*foo(){// ...}// badfunction*foo(){// ...}// very badfunction*foo(){// ...}// very badconstwat=function*(){// ...};// goodfunction*foo(){// ...}// goodconstfoo=function*(){// ...};

11.3If you must use generators, or if you disregardour advice, make sure their function signature is spaced properly. eslint:generator-star-spacing


Why?functionand*are part of the same conceptual keyword -*is not a modifier forfunction,function*is a unique construct, different fromfunction.


```javascript
// bad
function * foo() {
  // ...
}

// bad
const bar = function * () {
  // ...
};

// bad
const baz = function *() {
  // ...
};

// bad
const quux = function*() {
  // ...
};

// bad
function*foo() {
  // ...
}

// bad
function *foo() {
  // ...
}

// very bad
function
*
foo() {
  // ...
}

// very bad
const wat = function
*
() {
  // ...
};

// good
function* foo() {
  // ...
}

// good
const foo = function* () {
  // ...
};
```


⬆ back to top


## Properties

- 12.1Use dot notation when accessing properties. eslint:dot-notationconstluke={jedi:true,age:28,};// badconstisJedi=luke['jedi'];// goodconstisJedi=luke.jedi;

12.1Use dot notation when accessing properties. eslint:dot-notation


```javascript
const luke = {
  jedi: true,
  age: 28,
};

// bad
const isJedi = luke['jedi'];

// good
const isJedi = luke.jedi;
```

- 12.2Use bracket notation[]when accessing properties with a variable.constluke={jedi:true,age:28,};functiongetProp(prop){returnluke[prop];}constisJedi=getProp('jedi');

12.2Use bracket notation[]when accessing properties with a variable.


```javascript
const luke = {
  jedi: true,
  age: 28,
};

function getProp(prop) {
  return luke[prop];
}

const isJedi = getProp('jedi');
```

- 12.3Use exponentiation operator**when calculating exponentiations. eslint:prefer-exponentiation-operator.// badconstbinary=Math.pow(2,10);// goodconstbinary=2**10;

12.3Use exponentiation operator**when calculating exponentiations. eslint:prefer-exponentiation-operator.


```javascript
// bad
const binary = Math.pow(2, 10);

// good
const binary = 2 ** 10;
```


⬆ back to top


## Variables

- 13.1Always useconstorletto declare variables. Not doing so will result in global variables. We want to avoid polluting the global namespace. Captain Planet warned us of that. eslint:no-undefprefer-const// badsuperPower=newSuperPower();// goodconstsuperPower=newSuperPower();

13.1Always useconstorletto declare variables. Not doing so will result in global variables. We want to avoid polluting the global namespace. Captain Planet warned us of that. eslint:no-undefprefer-const


```javascript
// bad
superPower = new SuperPower();

// good
const superPower = new SuperPower();
```

- 13.2Use oneconstorletdeclaration per variable or assignment. eslint:one-varWhy? It’s easier to add new variable declarations this way, and you never have to worry about swapping out a;for a,or introducing punctuation-only diffs. You can also step through each declaration with the debugger, instead of jumping through all of them at once.// badconstitems=getItems(),goSportsTeam=true,dragonball='z';// bad// (compare to above, and try to spot the mistake)constitems=getItems(),goSportsTeam=true;dragonball='z';// goodconstitems=getItems();constgoSportsTeam=true;constdragonball='z';

13.2Use oneconstorletdeclaration per variable or assignment. eslint:one-var


Why? It’s easier to add new variable declarations this way, and you never have to worry about swapping out a;for a,or introducing punctuation-only diffs. You can also step through each declaration with the debugger, instead of jumping through all of them at once.


```javascript
// bad
const items = getItems(),
    goSportsTeam = true,
    dragonball = 'z';

// bad
// (compare to above, and try to spot the mistake)
const items = getItems(),
    goSportsTeam = true;
    dragonball = 'z';

// good
const items = getItems();
const goSportsTeam = true;
const dragonball = 'z';
```

- 13.3Group all yourconsts and then group all yourlets.Why? This is helpful when later on you might need to assign a variable depending on one of the previously assigned variables.// badleti,len,dragonball,items=getItems(),goSportsTeam=true;// badleti;constitems=getItems();letdragonball;constgoSportsTeam=true;letlen;// goodconstgoSportsTeam=true;constitems=getItems();letdragonball;leti;letlength;

13.3Group all yourconsts and then group all yourlets.


Why? This is helpful when later on you might need to assign a variable depending on one of the previously assigned variables.


```javascript
// bad
let i, len, dragonball,
    items = getItems(),
    goSportsTeam = true;

// bad
let i;
const items = getItems();
let dragonball;
const goSportsTeam = true;
let len;

// good
const goSportsTeam = true;
const items = getItems();
let dragonball;
let i;
let length;
```

- 13.4Assign variables where you need them, but place them in a reasonable place.Why?letandconstare block scoped and not function scoped.// bad - unnecessary function callfunctioncheckName(hasName){constname=getName();if(hasName==='test'){returnfalse;}if(name==='test'){this.setName('');returnfalse;}returnname;}// goodfunctioncheckName(hasName){if(hasName==='test'){returnfalse;}constname=getName();if(name==='test'){this.setName('');returnfalse;}returnname;}

13.4Assign variables where you need them, but place them in a reasonable place.


Why?letandconstare block scoped and not function scoped.


```javascript
// bad - unnecessary function call
function checkName(hasName) {
  const name = getName();

  if (hasName === 'test') {
    return false;
  }

  if (name === 'test') {
    this.setName('');
    return false;
  }

  return name;
}

// good
function checkName(hasName) {
  if (hasName === 'test') {
    return false;
  }

  const name = getName();

  if (name === 'test') {
    this.setName('');
    return false;
  }

  return name;
}
```

- 13.5Don’t chain variable assignments. eslint:no-multi-assignWhy? Chaining variable assignments creates implicit global variables.// bad(functionexample(){// JavaScript interprets this as// let a = ( b = ( c = 1 ) );// The let keyword only applies to variable a; variables b and c become// global variables.leta=b=c=1;}());console.log(a);// throws ReferenceErrorconsole.log(b);// 1console.log(c);// 1// good(functionexample(){leta=1;letb=a;letc=a;}());console.log(a);// throws ReferenceErrorconsole.log(b);// throws ReferenceErrorconsole.log(c);// throws ReferenceError// the same applies for `const`

13.5Don’t chain variable assignments. eslint:no-multi-assign


Why? Chaining variable assignments creates implicit global variables.


```javascript
// bad
(function example() {
  // JavaScript interprets this as
  // let a = ( b = ( c = 1 ) );
  // The let keyword only applies to variable a; variables b and c become
  // global variables.
  let a = b = c = 1;
}());

console.log(a); // throws ReferenceError
console.log(b); // 1
console.log(c); // 1

// good
(function example() {
  let a = 1;
  let b = a;
  let c = a;
}());

console.log(a); // throws ReferenceError
console.log(b); // throws ReferenceError
console.log(c); // throws ReferenceError

// the same applies for `const`
```

- 13.6Avoid using unary increments and decrements (++,--). eslintno-plusplusWhy? Per the eslint documentation, unary increment and decrement statements are subject to automatic semicolon insertion and can cause silent errors with incrementing or decrementing values within an application. It is also more expressive to mutate your values with statements likenum += 1instead ofnum++ornum ++. Disallowing unary increment and decrement statements also prevents you from pre-incrementing/pre-decrementing values unintentionally which can also cause unexpected behavior in your programs.// badconstarray=[1,2,3];letnum=1;num++;--num;letsum=0;lettruthyCount=0;for(leti=0;i<array.length;i++){letvalue=array[i];sum+=value;if(value){truthyCount++;}}// goodconstarray=[1,2,3];letnum=1;num+=1;num-=1;constsum=array.reduce((a,b)=>a+b,0);consttruthyCount=array.filter(Boolean).length;

13.6Avoid using unary increments and decrements (++,--). eslintno-plusplus


Why? Per the eslint documentation, unary increment and decrement statements are subject to automatic semicolon insertion and can cause silent errors with incrementing or decrementing values within an application. It is also more expressive to mutate your values with statements likenum += 1instead ofnum++ornum ++. Disallowing unary increment and decrement statements also prevents you from pre-incrementing/pre-decrementing values unintentionally which can also cause unexpected behavior in your programs.


```javascript
// bad

const array = [1, 2, 3];
let num = 1;
num++;
--num;

let sum = 0;
let truthyCount = 0;
for (let i = 0; i < array.length; i++) {
  let value = array[i];
  sum += value;
  if (value) {
    truthyCount++;
  }
}

// good

const array = [1, 2, 3];
let num = 1;
num += 1;
num -= 1;

const sum = array.reduce((a, b) => a + b, 0);
const truthyCount = array.filter(Boolean).length;
```

- 13.7Avoid linebreaks before or after=in an assignment. If your assignment violatesmax-len, surround the value in parens. eslintoperator-linebreak.Why? Linebreaks surrounding=can obfuscate the value of an assignment.// badconstfoo=superLongLongLongLongLongLongLongLongFunctionName();// badconstfoo='superLongLongLongLongLongLongLongLongString';// goodconstfoo=(superLongLongLongLongLongLongLongLongFunctionName());// goodconstfoo='superLongLongLongLongLongLongLongLongString';

13.7Avoid linebreaks before or after=in an assignment. If your assignment violatesmax-len, surround the value in parens. eslintoperator-linebreak.


Why? Linebreaks surrounding=can obfuscate the value of an assignment.


```javascript
// bad
const foo =
  superLongLongLongLongLongLongLongLongFunctionName();

// bad
const foo
  = 'superLongLongLongLongLongLongLongLongString';

// good
const foo = (
  superLongLongLongLongLongLongLongLongFunctionName()
);

// good
const foo = 'superLongLongLongLongLongLongLongLongString';
```

- 13.8Disallow unused variables. eslint:no-unused-varsWhy? Variables that are declared and not used anywhere in the code are most likely an error due to incomplete refactoring. Such variables take up space in the code and can lead to confusion by readers.// badconstsome_unused_var=42;// Write-only variables are not considered as used.lety=10;y=5;// A read for a modification of itself is not considered as used.letz=0;z=z+1;// Unused function arguments.functiongetX(x,y){returnx;}// goodfunctiongetXPlusY(x,y){returnx+y;}constx=1;consty=a+2;alert(getXPlusY(x,y));// 'type' is ignored even if unused because it has a rest property sibling.// This is a form of extracting an object that omits the specified keys.const{type,...coords}=data;// 'coords' is now the 'data' object without its 'type' property.

13.8Disallow unused variables. eslint:no-unused-vars


Why? Variables that are declared and not used anywhere in the code are most likely an error due to incomplete refactoring. Such variables take up space in the code and can lead to confusion by readers.


```javascript
// bad

const some_unused_var = 42;

// Write-only variables are not considered as used.
let y = 10;
y = 5;

// A read for a modification of itself is not considered as used.
let z = 0;
z = z + 1;

// Unused function arguments.
function getX(x, y) {
    return x;
}

// good

function getXPlusY(x, y) {
  return x + y;
}

const x = 1;
const y = a + 2;

alert(getXPlusY(x, y));

// 'type' is ignored even if unused because it has a rest property sibling.
// This is a form of extracting an object that omits the specified keys.
const { type, ...coords } = data;
// 'coords' is now the 'data' object without its 'type' property.
```


⬆ back to top


## Hoisting

- 14.1vardeclarations get hoisted to the top of their closest enclosing function scope, their assignment does not.constandletdeclarations are blessed with a new concept calledTemporal Dead Zones (TDZ). It’s important to know whytypeof is no longer safe.// we know this wouldn’t work (assuming there// is no notDefined global variable)functionexample(){console.log(notDefined);// => throws a ReferenceError}// creating a variable declaration after you// reference the variable will work due to// variable hoisting. Note: the assignment// value of `true` is not hoisted.functionexample(){console.log(declaredButNotAssigned);// => undefinedvardeclaredButNotAssigned=true;}// the interpreter is hoisting the variable// declaration to the top of the scope,// which means our example could be rewritten as:functionexample(){letdeclaredButNotAssigned;console.log(declaredButNotAssigned);// => undefineddeclaredButNotAssigned=true;}// using const and letfunctionexample(){console.log(declaredButNotAssigned);// => throws a ReferenceErrorconsole.log(typeofdeclaredButNotAssigned);// => throws a ReferenceErrorconstdeclaredButNotAssigned=true;}

14.1vardeclarations get hoisted to the top of their closest enclosing function scope, their assignment does not.constandletdeclarations are blessed with a new concept calledTemporal Dead Zones (TDZ). It’s important to know whytypeof is no longer safe.


```javascript
// we know this wouldn’t work (assuming there
// is no notDefined global variable)
function example() {
  console.log(notDefined); // => throws a ReferenceError
}

// creating a variable declaration after you
// reference the variable will work due to
// variable hoisting. Note: the assignment
// value of `true` is not hoisted.
function example() {
  console.log(declaredButNotAssigned); // => undefined
  var declaredButNotAssigned = true;
}

// the interpreter is hoisting the variable
// declaration to the top of the scope,
// which means our example could be rewritten as:
function example() {
  let declaredButNotAssigned;
  console.log(declaredButNotAssigned); // => undefined
  declaredButNotAssigned = true;
}

// using const and let
function example() {
  console.log(declaredButNotAssigned); // => throws a ReferenceError
  console.log(typeof declaredButNotAssigned); // => throws a ReferenceError
  const declaredButNotAssigned = true;
}
```

- 14.2Anonymous function expressions hoist their variable name, but not the function assignment.functionexample(){console.log(anonymous);// => undefinedanonymous();// => TypeError anonymous is not a functionvaranonymous=function(){console.log('anonymous function expression');};}

14.2Anonymous function expressions hoist their variable name, but not the function assignment.


```javascript
function example() {
  console.log(anonymous); // => undefined

  anonymous(); // => TypeError anonymous is not a function

  var anonymous = function () {
    console.log('anonymous function expression');
  };
}
```

- 14.3Named function expressions hoist the variable name, not the function name or the function body.functionexample(){console.log(named);// => undefinednamed();// => TypeError named is not a functionsuperPower();// => ReferenceError superPower is not definedvarnamed=functionsuperPower(){console.log('Flying');};}// the same is true when the function name// is the same as the variable name.functionexample(){console.log(named);// => undefinednamed();// => TypeError named is not a functionvarnamed=functionnamed(){console.log('named');};}

14.3Named function expressions hoist the variable name, not the function name or the function body.


```javascript
function example() {
  console.log(named); // => undefined

  named(); // => TypeError named is not a function

  superPower(); // => ReferenceError superPower is not defined

  var named = function superPower() {
    console.log('Flying');
  };
}

// the same is true when the function name
// is the same as the variable name.
function example() {
  console.log(named); // => undefined

  named(); // => TypeError named is not a function

  var named = function named() {
    console.log('named');
  };
}
```

- 14.4Function declarations hoist their name and the function body.functionexample(){superPower();// => FlyingfunctionsuperPower(){console.log('Flying');}}

14.4Function declarations hoist their name and the function body.


```javascript
function example() {
  superPower(); // => Flying

  function superPower() {
    console.log('Flying');
  }
}
```

- 14.5Variables, classes, and functions should be defined before they can be used. eslint:no-use-before-defineWhy? When variables, classes, or functions are declared after being used, it can harm readability since a reader won't know what a thing that's referenced is. It's much clearer for a reader to first encounter the source of a thing (whether imported from another module, or defined in the file) before encountering a use of the thing.// bad// Variable a is being used before it is being defined.console.log(a);// this will be undefined, since while the declaration is hoisted, the initialization is notvara=10;// Function fun is being called before being defined.fun();functionfun(){}// Class A is being used before being defined.newA();// ReferenceError: Cannot access 'A' before initializationclassA{}// `let` and `const` are hoisted, but they don't have a default initialization.// The variables 'a' and 'b' are in a Temporal Dead Zone where JavaScript// knows they exist (declaration is hoisted) but they are not accessible// (as they are not yet initialized).console.log(a);// ReferenceError: Cannot access 'a' before initializationconsole.log(b);// ReferenceError: Cannot access 'b' before initializationleta=10;constb=5;// goodvara=10;console.log(a);// 10functionfun(){}fun();classA{}newA();leta=10;constb=5;console.log(a);// 10console.log(b);// 5
- For more information refer toJavaScript Scoping & HoistingbyBen Cherry.

14.5Variables, classes, and functions should be defined before they can be used. eslint:no-use-before-define


Why? When variables, classes, or functions are declared after being used, it can harm readability since a reader won't know what a thing that's referenced is. It's much clearer for a reader to first encounter the source of a thing (whether imported from another module, or defined in the file) before encountering a use of the thing.


```javascript
// bad

// Variable a is being used before it is being defined.
console.log(a); // this will be undefined, since while the declaration is hoisted, the initialization is not
var a = 10;

// Function fun is being called before being defined.
fun();
function fun() {}

// Class A is being used before being defined.
new A(); // ReferenceError: Cannot access 'A' before initialization
class A {
}

// `let` and `const` are hoisted, but they don't have a default initialization.
// The variables 'a' and 'b' are in a Temporal Dead Zone where JavaScript
// knows they exist (declaration is hoisted) but they are not accessible
// (as they are not yet initialized).

console.log(a); // ReferenceError: Cannot access 'a' before initialization
console.log(b); // ReferenceError: Cannot access 'b' before initialization
let a = 10;
const b = 5;


// good

var a = 10;
console.log(a); // 10

function fun() {}
fun();

class A {
}
new A();

let a = 10;
const b = 5;
console.log(a); // 10
console.log(b); // 5
```


For more information refer toJavaScript Scoping & HoistingbyBen Cherry.


⬆ back to top


## Comparison Operators & Equality

- 15.1Use===and!==over==and!=. eslint:eqeqeq
- 15.2Conditional statements such as theifstatement evaluate their expression using coercion with theToBooleanabstract method and always follow these simple rules:Objectsevaluate totrueUndefinedevaluates tofalseNullevaluates tofalseBooleansevaluate tothe value of the booleanNumbersevaluate tofalseif+0, -0, or NaN, otherwisetrueStringsevaluate tofalseif an empty string'', otherwisetrueif([0]&&[]){// true// an array (even an empty one) is an object, objects will evaluate to true}
- Objectsevaluate totrue
- Undefinedevaluates tofalse
- Nullevaluates tofalse
- Booleansevaluate tothe value of the boolean
- Numbersevaluate tofalseif+0, -0, or NaN, otherwisetrue
- Stringsevaluate tofalseif an empty string'', otherwisetrue

15.2Conditional statements such as theifstatement evaluate their expression using coercion with theToBooleanabstract method and always follow these simple rules:

- Objectsevaluate totrue
- Undefinedevaluates tofalse
- Nullevaluates tofalse
- Booleansevaluate tothe value of the boolean
- Numbersevaluate tofalseif+0, -0, or NaN, otherwisetrue
- Stringsevaluate tofalseif an empty string'', otherwisetrue

```javascript
if ([0] && []) {
  // true
  // an array (even an empty one) is an object, objects will evaluate to true
}
```

- 15.3Use shortcuts for booleans, but explicit comparisons for strings and numbers.// badif(isValid===true){// ...}// goodif(isValid){// ...}// badif(name){// ...}// goodif(name!==''){// ...}// badif(collection.length){// ...}// goodif(collection.length>0){// ...}

15.3Use shortcuts for booleans, but explicit comparisons for strings and numbers.


```javascript
// bad
if (isValid === true) {
  // ...
}

// good
if (isValid) {
  // ...
}

// bad
if (name) {
  // ...
}

// good
if (name !== '') {
  // ...
}

// bad
if (collection.length) {
  // ...
}

// good
if (collection.length > 0) {
  // ...
}
```

- 15.4For more information seeTruth, Equality, and JavaScriptby Angus Croll.
- 15.5Use braces to create blocks incaseanddefaultclauses that contain lexical declarations (e.g.let,const,function, andclass). eslint:no-case-declarationsWhy? Lexical declarations are visible in the entireswitchblock but only get initialized when assigned, which only happens when itscaseis reached. This causes problems when multiplecaseclauses attempt to define the same thing.// badswitch(foo){case1:letx=1;break;case2:consty=2;break;case3:functionf(){// ...}break;default:classC{}}// goodswitch(foo){case1:{letx=1;break;}case2:{consty=2;break;}case3:{functionf(){// ...}break;}case4:bar();break;default:{classC{}}}

15.5Use braces to create blocks incaseanddefaultclauses that contain lexical declarations (e.g.let,const,function, andclass). eslint:no-case-declarations


Why? Lexical declarations are visible in the entireswitchblock but only get initialized when assigned, which only happens when itscaseis reached. This causes problems when multiplecaseclauses attempt to define the same thing.


```javascript
// bad
switch (foo) {
  case 1:
    let x = 1;
    break;
  case 2:
    const y = 2;
    break;
  case 3:
    function f() {
      // ...
    }
    break;
  default:
    class C {}
}

// good
switch (foo) {
  case 1: {
    let x = 1;
    break;
  }
  case 2: {
    const y = 2;
    break;
  }
  case 3: {
    function f() {
      // ...
    }
    break;
  }
  case 4:
    bar();
    break;
  default: {
    class C {}
  }
}
```

- 15.6Ternaries should not be nested and generally be single line expressions. eslint:no-nested-ternary// badconstfoo=maybe1>maybe2?"bar":value1>value2?"baz":null;// split into 2 separated ternary expressionsconstmaybeNull=value1>value2?'baz':null;// betterconstfoo=maybe1>maybe2?'bar':maybeNull;// bestconstfoo=maybe1>maybe2?'bar':maybeNull;

15.6Ternaries should not be nested and generally be single line expressions. eslint:no-nested-ternary


```javascript
// bad
const foo = maybe1 > maybe2
  ? "bar"
  : value1 > value2 ? "baz" : null;

// split into 2 separated ternary expressions
const maybeNull = value1 > value2 ? 'baz' : null;

// better
const foo = maybe1 > maybe2
  ? 'bar'
  : maybeNull;

// best
const foo = maybe1 > maybe2 ? 'bar' : maybeNull;
```

- 15.7Avoid unneeded ternary statements. eslint:no-unneeded-ternary// badconstfoo=a?a:b;constbar=c?true:false;constbaz=c?false:true;constquux=a!=null?a:b;// goodconstfoo=a||b;constbar=!!c;constbaz=!c;constquux=a??b;

15.7Avoid unneeded ternary statements. eslint:no-unneeded-ternary


```javascript
// bad
const foo = a ? a : b;
const bar = c ? true : false;
const baz = c ? false : true;
const quux = a != null ? a : b;

// good
const foo = a || b;
const bar = !!c;
const baz = !c;
const quux = a ?? b;
```

- 15.8When mixing operators, enclose them in parentheses. The only exception is the standard arithmetic operators:+,-, and**since their precedence is broadly understood. We recommend enclosing/and*in parentheses because their precedence can be ambiguous when they are mixed.
eslint:no-mixed-operatorsWhy? This improves readability and clarifies the developer’s intention.// badconstfoo=a&&b<0||c>0||d+1===0;// badconstbar=a**b-5%d;// bad// one may be confused into thinking (a || b) && cif(a||b&&c){returnd;}// badconstbar=a+b/c*d;// goodconstfoo=(a&&b<0)||c>0||(d+1===0);// goodconstbar=a**b-(5%d);// goodif(a||(b&&c)){returnd;}// goodconstbar=a+(b/c)*d;

15.8When mixing operators, enclose them in parentheses. The only exception is the standard arithmetic operators:+,-, and**since their precedence is broadly understood. We recommend enclosing/and*in parentheses because their precedence can be ambiguous when they are mixed.
eslint:no-mixed-operators


Why? This improves readability and clarifies the developer’s intention.


```javascript
// bad
const foo = a && b < 0 || c > 0 || d + 1 === 0;

// bad
const bar = a ** b - 5 % d;

// bad
// one may be confused into thinking (a || b) && c
if (a || b && c) {
  return d;
}

// bad
const bar = a + b / c * d;

// good
const foo = (a && b < 0) || c > 0 || (d + 1 === 0);

// good
const bar = a ** b - (5 % d);

// good
if (a || (b && c)) {
  return d;
}

// good
const bar = a + (b / c) * d;
```

- 15.9The nullish coalescing operator (??) is a logical operator that returns its right-hand side operand when its left-hand side operand isnullorundefined. Otherwise, it returns the left-hand side operand.Why? It provides precision by distinguishing null/undefined from other falsy values, enhancing code clarity and predictability.// badconstvalue=0??'default';// returns 0, not 'default'// badconstvalue=''??'default';// returns '', not 'default'// goodconstvalue=null??'default';// returns 'default'// goodconstuser={name:'John',age:null};constage=user.age??18;// returns 18

15.9The nullish coalescing operator (??) is a logical operator that returns its right-hand side operand when its left-hand side operand isnullorundefined. Otherwise, it returns the left-hand side operand.


Why? It provides precision by distinguishing null/undefined from other falsy values, enhancing code clarity and predictability.


```javascript
// bad
const value = 0 ?? 'default';
// returns 0, not 'default'

// bad
const value = '' ?? 'default';
// returns '', not 'default'

// good
const value = null ?? 'default';
// returns 'default'

// good
const user = {
  name: 'John',
  age: null
};
const age = user.age ?? 18;
// returns 18
```


⬆ back to top


## Blocks

- 16.1Use braces with all multiline blocks. eslint:nonblock-statement-body-position// badif(test)returnfalse;// goodif(test)returnfalse;// goodif(test){returnfalse;}// badfunctionfoo(){returnfalse;}// goodfunctionbar(){returnfalse;}

16.1Use braces with all multiline blocks. eslint:nonblock-statement-body-position


```javascript
// bad
if (test)
  return false;

// good
if (test) return false;

// good
if (test) {
  return false;
}

// bad
function foo() { return false; }

// good
function bar() {
  return false;
}
```

- 16.2If you’re using multiline blocks withifandelse, putelseon the same line as yourifblock’s closing brace. eslint:brace-style// badif(test){thing1();thing2();}else{thing3();}// goodif(test){thing1();thing2();}else{thing3();}

16.2If you’re using multiline blocks withifandelse, putelseon the same line as yourifblock’s closing brace. eslint:brace-style


```javascript
// bad
if (test) {
  thing1();
  thing2();
}
else {
  thing3();
}

// good
if (test) {
  thing1();
  thing2();
} else {
  thing3();
}
```

- 16.3If anifblock always executes areturnstatement, the subsequentelseblock is unnecessary. Areturnin anelse ifblock following anifblock that contains areturncan be separated into multipleifblocks. eslint:no-else-return// badfunctionfoo(){if(x){returnx;}else{returny;}}// badfunctioncats(){if(x){returnx;}elseif(y){returny;}}// badfunctiondogs(){if(x){returnx;}else{if(y){returny;}}}// goodfunctionfoo(){if(x){returnx;}returny;}// goodfunctioncats(){if(x){returnx;}if(y){returny;}}// goodfunctiondogs(x){if(x){if(z){returny;}}else{returnz;}}

16.3If anifblock always executes areturnstatement, the subsequentelseblock is unnecessary. Areturnin anelse ifblock following anifblock that contains areturncan be separated into multipleifblocks. eslint:no-else-return


```javascript
// bad
function foo() {
  if (x) {
    return x;
  } else {
    return y;
  }
}

// bad
function cats() {
  if (x) {
    return x;
  } else if (y) {
    return y;
  }
}

// bad
function dogs() {
  if (x) {
    return x;
  } else {
    if (y) {
      return y;
    }
  }
}

// good
function foo() {
  if (x) {
    return x;
  }

  return y;
}

// good
function cats() {
  if (x) {
    return x;
  }

  if (y) {
    return y;
  }
}

// good
function dogs(x) {
  if (x) {
    if (z) {
      return y;
    }
  } else {
    return z;
  }
}
```


⬆ back to top


## Control Statements

- 17.1In case your control statement (if,whileetc.) gets too long or exceeds the maximum line length, each (grouped) condition could be put into a new line. The logical operator should begin the line.Why? Requiring operators at the beginning of the line keeps the operators aligned and follows a pattern similar to method chaining. This also improves readability by making it easier to visually follow complex logic.// badif((foo===123||bar==='abc')&&doesItLookGoodWhenItBecomesThatLong()&&isThisReallyHappening()){thing1();}// badif(foo===123&&bar==='abc'){thing1();}// badif(foo===123&&bar==='abc'){thing1();}// badif(foo===123&&bar==='abc'){thing1();}// goodif(foo===123&&bar==='abc'){thing1();}// goodif((foo===123||bar==='abc')&&doesItLookGoodWhenItBecomesThatLong()&&isThisReallyHappening()){thing1();}// goodif(foo===123&&bar==='abc'){thing1();}

17.1In case your control statement (if,whileetc.) gets too long or exceeds the maximum line length, each (grouped) condition could be put into a new line. The logical operator should begin the line.


Why? Requiring operators at the beginning of the line keeps the operators aligned and follows a pattern similar to method chaining. This also improves readability by making it easier to visually follow complex logic.


```javascript
// bad
if ((foo === 123 || bar === 'abc') && doesItLookGoodWhenItBecomesThatLong() && isThisReallyHappening()) {
  thing1();
}

// bad
if (foo === 123 &&
  bar === 'abc') {
  thing1();
}

// bad
if (foo === 123
  && bar === 'abc') {
  thing1();
}

// bad
if (
  foo === 123 &&
  bar === 'abc'
) {
  thing1();
}

// good
if (
  foo === 123
  && bar === 'abc'
) {
  thing1();
}

// good
if (
  (foo === 123 || bar === 'abc')
  && doesItLookGoodWhenItBecomesThatLong()
  && isThisReallyHappening()
) {
  thing1();
}

// good
if (foo === 123 && bar === 'abc') {
  thing1();
}
```

- 17.2Don't use selection operators in place of control statements.// bad!isRunning&&startRunning();// goodif(!isRunning){startRunning();}

17.2Don't use selection operators in place of control statements.


```javascript
// bad
!isRunning && startRunning();

// good
if (!isRunning) {
  startRunning();
}
```


⬆ back to top


## Comments

- 18.1Use/** ... */for multiline comments.// bad// make() returns a new element// based on the passed in tag name////@param{String} tag//@return{Element} elementfunctionmake(tag){// ...returnelement;}// good/*** make() returns a new element* based on the passed-in tag name*/functionmake(tag){// ...returnelement;}

18.1Use/** ... */for multiline comments.


```javascript
// bad
// make() returns a new element
// based on the passed in tag name
//
// @param {String} tag
// @return {Element} element
function make(tag) {

  // ...

  return element;
}

// good
/**
 * make() returns a new element
 * based on the passed-in tag name
 */
function make(tag) {

  // ...

  return element;
}
```

- 18.2Use//for single line comments. Place single line comments on a newline above the subject of the comment. Put an empty line before the comment unless it’s on the first line of a block.// badconstactive=true;// is current tab// good// is current tabconstactive=true;// badfunctiongetType(){console.log('fetching type...');// set the default type to 'no type'consttype=this.type||'no type';returntype;}// goodfunctiongetType(){console.log('fetching type...');// set the default type to 'no type'consttype=this.type||'no type';returntype;}// also goodfunctiongetType(){// set the default type to 'no type'consttype=this.type||'no type';returntype;}

18.2Use//for single line comments. Place single line comments on a newline above the subject of the comment. Put an empty line before the comment unless it’s on the first line of a block.


```javascript
// bad
const active = true;  // is current tab

// good
// is current tab
const active = true;

// bad
function getType() {
  console.log('fetching type...');
  // set the default type to 'no type'
  const type = this.type || 'no type';

  return type;
}

// good
function getType() {
  console.log('fetching type...');

  // set the default type to 'no type'
  const type = this.type || 'no type';

  return type;
}

// also good
function getType() {
  // set the default type to 'no type'
  const type = this.type || 'no type';

  return type;
}
```

- 18.3Start all comments with a space to make it easier to read. eslint:spaced-comment// bad//is current tabconstactive=true;// good// is current tabconstactive=true;// bad/***make() returns a new element*based on the passed-in tag name*/functionmake(tag){// ...returnelement;}// good/*** make() returns a new element* based on the passed-in tag name*/functionmake(tag){// ...returnelement;}

18.3Start all comments with a space to make it easier to read. eslint:spaced-comment


```javascript
// bad
//is current tab
const active = true;

// good
// is current tab
const active = true;

// bad
/**
 *make() returns a new element
 *based on the passed-in tag name
 */
function make(tag) {

  // ...

  return element;
}

// good
/**
 * make() returns a new element
 * based on the passed-in tag name
 */
function make(tag) {

  // ...

  return element;
}
```

- 18.4Prefixing your comments withFIXMEorTODOhelps other developers quickly understand if you’re pointing out a problem that needs to be revisited, or if you’re suggesting a solution to the problem that needs to be implemented. These are different than regular comments because they are actionable. The actions areFIXME: -- need to figure this outorTODO: -- need to implement.
- 18.5Use// FIXME:to annotate problems.classCalculatorextendsAbacus{constructor(){super();// FIXME: shouldn’t use a global heretotal=0;}}

18.5Use// FIXME:to annotate problems.


```javascript
class Calculator extends Abacus {
  constructor() {
    super();

    // FIXME: shouldn’t use a global here
    total = 0;
  }
}
```

- 18.6Use// TODO:to annotate solutions to problems.classCalculatorextendsAbacus{constructor(){super();// TODO: total should be configurable by an options paramthis.total=0;}}

18.6Use// TODO:to annotate solutions to problems.


```javascript
class Calculator extends Abacus {
  constructor() {
    super();

    // TODO: total should be configurable by an options param
    this.total = 0;
  }
}
```


⬆ back to top


## Whitespace

- 19.1Use soft tabs (space character) set to 2 spaces. eslint:indent// badfunctionfoo(){∙∙∙∙letname;}// badfunctionbar(){∙letname;}// goodfunctionbaz(){∙∙letname;}

19.1Use soft tabs (space character) set to 2 spaces. eslint:indent


```javascript
// bad
function foo() {
∙∙∙∙let name;
}

// bad
function bar() {
∙let name;
}

// good
function baz() {
∙∙let name;
}
```

- 19.2Place 1 space before the leading brace. eslint:space-before-blocks// badfunctiontest(){console.log('test');}// goodfunctiontest(){console.log('test');}// baddog.set('attr',{age:'1 year',breed:'Bernese Mountain Dog',});// gooddog.set('attr',{age:'1 year',breed:'Bernese Mountain Dog',});

19.2Place 1 space before the leading brace. eslint:space-before-blocks


```javascript
// bad
function test(){
  console.log('test');
}

// good
function test() {
  console.log('test');
}

// bad
dog.set('attr',{
  age: '1 year',
  breed: 'Bernese Mountain Dog',
});

// good
dog.set('attr', {
  age: '1 year',
  breed: 'Bernese Mountain Dog',
});
```

- 19.3Place 1 space before the opening parenthesis in control statements (if,whileetc.). Place no space between the argument list and the function name in function calls and declarations. eslint:keyword-spacing// badif(isJedi){fight();}// goodif(isJedi){fight();}// badfunctionfight(){console.log('Swooosh!');}// goodfunctionfight(){console.log('Swooosh!');}

19.3Place 1 space before the opening parenthesis in control statements (if,whileetc.). Place no space between the argument list and the function name in function calls and declarations. eslint:keyword-spacing


```javascript
// bad
if(isJedi) {
  fight ();
}

// good
if (isJedi) {
  fight();
}

// bad
function fight () {
  console.log ('Swooosh!');
}

// good
function fight() {
  console.log('Swooosh!');
}
```

- 19.4Set off operators with spaces. eslint:space-infix-ops// badconstx=y+5;// goodconstx=y+5;

19.4Set off operators with spaces. eslint:space-infix-ops


```javascript
// bad
const x=y+5;

// good
const x = y + 5;
```

- 19.5End files with a single newline character. eslint:eol-last// badimport{es6}from'./AirbnbStyleGuide';// ...exportdefaultes6;// badimport{es6}from'./AirbnbStyleGuide';// ...exportdefaultes6;↵↵// goodimport{es6}from'./AirbnbStyleGuide';// ...exportdefaultes6;↵

19.5End files with a single newline character. eslint:eol-last


```javascript
// bad
import { es6 } from './AirbnbStyleGuide';
  // ...
export default es6;
```


```javascript
// bad
import { es6 } from './AirbnbStyleGuide';
  // ...
export default es6;↵
↵
```


```javascript
// good
import { es6 } from './AirbnbStyleGuide';
  // ...
export default es6;↵
```

- 19.6Use indentation when making long method chains (more than 2 method chains). Use a leading dot, which
emphasizes that the line is a method call, not a new statement. eslint:newline-per-chained-callno-whitespace-before-property// bad$('#items').find('.selected').highlight().end().find('.open').updateCount();// bad$('#items').find('.selected').highlight().end().find('.open').updateCount();// good$('#items').find('.selected').highlight().end().find('.open').updateCount();// badconstleds=stage.selectAll('.led').data(data).enter().append('svg:svg').classed('led',true).attr('width',(radius+margin)*2).append('svg:g').attr('transform',`translate(${radius+margin},${radius+margin})`).call(tron.led);// goodconstleds=stage.selectAll('.led').data(data).enter().append('svg:svg').classed('led',true).attr('width',(radius+margin)*2).append('svg:g').attr('transform',`translate(${radius+margin},${radius+margin})`).call(tron.led);// goodconstleds=stage.selectAll('.led').data(data);constsvg=leds.enter().append('svg:svg');svg.classed('led',true).attr('width',(radius+margin)*2);constg=svg.append('svg:g');g.attr('transform',`translate(${radius+margin},${radius+margin})`).call(tron.led);

19.6Use indentation when making long method chains (more than 2 method chains). Use a leading dot, which
emphasizes that the line is a method call, not a new statement. eslint:newline-per-chained-callno-whitespace-before-property


```javascript
// bad
$('#items').find('.selected').highlight().end().find('.open').updateCount();

// bad
$('#items').
  find('.selected').
    highlight().
    end().
  find('.open').
    updateCount();

// good
$('#items')
  .find('.selected')
    .highlight()
    .end()
  .find('.open')
    .updateCount();

// bad
const leds = stage.selectAll('.led').data(data).enter().append('svg:svg').classed('led', true)
    .attr('width', (radius + margin) * 2).append('svg:g')
    .attr('transform', `translate(${radius + margin}, ${radius + margin})`)
    .call(tron.led);

// good
const leds = stage.selectAll('.led')
    .data(data)
  .enter().append('svg:svg')
    .classed('led', true)
    .attr('width', (radius + margin) * 2)
  .append('svg:g')
    .attr('transform', `translate(${radius + margin}, ${radius + margin})`)
    .call(tron.led);

// good
const leds = stage.selectAll('.led').data(data);
const svg = leds.enter().append('svg:svg');
svg.classed('led', true).attr('width', (radius + margin) * 2);
const g = svg.append('svg:g');
g.attr('transform', `translate(${radius + margin}, ${radius + margin})`).call(tron.led);
```

- 19.7Leave a blank line after blocks and before the next statement.// badif(foo){returnbar;}returnbaz;// goodif(foo){returnbar;}returnbaz;// badconstobj={foo(){},bar(){},};returnobj;// goodconstobj={foo(){},bar(){},};returnobj;// badconstarr=[functionfoo(){},functionbar(){},];returnarr;// goodconstarr=[functionfoo(){},functionbar(){},];returnarr;

19.7Leave a blank line after blocks and before the next statement.


```javascript
// bad
if (foo) {
  return bar;
}
return baz;

// good
if (foo) {
  return bar;
}

return baz;

// bad
const obj = {
  foo() {
  },
  bar() {
  },
};
return obj;

// good
const obj = {
  foo() {
  },

  bar() {
  },
};

return obj;

// bad
const arr = [
  function foo() {
  },
  function bar() {
  },
];
return arr;

// good
const arr = [
  function foo() {
  },

  function bar() {
  },
];

return arr;
```

- 19.8Do not pad your blocks with blank lines. eslint:padded-blocks// badfunctionbar(){console.log(foo);}// badif(baz){console.log(quux);}else{console.log(foo);}// badclassFoo{constructor(bar){this.bar=bar;}}// goodfunctionbar(){console.log(foo);}// goodif(baz){console.log(quux);}else{console.log(foo);}

19.8Do not pad your blocks with blank lines. eslint:padded-blocks


```javascript
// bad
function bar() {

  console.log(foo);

}

// bad
if (baz) {

  console.log(quux);
} else {
  console.log(foo);

}

// bad
class Foo {

  constructor(bar) {
    this.bar = bar;
  }
}

// good
function bar() {
  console.log(foo);
}

// good
if (baz) {
  console.log(quux);
} else {
  console.log(foo);
}
```

- 19.9Do not use multiple blank lines to pad your code. eslint:no-multiple-empty-lines// badclassPerson{constructor(fullName,email,birthday){this.fullName=fullName;this.email=email;this.setAge(birthday);}setAge(birthday){consttoday=newDate();constage=this.getAge(today,birthday);this.age=age;}getAge(today,birthday){// ..}}// goodclassPerson{constructor(fullName,email,birthday){this.fullName=fullName;this.email=email;this.setAge(birthday);}setAge(birthday){consttoday=newDate();constage=getAge(today,birthday);this.age=age;}getAge(today,birthday){// ..}}

19.9Do not use multiple blank lines to pad your code. eslint:no-multiple-empty-lines


```javascript
// bad
class Person {
  constructor(fullName, email, birthday) {
    this.fullName = fullName;


    this.email = email;


    this.setAge(birthday);
  }


  setAge(birthday) {
    const today = new Date();


    const age = this.getAge(today, birthday);


    this.age = age;
  }


  getAge(today, birthday) {
    // ..
  }
}

// good
class Person {
  constructor(fullName, email, birthday) {
    this.fullName = fullName;
    this.email = email;
    this.setAge(birthday);
  }

  setAge(birthday) {
    const today = new Date();
    const age = getAge(today, birthday);
    this.age = age;
  }

  getAge(today, birthday) {
    // ..
  }
}
```

- 19.10Do not add spaces inside parentheses. eslint:space-in-parens// badfunctionbar(foo){returnfoo;}// goodfunctionbar(foo){returnfoo;}// badif(foo){console.log(foo);}// goodif(foo){console.log(foo);}

19.10Do not add spaces inside parentheses. eslint:space-in-parens


```javascript
// bad
function bar( foo ) {
  return foo;
}

// good
function bar(foo) {
  return foo;
}

// bad
if ( foo ) {
  console.log(foo);
}

// good
if (foo) {
  console.log(foo);
}
```

- 19.11Do not add spaces inside brackets. eslint:array-bracket-spacing// badconstfoo=[1,2,3];console.log(foo[0]);// goodconstfoo=[1,2,3];console.log(foo[0]);

19.11Do not add spaces inside brackets. eslint:array-bracket-spacing


```javascript
// bad
const foo = [ 1, 2, 3 ];
console.log(foo[ 0 ]);

// good
const foo = [1, 2, 3];
console.log(foo[0]);
```

- 19.12Add spaces inside curly braces. eslint:object-curly-spacing// badconstfoo={clark:'kent'};// goodconstfoo={clark:'kent'};

19.12Add spaces inside curly braces. eslint:object-curly-spacing


```javascript
// bad
const foo = {clark: 'kent'};

// good
const foo = { clark: 'kent' };
```

- 19.13Avoid having lines of code that are longer than 100 characters (including whitespace). Note: perabove, long strings are exempt from this rule, and should not be broken up. eslint:max-lenWhy? This ensures readability and maintainability.// badconstfoo=jsonData&&jsonData.foo&&jsonData.foo.bar&&jsonData.foo.bar.baz&&jsonData.foo.bar.baz.quux&&jsonData.foo.bar.baz.quux.xyzzy;// bad$.ajax({method:'POST',url:'https://airbnb.com/',data:{name:'John'}}).done(()=>console.log('Congratulations!')).fail(()=>console.log('You have failed this city.'));// goodconstfoo=jsonData&&jsonData.foo&&jsonData.foo.bar&&jsonData.foo.bar.baz&&jsonData.foo.bar.baz.quux&&jsonData.foo.bar.baz.quux.xyzzy;// betterconstfoo=jsonData?.foo?.bar?.baz?.quux?.xyzzy;// good$.ajax({method:'POST',url:'https://airbnb.com/',data:{name:'John'},}).done(()=>console.log('Congratulations!')).fail(()=>console.log('You have failed this city.'));

19.13Avoid having lines of code that are longer than 100 characters (including whitespace). Note: perabove, long strings are exempt from this rule, and should not be broken up. eslint:max-len


Why? This ensures readability and maintainability.


```javascript
// bad
const foo = jsonData && jsonData.foo && jsonData.foo.bar && jsonData.foo.bar.baz && jsonData.foo.bar.baz.quux && jsonData.foo.bar.baz.quux.xyzzy;

// bad
$.ajax({ method: 'POST', url: 'https://airbnb.com/', data: { name: 'John' } }).done(() => console.log('Congratulations!')).fail(() => console.log('You have failed this city.'));

// good
const foo = jsonData
  && jsonData.foo
  && jsonData.foo.bar
  && jsonData.foo.bar.baz
  && jsonData.foo.bar.baz.quux
  && jsonData.foo.bar.baz.quux.xyzzy;

// better
const foo = jsonData
  ?.foo
  ?.bar
  ?.baz
  ?.quux
  ?.xyzzy;

// good
$.ajax({
  method: 'POST',
  url: 'https://airbnb.com/',
  data: { name: 'John' },
})
  .done(() => console.log('Congratulations!'))
  .fail(() => console.log('You have failed this city.'));
```

- 19.14Require consistent spacing inside an open block token and the next token on the same line. This rule also enforces consistent spacing inside a close block token and previous token on the same line. eslint:block-spacing// badfunctionfoo(){returntrue;}if(foo){bar=0;}// goodfunctionfoo(){returntrue;}if(foo){bar=0;}

19.14Require consistent spacing inside an open block token and the next token on the same line. This rule also enforces consistent spacing inside a close block token and previous token on the same line. eslint:block-spacing


```javascript
// bad
function foo() {return true;}
if (foo) { bar = 0;}

// good
function foo() { return true; }
if (foo) { bar = 0; }
```

- 19.15Avoid spaces before commas and require a space after commas. eslint:comma-spacing// badconstfoo=1,bar=2;constarr=[1,2];// goodconstfoo=1,bar=2;constarr=[1,2];

19.15Avoid spaces before commas and require a space after commas. eslint:comma-spacing


```javascript
// bad
const foo = 1,bar = 2;
const arr = [1 , 2];

// good
const foo = 1, bar = 2;
const arr = [1, 2];
```

- 19.16Enforce spacing inside of computed property brackets. eslint:computed-property-spacing// badobj[foo]obj['foo']constx={[b]:a}obj[foo[bar]]// goodobj[foo]obj['foo']constx={[b]:a}obj[foo[bar]]

19.16Enforce spacing inside of computed property brackets. eslint:computed-property-spacing


```javascript
// bad
obj[foo ]
obj[ 'foo']
const x = {[ b ]: a}
obj[foo[ bar ]]

// good
obj[foo]
obj['foo']
const x = { [b]: a }
obj[foo[bar]]
```

- 19.17Avoid spaces between functions and their invocations. eslint:func-call-spacing// badfunc();func();// goodfunc();

19.17Avoid spaces between functions and their invocations. eslint:func-call-spacing


```javascript
// bad
func ();

func
();

// good
func();
```

- 19.18Enforce spacing between keys and values in object literal properties. eslint:key-spacing// badconstobj={foo:42};constobj2={foo:42};// goodconstobj={foo:42};

19.18Enforce spacing between keys and values in object literal properties. eslint:key-spacing


```javascript
// bad
const obj = { foo : 42 };
const obj2 = { foo:42 };

// good
const obj = { foo: 42 };
```

- 19.19Avoid trailing spaces at the end of lines. eslint:no-trailing-spaces
- 19.20Avoid multiple empty lines, only allow one newline at the end of files, and avoid a newline at the beginning of files. eslint:no-multiple-empty-lines// bad - multiple empty linesconstx=1;consty=2;// bad - 2+ newlines at end of fileconstx=1;consty=2;// bad - 1+ newline(s) at beginning of fileconstx=1;consty=2;// goodconstx=1;consty=2;

19.20Avoid multiple empty lines, only allow one newline at the end of files, and avoid a newline at the beginning of files. eslint:no-multiple-empty-lines


```javascript
// bad - multiple empty lines
const x = 1;


const y = 2;

// bad - 2+ newlines at end of file
const x = 1;
const y = 2;


// bad - 1+ newline(s) at beginning of file

const x = 1;
const y = 2;

// good
const x = 1;
const y = 2;
```


⬆ back to top


## Commas

- 20.1Leading commas:Nope.eslint:comma-style// badconststory=[once,upon,aTime];// goodconststory=[once,upon,aTime,];// badconsthero={firstName:'Ada',lastName:'Lovelace',birthYear:1815,superPower:'computers'};// goodconsthero={firstName:'Ada',lastName:'Lovelace',birthYear:1815,superPower:'computers',};

20.1Leading commas:Nope.eslint:comma-style


```javascript
// bad
const story = [
    once
  , upon
  , aTime
];

// good
const story = [
  once,
  upon,
  aTime,
];

// bad
const hero = {
    firstName: 'Ada'
  , lastName: 'Lovelace'
  , birthYear: 1815
  , superPower: 'computers'
};

// good
const hero = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  birthYear: 1815,
  superPower: 'computers',
};
```

- 20.2Additional trailing comma:Yup.eslint:comma-dangleWhy? This leads to cleaner git diffs. Also, transpilers like Babel will remove the additional trailing comma in the transpiled code which means you don’t have to worry about thetrailing comma problemin legacy browsers.// bad - git diff without trailing comma
const hero = {
     firstName: 'Florence',-lastName: 'Nightingale'+lastName: 'Nightingale',+inventorOf: ['coxcomb chart', 'modern nursing']};

// good - git diff with trailing comma
const hero = {
     firstName: 'Florence',
     lastName: 'Nightingale',+inventorOf: ['coxcomb chart', 'modern nursing'],};// badconsthero={firstName:'Dana',lastName:'Scully'};constheroes=['Batman','Superman'];// goodconsthero={firstName:'Dana',lastName:'Scully',};constheroes=['Batman','Superman',];// badfunctioncreateHero(firstName,lastName,inventorOf){// does nothing}// goodfunctioncreateHero(firstName,lastName,inventorOf,){// does nothing}// good (note that a comma must not appear after a "rest" element)functioncreateHero(firstName,lastName,inventorOf,...heroArgs){// does nothing}// badcreateHero(firstName,lastName,inventorOf);// goodcreateHero(firstName,lastName,inventorOf,);// good (note that a comma must not appear after a "rest" element)createHero(firstName,lastName,inventorOf,...heroArgs);

20.2Additional trailing comma:Yup.eslint:comma-dangle


Why? This leads to cleaner git diffs. Also, transpilers like Babel will remove the additional trailing comma in the transpiled code which means you don’t have to worry about thetrailing comma problemin legacy browsers.


```javascript
// bad - git diff without trailing comma
const hero = {
     firstName: 'Florence',
-    lastName: 'Nightingale'
+    lastName: 'Nightingale',
+    inventorOf: ['coxcomb chart', 'modern nursing']
};

// good - git diff with trailing comma
const hero = {
     firstName: 'Florence',
     lastName: 'Nightingale',
+    inventorOf: ['coxcomb chart', 'modern nursing'],
};
```


```javascript
// bad
const hero = {
  firstName: 'Dana',
  lastName: 'Scully'
};

const heroes = [
  'Batman',
  'Superman'
];

// good
const hero = {
  firstName: 'Dana',
  lastName: 'Scully',
};

const heroes = [
  'Batman',
  'Superman',
];

// bad
function createHero(
  firstName,
  lastName,
  inventorOf
) {
  // does nothing
}

// good
function createHero(
  firstName,
  lastName,
  inventorOf,
) {
  // does nothing
}

// good (note that a comma must not appear after a "rest" element)
function createHero(
  firstName,
  lastName,
  inventorOf,
  ...heroArgs
) {
  // does nothing
}

// bad
createHero(
  firstName,
  lastName,
  inventorOf
);

// good
createHero(
  firstName,
  lastName,
  inventorOf,
);

// good (note that a comma must not appear after a "rest" element)
createHero(
  firstName,
  lastName,
  inventorOf,
  ...heroArgs
);
```


⬆ back to top


## Semicolons

- 21.1Yup.eslint:semiWhy? When JavaScript encounters a line break without a semicolon, it uses a set of rules calledAutomatic Semicolon Insertionto determine whether it should regard that line break as the end of a statement, and (as the name implies) place a semicolon into your code before the line break if it thinks so. ASI contains a few eccentric behaviors, though, and your code will break if JavaScript misinterprets your line break. These rules will become more complicated as new features become a part of JavaScript. Explicitly terminating your statements and configuring your linter to catch missing semicolons will help prevent you from encountering issues.// bad - raises exceptionconstluke={}constleia={}[luke,leia].forEach((jedi)=>jedi.father='vader')// bad - raises exceptionconstreaction="No! That’s impossible!"(asyncfunctionmeanwhileOnTheFalcon(){// handle `leia`, `lando`, `chewie`, `r2`, `c3p0`// ...}())// bad - returns `undefined` instead of the value on the next line - always happens when `return` is on a line by itself because of ASI!functionfoo(){return'search your feelings, you know it to be foo'}// goodconstluke={};constleia={};[luke,leia].forEach((jedi)=>{jedi.father='vader';});// goodconstreaction='No! That’s impossible!';(asyncfunctionmeanwhileOnTheFalcon(){// handle `leia`, `lando`, `chewie`, `r2`, `c3p0`// ...}());// goodfunctionfoo(){return'search your feelings, you know it to be foo';}Read more.

21.1Yup.eslint:semi


Why? When JavaScript encounters a line break without a semicolon, it uses a set of rules calledAutomatic Semicolon Insertionto determine whether it should regard that line break as the end of a statement, and (as the name implies) place a semicolon into your code before the line break if it thinks so. ASI contains a few eccentric behaviors, though, and your code will break if JavaScript misinterprets your line break. These rules will become more complicated as new features become a part of JavaScript. Explicitly terminating your statements and configuring your linter to catch missing semicolons will help prevent you from encountering issues.


```javascript
// bad - raises exception
const luke = {}
const leia = {}
[luke, leia].forEach((jedi) => jedi.father = 'vader')

// bad - raises exception
const reaction = "No! That’s impossible!"
(async function meanwhileOnTheFalcon() {
  // handle `leia`, `lando`, `chewie`, `r2`, `c3p0`
  // ...
}())

// bad - returns `undefined` instead of the value on the next line - always happens when `return` is on a line by itself because of ASI!
function foo() {
  return
    'search your feelings, you know it to be foo'
}

// good
const luke = {};
const leia = {};
[luke, leia].forEach((jedi) => {
  jedi.father = 'vader';
});

// good
const reaction = 'No! That’s impossible!';
(async function meanwhileOnTheFalcon() {
  // handle `leia`, `lando`, `chewie`, `r2`, `c3p0`
  // ...
}());

// good
function foo() {
  return 'search your feelings, you know it to be foo';
}
```


Read more.


⬆ back to top


## Type Casting & Coercion

- 22.1Perform type coercion at the beginning of the statement.
- 22.2Strings: eslint:no-new-wrappers// => this.reviewScore = 9;// badconsttotalScore=newString(this.reviewScore);// typeof totalScore is "object" not "string"// badconsttotalScore=this.reviewScore+'';// invokes this.reviewScore.valueOf()// badconsttotalScore=this.reviewScore.toString();// isn’t guaranteed to return a string// goodconsttotalScore=String(this.reviewScore);

22.2Strings: eslint:no-new-wrappers


```javascript
// => this.reviewScore = 9;

// bad
const totalScore = new String(this.reviewScore); // typeof totalScore is "object" not "string"

// bad
const totalScore = this.reviewScore + ''; // invokes this.reviewScore.valueOf()

// bad
const totalScore = this.reviewScore.toString(); // isn’t guaranteed to return a string

// good
const totalScore = String(this.reviewScore);
```

- 22.3Numbers: UseNumberfor type casting andparseIntalways with a radix for parsing strings. eslint:radixno-new-wrappersWhy? TheparseIntfunction produces an integer value dictated by interpretation of the contents of the string argument according to the specified radix. Leading whitespace in string is ignored. If radix isundefinedor0, it is assumed to be10except when the number begins with the character pairs0xor0X, in which case a radix of 16 is assumed. This differs from ECMAScript 3, which merely discouraged (but allowed) octal interpretation. Many implementations have not adopted this behavior as of 2013. And, because older browsers must be supported, always specify a radix.constinputValue='4';// badconstval=newNumber(inputValue);// badconstval=+inputValue;// badconstval=inputValue>>0;// badconstval=parseInt(inputValue);// goodconstval=Number(inputValue);// goodconstval=parseInt(inputValue,10);

22.3Numbers: UseNumberfor type casting andparseIntalways with a radix for parsing strings. eslint:radixno-new-wrappers


Why? TheparseIntfunction produces an integer value dictated by interpretation of the contents of the string argument according to the specified radix. Leading whitespace in string is ignored. If radix isundefinedor0, it is assumed to be10except when the number begins with the character pairs0xor0X, in which case a radix of 16 is assumed. This differs from ECMAScript 3, which merely discouraged (but allowed) octal interpretation. Many implementations have not adopted this behavior as of 2013. And, because older browsers must be supported, always specify a radix.


```javascript
const inputValue = '4';

// bad
const val = new Number(inputValue);

// bad
const val = +inputValue;

// bad
const val = inputValue >> 0;

// bad
const val = parseInt(inputValue);

// good
const val = Number(inputValue);

// good
const val = parseInt(inputValue, 10);
```

- 22.4If for whatever reason you are doing something wild andparseIntis your bottleneck and need to use Bitshift forperformance reasons, leave a comment explaining why and what you’re doing.// good/*** parseInt was the reason my code was slow.* Bitshifting the String to coerce it to a* Number made it a lot faster.*/constval=inputValue>>0;

22.4If for whatever reason you are doing something wild andparseIntis your bottleneck and need to use Bitshift forperformance reasons, leave a comment explaining why and what you’re doing.


```javascript
// good
/**
 * parseInt was the reason my code was slow.
 * Bitshifting the String to coerce it to a
 * Number made it a lot faster.
 */
const val = inputValue >> 0;
```

- 22.5Note:Be careful when using bitshift operations. Numbers are represented as64-bit values, but bitshift operations always return a 32-bit integer (source). Bitshift can lead to unexpected behavior for integer values larger than 32 bits.Discussion. Largest signed 32-bit Int is 2,147,483,647:2147483647>>0;// => 21474836472147483648>>0;// => -21474836482147483649>>0;// => -2147483647

22.5Note:Be careful when using bitshift operations. Numbers are represented as64-bit values, but bitshift operations always return a 32-bit integer (source). Bitshift can lead to unexpected behavior for integer values larger than 32 bits.Discussion. Largest signed 32-bit Int is 2,147,483,647:


```javascript
2147483647 >> 0; // => 2147483647
2147483648 >> 0; // => -2147483648
2147483649 >> 0; // => -2147483647
```

- 22.6Booleans: eslint:no-new-wrappersconstage=0;// badconsthasAge=newBoolean(age);// goodconsthasAge=Boolean(age);// bestconsthasAge=!!age;

22.6Booleans: eslint:no-new-wrappers


```javascript
const age = 0;

// bad
const hasAge = new Boolean(age);

// good
const hasAge = Boolean(age);

// best
const hasAge = !!age;
```


⬆ back to top


## Naming Conventions

- 23.1Avoid single letter names. Be descriptive with your naming. eslint:id-length// badfunctionq(){// ...}// goodfunctionquery(){// ...}

23.1Avoid single letter names. Be descriptive with your naming. eslint:id-length


```javascript
// bad
function q() {
  // ...
}

// good
function query() {
  // ...
}
```

- 23.2Use camelCase when naming objects, functions, and instances. eslint:camelcase// badconstOBJEcttsssss={};constthis_is_my_object={};functionc(){}// goodconstthisIsMyObject={};functionthisIsMyFunction(){}

23.2Use camelCase when naming objects, functions, and instances. eslint:camelcase


```javascript
// bad
const OBJEcttsssss = {};
const this_is_my_object = {};
function c() {}

// good
const thisIsMyObject = {};
function thisIsMyFunction() {}
```

- 23.3Use PascalCase only when naming constructors or classes. eslint:new-cap// badfunctionuser(options){this.name=options.name;}constbad=newuser({name:'nope',});// goodclassUser{constructor(options){this.name=options.name;}}constgood=newUser({name:'yup',});

23.3Use PascalCase only when naming constructors or classes. eslint:new-cap


```javascript
// bad
function user(options) {
  this.name = options.name;
}

const bad = new user({
  name: 'nope',
});

// good
class User {
  constructor(options) {
    this.name = options.name;
  }
}

const good = new User({
  name: 'yup',
});
```

- 23.4Do not use trailing or leading underscores. eslint:no-underscore-dangleWhy? JavaScript does not have the concept of privacy in terms of properties or methods. Although a leading underscore is a common convention to mean “private”, in fact, these properties are fully public, and as such, are part of your public API contract. This convention might lead developers to wrongly think that a change won’t count as breaking, or that tests aren’t needed. tl;dr: if you want something to be “private”, it must not be observably present.// badthis.__firstName__='Panda';this.firstName_='Panda';this._firstName='Panda';// goodthis.firstName='Panda';// good, in environments where WeakMaps are available// see https://compat-table.github.io/compat-table/es6/#test-WeakMapconstfirstNames=newWeakMap();firstNames.set(this,'Panda');

23.4Do not use trailing or leading underscores. eslint:no-underscore-dangle


Why? JavaScript does not have the concept of privacy in terms of properties or methods. Although a leading underscore is a common convention to mean “private”, in fact, these properties are fully public, and as such, are part of your public API contract. This convention might lead developers to wrongly think that a change won’t count as breaking, or that tests aren’t needed. tl;dr: if you want something to be “private”, it must not be observably present.


```javascript
// bad
this.__firstName__ = 'Panda';
this.firstName_ = 'Panda';
this._firstName = 'Panda';

// good
this.firstName = 'Panda';

// good, in environments where WeakMaps are available
// see https://compat-table.github.io/compat-table/es6/#test-WeakMap
const firstNames = new WeakMap();
firstNames.set(this, 'Panda');
```

- 23.5Don’t save references tothis. Use arrow functions orFunction#bind.// badfunctionfoo(){constself=this;returnfunction(){console.log(self);};}// badfunctionfoo(){constthat=this;returnfunction(){console.log(that);};}// goodfunctionfoo(){return()=>{console.log(this);};}

23.5Don’t save references tothis. Use arrow functions orFunction#bind.


```javascript
// bad
function foo() {
  const self = this;
  return function () {
    console.log(self);
  };
}

// bad
function foo() {
  const that = this;
  return function () {
    console.log(that);
  };
}

// good
function foo() {
  return () => {
    console.log(this);
  };
}
```

- 23.6A base filename should exactly match the name of its default export.// file 1 contentsclassCheckBox{// ...}exportdefaultCheckBox;// file 2 contentsexportdefaultfunctionfortyTwo(){return42;}// file 3 contentsexportdefaultfunctioninsideDirectory(){}// in some other file// badimportCheckBoxfrom'./checkBox';// PascalCase import/export, camelCase filenameimportFortyTwofrom'./FortyTwo';// PascalCase import/filename, camelCase exportimportInsideDirectoryfrom'./InsideDirectory';// PascalCase import/filename, camelCase export// badimportCheckBoxfrom'./check_box';// PascalCase import/export, snake_case filenameimportforty_twofrom'./forty_two';// snake_case import/filename, camelCase exportimportinside_directoryfrom'./inside_directory';// snake_case import, camelCase exportimportindexfrom'./inside_directory/index';// requiring the index file explicitlyimportinsideDirectoryfrom'./insideDirectory/index';// requiring the index file explicitly// goodimportCheckBoxfrom'./CheckBox';// PascalCase export/import/filenameimportfortyTwofrom'./fortyTwo';// camelCase export/import/filenameimportinsideDirectoryfrom'./insideDirectory';// camelCase export/import/directory name/implicit "index"// ^ supports both insideDirectory.js and insideDirectory/index.js

23.6A base filename should exactly match the name of its default export.


```javascript
// file 1 contents
class CheckBox {
  // ...
}
export default CheckBox;

// file 2 contents
export default function fortyTwo() { return 42; }

// file 3 contents
export default function insideDirectory() {}

// in some other file
// bad
import CheckBox from './checkBox'; // PascalCase import/export, camelCase filename
import FortyTwo from './FortyTwo'; // PascalCase import/filename, camelCase export
import InsideDirectory from './InsideDirectory'; // PascalCase import/filename, camelCase export

// bad
import CheckBox from './check_box'; // PascalCase import/export, snake_case filename
import forty_two from './forty_two'; // snake_case import/filename, camelCase export
import inside_directory from './inside_directory'; // snake_case import, camelCase export
import index from './inside_directory/index'; // requiring the index file explicitly
import insideDirectory from './insideDirectory/index'; // requiring the index file explicitly

// good
import CheckBox from './CheckBox'; // PascalCase export/import/filename
import fortyTwo from './fortyTwo'; // camelCase export/import/filename
import insideDirectory from './insideDirectory'; // camelCase export/import/directory name/implicit "index"
// ^ supports both insideDirectory.js and insideDirectory/index.js
```

- 23.7Use camelCase when you export-default a function. Your filename should be identical to your function’s name.functionmakeStyleGuide(){// ...}exportdefaultmakeStyleGuide;

23.7Use camelCase when you export-default a function. Your filename should be identical to your function’s name.


```javascript
function makeStyleGuide() {
  // ...
}

export default makeStyleGuide;
```

- 23.8Use PascalCase when you export a constructor / class / singleton / function library / bare object.constAirbnbStyleGuide={es6:{},};exportdefaultAirbnbStyleGuide;

23.8Use PascalCase when you export a constructor / class / singleton / function library / bare object.


```javascript
const AirbnbStyleGuide = {
  es6: {
  },
};

export default AirbnbStyleGuide;
```

- 23.9Acronyms and initialisms should always be all uppercased, or all lowercased.Why? Names are for readability, not to appease a computer algorithm.// badimportSmsContainerfrom'./containers/SmsContainer';// badconstHttpRequests=[// ...];// goodimportSMSContainerfrom'./containers/SMSContainer';// goodconstHTTPRequests=[// ...];// also goodconsthttpRequests=[// ...];// bestimportTextMessageContainerfrom'./containers/TextMessageContainer';// bestconstrequests=[// ...];

23.9Acronyms and initialisms should always be all uppercased, or all lowercased.


Why? Names are for readability, not to appease a computer algorithm.


```javascript
// bad
import SmsContainer from './containers/SmsContainer';

// bad
const HttpRequests = [
  // ...
];

// good
import SMSContainer from './containers/SMSContainer';

// good
const HTTPRequests = [
  // ...
];

// also good
const httpRequests = [
  // ...
];

// best
import TextMessageContainer from './containers/TextMessageContainer';

// best
const requests = [
  // ...
];
```

- 23.10You may optionally uppercase a constant only if it (1) is exported, (2) is aconst(it can not be reassigned), and (3) the programmer can trust it (and its nested properties) to never change.Why? This is an additional tool to assist in situations where the programmer would be unsure if a variable might ever change. UPPERCASE_VARIABLES are letting the programmer know that they can trust the variable (and its properties) not to change.What about allconstvariables? - This is unnecessary, so uppercasing should not be used for constants within a file. It should be used for exported constants however.What about exported objects? - Uppercase at the top level of export (e.g.EXPORTED_OBJECT.key) and maintain that all nested properties do not change.// badconstPRIVATE_VARIABLE='should not be unnecessarily uppercased within a file';// badexportconstTHING_TO_BE_CHANGED='should obviously not be uppercased';// badexportletREASSIGNABLE_VARIABLE='do not use let with uppercase variables';// ---// allowed but does not supply semantic valueexportconstapiKey='SOMEKEY';// better in most casesexportconstAPI_KEY='SOMEKEY';// ---// bad - unnecessarily uppercases key while adding no semantic valueexportconstMAPPING={KEY:'value'};// goodexportconstMAPPING={key:'value',};
- What about allconstvariables? - This is unnecessary, so uppercasing should not be used for constants within a file. It should be used for exported constants however.
- What about exported objects? - Uppercase at the top level of export (e.g.EXPORTED_OBJECT.key) and maintain that all nested properties do not change.

23.10You may optionally uppercase a constant only if it (1) is exported, (2) is aconst(it can not be reassigned), and (3) the programmer can trust it (and its nested properties) to never change.


Why? This is an additional tool to assist in situations where the programmer would be unsure if a variable might ever change. UPPERCASE_VARIABLES are letting the programmer know that they can trust the variable (and its properties) not to change.

- What about allconstvariables? - This is unnecessary, so uppercasing should not be used for constants within a file. It should be used for exported constants however.
- What about exported objects? - Uppercase at the top level of export (e.g.EXPORTED_OBJECT.key) and maintain that all nested properties do not change.

```javascript
// bad
const PRIVATE_VARIABLE = 'should not be unnecessarily uppercased within a file';

// bad
export const THING_TO_BE_CHANGED = 'should obviously not be uppercased';

// bad
export let REASSIGNABLE_VARIABLE = 'do not use let with uppercase variables';

// ---

// allowed but does not supply semantic value
export const apiKey = 'SOMEKEY';

// better in most cases
export const API_KEY = 'SOMEKEY';

// ---

// bad - unnecessarily uppercases key while adding no semantic value
export const MAPPING = {
  KEY: 'value'
};

// good
export const MAPPING = {
  key: 'value',
};
```


⬆ back to top


## Accessors

- 24.1Accessor functions for properties are not required.
- 24.2Do not use JavaScript getters/setters as they cause unexpected side effects and are harder to test, maintain, and reason about. Instead, if you do make accessor functions, usegetVal()andsetVal('hello').// badclassDragon{getage(){// ...}setage(value){// ...}}// goodclassDragon{getAge(){// ...}setAge(value){// ...}}

24.2Do not use JavaScript getters/setters as they cause unexpected side effects and are harder to test, maintain, and reason about. Instead, if you do make accessor functions, usegetVal()andsetVal('hello').


```javascript
// bad
class Dragon {
  get age() {
    // ...
  }

  set age(value) {
    // ...
  }
}

// good
class Dragon {
  getAge() {
    // ...
  }

  setAge(value) {
    // ...
  }
}
```

- 24.3If the property/method is aboolean, useisVal()orhasVal().// badif(!dragon.age()){returnfalse;}// goodif(!dragon.hasAge()){returnfalse;}

24.3If the property/method is aboolean, useisVal()orhasVal().


```javascript
// bad
if (!dragon.age()) {
  return false;
}

// good
if (!dragon.hasAge()) {
  return false;
}
```

- 24.4It’s okay to createget()andset()functions, but be consistent.classJedi{constructor(options={}){constlightsaber=options.lightsaber||'blue';this.set('lightsaber',lightsaber);}set(key,val){this[key]=val;}get(key){returnthis[key];}}

24.4It’s okay to createget()andset()functions, but be consistent.


```javascript
class Jedi {
  constructor(options = {}) {
    const lightsaber = options.lightsaber || 'blue';
    this.set('lightsaber', lightsaber);
  }

  set(key, val) {
    this[key] = val;
  }

  get(key) {
    return this[key];
  }
}
```


⬆ back to top


## Events

- 25.1When attaching data payloads to events (whether DOM events or something more proprietary like Backbone events), pass an object literal (also known as a "hash") instead of a raw value. This allows a subsequent contributor to add more data to the event payload without finding and updating every handler for the event. For example, instead of:// bad$(this).trigger('listingUpdated',listing.id);// ...$(this).on('listingUpdated',(e,listingID)=>{// do something with listingID});prefer:// good$(this).trigger('listingUpdated',{listingID:listing.id});// ...$(this).on('listingUpdated',(e,data)=>{// do something with data.listingID});

25.1When attaching data payloads to events (whether DOM events or something more proprietary like Backbone events), pass an object literal (also known as a "hash") instead of a raw value. This allows a subsequent contributor to add more data to the event payload without finding and updating every handler for the event. For example, instead of:


```javascript
// bad
$(this).trigger('listingUpdated', listing.id);

// ...

$(this).on('listingUpdated', (e, listingID) => {
  // do something with listingID
});
```


prefer:


```javascript
// good
$(this).trigger('listingUpdated', { listingID: listing.id });

// ...

$(this).on('listingUpdated', (e, data) => {
  // do something with data.listingID
});
```


⬆ back to top


## jQuery

- 26.1Prefix jQuery object variables with a$.// badconstsidebar=$('.sidebar');// goodconst$sidebar=$('.sidebar');// goodconst$sidebarBtn=$('.sidebar-btn');

26.1Prefix jQuery object variables with a$.


```javascript
// bad
const sidebar = $('.sidebar');

// good
const $sidebar = $('.sidebar');

// good
const $sidebarBtn = $('.sidebar-btn');
```

- 26.2Cache jQuery lookups.// badfunctionsetSidebar(){$('.sidebar').hide();// ...$('.sidebar').css({'background-color':'pink',});}// goodfunctionsetSidebar(){const$sidebar=$('.sidebar');$sidebar.hide();// ...$sidebar.css({'background-color':'pink',});}

26.2Cache jQuery lookups.


```javascript
// bad
function setSidebar() {
  $('.sidebar').hide();

  // ...

  $('.sidebar').css({
    'background-color': 'pink',
  });
}

// good
function setSidebar() {
  const $sidebar = $('.sidebar');
  $sidebar.hide();

  // ...

  $sidebar.css({
    'background-color': 'pink',
  });
}
```

- 26.3For DOM queries use Cascading$('.sidebar ul')or parent > child$('.sidebar > ul').jsPerf
- 26.4Usefindwith scoped jQuery object queries.// bad$('ul','.sidebar').hide();// bad$('.sidebar').find('ul').hide();// good$('.sidebar ul').hide();// good$('.sidebar > ul').hide();// good$sidebar.find('ul').hide();

26.4Usefindwith scoped jQuery object queries.


```javascript
// bad
$('ul', '.sidebar').hide();

// bad
$('.sidebar').find('ul').hide();

// good
$('.sidebar ul').hide();

// good
$('.sidebar > ul').hide();

// good
$sidebar.find('ul').hide();
```


⬆ back to top


## ECMAScript 5 Compatibility

- 27.1Refer toKangax’s ES5compatibility table.

⬆ back to top


## ECMAScript 6+ (ES 2015+) Styles

- 28.1This is a collection of links to the various ES6+ features.
- Arrow Functions
- Classes
- Object Shorthand
- Object Concise
- Object Computed Properties
- Template Strings
- Destructuring
- Default Parameters
- Rest
- Array Spreads
- Let and Const
- Exponentiation Operator
- Iterators and Generators
- Modules
- 28.2Do not useTC39 proposalsthat have not reached stage 3.Why?They are not finalized, and they are subject to change or to be withdrawn entirely. We want to use JavaScript, and proposals are not JavaScript yet.

28.2Do not useTC39 proposalsthat have not reached stage 3.


Why?They are not finalized, and they are subject to change or to be withdrawn entirely. We want to use JavaScript, and proposals are not JavaScript yet.


⬆ back to top


## Standard Library


TheStandard Librarycontains utilities that are functionally broken but remain for legacy reasons.

- 29.1UseNumber.isNaNinstead of globalisNaN.
eslint:no-restricted-globalsWhy? The globalisNaNcoerces non-numbers to numbers, returning true for anything that coerces to NaN.
If this behavior is desired, make it explicit.// badisNaN('1.2');// falseisNaN('1.2.3');// true// goodNumber.isNaN('1.2.3');// falseNumber.isNaN(Number('1.2.3'));// true

29.1UseNumber.isNaNinstead of globalisNaN.
eslint:no-restricted-globals


Why? The globalisNaNcoerces non-numbers to numbers, returning true for anything that coerces to NaN.
If this behavior is desired, make it explicit.


```javascript
// bad
isNaN('1.2'); // false
isNaN('1.2.3'); // true

// good
Number.isNaN('1.2.3'); // false
Number.isNaN(Number('1.2.3')); // true
```

- 29.2UseNumber.isFiniteinstead of globalisFinite.
eslint:no-restricted-globalsWhy? The globalisFinitecoerces non-numbers to numbers, returning true for anything that coerces to a finite number.
If this behavior is desired, make it explicit.// badisFinite('2e3');// true// goodNumber.isFinite('2e3');// falseNumber.isFinite(parseInt('2e3',10));// true

29.2UseNumber.isFiniteinstead of globalisFinite.
eslint:no-restricted-globals


Why? The globalisFinitecoerces non-numbers to numbers, returning true for anything that coerces to a finite number.
If this behavior is desired, make it explicit.


```javascript
// bad
isFinite('2e3'); // true

// good
Number.isFinite('2e3'); // false
Number.isFinite(parseInt('2e3', 10)); // true
```


⬆ back to top


## Testing

- 30.1Yup.functionfoo(){returntrue;}

30.1Yup.


```javascript
function foo() {
  return true;
}
```

- 30.2No, but seriously:Whichever testing framework you use, you should be writing tests!Strive to write many small pure functions, and minimize where mutations occur.Be cautious about stubs and mocks - they can make your tests more brittle.We primarily usemochaandjestat Airbnb.tapeis also used occasionally for small, separate modules.100% test coverage is a good goal to strive for, even if it’s not always practical to reach it.Whenever you fix a bug,write a regression test. A bug fixed without a regression test is almost certainly going to break again in the future.
- Whichever testing framework you use, you should be writing tests!
- Strive to write many small pure functions, and minimize where mutations occur.
- Be cautious about stubs and mocks - they can make your tests more brittle.
- We primarily usemochaandjestat Airbnb.tapeis also used occasionally for small, separate modules.
- 100% test coverage is a good goal to strive for, even if it’s not always practical to reach it.
- Whenever you fix a bug,write a regression test. A bug fixed without a regression test is almost certainly going to break again in the future.
- Whichever testing framework you use, you should be writing tests!
- Strive to write many small pure functions, and minimize where mutations occur.
- Be cautious about stubs and mocks - they can make your tests more brittle.
- We primarily usemochaandjestat Airbnb.tapeis also used occasionally for small, separate modules.
- 100% test coverage is a good goal to strive for, even if it’s not always practical to reach it.
- Whenever you fix a bug,write a regression test. A bug fixed without a regression test is almost certainly going to break again in the future.

⬆ back to top


## Performance

- On Layout & Web Performance
- String vs Array Concat
- Try/Catch Cost In a Loop
- Bang Function
- jQuery Find vs Context, Selector
- innerHTML vs textContent for script text
- Long String Concatenation
- Are JavaScript functions likemap(),reduce(), andfilter()optimized for traversing arrays?
- Loading...

⬆ back to top


## Resources


Learning ES6+

- Latest ECMA spec
- ExploringJS
- ES6 Compatibility Table
- Comprehensive Overview of ES6 Features
- JavaScript Roadmap

Read This

- Standard ECMA-262

Tools

- Code Style LintersESlint-Airbnb Style .eslintrcJSHint-Airbnb Style .jshintrc
- ESlint-Airbnb Style .eslintrc
- JSHint-Airbnb Style .jshintrc
- Neutrino Preset -@neutrinojs/airbnb
- ESlint-Airbnb Style .eslintrc
- JSHint-Airbnb Style .jshintrc

Other Style Guides

- Google JavaScript Style Guide
- Google JavaScript Style Guide (Old)
- jQuery Core Style Guidelines
- Principles of Writing Consistent, Idiomatic JavaScript
- StandardJS

Other Styles

- Naming this in nested functions- Christian Johansen
- Conditional Callbacks- Ross Allen
- Popular JavaScript Coding Conventions on GitHub- JeongHoon Byun
- Multiple var statements in JavaScript, not superfluous- Ben Alman

Further Reading

- Understanding JavaScript Closures- Angus Croll
- Basic JavaScript for the impatient programmer- Dr. Axel Rauschmayer
- You Might Not Need jQuery- Zack Bloom & Adam Schwartz
- ES6 Features- Luke Hoban
- Frontend Guidelines- Benjamin De Cock

Books

- JavaScript: The Good Parts- Douglas Crockford
- JavaScript Patterns- Stoyan Stefanov
- Pro JavaScript Design Patterns- Ross Harmes and Dustin Diaz
- High Performance Web Sites: Essential Knowledge for Front-End Engineers- Steve Souders
- Maintainable JavaScript- Nicholas C. Zakas
- JavaScript Web Applications- Alex MacCaw
- Pro JavaScript Techniques- John Resig
- Smashing Node.js: JavaScript Everywhere- Guillermo Rauch
- Secrets of the JavaScript Ninja- John Resig and Bear Bibeault
- Human JavaScript- Henrik Joreteg
- Superhero.js- Kim Joar Bekkelund, Mads Mobæk, & Olav Bjorkoy
- JSBooks- Julien Bouquillon
- Third Party JavaScript- Ben Vinegar and Anton Kovalyov
- Effective JavaScript: 68 Specific Ways to Harness the Power of JavaScript- David Herman
- Eloquent JavaScript- Marijn Haverbeke
- You Don’t Know JS: ES6 & Beyond- Kyle Simpson

Blogs

- JavaScript Weekly
- JavaScript, JavaScript...
- Bocoup Weblog
- Adequately Good
- NCZOnline
- Perfection Kills
- Ben Alman
- Dmitry Baranovskiy
- nettuts

Podcasts

- JavaScript Air
- JavaScript Jabber

⬆ back to top


## In the Wild


This is a list of organizations that are using this style guide. Send us a pull request and we'll add you to the list.

- 123erfasst:123erfasst/javascript
- 4Catalyzer:4Catalyzer/javascript
- Aan Zee:AanZee/javascript
- Airbnb:airbnb/javascript
- AloPeyk:AloPeyk
- AltSchool:AltSchool/javascript
- Apartmint:apartmint/javascript
- Ascribe:ascribe/javascript
- Avant:avantcredit/javascript
- Axept:axept/javascript
- Billabong:billabong/javascript
- Bisk:bisk
- Brainshark:brainshark/javascript
- CaseNine:CaseNine/javascript
- Cerner:Cerner
- Chartboost:ChartBoost/javascript-style-guide
- Coeur d'Alene Tribe:www.cdatribe-nsn.gov
- ComparaOnline:comparaonline/javascript
- Compass Learning:compasslearning/javascript-style-guide
- DailyMotion:dailymotion/javascript
- DoSomething:DoSomething/eslint-config
- Digitpaintdigitpaint/javascript
- Drupal:www.drupal.org
- Ecosia:ecosia/javascript
- Evolution Gaming:evolution-gaming/javascript
- EvozonJs:evozonjs/javascript
- ExactTarget:ExactTarget/javascript
- Flexberry:Flexberry/javascript-style-guide
- Gawker Media:gawkermedia
- General Electric:GeneralElectric/javascript
- Generation Tux:GenerationTux/javascript
- GoodData:gooddata/gdc-js-style
- GreenChef:greenchef/javascript
- Grooveshark:grooveshark/javascript
- Grupo-Abraxas:Grupo-Abraxas/javascript
- Happeo:happeo/javascript
- How About We:howaboutwe/javascript
- HubSpot:HubSpot/javascript
- Hyper:hyperoslo/javascript-playbook
- ILIAS:ILIAS
- InterCity Group:intercitygroup/javascript-style-guide
- Jam3:Jam3/Javascript-Code-Conventions
- JSSolutions:JSSolutions/javascript
- Kaplan Komputing:kaplankomputing/javascript
- KickorStick:kickorstick
- Kinetica Solutions:kinetica/javascript
- LEINWAND:LEINWAND/javascript
- Lonely Planet:lonelyplanet/javascript
- M2GEN:M2GEN/javascript
- Mighty Spring:mightyspring/javascript
- MinnPost:MinnPost/javascript
- MitocGroup:MitocGroup/javascript
- Muber:muber
- National Geographic Society:natgeosociety
- NullDev:NullDevCo/JavaScript-Styleguide
- Nulogy:nulogy/javascript
- Orange Hill Development:orangehill/javascript
- Orion Health:orionhealth/javascript
- Peerby:Peerby/javascript
- Pier 1:Pier1/javascript
- Qotto:Qotto/javascript-style-guide
- React:reactjs.org/docs/how-to-contribute.html#style-guide
- Ripple:ripple/javascript-style-guide
- Sainsbury’s Supermarkets:jsainsburyplc
- Shutterfly:shutterfly/javascript
- Sourcetoad:sourcetoad/javascript
- Springload:springload
- StratoDem Analytics:stratodem/javascript
- SteelKiwi Development:steelkiwi/javascript
- StudentSphere:studentsphere/javascript
- SwoopApp:swoopapp/javascript
- SysGarage:sysgarage/javascript-style-guide
- Syzygy Warsaw:syzygypl/javascript
- Target:target/javascript
- Terra:terra
- TheLadders:TheLadders/javascript
- The Nerdery:thenerdery/javascript-standards
- Tomify:tomprats
- Traitify:traitify/eslint-config-traitify
- T4R Technology:T4R-Technology/javascript
- UrbanSim:urbansim
- VoxFeed:VoxFeed/javascript-style-guide
- WeBox Studio:weboxstudio/javascript
- Weggo:Weggo/javascript
- Zillow:zillow/javascript
- Zit Software:zit-software/javascript
- ZocDoc:ZocDoc/javascript

⬆ back to top


## Translation


This style guide is also available in other languages:

- Brazilian Portuguese:armoucar/javascript-style-guide
- Bulgarian:borislavvv/javascript
- Catalan:fpmweb/javascript-style-guide
- Chinese (Simplified):lin-123/javascript
- Chinese (Traditional):jigsawye/javascript
- French:nmussy/javascript-style-guide
- German:timofurrer/javascript-style-guide
- Italian:sinkswim/javascript-style-guide
- Japanese:mitsuruog/javascript-style-guide
- Korean:ParkSB/javascript-style-guide
- Russian:leonidlebedev/javascript-airbnb
- Spanish:paolocarrasco/javascript-style-guide
- Thai:lvarayut/javascript-style-guide
- Turkish:eraycetinay/javascript
- Ukrainian:ivanzusko/javascript
- Vietnam:dangkyokhoang/javascript-style-guide

## The JavaScript Style Guide Guide

- Reference

## Chat With Us About JavaScript

- Find us ongitter.

## Contributors

- View Contributors

## License


(The MIT License)


Copyright (c) 2012 Airbnb


Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:


The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.


THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


⬆ back to top


## Amendments


We encourage you to fork this guide and change the rules to fit your team’s style guide. Below, you may list some amendments to the style guide. This allows you to periodically update your style guide without having to deal with merge conflicts.


# };