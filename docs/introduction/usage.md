---
layout: default
title: Usage
description: 'Usage instructions for react-axios-progressbar.'
parent: Introduction
permalink: /usage
nav_order: 3
---

Simply display the ProgressBar somewhere:

```jsx
import { ProgressBar } from 'react-axios-progressbar';

// Then somewhere in a render method:
<ProgressBar />
```

WARNING: only render one ProgressBar at a time, otherwise the two
progressBars will interfere with each other.

# Styling the ProgressBar

You have two options, either provide a style object or create
a CSS rule.

First these are the default styles, which are applied:

```js
{
  position: 'absolute',
  top: '0',
  zIndex: '9000',
  backgroundColor: '#f0ad4e',
  height: '4px',
}
```

Note that if you set the `transition` or the `width` property, they
will be ignored by the ProgressBar to make the animation work properly.

## Via style

Say you want a different `height` and `backgroundColor` you simply
override the styles using:

```jsx
const style = {
  backgroundColor: 'red',
  height: '10px'
}

<ProgressBar style={style}/>
```

## Via CSS

The class which is added on the progress bar is called
`.react-axios-progress-bar`.
You can extend that class and override properties like so:

```css
.react-axios-progress-bar {
  backgroundColor: red !important;
  height: 10px !important;
}
```

Don't forget to add the `!important`, otherwise the styling defined in the
style attribute in the ProgressBar component will take precedence.
