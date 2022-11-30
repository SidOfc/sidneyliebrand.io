---
title:       "A collection of Vim key binds"
description: "In my never ending quest for an optimal Vim setup I am always looking for ways to improve. I've used Vim for about two months now and I'm still learning a lot. In this post I'm going to take you through a part of my .vimrc that describes my non-plugin key binds."
published:   "2017-09-16T13:11:03Z"
---

<Media
    src="/media/posts/vimrc-movement-key-binds.png"
    alt="A screenshot of my vimrc movement key bindings"
    width="900"
    height="315"
/>

Vim is installed on almost every unix system known to man,
therefore knowing how it works will allow you to work pretty much anywhere.
Why would you create customized mappings that only work on your machine?

## Ease of use

Key binds in Vim are not always the most intuitive to use.
Take for instance, moving up or down a paragraph which are bound to <kbd>\{</kbd> and <kbd>\}</kbd> respectively.
I find these binds quite awkward, but like <kbd>w</kbd>, they allow you to move a lot faster
than using line wise <kbd>j</kbd> or <kbd>k</kbd>. For that reason, I rebound them to <kbd>J</kbd> and <kbd>K</kbd> instead (note their case).
Since they apply no useful action in normal mode and they are more easily combined with the <kbd>shift</kbd>
key than <kbd>\{</kbd> and <kbd>\}</kbd> it made sense to me to map them to something easier to reach.

## Consistency

Some of the key binds are actually inconsistent. Given that there is <kbd>D</kbd> for deleting from cursor to
end of line and <kbd>C</kbd> to change from cursor to end of line, but for some reason, <kbd>Y</kbd> does not share the
"from cursor to end of line" behavior. We can fix this by overwriting the map and binding <kbd>Y</kbd> to `y$`
instead (visit `:h Y` in Vim), which *will* make it copy from cursor to end of line.

## End bad habits

Vim will definitely put an end to at least *most* of your bad habits. Using the arrow keys to
move around is generally considered a bad thing in my opinion since you have to move your hand
away from the home row of your keyboard. Therefore you can unbind them by setting them do do nothing.
The next time you press such key, it will simply... *do nothing* and your brain will rewire itself
based on the negative impulse :)

## My key binds

So without further ado, here are my non-plugin key binds.

### Pairing braces

```vim.map
inoremap <> <><Left>
inoremap () ()<Left>
inoremap {} {}<Left>
inoremap [] []<Left>
inoremap "" ""<Left>
inoremap '' ''<Left>
inoremap `` ``<Left>
```

The way I type braces might be weird, but I like it. Basically, whenever I type an opening brace or quote,
I close it off and move my cursor between them. This ensures that I always have matching braces and I don't
actually have to go back and add them later (especially useful in nesting situations).

What this does is when you type <kbd>\<</kbd> followed by <kbd>\></kbd> for example, vim will replace it with the same characters,
but it will also "insert" `<Left>` or rather, insert an arrow keypress left which leaves you in this position:
`<|>` where the bar represents the cursor. You can now type away without having to worry about that closing brace!

### Navigational keys

```vim.map
nmap <Up>    <Nop>
nmap <Down>  <Nop>
nmap <Left>  <Nop>
nmap <Right> <Nop>

map $ <Nop>
map ^ <Nop>
map { <Nop>
map } <Nop>

noremap K     {
noremap J     }
noremap H     ^
noremap L     $
noremap <C-x> :bp<Bar>bd #<Cr>
```

I've already discussed the keys <kbd>J</kbd> and <kbd>K</kbd> which are used for moving up and down by paragraph.
Likewise <kbd>H</kbd> maps to <kbd>^</kbd> which takes you to the first *non-whitespace* character of the current line
and <kbd>L</kbd> maps to <kbd>$</kbd> which takes you to the *end* of the current line.
I like to think of these mappings as stronger versions of the regular <kbd>h</kbd>, <kbd>j</kbd>, <kbd>k</kbd>, <kbd>l</kbd> motions in Vim.

The last mapping to discuss here is <kbd>ctrl</kbd>+<kbd>x</kbd>. What this does is open the previous buffer in the current
pane and close the buffer visible before that. This means that if I open `filea.txt` and then open
`fileb.txt` in the same pane, pressing <kbd>ctrl</kbd>+<kbd>x</kbd> will show me filea.txt and close the buffer containing `fileb.txt`.
I like this because I work with split panes a lot and I don't always want my split to disappear when
I'm done working with a file. Now it will show me the file I had open before that.

### Insert mode navigational keys

```vim.map
imap <Up>    <Nop>
imap <Down>  <Nop>
imap <Left>  <Nop>
imap <Right> <Nop>

inoremap <C-k> <Up>
inoremap <C-j> <Down>
inoremap <C-h> <Left>
inoremap <C-l> <Right>
```

These ones are very new to me and I have only added them recently. I'm still thinking that when I
did this about a month ago, I was completely and utterly disoriented without the arrow keys in insert mode.
I simply didn't understand how to move out of some situations in insert mode and I hadn't discovered <kbd>ctrl</kbd>+<kbd>o</kbd> yet either.
I ended up using the hjkl combo I knew for moving around and prefixing it with control,
so in insert mode, <kbd>ctrl</kbd>+<kbd>l</kbd> moves me one character to the right, as <kbd>l</kbd> would do in normal mode.

Insert mode is not really the mode you want to be in most of the time, unless you are actually writing code that is.
But it is annoying to have to switch out of insert mode *just* to use a normal mode command to move to the right place.
I found that using <kbd>ctrl</kbd>+<kbd>o</kbd> followed by a command used too many keypresses for the same operation and thus I
ended up with the `<C-[direction]>` keys for movement in insert mode.

### <kbd>tab</kbd> and <kbd>shift</kbd>+<kbd>tab</kbd> to indent and de-indent

```vim.map
nmap >> <Nop>
nmap << <Nop>
vmap >> <Nop>
vmap << <Nop>

nnoremap <Tab>   >>
nnoremap <S-Tab> <<
vnoremap <Tab>   >><Esc>gv
vnoremap <S-Tab> <<<Esc>gv
```

Yet another pair of inconvenient binds are used for indenting and de-indenting code, <kbd>\>\></kbd> and <kbd>\<\<</kbd> respectively.
Like with the default paragraph binds I think these can be better by just using the bindings I already know and use: <kbd>tab</kbd>
and <kbd>shift</kbd>+<kbd>tab</kbd>. These binds are to be used in normal or visual mode as we have a special purpose for <kbd>shift</kbd>+<kbd>tab</kbd> in insert mode.

### Avoiding the <kbd>esc</kbd> key

```vim.map
inoremap <S-Tab> <Esc>
onoremap <S-Tab> <Esc>
```

While there is no such real thing like completely avoiding the escape key, I can manage pretty
well without it with these simple binds. The first one will take you out of insert mode when
you hit <kbd>shift</kbd>+<kbd>tab</kbd>. Since it does nothing useful, it might as well save one of my fingers some serious wear.
The second map is used in operator pending mode, which is when you type <kbd>d</kbd><kbd>3</kbd>,
the next thing that follows is the operator to finish the command. This means that if I press <kbd>d</kbd><kbd>3</kbd><kbd>shift</kbd>+<kbd>tab</kbd>
I will no longer be in operator pending mode, handy for when you accidentally typed <kbd>4</kbd> instead of <kbd>3</kbd>
(while you don't *see* this, you just *feel* it).

### Run macro's with <kbd>Q</kbd>

```vim.map
nnoremap Q @q
```

This one is a bit different, I'm not unbinding <kbd>@</kbd><kbd>q</kbd> here as I simply *don't have to*. The clumsiness of this
bind leads me to never accidentally press it anyway. To explain, for recording a macro use <kbd>qq</kbd>,
to stop recording use <kbd>q</kbd> and to play it, simply use <kbd>Q</kbd> &mdash; much better than pressing <kbd>@</kbd><kbd>q</kbd>.
Note that this might not be handy if you use a lot of macros and registers.
I mostly remember and use one macro at a time for the moment so this bind fits my needs.

### Consistent <kbd>Y</kbd>

```vim.map
nnoremap Y y$
```

So unlike our friends <kbd>C</kbd> and <kbd>D</kbd> which change and delete *from cursor to end of line* respectively, <kbd>Y</kbd>
seems to have some issues, it basically does a <kbd>y</kbd><kbd>y</kbd> which we already have... <kbd>y</kbd><kbd>y</kbd> for. So to make it consistent with its bro's,
I remapped it to <kbd>y</kbd><kbd>$</kbd>. Additional explanation can be found in the help section: `:h Y`.

## Wrapping up

I hope you found some useful binds in between, or a useful context with which you can create such mappings yourself.
These are my vanilla key binds so they should work in your .vimrc too, no plugins required.
Vim is a blast to work in and it is *by far* the most flexible text editor I've used. It allows me to spend my days in
a terminal with joy and helps me work faster than I could with any conventional text editor.
Custom key binds were not my first goal but as I started to get more comfortable I found some things to be awkward.
It is the process of finding and removing these awkward binds and turning them into something useful that will
transform you into a text editing machine.

Happy Vimming :)

:wave:
