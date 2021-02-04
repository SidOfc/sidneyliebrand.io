---
title:       'Converting .gif to web-safe .mp4 using ffmpeg'
description: 'In this TIL: converting .gif to web-safe .mp4 files using ffmpeg cli'
published:   '2019-06-10T00:20:00Z'
---

When recording animations for my posts I use a gif recorder. However,
while not the most efficient format, [.mp4 browser support](https://caniuse.com/#feat=mpeg4) is a little bit better
than [.webm](https://caniuse.com/#feat=webm) so aside from generating .webm files, I also like to create
fallback .mp4 files. This `ffmpeg` command converts a .gif to a more efficient .mp4 file:

~~~shell
ffmpeg -i file.gif -movflags faststart -pix_fmt yuv420p \
       -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" file.mp4
~~~

The `-px_fmt yuv420p` and `-vf "scale=trunc(iw/2)*2:trunc(ih/2)*2"` are
required for [mobile browsers](https://stackoverflow.com/a/50554953/2224331) (mainly for mobile Safari from my experience) to be able to display the files.

Just in case the stackoverflow link ever goes away, this [backup link](https://github.com/manateelazycat/deepin-screen-recorder/commit/a49612faed28fc70a98aa117839cc67d96b99761) explains it as well.
