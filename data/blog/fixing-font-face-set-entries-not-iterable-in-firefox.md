---
title:       "Handling FontFaceSet.entries() result not being iterable in Firefox"
description: "This post describes how to deal with a bug in Firefox where it fails to properly identify the result of <code>FontFaceSet.entries()</code> as an actual iterable object."
published:   "2022-11-29T19:20:00Z"
---

Today at work I fixed a bug while working with `FontFaceSet.entries()` which only
appears in Firefox. This might not seem so strange in browser land, until I give
you the gist of the bug. So without further ado, let's get into it!

## Bug description

You may at some point have used methods such as [`Object.entries()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
or [`URLSearchParams.entries()`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/entries) to get an iterator of `[key, value]` arrays.
This iterator can then be used to _loop_ over collections of data using
[`for...of`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) loops, or can be spread into an array using [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax).

This concept is pretty well known and has been widely implemented across browsers
for quite some time so there should be no need to worry about implementation differences.

Unfortunately, this changed for me after encountering an issue _only_ in Firefox
where `FontFaceSet.entries()` does not return an iterable object while
it does in fact look **quite iterable**:

<Media
    src="/media/posts/entries-not-iterable-firefox.png"
    alt="FontFaceSet.entries() is not iterable error"
    width="878"
    height="106"
/>

## Debugging the problem

To look further into what is causing this, we must know what
`document.fonts.entries()` returns. We can figure out by creating
a minimal reproducible example which can be used for debugging.

Given the following HTML:

```html
<!DOCTYPE html>
<html>
    <head>
        <title>FontFaceSet.entries()</title>
        <link
            type="text/css"
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Lato:wght@400&display=swap"
        />
        <link
            type="text/css"
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap"
        />
    </head>
    <body>
        <span style="font-family: Lato">Hello</span>
        <span style="font-family: Roboto">World</span>
        <script type="text/javascript">
            console.log(document.fonts.entries());
        </script>
    </body>
</html>
```

Opening this page in Firefox yields the following result in the console:

```javascript
FontFaceSetIterator { }
```

Whereas in Chrome the following result appears in the console:

```javascript
Iterator { }
```
Interesting indeed but alas, **neither** of these is actually documented
(iterator _[protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)_ are, but not the objects themselves).
In one case while checking [`URLSearchParams.entries()`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/entries)
documentation the word "iterator" even links to the "iterator _protocols_" page... :confused:

## Looking for answers

One of the first things I did after realizing there was no documentation
was to see if a bug was open on Firefox's bug tracker. Indeed two issues mention
this unholy Firefox construct:

- [https://bugzilla.mozilla.org/show_bug.cgi?id=1729089](https://bugzilla.mozilla.org/show_bug.cgi?id=1729089)
- [https://bugzilla.mozilla.org/show_bug.cgi?id=1780657](https://bugzilla.mozilla.org/show_bug.cgi?id=1780657)

Unfortunately one is already a year old at the time of writing this article
which means there is little hope for a "hotfix" and also means that this
behavior has existed in Firefox for at least one year.

Since this isn't something Firefox seems to be fixing and the documentation
is lacking there isn't much to do aside from writing a workaround for
a problem which shouldn't even exist in the first place.

## Solving the problem

The value returned by `document.fonts.entries()` in Firefox may not be "officially"
iterable from the browser's own perspective, but it **does** have a `.next()`
method as is required per [iterator protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterator_protocol).

So, instead of relying on browser magic, we can instead write a
wrapper function which exhausts this fake "iterator":

```javascript
function fontFaceSetIteratorToArray(target) {
    const iterable = target.entries();
    const results = [];
    let iterator = iterable.next();

    while (iterator.done === false) {
        results.push(iterator.value);

        iterator = iterable.next();
    }

    return results;
}
```

Which means that in Firefox we can now finally loop over font faces :tada:

```javascript
console.log(fontFaceSetIteratorToArray(document.fonts));
```

This piece of code works in all modern browsers so it can be used wherever
references to `FontFaceSet.entries()` exist. It's not pretty, but it beats
writing unreliable browser detection code.

## Conclusion

Considering this is still an active problem in Firefox roughly a month before 2023,
using spread syntax, `for...of`, or `Array.from` on `FontFaceSet.entries()` results is
**not viable** and instead a polyfill such as the one found in this article must be
used instead to ensure proper functionality across browsers.

It'll take some time before we can finally start using `[...document.fonts.entries()]`
considering that even after closing the issue, we're still dependent on
everyone updating their browsers.

While this post does not end on a high note I do hope Firefox developers fix this
issue at some point so we can all enjoy the syntactically sugarcoated patterns
we know and love :)

Until next time!

:wave:


