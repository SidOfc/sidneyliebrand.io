---
title:       "Creating my own vim statusline"
description: "Recently I decided to clean up my vim plugins once again, I do not think I use too many but I prefer to keep my setup simple. One of the things which bothered me was the configuration for lightline.vim in my vim config. It seemed needlessly complex and I wondered if I could recreate it without any plugins at all!"
published:   "2020-05-21T00:12:34Z"
---

I love Vim (more specifically Neovim) and the great text editing powers it
comes with out of the box. It gets even better when enhancing Vim with
plugins to make life a lot easier as well. Over time I've added, swapped,
and removed many. One of the plugins I have used for a long time is [lightline.vim](https://github.com/itchyny/lightline.vim).

lightline is a plugin that takes control of Vim's statusline and allows the user
to customize it to look and function however they want. Before getting to my lightline
configuration (and after that, my own implementation) however,
I want to show (or remind) you how Vim's statusline looks out of the box:

<%= figure_tag 'posts/vim-default-statusline.png', alt: 'default vim statusline' %>

It provides useful information such as the current filename and the line and
column number the cursor is on (it also shows "All" to the right but to this
day I haven't really looked into what that means). Aside from that, the
statusline shows when the file has been modified with a `[+]` marker
after the filename:

<%= figure_tag 'posts/vim-default-statusline-modified.png', alt: 'default vim statusline with modified flag' %>

And finally, it will also show when a file is readonly with a `[RO]` marker:

<%= figure_tag 'posts/vim-default-statusline-readonly.png', alt: 'default vim statusline with read-only flag' %>

This is all nice and useful, but at the same time it isn't very... ehm
visually pleasing... at least in my opinion. This is where lightline comes in.

## Pimping the statusline

lightline makes it possible to add some life to the statusline without having
to dive deep into how Vim works. This is great if you're starting out like
I was a few years ago. I wanted it to do things it did not do out of the box
such as showing a different color in each mode and replacing the bulky
`[+]` and `[RO]` markers with something "cleaner". This is how I made mine look:

<%= video_tag 'posts/vim-colored-statusline', alt: 'lightline.vim statusline colors' %>

The blue color is used in normal mode, the yellow/green is used
in insert mode, and the purple is used for all the visual modes
(blockwise, linewise, regular visual).

This was already a massive improvement and as you may have noticed,
the line and column numbers are now shown on the right and "All" is gone.
I also mentioned that I wanted to replace the markers with something a bit
cleaner, this is what I cam up with:

<%= figure_tag 'posts/vim-statusline-lightline-modified.png', alt: 'lightline.vim statusline with modified flag' %>

The `+` is spaced and placed on the left side of the statusline. This
is my personal preference, I think this is useful so that I can always see
if a file is modified by looking **all the way to the left** rather than
having to scan for it after the filename which can have a variable length.

I also mentioned that by default, Vim will also show if a file is readonly.
To be honest, I didn't care about this since it adds a new scenario and if I
wanted to keep the single-character marker for aesthetics I'd have to use a
different character which I would then have to remember to mean "this is readonly".

For this reason, I decided not to show readonly and live with the fact that
trying to write certain files would give me an error. It doesn't come up
often enough for me to justify having it in my statusline.

Now that we've explored all this, I'd like to jump into the downside
of lightline.vim. While it is a fantastic plugin for newcomers to Vim
and comes with great power, it comes at the cost of **configuration**.

## Configuring lightline

I had some difficulties with configuring lightline the way I wanted.
The primary reason being that I did not like the default configuration
and the themes lightline provides out of the box did not fit my colorscheme.

As a visual person I tend to go a little crazy when everything is different.
I like consistency and will go to great lengths to achieve it, even for
something seemingly simple such as the statusline.

I must add that when I initially wrote the config to solve above issues,
I was quite new to Vim myself and probably made some poor choices. These
choices however, stuck with me for quite some time and as I spent less
time configuring, I also forgot how to change things and had to always
go back to the documentation to figure out how to do stuff.
All that being said, I'd like to share the full "block" of configuration
that made this possible:

~~~viml
let s:base1   = '#C8CACB'
let s:base0   = '#AEB0B1'
let s:base00  = '#949697'
let s:base02  = '#626465'
let s:base023 = '#484A4B'
let s:base03  = '#2F3132'
let s:red     = '#cd3f45'
let s:orange  = '#db7b55'
let s:yellow  = '#e6cd69'
let s:green   = '#9fca56'
let s:cyan    = '#55dbbe'
let s:blue    = '#55b5db'
let s:magenta = '#a074c4'

let s:p = {'normal': {}, 'inactive': {}, 'insert': {},
         \ 'replace': {}, 'visual': {}, 'tabline': {}}

let s:p.normal.left    = [ [ s:blue,   s:base03  ], [ s:base03, s:blue   ] ]
let s:p.normal.middle  = [ [ s:base1,  s:base03  ]  ]
let s:p.normal.right   = [ [ s:base03, s:blue    ], [ s:base00, s:base03 ] ]
let s:p.normal.error   = [ [ s:red,    s:base023 ]  ]
let s:p.normal.warning = [ [ s:yellow, s:base02  ]  ]

let s:p.inactive.left   = [ [ s:base1,   s:base03  ], [ s:base03, s:base03  ] ]
let s:p.inactive.middle = [ [ s:base03,  s:base03  ]  ]
let s:p.inactive.right  = [ [ s:base03,  s:base03  ], [ s:base03, s:base03  ] ]

let s:p.insert.left     = [ [ s:green,   s:base03  ], [ s:base03, s:green   ] ]
let s:p.insert.right    = [ [ s:base03,  s:green   ], [ s:base00, s:base03  ] ]
let s:p.replace.left    = [ [ s:orange,  s:base03  ], [ s:base03, s:orange  ] ]
let s:p.replace.right   = [ [ s:base03,  s:orange  ], [ s:base00, s:base03  ] ]
let s:p.visual.left     = [ [ s:magenta, s:base03  ], [ s:base03, s:magenta ] ]
let s:p.visual.right    = [ [ s:base03,  s:magenta ], [ s:base00, s:base03  ] ]

let g:lightline#colorscheme#base16_seti#palette = lightline#colorscheme#fill(s:p)
let s:label = '%{substitute(expand("%"), "NetrwTreeListing \\d\\+", "netrw", "")}'
let g:lightline = {
      \ 'colorscheme':      'base16_seti',
      \ 'separator':        { 'left': "", 'right': "" },
      \ 'subseparator':     { 'left': "│", 'right': "│" },
      \ 'active': {
      \   'left': [ [ 'paste' ],
      \             [ 'modified', 'label' ] ],
      \   'right': [ [ 'lineinfo' ] ]
      \ },
      \ 'component': {
      \   'mode':     '%{lightline#mode()[0]}',
      \   'readonly': '%{&filetype=="help"?"":&readonly?"!":""}',
      \   'modified': '%{&filetype=="help"?"":&modified?"+":&modifiable?"":"-"}',
      \   'label':    s:label
      \ },
      \ 'component_visible_condition': {
      \   'paste':    '(&paste!="nopaste")',
      \   'readonly': '(&filetype!="help"&& &readonly)',
      \   'modified': '(&filetype!="help"&&(&modified||!&modifiable))',
      \ }
    \ }
~~~

At the start I was perfectly fine with dealing with this, I was in
"the configuration zone" at the time anyway so I did not care. Future me however,
was no longer satisfied by the cryptic block of configuration.

I also didn't want to sink more time into demystifying it either. What I wanted,
was **simplicity**. After having gained some experience with Vim and writing
[my own markdown plugin](https://github.com/sidofc/mkdx) and [my own file explorer](https://github.com/sidofc/treevial)
I figured it was time to write my own statusline.

## Ditching lightline.vim

First off, I'd like to emphasize that lightline.vim is a great plugin. I loved
it until the very end and it allowed me to do whatever I wanted without having
intricate knowledge of Vimscript.

The thing that broke me was the way the colors had to be specified,
the `let s:p` object with lots of nested lists which contained more lists
drove me crazy every time I looked at my vim config. It was a black box that
I wanted to get rid of.

So finally, I decided to **roll my own**. It took me roughly two to three hours
to figure out how I could make the statusline work the way I wanted using
plain Vimscript in addition to stealing a small snippet from a statusline plugin
to make sure only one statusline was active and unfocussed windows would
show a "grayscale" version. This is the pure-vimscript implementation I came up with:

~~~viml
let g:mode_colors = {
      \ 'n':  'StatusLineSection',
      \ 'v':  'StatusLineSectionV',
      \ '^V': 'StatusLineSectionV',
      \ 'i':  'StatusLineSectionI',
      \ 'c':  'StatusLineSectionC',
      \ 'r':  'StatusLineSectionR'
      \ }

fun! StatusLineRenderer()
  let hl = '%#' . get(g:mode_colors, tolower(mode()), g:mode_colors.n) . '#'

  return hl
        \ . (&modified ? ' + │' : '')
        \ . ' %{StatusLineFilename()} %#StatusLine#%='
        \ . hl
        \ . ' %l:%c '
endfun

fun! StatusLineFilename()
  if (&ft ==? 'netrw') | return '*' | endif
  return substitute(expand('%'), '^' . getcwd() . '/\?', '', 'i')
endfun

fun! <SID>StatusLineHighlights()
  hi StatusLine         ctermbg=8  guibg=#313131 ctermfg=15 guifg=#cccccc
  hi StatusLineNC       ctermbg=0  guibg=#313131 ctermfg=8  guifg=#999999
  hi StatusLineSection  ctermbg=8  guibg=#55b5db ctermfg=0  guifg=#333333
  hi StatusLineSectionV ctermbg=11 guibg=#a074c4 ctermfg=0  guifg=#000000
  hi StatusLineSectionI ctermbg=10 guibg=#9fca56 ctermfg=0  guifg=#000000
  hi StatusLineSectionC ctermbg=12 guibg=#db7b55 ctermfg=0  guifg=#000000
  hi StatusLineSectionR ctermbg=12 guibg=#ed3f45 ctermfg=0  guifg=#000000
endfun

call <SID>StatusLineHighlights()

" only set default statusline once on initial startup.
" ignored on subsequent 'so $MYVIMRC' calls to prevent
" active buffer statusline from being 'blurred'.
if has('vim_starting')
  let &statusline = ' %{StatusLineFilename()}%= %l:%c '
endif

augroup vimrc
  au!
  " show focussed buffer statusline
  au FocusGained,VimEnter,WinEnter,BufWinEnter *
    \ setlocal statusline=%!StatusLineRenderer()

  " show blurred buffer statusline
  au FocusLost,VimLeave,WinLeave,BufWinLeave *
    \ setlocal statusline&

  " restore statusline highlights on colorscheme update
  au Colorscheme * call <SID>StatusLineHighlights()
augroup END
~~~

To my surprise, the above snippet is **56 lines** for the **entire implementation**
whereas the **lightline configuration** weighs in at **57 lines**. Yes,
my entire implementation in less code than "just" the config for lightline.

This may actually not seem like much, but considering that lightline has to
take into account all kinds of configuration while rendering, it is actually
quite a bit slower than this implementation as well. I felt a noticeable difference
when scrolling up and down a file like a mad man.

## Conclusion

For me, it was a nice challenge and good fun. I also really like the end
result as well. Remember when I showed the colors on my statusline?
Yeah I lied about that being lightline :smiley:

What you saw before is indeed my current implementation, and it actually
does more than I could care to figure out how to achieve with lightline.
I was able to get rid of netrw buffer names even though I don't actually
need that anymore since I'm using my own file explorer :thinking:

Aside from that it shows more colors than the three mentioned above, here's all
of them in a short gif:

<%= video_tag 'posts/vim-colored-statusline-all', alt: 'custom statusline showing all colors' %>

In addition to blue for normal mode, yellow/green for insert, and purple for
visual modes, it also shows red when in replace mode and a nice orange
when in EX mode!

The best part about this though, is that I can now do whatever I want
with this statusline using the power of Vimscript. No more abstract configuration
and no more scary palette, just plain ol' Vimscript.

Now freed from statusline plugins and being able to cruise over files at the
speed of light, this concludes my story of creating my own statusline. I hope
you enjoyed it!

Until next time :)

:wave:
