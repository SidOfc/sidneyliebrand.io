---
title:       "Switching to ASDF version manager"
description: "Depending on how many languages you program in, getting all their version managers installed, added to <code>$PATH</code>, configured etc... becomes quite a pain when setting up a new system, or even figuring out how this one works because you've used something else for a while."
published:   "2017-08-15T21:04:44Z"
---

<%= figure_tag 'posts/asdfmovie-banner.svg', alt: 'asdfmovie quote from youtube' %>

Version management tools for programming languages are a common thing in (web-)developer land.
I started to wonder if there was an all-in-one version management tool.
I want this because as I learn more and do more, I will need more version managers that all
slow down my shell. So lets prevent that shall we!

I've always used [RVM](https://rvm.io) in the past without problem, the shell took about half a
second to load and that was acceptable. I mean, you can't have it all right :)

Aside from sourcing good old RVM, recently I also added [NVM](https://github.com/creationix/nvm) to the stack.
No problem I thought! Until I resourced my shell and had to wait for two seconds... Yeah,
this goes beyond the "you can't have it all" criteria. I often open a shell for a quick ssh session,
running tests, git commands, etc... There has to be a better way!

## A universal version manager

Enter [ASDF](https://github.com/asdf-vm/asdf) and [friends](https://github.com/asdf-vm/asdf-plugins).
ASDF is a universal and extensible version management tool for many [programming languages](https://github.com/asdf-vm/asdf-plugins).
It provides the version management tooling and allows you to choose which plugins you would like to install.
Like Node.js, Ruby or Python for instance.

To get started, go to their [github page](https://github.com/asdf-vm/asdf) and install ASDF.

After installing, you'll only have the core of ASDF.
We'll need to extend it by adding plugins to it and using those to install versions
of the language we want to use.

The list of plugins you'll install will differ from what I use.
I am a front end developer that works with Ruby / Rails as well as React.
From time to time I also muck around in [Crystal](https://crystal-lang.org/) or [Rust](https://www.rust-lang.org/en-US/)
(both of which are awesome &mdash; check them out!). So I would head to the [plugins page](https://github.com/asdf-vm/asdf-plugins)
and look for plugins for those programming languages. The following is what I use:

* [asdf-vm/asdf-ruby](https://github.com/asdf-vm/asdf-ruby)

* [asdf-vm/asdf-nodejs](https://github.com/asdf-vm/asdf-nodejs)

* [code-lever/asdf-rust](https://github.com/code-lever/asdf-rust)

* [marciogm/asdf-crystal](http://marciogm/asdf-crystal)

There are installation instructions on every plugin repo. Sometimes, steps
for migrating from your old version manager are also included.
For Ruby using RVM, the migration is as easy as moving `~/.rvm/rubies` to `~/.asdf/installs/ruby.`

## Sounds smooth, any bumps along the way?

It could be that gems and even Ruby versions will not work. If you run into this issue,
run `asdf reshim [language]` and restart your shell to fix any broken paths.

If the problem persists, you can run `asdf current [language]` to find the current version.
It will also print the path to the version file that defined it.
This is much simpler than running a mixture of `ls` and `grep` to find out where that version comes from.

If you see the following after running `asdf current [language]`:

> No version set for [language]

It means that you haven't set or installed any versions for that language.
If you haven't installed a version, run `asdf list-all [language]`.
This will list all the available versions that ASDF can install. Choose a version and run
`asdf install [language] [version]` to install it.

If the plugin still doesn't work, run `asdf global [language] [version]` which will create a `~/.tool-versions` file.
The language and version info will be stored and ASDF will attempt to load that version.

To set a specific version in a directory, `cd` to it and run
`asdf local [language] [version]`. ASDF will use a local version over a global version.

After migrating from RVM, I had to rename my rubies.
RVM stored them in the format of `ruby-[major]-[minor]-[patch]-p[ruby-patch]`.
This caused ASDF not to switch after running `asdf local ruby 2.4.1` because the folder
name differed from the version input. Which meant I had to run `asdf local ruby ruby-2.4.1`.
If a language is already specified, I'd rather not bother typing it again.
Removing the `ruby-` prefix from the directory names in `~/.asdf/installs/ruby` fixed it.
Running `asdf local ruby 2.4.1` switched perfect afterwards.

## Extra's

A feature of the `asdf-ruby` plugin is that it can install a set of [default gems](https://github.com/asdf-vm/asdf-ruby#default-gems)
specified in a `~/.default-gems file`. I love this one as I'll never have to run `gem install pry` again!

What RVM additionally offers that I have not seen in ASDF is the option to create a gemset.
This was and still is a useful feature if you're doing Ruby projects involving lots of different
gems or even testing with specific gems. I rarely felt the need to create a gemset myself.
Thus not having this feature did not have a lot of impact on my workflow (yet).
I'm not sure if NVM adds any extra functionality, either way I think ASDF will fill the
gaps because of how it was designed and how it can be extended.

Finally, I added a `~/.asdfrc` file containing: `legacy_version_file = yes`.
This enables ASDF read all version files we know and love.

## Conclusion

As for my shell time, it's back where it was with only RVM. But nothing messes with my `cd` command anymore.
I also don't have to keep adding these noisy `source` lines to [my dotfiles](https://github.com/sidofc/dotfiles).

ASDF is still quite new and at the time of writing, there are few integrations.
This means that if you use `capistrano` to deploy using RVM for example, you won't be able to do that using ASDF just yet.
But as mentioned above, someone somewhere will fix that gap or you could give it a shot yourself!

I hope you've learned something from this post and also that you will choose to switch to ASDF.
Not because it's better per-se but because it's universal and extensible and you now no longer have
to worry about version managers! Install a plugin and you're done! A plugin system and a management system,
bundled in 3 simple commands with a common interface. ASDF and I will be friends for a long time :)

Cheers!

*Many thanks to [@vvgemert](https://medium.com/@vvangemert) for proofreading!*

:wave:
