---
title:       "The greatnesses and gotchas of YAML"
description: "YAML is a great language for configuration files, it is a lot more flexible than JSON with comments and inheritance for example. While I was doing some research about YAML I found bits of information scattered all over the place so I attempted to piece the great things and the quirks together in a post!"
published:   "2017-12-23T07:25:59Z"
---

**Update 08–11–2018:** Thank you [Anatoli Babenia](https://medium.com/@abitrolly "Visit Anatoli Babenia on Medium")
for pointing to the base 60 parsing 'feature' in the [`docker-compose`](https://docs.docker.com/compose/compose-file/compose-file-v2/#ports "Visit base 60 parsing section on docs.docker.com") documentation.
It led to me finding another great resource and added it along with some new content
to this post.

<Media
    src="{{media::posts/yaml-homepage.png}}"
    alt="yaml.org homepage"
    width="900"
    height="371"
/>

In this post I want to talk about [YAML](http://yaml.org/ "Visit yaml.org").
Like the very popular [JSON](http://json.org/ "Visit json.org") format, it is a file format
that allows you to store data in a structured way. Last week I had a
discussion with a colleague about an unexpected output value when parsing
YAML to a Ruby hash. The YAML data looks like this:

~~~yaml
---
some_key:
  some_other_key: nil
~~~

When parsed in Ruby, it looks like this:

~~~ruby
{'some_key' => {'some_other_key' => 'nil'}}
~~~

And the equivalent Python output:

~~~python
{'some_key': {'some_other_key': 'nil'}}
~~~

The confusion was about the value of `some_other_key` which we
both thought would become `nil` instead of `'nil'`. I mentioned to my
colleague that if he wanted to get a nil value, he might as well
leave it completely empty:

~~~yaml
---
some_key:
  some_other_key:
~~~

Which indeed, leads to the expected result in Ruby:

~~~ruby
{'some_key' => {'some_other_key' => nil}}
~~~

And of course, in Python too:

~~~python
{'some_key': {'some_other_key': None}}
~~~

At this point we became curious, I mean, there must be *some* kind of `nil` value,
right? So we ventured to Google and well, found an answer in no time at all :)
There is a `nil` value in YAML, it's called [`null`](http://yaml.org/type/null.html "Visit null type documentation on yaml.org")!

~~~yaml
---
some_key:
  some_other_key: null
~~~

Also yields the expected result for both Ruby and Python.

## And this was only the start...

Since that moment I've been wondering what *more* is there to YAML.
I've written literally [thousands of lines of YAML](https://github.com/SidOfc/browserino/tree/master/spec/files "Visit SidOfc/browserino YAML test files directory")
test data for one of [my gems](http://github.com/SidOfc/browserino "Visit SidOfc/browserino github repository")
but I've never really wondered what the language could really do.

What I also noticed is that there aren't all that many YAML posts out there,
some resources I used while gathering information for this post:

* [https://learnxinyminutes.com/docs/yaml/](https://learnxinyminutes.com/docs/yaml/ "Visit the learnxinyminutes.com YAML docs")

* [https://yaml.org/](https://yaml.org/ "Visit yaml.org")

* [https://codebeautify.org/yaml-validator](https://codebeautify.org/yaml-validator "Visit the codebeautify YAML validator")

* [https://docs.saltstack.com/en/latest/topics/yaml/](https://docs.saltstack.com/en/latest/topics/yaml/ "visit the doc.saltstack.com YAML topic")

* [https://www.yaml.org/spec/1.2/spec.html](https://www.yaml.org/spec/1.2/spec.html "Visit the YAML specification")

* [https://stackoverflow.com/a/1729545/2224331](https://stackoverflow.com/a/1729545/2224331 "Visit StackOverflow answer")

* [https://stackoverflow.com/a/16986339/2224331](https://stackoverflow.com/a/16986339/2224331 "Visit StackOverflow answer")

* [https://json.org/](https://json.org/ "Visit json.org")

* [https://pyyaml.org/wiki/PyYAMLDocumentation](https://pyyaml.org/wiki/PyYAMLDocumentation "Visit pyyaml.org YAML documentation")

* [http://blog.teamlazerbeez.com/2009/04/15/yaml-gotchas/](http://blog.teamlazerbeez.com/2009/04/15/yaml-gotchas/ "Visit blog.teamlazerbeez.com YAML blog post")

So I would like to share some of the features of YAML that you might not know about and also,
share some differences between YAML parsers (the Ruby and Python parsers).

## Inheritance

One cool feature, which I first saw when bootstrapping a sample Rails application was that you
can define "defaults" using anchors. In Rails, the `config/database.yml` file contains the
following content by default:

~~~yaml
default: &default
  adapter: sqlite3
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  timeout: 5000

development:
  <<: *default
  database: db/development.sqlite3

test:
  <<: *default
  database: db/test.sqlite3

production:
  <<: *default
  database: db/production.sqlite3
~~~

As you can see, there is a `default` key followed by `&default`. The `&default` keyword here represents
the anchor. Then, in another YAML node, you can inherit properties from that anchor by adding a
special key `<<` followed by `*default` in this case. To overwrite a default value, simply add the key
you want to overwrite with its new value below the `<<:* default` line.

## Write JSON in your YAML

Another handy thing to know is that you can write JSON inside YAML, this is pretty neat and to be
expected as [YAML is a superset of JSON](https://stackoverflow.com/questions/1726802/what-is-the-difference-between-yaml-and-json-when-to-prefer-one-over-the-other/1729545#1729545 "Visit StackOverflow answer") (or well, since version 1.2 it is at least).

The following YAML:

~~~yaml
---
key: {"some": "json"}
another: [1, 2, 3]
~~~

Parsed in Ruby this results in:

~~~ruby
{"key"=>{"some"=>"json"}, "another"=>[1, 2, 3]}
~~~

## YAML keys as Ruby symbols

This one I looked for specifically when I started a major rewrite of one of my gems and decided
to migrate test data out of Ruby into YAML. I was curious to see if YAML could actually store
Ruby *Symbols* instead of *Strings*. While I didn't have thousands of tests written in YAML at the
time, I thought "Why not?". The answer was that indeed, the Ruby parser understands symbols written
in YAML, and treats them as such when parsing in Ruby.

~~~yaml
---
:my_symbol_key: :or_value
~~~

In Ruby, evaluates to the following:

~~~ruby
{:my_symbol_key=>:or_value}
~~~

Whereas the same YAML parsed in Python outputs:

~~~python
{':my_symbol_key': ':or_value'}
~~~

I only recently gave this some thought, if I were to port my gem to Python for whatever reason,
I couldn't "conveniently" use this YAML anymore and for anyone wanting to use the gem's YAML
outside of Ruby, it would contain useless `:` characters at the start of every "symbol".
So yeah, while awesome, use with caution! I'm considering rewriting my gem's YAML to just
use strings instead of symbols because of this "exclusive" Ruby feature :)

## Multiline strings? YAML's got your back!

Another topic often discussed in programming languages in general is how to handle multiline
strings, various languages have different solutions to the same problem. YAML has it's own
two solutions. The pipe (`|`) character and the greater than (`>`) sign.

The pipe notation, also referred to as "literal block":

~~~yaml
literal: |
    This block of text will be the value of the 'literal' key,
    with line breaks being preserved.

    It continues until de-dented, leading indentation is
    stripped.

        Any lines that are 'more-indented' keep the rest
        of their indentation -
        these lines will be indented by 4 spaces.
~~~

The greater than sign notation, also referred to as "folded block":

~~~yaml
folded: >
    This block of text will be the value of 'folded', but this
    time, all newlines will be replaced with a single space.

    Blank lines, like above, are converted
    to a newline character.

        'More-indented' lines keep their newlines, too -
        this text will appear over two lines.
~~~

[Both snippets came from here.](https://learnxinyminutes.com/docs/yaml/ "Visit the learnxinyminutes.com YAML docs") This post also contains
a lot of other great YAML examples you should definitely check out!

## Quoted strings, begone!

Unlike its friend JSON, YAML doesn't mind if you don't put your strings between quotes.
The following will output exactly what you would expect:

~~~yaml
some_key: with a string value
~~~

In Ruby and Python, the results are the same (output in Ruby):

~~~ruby
{"some_key"=>"with a string value"}
~~~

Keys don't have to be quoted either, so removing the `_` from `some_key` results
in the following in both Ruby and Python (output in Ruby):

~~~ruby
{"some key"=>"with a string value"}
~~~

While this makes copying certain values easier YAML tries to be smart about some
(more than you might think) of them. When a key with a value of either `yes`, `Yes`,
`YES`, `on`, `On` or `ON` is present, the resulting value when parsing this YAML will be
a boolean. The same is true for values `no`, `No`, `NO`, `off`, `Off` and `OFF`.

The following example shows Ruby syntax but Python 3.6 parsed it exactly the same.

~~~ruby
# All the following equal true
YAML.load("key: Yes")
YAML.load("key: yes")
YAML.load("key: YES")
YAML.load("key: on")
YAML.load("key: On")
YAML.load("key: ON")
# => {"key"=>true}

# All the following equal false
YAML.load("key: no")
YAML.load("key: No")
YAML.load("key: NO")
YAML.load("key: off")
YAML.load("key: Off")
YAML.load("key: OFF")
# => {"key"=>false}
~~~

If you expect your program to see these values as strings, the solution is to quote
the string or to cast the value as we'll see in the next section.

## Casting values

If you want to ensure that a key has a value of a specific type, you can cast values
explicitly: `key: !!str 0.5` => `{"key" => "0.5"}` in both Ruby and Python. Likewise
key: `!!float '0.5'` => `{"key" => 0.5}` as well.

Some parsers actually implement *language specific* tags. These can be used to create specific data structures for that given language:

~~~yaml
---
key: !!python/tuple [1, 2]
~~~

Results in the following in Python:

~~~python
{'key': (1, 2)}
~~~

What REALLY surprised me here was that the *Ruby parser turned it into an Array instead:*

~~~ruby
{"key" => [1, 2]}
~~~

So I thought to myself, *"What if I change `!!python/tuple` to `!!ruby/array?`".*
So I went on ahead and updated the snippet:

~~~yaml
---
key: !!ruby/array [1, 2]
~~~

And as expected, Ruby returns the correct result:

~~~ruby
{"key" => [1, 2]}
~~~

Our friend Python on the other hand, has some issues here:

~~~plain
...snipped...
yaml.constructor.ConstructorError: could not determine a
constructor for the tag 'tag:yaml.org,2002:ruby/array'
  in "<unicode string>", line 1, column 6:
    key: !!ruby/array [1, 2]
~~~

In the above example we see that the Python parser throws an error because it can't find the
correct constructor for the tag. When Ruby finds a *language specific* tag that it doesn't know
how to use, it is simply ignored. I think both languages have a different point of view where
Python is more "demanding" about what kind of YAML you feed it and Ruby tries to "cushion" your
experience whenever it can.

So thank you Ruby (at least MRI Ruby) for supporting and treating
these Pythonic types as if they were your own :hearts:

## Integer notation

This is a small one, and part of multiple programming languages to improve readability of
large integers / binary numbers. YAML allows the usage of _ characters to "group" numbers,
e.g. `1000000000` vs `1_000_000_000`. I think the latter is many more times more readable and
therefore think that YAML deserves a honorable mention for including this awesome feat! :+1:

## Sexagesimal numbers?

We've already seen some weird behavior with some unquoted string values magically turning
into booleans but there is more! YAML parses numbers in `ii:jj` format in base 60! For example, in Ruby:

~~~ruby
YAML.load("key: 12:30:00")
# => {"key"=>45000}
~~~

While the result is [following the spec](http://yaml.org/type/float.html "Visit float type documentation on yaml.org"), it is more often than
not undesired. It becomes more interesting when the digit starts with a leading `0`. In Ruby:

~~~ruby
YAML.load("key: 01:30:00")
# => {"key"=>5400}
~~~

Whereas in Python:

~~~python
  yaml.safe_load("key: 01:30:00")
  # => {'key': '01:30:00'}
~~~

Ruby seems to be trying to "fix" this by trimming the leading `0` and parsing the rest in base 60 whereas
Python sees that this value is not valid `ii:jj` format. I am not sure why this is but my guess is what
we're going to talk about next.

## Octal numbers

If your YAML contains integer values that start with a `0` and do not contain digits greater than `7`,
they will be parsed as octal values. In Ruby:

~~~ruby
# parsed as octal
YAML.load("key: 0123")
# => {"key": 83}

# parsed 'normally'
YAML.load("key: 01238")
# => {"key": "01238"}
~~~

Python does exactly the same thing in this case. To get back to the previous example, I think Python
sees the value `01:30:00` as an invalid octal number and therefore chooses to parse it as a string.

## Complex keys

Aside from string keys, YAML won't complain if you want to use floats:
`1.1: hello there` => `{1.1 => "hello there"}` but this is still a simple key.
It *will* complain about using a list or hash as key: `[1, 2, 3]: hello there` => `error`.
Both the Ruby and Python parsers give an error when trying either.

The solution is to use a *language specific* tag. This can be used to create keys that are complex
data types such as a Ruby Array or Python Tuple.

A complex key is created by first inserting a question mark followed by a space, followed by the
*language specific* tag and the final value of the key. Then, on a new line, the value is added as usual,
starting with a colon followed by a space character and the value of the key:

~~~yaml
  ---
  ? !!python/tuple [1, 2]
  : hello
~~~

In Python, this will result in:

~~~python
{(1, 2): 'hello'}
~~~

Ruby on the other hand, has no "Tuple" type (nor did I expect it to understand the python tags)
and uses the thing that most closely resembles it, an Array:

~~~ruby
{[1, 2] => "hello"}
~~~

So while it is a bit awkward and not very portable, still something useful to know just in case :)

## Comments

We've already seen what kind of beast YAML actually is under the hood, I actually learned new things
myself *while writing this post* since I ran every example through both the Python and Ruby REPL at the
same time (Thank you tmux pane-synchronization :hearts:) and it doesn't stop there! Another
seemingly-trivial-yet-missing-from-JSON feature would be the fact that you can add `# comments`.

In JSON, comments aren't supported but of course, YAML has our back and lets us do pretty much
whatever we want, a comment starts with a # sign:

~~~yaml
---
some: yaml
# oh noes! A comment
no: problem
~~~

Both Ruby and Python simply ignore the comment:

~~~ruby
{"key"=>[1, 2], "key2"=>"no problem"}
~~~

## Summary

In short, this post described the following features:

* Inheritance / defaults

* Write JSON within YAML

* Ruby Symbols as keys

* Multiline strings

* Quoted strings

* Casting values

* Integer notation

* Sexagesimal numbers?

* Octal numbers

* Complex keys

* Comments

YAML is certainly a versatile marku...lang... yeah never mind that :) But seriously though, YAML is indeed very versatile, it can do lots of things as you have hopefully seen in the examples.

The REPLS used for testing were [pry](https://github.com/pry/pry "Visit pry/pry repository") for Ruby and Python's builtin REPL.
The Ruby parser used was [Yaml](https://ruby-doc.org/stdlib-2.4.2/libdoc/yaml/rdoc/YAML.html "Visit ruby-doc.org YAML documentation") on Ruby (MRI) 2.4.1 and for Python, [pyyaml](https://pyyaml.org/wiki/PyYAMLDocumentation "Visit pyyaml.org YAML documentation") was used on Python 3.6.2.

**Post update**: During the process of updating this post, I used pry for Ruby (MRI) 2.5.1 and Python's (3.6.7) builtin REPL. The same libraries were used for testing.

## Conclusion

I think YAML is great! Every experience I've had so far with YAML has been a positive one, whether it includes writing thousands of lines or debugging an issue. Even writing this post was a pleasure, I just took my time, opened my favorite REPL's with pane-sync on to reduce typing and started compiling information and examples, sometimes with side-effects I didn't even anticipate which led to interesting results.

I'm pretty sure I've missed some things considering what we've just witnessed earlier in the Casting Values section, there are probably lots more of these nuances between various other parsers.

From this point on, I hope that your YAML experience will also be great, it is a powerful tool to be able to wield, and I also hope you learned something new.

Cheers!

:wave:
