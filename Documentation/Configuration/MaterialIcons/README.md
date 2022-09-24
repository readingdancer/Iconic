# Iconic Configuration: Material Icons

*[If you have successfully configured Material Icons, please consider contributing to this doc!]*

## Icons source file

Other packages like Material Icons use the glyph codes or even ligatures to display the icon instead a specific css selector. 
```
<i class="material-icons">alarm</i> (Template: <i class="material-icons">{icon}</i>)
```
So this file can be the same css file or another files use to extract the icons property. In the case of Material Icons for instance there is a file called <a href="https://github.com/google/material-design-icons/blob/master/iconfont/codepoints">codepoints</a> where you can extract the icons names from.

## Material Icons
If you're having issues configuring Material Icons, try this configuration:

**Css File**: https://fonts.googleapis.com/icon?family=Material+Icons

**Rules file**: https://github.com/skartknet/Iconic/tree/master/Documentation/Configuration/MaterialIcons/codepoints.css

**11/4/2022 UPDATE**
The link to the codepoints file now returns a file with a JSON object.
In order to make it work, you need to download the file and remove the first and last `{` `}` so the Icon service that loads the file doesn't think it's an actual obj and it returns it as plain text.
The regex for the Selector input needs to be **"(\w+)":\s"[^"]"**

Yes, this is a pretty dirty trick, but given that no other package for the moment have this issue we won't make Iconic compatible with JSON files.
