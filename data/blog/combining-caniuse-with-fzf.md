---
title:       "Combining Caniuse with FZF"
description: "There is caniuse.com which you can use to search online, but what if you're a lazy dev like me that likes to keep his stuff in the terminal? Well, for this reason I wrote a small wrapper using some of my all time favorite tools: Ruby and FZF!"
published:   "2017-09-03T11:47:27Z"
---

Do you love [Caniuse](http://caniuse.com/) and [FZF](https://github.com/junegunn/fzf)? I do! As a front end developer,
every now and then I need to check the support of some feature across major browsers.
For this I used to go to caniuse.com, search for the feature and make a decision based on that.

The part where FZF comes in is the "search for the feature" part. Having to go to their website
to find a feature isn't bad or slow per se but I am a very lazy developer and I like to keep
things where I spend most of my time &mdash; inside a terminal.

## caniuse-cmd

My first attempt at trying to get my results in the terminal was of course by googling
for a package which I could use. That package was [caniuse-cmd](https://github.com/sgentle/caniuse-cmd)
which adds a `caniuse` command and displays results based on the feature you're looking for.

It works really well for doing a single query of a feature, but I thought I could make this
better by showing a list of features using FZF and then and running the `caniuse` command on the selected result(s).

This is possible because the `caniuse` command returns all features when run without arguments.
I tried to format this output into something more "FZF friendly"
(which I would define as being text-search-friendly) but this proved more cumbersome than I thought.

## A more neutral data source

Since I was using a package to fetch the results, I was bound to the way the package worked.
It means I had a dependency to serve a single purpose &mdash; fetching results (and in this case,
also display additional information afterwards of course). If the package changed their format,
it could screw up my formatting script and I would have to adjust it every time as well.

So I decided not to use the dependency and instead, find a [raw source of data](https://raw.githubusercontent.com/Fyrd/caniuse/master/data.json)
(~1.5MB JSON) and create a wrapper that would essentially:

* check to see if `~/caniuse-db.txt` exists

* update `~/caniuse-db.txt` if it exists and is older than one day

* download, format and save the data in `~/caniuse-db.txt` otherwise

* print data

With this functionality, I can pipe the output of my script into FZF to search through all the features on caniuse,
and the file will be no older than a day at worst. For brevity I did not include the ~60 line
Ruby script but it can be [found here](https://github.com/SidOfc/dotfiles/blob/653c0331b3bd8a3b6fb5fbff0531f038e7eb5b12/bin/ciu) in my [dotfiles repo](https://github.com/SidOfc/dotfiles).
Combining it with FZF yielded the following result:

<Image
    src="/media/posts/caniuse-fzf-ie-last-version-features.png"
    alt="Caniuse fzf: IE features supported since last version"
    width="900"
    height="348"
/>

The above display might seem a bit intimidating at first, but the output isn't hard to understand
if you know what each column indicates. In the leftmost column, we have a 2 letter W3C status, e.g.
`[wd]` for "Working Draft". Followed by a percentage of global support which is followed by the title of the feature.

On the right side we see the browsers listed with a bunch of plus, minus and tilde signs.
This indicates wether or not a feature is supported (`+`), partially supported (`~`) or not supported (`-`).
It shows the support for the last 2 versions (first sign is previous, last is current) which is why there are 2.
The idea being that, I can look for features which are only supported in the latest version of a
browser and see which ones they are so I can look for them in any project and patch them if needed.

As seen in the image, my search pattern is `'-+ie` and it finds all the features that aren't supported
in the previous version but are in the current version. The quote mark is required for FZF
to search for this as a single word rather than 4 single characters.

I can also search for all the `[wd]` features, like this:

<Image
    src="/media/posts/caniuse-search-wd-feature.png"
    alt="Searching for working draft CSS features"
    width="900"
    height="140"
/>

Any text you see on the screenshots can be used to search and you get some free bonuses of seeing how many
features there are in caniuse (426) and how many of them matched your query (86 are WD apparently).

## Combine with "caniuse" command

Aside from being able to search on steroids, and as mentioned above, the end result of this should allow
us to select one or multiple results and run them through `caniuse` so that we can see any additional details.

To do this, I created a ZSH function (which depends on my script for listing the features):

~~~shell
# caniuse for quick access to global support list
cani() {
  local feats=$(~/dotfiles/bin/ciu | sort -rn | fzf -m | sed -e 's/^.*%\ *//g' | sed -e 's/   .*//g')

  if [[ $feats ]]; then
    for feat in $(echo $feats)
    do caniuse $feat
    done
  fi
}
~~~

This will take your selected features from FZF:

<Image
    src="/media/posts/caniuse-select-multiple-features.png"
    alt="Selecting multiple feature entries"
    width="900"
    height="279"
/>

then it tries to select the title and run each selected feature title through the `caniuse` command:

<Image
    src="/media/posts/caniuse-cmd-output.png"
    alt="Output entry results using caniuse-cmd package"
    width="900"
    height="666"
/>

There! All the details I can muster now combined in a single command with support for outputting multiple features at the same time.

## Conclusion

Only after I started searching through my output with FZF did I realize what more I could now do.
Even compared to the website, I could "group" things by search pattern, then limit the results
further with additional terms. I can filter by W3C status, global support,
name or any combination of browser support.

In addition to that, looping the output from FZF to `caniuse` allowed me to also read the
notes in the terminal as well as get some extra and confirming information about the
feature(s) which is really nice in my opinion.

And last, maybe I will port the "fetching and formatting" script to a gem,
or port it to another language I want to learn and distribute it as a package there,
either way it will probably become a package :)

## Update 08–07–2018

The `cani` command is now packaged as a [RubyGem](https://github.com/sidofc/cani) with some additional commands and features :)

Cheers!

:wave:
