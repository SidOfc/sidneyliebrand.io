---
title:       'Fixing audio configuration after upgrading Ubuntu'
description: 'In this TIL: fixing some audio decifiencies in Ubuntu after upgrading'
published:   '2020-05-20T00:13:37Z'
---

Every time I upgrade Ubuntu something fails. One of these things is audio.
For some reason, upgrading breaks my audio setup in weird ways, I have speakers
connected as "Line Out" and a wireless headset. After an upgrade Ubuntu
may refuse to play audio through my headset entirely, this can be fixed
by removing pulse config:

~~~shell
rm -rf ~/.config/pulse
~~~

On restart, Ubuntu will create a fresh config file which will work.

Another thing that fails for me after upgrading Ubuntu is that my headset
likes to "take control" over the audio even though it isn't switched on.
The (likely) reason this happens is because the hub my headset connects to
is in fact, always on, and gets detected after "Line Out". Pulseaudio has
a setting located in `/etc/pulse/default.pa` to automatically
switch to "newly connected" audio devices.

Since this is never what I want, I have to disable it by editing the file
and commenting out `load-module module-switch-on-connect` like this:

~~~ini
# load-module module-switch-on-connect
~~~
