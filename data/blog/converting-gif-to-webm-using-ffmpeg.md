---
title:       'Converting .gif to .webm using ffmpeg'
description: 'This short post shows how to convirt .gif images to .webm videos using ffmpeg cli.'
published:   '2019-06-10T00:00:00Z'
---

When recording animations for my posts I use a gif recorder. However,
using .webm files is more efficient and works in [most browsers](https://caniuse.com/#feat=webm) today.
This `ffmpeg` command converts a .gif to a more efficient .webm file:

~~~shell
ffmpeg -i file.gif -c vp9 -b:v 0 -crf 40 file.webm
~~~

Until next time :)

:wave:
