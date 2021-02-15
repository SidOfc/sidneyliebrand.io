---
title:       "How FZF and ripgrep improved my workflow"
description: "In my never ending quest for simplicity I recently discovered FZF and ripgrep. Two command-line tools that have the potential to make every dag programming tasks easier. In this post I will explain how I use these tools to do things in a matter of keystrokes rather than having to re-google that command you keep forgetting <strong>every. single. time.</strong>."
published:   "2018-06-24T13:33:37Z"
updated:     "2019-07-10T21:10:00Z"
---

Today I want to talk about [fzf](https://github.com/junegunn/fzf "Visit junegunn/fzf on github") and [ripgrep](https://github.com/BurntSushi/ripgrep "Visit BurntSushi/ripgrep on github"),
two tools I use all the time when working in Vim and the terminal.
They have become an absolutely **vital** part of my workflow.
Ever since I started using them I can't imagine myself functioning
without them anymore.

## What is FZF?

FZF is a fuzzy finder for your terminal, it is a command line application that
filters each line from given input with a query that the user types.
When the query changes, the results update in realtime.

<Media
    src="/media/posts/fzf-ls-example"
    alt="FZF + LS example"
    width="768"
    height="180"
/>

After finding the file you're looking for, hitting <kbd>enter</kbd> prints the highlighted
entry. You can combine this with your `$EDITOR` variable to search for a file and then edit
it for example.

<Media
    src="/media/posts/open-changelog-neovim"
    alt="Open CHANGELOG.md in NeoVim"
    width="768"
    height="180"
/>

Of course this is only a simple example. The possibilities with FZF are endless.
There are countless ways in which you can use it to filter input and use that in
another command. We'll dive more into that later.

## What about ripgrep?

As it already says in the name, it is another `grep` program. Ripgrep is written
in rust and one of its primary goals is to be the *fastest* `grep` of them all.
It performs amazing even in a larger code base.

<Media
    src="/media/posts/rg-ls-fzf"
    alt="Ripgrep list files with FZF"
    width="768"
    height="180"
/>

Ripgrep has many options to explore, there are way to many to list here.
Some of the options I use most often with ripgrep are:

* `--files` &mdash; List files which ripgrep will search instead of searching them

* `--hidden` &mdash; Show hidden (`.file`) files

* `--no-ignore-vcs` &mdash; Show files ignored by your VCS

* `--vimgrep` &mdash; Results are returned on a single line in vimgrep format

## The problems they solve

Both these tools can be combined in various scenario's that would have otherwise
taken multiple long commands to execute. This ranges from killing processes to
managing plugins to being able to find (in) files.

These actions are usually involved when I try to do something more complex:

* googling the right command

* look around for the right line in the output

* refine `grep` pattern

* retrying the command

At this point you'll realize that you're not actually searching for something
anymore. You find yourself looking for ways to perform your search instead :/

My solution to <strike>not being able</strike> being too lazy to memorize these commands is to create
small shell wrappers for them. I learn / read docs on a command to figure out how to
apply it for my use case(s). Then I write the wrapper based on the ideas I have about
how it should work.

With that being said, let's dive right in with a common case:

## Killing processes

One example is stopping an out of control process. First you have to find the
process ID by issuing some command like `ps -ef | grep [PROCESS NAME]`.

Which is then followed by a `kill` command with one of the process IDs you want
to kill. The downsides to this are that I have to use two commands. Filter the
output before seeing it or knowing how it looks and issuing an extra command
to actually stop the process.

To make this easier, I wrote a small wrapper (first in [zsh](https://github.com/SidOfc/dotfiles/blob/d07fa3862ed065c2a5a7f1160ae98416bfe2e1ee/zsh/kp "View kp zsh script"),
later migrated to [fish](https://github.com/SidOfc/dotfiles/blob/e94b96b908479950186e42a3709511a0afe300e4/.config/fish/functions/kp.fish "View kp fish script")) called `kp`.
It lists processes using `ps -ef` and pipes it to `fzf`.

<Media
    src="/media/posts/kill-with-kp"
    alt="Killing processes using kp"
    width="768"
    height="180"
/>

This command opens an FZF window with your processes. FZF has an option to allow
selecting multiple entries (`-m flag`). When <kbd>enter</kbd> is pressed, both marked
(light red `>` symbols) processes will be shut down. When changing your query,
selected entries will stay selected. This is convenient for killing different
processes in a single run.

After killing some processes, the command will rerun itself. I can use <kbd>escape</kbd> to
exit from this specific window.

## Installing brew plugins

Another use case is to install, update or purge [brew](https://github.com/Homebrew "Visit Homebrew on github")
plugins from your system. When you are looking for a brew package, a common pattern
is to use `brew search` together with `grep` to find out if it exists.

After that you'll most likely run a command like: `brew install [PACKAGE]` to install it.
Another pattern is to use the `brew leaves` command to list installed packages which can
be updated or removed.

I created a small wrapper for each of these actions. One for installing,
another for updating and one for deleting brew packages:

* `bip` &mdash; <strong>B</strong>*rew* <strong>I</strong>*nstall* <strong>P</strong>*lugin*, install one or more plugins ([zsh](https://github.com/SidOfc/dotfiles/blob/d07fa3862ed065c2a5a7f1160ae98416bfe2e1ee/zsh/bip "View bip zsh script"), [fish](https://github.com/SidOfc/dotfiles/blob/e94b96b908479950186e42a3709511a0afe300e4/.config/fish/functions/bip.fish "View bip fish script"))

* `bup` &mdash; <strong>B</strong>*rew* <strong>U</strong>*pdate* <strong>P</strong>*lugin*, update multiple installed plugins ([zsh](https://github.com/SidOfc/dotfiles/blob/d07fa3862ed065c2a5a7f1160ae98416bfe2e1ee/zsh/bup "View bup zsh script"), [fish](https://github.com/SidOfc/dotfiles/blob/e94b96b908479950186e42a3709511a0afe300e4/.config/fish/functions/bup.fish "View bup fish script"))

* `bcp` &mdash; <strong>B</strong>*rew* <strong>C</strong>*lean* <strong>P</strong>*lugin*, delete multiple installed plugins ([zsh](https://github.com/SidOfc/dotfiles/blob/d07fa3862ed065c2a5a7f1160ae98416bfe2e1ee/zsh/bcp "View bcp zsh script"), [fish](https://github.com/SidOfc/dotfiles/blob/e94b96b908479950186e42a3709511a0afe300e4/.config/fish/functions/bcp.fish "View bcp fish script"))

Whenever I have to do anything with brew, it is completely painless and it
works quite well for package discovery too.

<Media
    src="/media/posts/bip-interface"
    alt="Brew Install Plugin interface"
    width="768"
    height="180"
/>

## Finding binaries

One mythical beast known to anyone who has ever worked in a terminal is the `$PATH`
variable. Often, a shell script will tell you to "Add me to your $PATH" so that the
script will become available in your shell. This makes sense but can leave you with
a messed up shell path or duplicate entries. It could cause all kinds of weirdness
and slowness in your terminal.

My solution to this is a simple path explorer called `fp` ([zsh](https://github.com/SidOfc/dotfiles/blob/d07fa3862ed065c2a5a7f1160ae98416bfe2e1ee/zsh/fp "View fp zsh script"), [fish](https://github.com/SidOfc/dotfiles/blob/e94b96b908479950186e42a3709511a0afe300e4/.config/fish/functions/fp.fish "View fp fish script")).
It invokes FZF with a list of folders populated using `$PATH`.

<Media
    src="/media/posts/dirs-in-path"
    alt="Directories present in $PATH"
    width="768"
    height="180"
/>

Of course there are more than 3 paths in my list but I cropped the gif for brevity here.
When I press <kbd>enter</kbd> on the `/bin` entry, I see a list of executables inside that folder.
Either find what you're looking for or go back.

Going back to the overview is as easy as pressing <kbd>escape</kbd>. This will take you back to
the directory listing. Pressing <kbd>escape</kbd> in the overview will exit the command completely.

## Checking features on caniuse.com

Additionally, I've written a post before on how to [combine Caniuse with FZF](/blog/combining-caniuse-with-fzf "Read the 'combine Caniuse with FZF post'").
It allows me to quickly find out wether I should stay away from some Web API or not.
this small tool also allows me to query features that have been added or deprecated recently.

<Media
    src="/media/posts/checking-caniuse"
    alt="An example of looking for features using cani"
    width="768"
    height="180"
/>

The `cani` command ([zsh](https://github.com/SidOfc/dotfiles/blob/d07fa3862ed065c2a5a7f1160ae98416bfe2e1ee/zsh/cani "View cani zsh script"), [fish](https://github.com/SidOfc/dotfiles/blob/1e07bc882e64cc22783ac8ec2a01651503ecc7b3/.config/fish/functions/cani.fish "View cani fish script")) itself uses another [ruby script](https://github.com/SidOfc/dotfiles/blob/653c0331b3bd8a3b6fb5fbff0531f038e7eb5b12/bin/ciu "View ciu ruby script")
(`ciu`) I wrote to actually provide the data and format it properly.
The data is fetched once then cached for a day.
So you'll have fresh data on a daily basis :)

*This mixture of shell + ruby has since been [ported](https://github.com/SidOfc/cani "View SidOfc/cani on github") to a [Ruby Gem](https://rubygems.org/gems/cani "View cani gem on rubygems.org") :)*

## Vim

Since I spend a lot of my time in Vim trying to find a file either by name,
or by some code *inside* a certain file. Streamlining that process is very important.
Every context switch you have to make adds overhead and the possibility of losing
focus of what you are trying to find. Therefore it should be as mindless as possible,
e.g: press a key, type query, press enter to go to matching file.

Finding files wasn't too much of an issue here. There is a long list of Vim plugins
that offer file searching using fuzzy matching or [MRU](https://en.wikipedia.org/wiki/Most_Recently_Used "Visit Most Recently Used definition on wikipedia.org") algorithms. Two examples of this are [CtrlP](https://github.com/ctrlpvim/ctrlp.vim "Visit ctrlpvim/ctrlp.vim on github") and [Command-T](https://github.com/wincent/command-t "Visit wincent/command-t on github").
I used CtrlP which always managed to do the job. But after playing around with FZF
in the terminal I wondered if it could be applied to Vim as well.

## FZF.vim

[FZF](https://github.com/junegunn/fzf.vim "Visit junegunn/fzf.vim on github") has a small builtin Vim interface that already works, but it comes without
any existing functionality. The author of FZF also wrote this plugin.
It is a small wrapper that provides common functionality. This includes listing files,
buffers, tags, git logs and much more!

## Fuzzy searching in file paths

Coming from CtrlP the first thing I needed was a replacement for fuzzy-finding files.
The solution was to use the `:Files` command provided by FZF.vim. This lists files
using your `$FZF_DEFAULT_COMMAND` environment variable. It opens the currently
highlighted file on <kbd>enter</kbd>.

<Media
    src="/media/posts/fzf-files-demo"
    alt="FZF :Files demo"
    width="1049"
    height="714"
/>

Since I was already so used to the <kbd>ctrl</kbd>+<kbd>p</kbd> mapping from the CtrlP plugin,
I mapped the `:Files` command to it: `nnoremap <C-p> :Files<Cr>`.

FZF will not use ripgrep by default so you'll have to modify `$FZF_DEFAULT_COMMAND`
if you want FZF to use ripgrep. Of course this is exactly what I wanted!
After some tweaking I ended up with the following command:

* **Fish syntax:** `set -gx FZF_DEFAULT_COMMAND 'rg --files --no-ignore-vcs --hidden'`

* **Bash / ZSH syntax:** `export FZF_DEFAULT_COMMAND='rg --files --no-ignore-vcs --hidden'`

In my case it happens that I do want to edit or search for something in a file
that is ignored by my VCS or in a hidden file. The options ensure that all files
inside the directory are listed (except those ignored in a `~/.rgignore` file).

## Finding content in specific files

Last but not least I wanted to find files based on what was inside of a file.
This is useful to see where a class or function is used for example.

<Media
    src="/media/posts/fzf-rg-demo"
    alt="FZF :Rg demo"
    width="1049"
    height="714"
/>

The name of this command is `:Rg` which already uses `ripgrep` in the background! Done right?
Nope &mdash; after playing around I noticed that while `:Rg` indeed searches the file's
*contents*, it also matches the *file name* shown in the list like `:Files` does (exclusively).

In my brain these concepts are completely isolated from each other:

When I need to find a specific *file* I *know* that I'm looking for a *filename* in
which case I do not want to search *inside* the file.

On the other hand, when I need to find a specific area of known code or figure out
in which files a certain class is used, I am most certainly never interested in matches from filenames.

To achieve what I wanted, I had to override the default behavior.
An [issue](https://github.com/junegunn/fzf.vim/issues/346 "Visit junegunn/fzf.vim issue #346") was created for the
exact same reason for the `:Ag` command. Based on [this comment](https://github.com/junegunn/fzf.vim/issues/346#issuecomment-288483704 "Visit junegunn/fzf.vim issue #346 issue comment")
I came up with the following setup to accomplish this:

~~~viml
command! -bang -nargs=* Rg
  \ call fzf#vim#grep(
  \   'rg --column --line-number --hidden --ignore-case --no-heading --color=always '.shellescape(<q-args>), 1,
  \   <bang>0 ? fzf#vim#with_preview({'options': '--delimiter : --nth 4..'}, 'up:60%')
  \           : fzf#vim#with_preview({'options': '--delimiter : --nth 4..'}, 'right:50%:hidden', '?'),
  \   <bang>0)
~~~

This one I mapped to <kbd>ctrl</kbd>+<kbd>g</kbd>, right next to <kbd>ctrl</kbd>+<kbd>f</kbd>
for the `:Files` command: `nnoremap <C-g> :Rg<Cr>`

The nice thing about this command is that you can select multiple files.
When selecting multiple files, pressing <kbd>enter</kbd> will load the files in a
quickfix list for batch editing using `cdo` for example.

## Conclusion

As I mentioned at the start of my post, these tools have become a **vital**
part of my workflow. I use them while barely noticing their presence and they
take a lot of complexity away from the task at hand. This allows me to focus
on what matters instead of finding out how to do something which should be trivial.

Wether it be killing services / processes, installing brew packages,
finding a glitch in my path or a feature set in caniuse, I can do it in fewer
keystrokes with more fine-grained control. I even use FZF as a standalone
filter sometimes when I have to find something in line-based command output,
skipping (rip)grep all together :)

Hopefully you are also able to reduce some of the strain in your workflow with
FZF using some of the tips above. If you are using FZF in another way, leave a
comment! I'd love to hear about it and learn what others are doing with these
two fantastic tools.

Happy fuzzy finding :)

:wave:
