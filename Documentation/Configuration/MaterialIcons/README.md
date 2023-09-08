# Iconic Configuration: Material Icons

## Icon source files

Packages like Material Icons use glyph codes or even ligatures to display the icon instead a specific css selector.

```html
<i class="material-icons">alarm</i> (Template: <i class="material-icons">{icon}</i>)
```

In the case of Material Icons there are five variations of icons and each one has it's own "codepoints" file:

- MaterialIcons ( Baseline ): <a href="https://github.com/google/material-design-icons/blob/master/font/MaterialIcons-Regular.codepoints">MaterialIcons-Regular.codepoints</a>
- MaterialIcons - Outlined: <a href="https://github.com/google/material-design-icons/blob/master/font/MaterialIconsOutlined-Regular.codepoints">MaterialIconsOutlined-Regular.codepoints</a>
- MaterialIcons - Round: <a href="https://github.com/google/material-design-icons/blob/master/font/MaterialIconsRound-Regular.codepoints">MaterialIconsRound-Regular.codepoints</a>
- MaterialIcons - Sharp: <a href="https://github.com/google/material-design-icons/blob/master/font/MaterialIconsSharp-Regular.codepoints">MaterialIconsSharp-Regular.codepoints</a>
- MaterialIcons - Two Tone: <a href="https://github.com/google/material-design-icons/blob/master/font/MaterialIconsTwoTone-Regular.codepoints">MaterialIconsTwoTone-Regular.codepoints</a>

Depending on which set of icons you are trying to configure, you will need one of the above "codepoints" files.

**Note:**
You *cannot* use the .codepoints extension on the Visual Studio Cassini web server as the MIME type is not supported, if you would like to use this extension on your live site, you will need to add this MIME type, how to do this is explained in the answer to this Stackoverflow question: [How to add Mime Types in ASP.NET Core](https://stackoverflow.com/questions/51770084/how-to-add-mime-types-in-asp-net-core)

Alternatively, you can rename the file with the .css extension.

## Material Icons Font CSS

Google recommend including their hosted font files like this:

```html
<!-- Baseline -->
<link href="https://fonts.googleapis.com/css2?family=Material+Icons" rel="stylesheet">

<!-- Outline -->
<link href="https://fonts.googleapis.com/css2?family=Material+Icons+Outlined" rel="stylesheet">

<!-- Round -->
<link href="https://fonts.googleapis.com/css2?family=Material+Icons+Round" rel="stylesheet">

<!-- Sharp -->
<link href="https://fonts.googleapis.com/css2?family=Material+Icons+Sharp" rel="stylesheet">

<!-- Two Tone -->
<link href="https://fonts.googleapis.com/css2?family=Material+Icons+Two+Tone" rel="stylesheet">
```

You can use these files in the back office if you have correctly setup CORS to allow cross site access to `https://fonts.googleapis.com` or you can download the CSS file for the icon set you would like to use and add it to your website.

## Material Icons

If you're having issues configuring Material Icons, try this configuration:

**Css File**: https://fonts.googleapis.com/css2?family=Material+Icons

**Rules file**: https://github.com/google/material-design-icons/blob/master/font/MaterialIcons-Regular.codepoints

( **Note:** Don't forget to rename this file if your web server does not support the `.codepoints` MIME type. )

The regex for the Selector input needs to be: `(\w+) [a-zA-Z0-9_]*`

## Resources

[Github Repo for Material Icons](https://github.com/google/material-design-icons/) ( Look inside the [font](https://github.com/google/material-design-icons/tree/master/font) folder for all the above files. )