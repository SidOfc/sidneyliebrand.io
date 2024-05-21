---
title:       "Codi.vim + fullscreen buffer"
description: "Learn how to set up Codi.vim to create a fullscreen scratch buffer that also works with Vim splits. We will take a look at wrapping the <code>Codi</code> command and improving the buffer name(s) as seen in <code>:ls</code>."
published:   "2018-08-27T07:55:24Z"
---

<Media
    src="/media/posts/codi-banner.png"
    alt="A Codi.vim fullscreen buffer"
    width="1672"
    height="972"
/>

Recently I discovered [codi.vim](https://github.com/metakirby5/codi.vim "Visit metakirby5/codi.vim on GitHub") on [vimawesome.com](https://vimawesome.com/?q=cat%3Aother "Visit vimawesome.com 'Other' category plugin").
It sells itself as an "interactive scratchpad for hackers".
After playing around with it for 5 minutes I was completely sold.

I pair program on a weekly basis using various different languages.
I used to turn to a REPL for help but this quickly becomes annoying when trying to write multi-line expressions.
Making a typo in the middle of a `do ... end` block in Ruby is quite costly:

<Media
    src="/media/posts/pry-multiline-typo"
    alt="Multiline expression typo in Pry"
    width="1033"
    height="250"
/>

Another thing to note here is that code and results are printed sequentially.
This means that any code you write goes off-screen at least twice as fast because the result is printed below it.

In case of errors and stack traces it can become a lot worse as well.
Codi solves all of this by allowing you to type in one pane and it prints the results in a separate pane side-by-side:

<Media
    src="/media/posts/ruby-demo"
    alt="Demo of Ruby in Codi.vim"
    width="1033"
    height="141"
/>

This feature, and the fact that I can toggle this buffer for _multiple programming languages_ using a single mapping blew my mind but as with anything,
it requires some more battle testing to see if it works in common scenario's.

## Battle testing

This is where I found out that when used with a split, it will not be fullscreen but rather split the current buffer:

<Media
    src="/media/posts/split-behavior"
    alt="Default split behavior"
    width="1033"
    height="496"
/>

At this point I started experimenting with a small [vimscript snippet](https://gist.github.com/SidOfc/5218a7a9f12ed2105a9b052ca8e6707e "Visit codi.vim snippet github gist") in my .vimrc.
Excluding comments and blanks it is 10 LoC.
It wraps the default `Codi` command in a function which creates an empty buffer in a new tab with the right filetype set before finally running `Codi` itself.
This creates the fullscreen split that I wanted:

<Media
    src="/media/posts/wrapped-split-behavior"
    alt="Enhanced split behavior"
    width="1033"
    height="496"
/>

## Problem solved, or maybe not?

All good so far, but upon closing the buffer, the contents of the buffer are deleted.
While automatically clearing the scratchpad is nice, sometimes I want to go back and forth between the code and the scratchpad to add additional code or compare the existing code with the scratchpad code.

This required a [second iteration](https://gist.github.com/SidOfc/3f94244a8b08406710b6669052f66d62 "Visit second codi.vim snippet github gist") of the original vimscript snippet.
This time I did not want to delete the buffer but hide it instead, keeping the code that was already written in it.
After hiding the buffer, its `tabpagenr()` is stored in a dictionary keyed by the filetype of the buffer.

Then, when toggling codi for a filetype that is stored, switch to that tab instead of opening a new one (there is even a check if that tab actually exists):

<Media
    src="/media/posts/wrapped-split-behavior-2"
    alt="Enhanced split behavior version 2"
    width="1033"
    height="496"
/>

And there we go! Aside from the fact that the buffer now remains, the name is also `scratch::ruby`.
This is a bit more descriptive than having just `[Scratch]` in `:ls` output when multiple codi buffers of a different filetype are active.

## Let's wrap it in an issue

It was a fun experience tweaking this plugin to my liking.
I thought this feature would be so awesome that I even proposed it in an [issue](https://github.com/metakirby5/codi.vim/issues/94 "View metakirby5/codi.vim issue #94").
Unfortunately it didn't make it since it was too workflow specific.

As you may have been able to see in the issue though, the code in that snippet is _slighty_ different from the example gist linked in this post.
The main difference is this line which resizes codi to 50% of the buffer width whenever a new instance is spawned:

```vim
" since it is fullscreen, I'd like a 50/50 split
let g:codi#width = winwidth(winnr()) / 2
```

The author thought it would be a nice addition to have percentage width support and for the snippets to live elsewhere for others to use in their .vimrc.
So I went ahead and [wrote a PR](https://github.com/metakirby5/codi.vim/pull/95 "View metakirby5/codi.vim pull request #95") for that instead, this is why you see
`let g:codi#width = 50.0` in the gists :)

## Conclusion

All in all it was a great experience discovering this plugin.
It is like one of those rare cases with a song where after a few seconds **you just know** _"this song is awesome"_.
I believe I'll be using it for a long time to come for quickly testing and showing some code.

This also gave me the chance to write my first non-organization bound PR for a project which I like and now also use.
Something which I wanted to do for a long time but couldn't really find the right project to contribute to.
I want to thank [Ethan Chan](https://medium.com/@metakirby5 "View @metakirby5 on Medium") for his awesome plugin and for being a kind and friendly maintainer!

That's it! If you want a fullscreen workflow with codi.vim, you have it.
If you want to persist the code in the buffer, you have it.

Until next time.

:wave:
