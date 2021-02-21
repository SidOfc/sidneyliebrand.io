---
title:       'Converting .gif to web-safe video formats using ffmpeg'
description: 'This post shows how to convert .gif images to web-safe video formats using ffmpeg cli. These formats produce smaller files which means less data to load!'
published:   '2021-02-14T18:30:00Z'
---

When recording animated content for my blog posts I use a gif recorder. However,
using [.webm](https://caniuse.com/?search=webm "View caniuse.com webm support") or [.mp4](https://caniuse.com/?search=mp4 "View caniuse.com mp4 support")
files is usually more efficient and works in pretty much every major browser today.

## Convert .gif to .webm

To convert a .gif file to .webm, use the following command:

~~~shell
ffmpeg -i file.gif -c vp9 -b:v 0 -crf 40 file.webm
~~~

This will output a .webm file that works in most browsers, but what are these options
doing exactly? Let's dive in:

- `-i`: Specifies the _input file_, in this case `file.gif`.
- `-c`: Specifies the _codec_, `vp9` works in most browsers.
- `-b:v`: Specifies the _video bitrate_, `0` allows us to specify the quality via the `-crf` option.
- `-crf`: Specifies the _quality_, ranges between 0-63, lower means better quality.

More detailed explanations about the options can be found [here](https://trac.ffmpeg.org/wiki/Encode/VP9 "Visit ffmpeg VP9 encode page").

These .webm files will suffer a little bit of quality loss, but if more quality is
needed the `-crf` flag can be set to a lower value easily. With these settings
the .webm file is (on average) **60%** smaller than the .gif file.

When we check caniuse, [.webm support](https://caniuse.com/?search=webm "View caniuse.com webm support") looks good too, mostly.
Indeed the only real reason today to use .mp4 on the web is to support Internet Explorer.

## Convert .gif to .mp4

To convert a .gif file to a web-safe .mp4, use the following command:

~~~shell
ffmpeg -i file.gif -movflags +faststart -pix_fmt yuv420p \
       -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" file.mp4
~~~

This will output a .mp4 file that is [widely supported](https://caniuse.com/?search=mp4 "View caniuse.com mp4 support")
in all browsers except Opera Mini. Let's also cover the options for this one:

- `-i`: Specifies the _input file_, in this case `file.gif`.
- `-movflags`: For web video we can specify `+faststart` to allow the video to start playing before the download is complete.
- `-pix_fmt`: The default `yuv444p` can't be played by some mobile browsers so we set it to `yuv420p` instead.
- `-vf`: This flag is allows us to set `"scale=trunc(iw/2)*2:trunc(ih/2)*2"` to ensure the video width and height are divisible by 2 which would otherwise cause an error when using `yuv420p`.

More detailed explanations about the options can be found [here](https://trac.ffmpeg.org/wiki/Encode/H.264 "Visit ffmpeg H.264 encode page").
Additionally, [this commit](https://github.com/manateelazycat/deepin-screen-recorder/commit/a49612faed28fc70a98aa117839cc67d96b99761 "Read details about pix_fmt and vf flags command line flags")
provides some additional context about `-pix_fmt` and `-vf`.

The .mp4 file is (on average) **50%** smaller than the .gif file. While less efficient
than .webm, it is still much better than using .gif.

## Conclusion

Hopefully this post made it a little bit easier to understand how to convert
.gif files to .webm or .mp4 using `ffmpeg`. It a powerful tool that can help us
optimize our usage of animated media on the web. It is definitely worth looking
into if you run a website that displays lots of gifs.

Until next time :)

:wave:
