---
title:       "Vim tip: persistent undo"
description: "Usually, when you open a file in your editor, make some changes, save and close, you lose the ability to <kbd>ctrl</kbd>+<kbd>Z</kbd>. Vim has a built in mechanism to persist changes made to files on disk. This may not sound that exciting, but what if your editor crashes while you have a set of changes you may want to revert stored?"
published:   "2018-08-04T20:17:52Z"
---

Sometimes I happen to close a buffer that I had open for a while and modified here and there.
Then I find out that the code from two or three edits ago in that file actually worked better and I want to revert but upon reopening the file, pressing `u` shows an `Already at oldest change` message...

The second thing I try is `git` to see the unchanged file but this usually takes me way to far back to be of any use.
This is when I usually realize that I can't get back to that point by using any kind of "undo" functionality.

Finally, the last wall of defense is my brain, small changes from the last edit are usually still lingering in my mind and I can revert them from memory.
Anything large or multi-line, though &mdash; forget about it.

None of the above so far provide a good reliable solution out of the box, but one day while randomly reading through `:h undo` I found a particularly useful section: `:h undo-persistence`.

## Persistent undo

The `undo-persistence` manual explains that Vim indeed destroys the *undo tree *when a buffer is *unloaded.*
To understand exactly what this means, I'll give a small explanation.

In Vim, a buffer is basically a file *loaded* in memory.
Whenever a file is loaded in memory, Vim keeps track of its *undo tree* &mdash; this is the construct that keeps track of changes and enables one to undo and redo them.
As long as the file remains in memory, the undo tree is kept with it.

As soon as the buffer is *unloaded* using for example `:[bufnum]bd`, it is cleared from memory and the undo tree is destroyed with it.
This is the part that is problematic if you want to revert back to some edit before the last time you re-opened the file in Vim.

Persistent undo solves this by storing the changes in a file instead of in-memory and linked to the loaded buffer, allowing undo to go back and forth beyond just the set of changes since the file was last opened.
You could go back to yesterday's changes or those of two weeks ago for example.

## Setup

Fortunately, not much is needed to set this up.
Vim needs a directory to store the persistent undo history and two settings need to be tweaked / enabled.
This is the snippet I have in my Vim config that handles this automatically:

~~~vim
" guard for distributions lacking the persistent_undo feature.
if has('persistent_undo')
    " define a path to store persistent_undo files.
    let target_path = expand('~/.config/vim-persisted-undo/')

    " create the directory and any parent directories
    " if the location does not exist.
    if !isdirectory(target_path)
        call system('mkdir -p ' . target_path)
    endif

    " point Vim to the defined undo directory.
    let &undodir = target_path

    " finally, enable undo persistence.
    set undofile
endif
~~~

The above VimL checks if the `persistent_undo` feature is supported.
Defines a path `~/.config/vim-persisted-undo/` to store the files.
Creates the directory if it doesn't exist and sets the necessary undodir and undofile options.

## A simple example

Now let's go through a simple exercise to see if this works.

1. After you've added the snippet or enabled this feature manually, exit Vim and run the following command in the terminal:vim sample.txt.
2. Write some text and save the file. Then make another change by adding, removing, or changing the content of the file and save it again.
3. The file now has some undo history we can use. Exit Vim and open the file again from the terminal: vim sample.txt.
4. Now, pressing u should work as expected and correctly undo the change you made before closing the file.

## Profit

That's it! You now have access to any edit you made at any point in time for any particular file.
If you accidentally close a buffer, just re-open it and your undo tree will be like it was before closing it.

I hope that you enjoyed this post and got something useful out of it.
If there is anything I missed I'd love to hear about it in the comments.
Likewise if I'm wrong or anything is unclear, I'll happily stand corrected.

Until next time :)

:wave:
