---
title:       'Building a Next.js page load progress bar'
description: "I've seen a fair few tutorials on building a page load progress bar for Next.js applications but most of them use the external library NProgress. While NProgress is a very nice general purpose library we can also build our own 'cheap' progress bar without using any library!"
published:   '2021-04-18T19:00:00Z'
---

In this post I'm going to cover why you would want to add a page load progress bar
to your Next.js application as well as how you could go about implementing it
without using any external libraries. Let's dive right in!

# Why add a page load progress bar

If you've ever visited a slow website and clicked a navigation link,
it may have felt like the page was not responding. This might have given
you a certain feeling of frustration perhaps, even provoking you to click
one or multiple times.

What really happened in the background was that the server got your request
and started preparing this page on the back-end but it just took a while to
complete. Since you didn't get any kind of indication that something was happening
you just decided to mash that button again.

In the worst case the webserver actually starts processing this second
click for the exact same page as well, needlessly increasing server load.
This implies two negative side effects. First, the webserver processed
a request twice, and second, the user has become more impatient than
they already were due to poor loading experience.

Of course the button could just be disabled on click, while this does
prevent the user from rage clicking it doesn't improve their browsing
experience on your website at all. This is why it may help to show
your users a page load progress bar.

# Implementing the page load progress bar

For this part I will be using Next.js' built-in support for CSS modules
and the provided `useRouter` hook so that we can hook into router events
provided by Next.js. The choice of CSS library is completely yours, you
could opt to use styled-jsx or styled-components if you'd like.
Furthermore this will be a self-contained component, when it's done you
can just drop `<Progress />` into your Next.js page layout file and
everything should just work.

## Setting up the component

To start off, let's first create the files we need for this component.
I'll assume you have some folder such as `components/` which holds all
your React components. Add a `progress/` folder inside this folder and
add an `index.js` and `progress.module.css` file to the `progress/` folder.
Your directory structure should look like this:

```plain
. (root)
|- components
|--|- progress
|--|--|- index.js
|--|--|- progress.module.css
```

With these files set up we can now open `progress/index.js` to start
working on our component. We'll need to use the `useRouter` and `useEffect` hooks
to bind listeners to navigation events and we'll need to use `useState`
to keep track of the progress:

```jsx
import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import styles from './progress.module.css';

export default function Progress() {
    const router = useRouter();
    const [progress, setProgress] = useState(0);

    return (
        <div className={styles.progress}>
            <div
                className={styles.indicator}
                style={{
                    width: `${progress}%`,
                    opacity: progress > 0 && progress < 100 ? 1 : 0,
                }}
            />
        </div>
    )
}
```

Of course this doesn't do much yet but at least we now have a component
that we can `import` in our layout or header file. We did set up
a little bit of dynamic styling in the `.indicator` element so set
the `width` equal to `${progress}%` and to set `opacity` to `1` whenever
it is active (`progress` not `0` or `100`). You can go ahead
and import and render it on your page. Nothing will show up yet but we're
going to fix that now by adding some CSS.

## Styling the component

Open `progress/progress.module.css` and add the following:

```css
.progress {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999999;
  height: 0.15rem;
  width: 100%;
}

.indicator {
  background-color: yellow;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 0;
  transition: all 0.1s linear, opacity 0.3s linear 0.2s;
}
```

The `.progress` class is the outer container which will create a fixed
space at the top of the page which `.indicator` will fill up. The
`.indicator` has some transition effects to animate both `width` and
`opacity` so the bar fades in and out nicely and width transitions
also look smooth. If we now go ahead and set the progress to something
other than `0` initially, we should see a yellow bar at the top,
let's set it to `40`:

```jsx
const [progress, setProgress] = useState(40);
```

Now reload the page and you should see a progress bar already at 40% progress.
This is the time you'll want to do some additional styling if you don't like
how it looks. Also don't forget to set the `useState` default back to `0`
when you're done :)

## Binding the events

All we have to do now is to hook up to Next.js' router events
and make this bar move on its own whenever a navigation event occurs. To
do this we'll add a `useEffect` hook without any dependencies so that
it works like [`componentDidMount`](https://reactjs.org/docs/react-component.html#componentdidmount)
/ [`componentWillUnmount`](https://reactjs.org/docs/react-component.html#componentwillunmount)
lifecycle methods.

We do this since we want
to make sure these listeners are only bound once, and should an unmount
occur we also want to make sure the old listeners are cleaned up
before any new ones are attached. This allows us to set up the listeners once,
and if an unmount occurs this also allows us to clean up the listeners:

```jsx
useEffect(() => {
    let timer;

    function start() {
        setProgress(1);
        increment();
    }

    function increment() {
        const timeout = Math.round(Math.random() * 300);

        setProgress((progress) => {
            const percent = Math.round(Math.random() * 10);
            const next = Math.min(progress + percent, 80);

            if (next < 80) {
                timer = setTimeout(increment, timeout);
                return next;
            }

            return 80;
        });
    }

    function complete() {
        clearTimeout(timer);
        setProgress(100);
    }

    router.events.on('routeChangeStart', start);
    router.events.on('routeChangeComplete', complete);
    router.events.on('routeChangeError', complete);

    return () => {
        clearTimeout(timer);
        router.events.off('routeChangeStart');
        router.events.off('routeChangeComplete');
        router.events.off('routeChangeError');
    };
}, []);
```

With all the parts set up we can now go over the `start`, `increment` and
`complete` functions. The `start` function kicks off the process on
`routeChangeStart`. It calls `setProgress(1)` which makes the progress bar
visible after a 0.2s delay defined in the CSS `opacity` transition.
Afterwards, it also calls `increment()` which will repeatedly call itself
using `setTimeout` until a certain threshold has been reached (`80` in this case).
This will move the progress bar at random intervals with random percentages added.

Finally the `complete` function will be called either on `routeChangeComplete`
or `routeChangeError` which will clear any remaining timeout set by `increment`
and force the bar to `100` progress causing it to fill up and fade out.

We can safely leave `progress` at `100` here. There is no need to reset it
to `0` because in our component logic we set `opacity` to `0` when the bar
is either at `0` or `100` progress. Additionally when new navigation events
occur the `start` function is called which always sets it to `1`.

# Everything together

Finally, you'll end up with this component:

```jsx
import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import styles from './progress.module.css';

export default function Progress() {
    const router = useRouter();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let timer;

        function start() {
            setProgress(1);
            increment();
        }

        function increment() {
            const timeout = Math.round(Math.random() * 300);

            setProgress((progress) => {
                const percent = Math.round(Math.random() * 10);
                const next = Math.min(progress + percent, 80);

                if (next < 80) {
                    timer = setTimeout(increment, timeout);
                    return next;
                }

                return 80;
            });
        }

        function complete() {
            clearTimeout(timer);
            setProgress(100);
        }

        router.events.on('routeChangeStart', start);
        router.events.on('routeChangeComplete', complete);
        router.events.on('routeChangeError', complete);

        return () => {
            clearTimeout(timer);
            router.events.off('routeChangeStart');
            router.events.off('routeChangeComplete');
            router.events.off('routeChangeError');
        };
    }, []);

    return (
        <div className={styles.progress}>
            <div
                className={styles.indicator}
                style={{
                    width: `${progress}%`,
                    opacity: progress > 0 && progress < 100 ? 1 : 0,
                }}
            />
        </div>
    );
}
```

While it isn't as fancy as something like [NProgress](https://github.com/rstacruz/nprogress),
which also shows a loading spinner, it doesn't require any library and it is
also less JS and CSS. Adding an endless spinner here also wouldn't be too
difficult if you really wanted to but this is something I'll leave
as an exercise for the reader :)

Until next time!

:wave:
