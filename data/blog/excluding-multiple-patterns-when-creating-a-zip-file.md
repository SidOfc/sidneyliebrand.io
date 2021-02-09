---
title:       'Excluding multiple patterns when creating a zip file'
description: 'A short post about creating a zip archive using multiple excludes.'
published:   '2018-06-06T00:00:00Z'
---

This is something I use so that I can deploy [mkdx](https://github.com/sidofc/mkdx)
my markdown vim plugin, to [vim.org](https://www.vim.org/scripts/script.php?script_id=5620).

vim.org doesn't allow zip files that are too large and the documentation
I wrote contains a lot of example gif files. So to keep the zip size low
I use the following command:

~~~shell
zip -r mkdx.zip mkdx -x "*git*" -x "*.gif" -x "*test*"
~~~

This recursively adds files while excluding any git, gif, or test files / directories.

Until next time :)

:wave:
