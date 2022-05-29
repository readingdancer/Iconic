# Iconic Tips & Tricks


## Contents
1. [Stacked Content](#stackedcontent)
2. [I don't get what the Rules Source is for](#rulessource)
3. [Why do I need to configure two different files for Rules Source and CSS file?](#twofiles)

## 1. <a name="stackedcontent"></a> Stacked Content
If you are using stacked content and Iconic, you must ensure that any stacked document types do not use "icon" as the alias for an Icon Picker property editor. 
It's a known issue of Inner Content: <a href="https://github.com/umco/umbraco-inner-content#known-issues">https://github.com/umco/umbraco-inner-content#known-issues</a>

## 2. <a name="rulessource"></a> I don't get what the Rules Source is for.
The Rules Source is the file used to extract the string that makes each icon unique.

## 3.<a name="twofiles"></a> Why do I need to configure two different files for Rules Source and CSS file?
It's common that these are configured pointing to the same file. Sometimes though they need to be different.

Material Icons, for instance, uses a codepoint file. This file specifies a code for each icon, not a CSS rule. The CSS file specifies the classes that the HTML code needs to render each codepoint.

Other libraries use CSS to define each icon, and that's why we can use the same CSS file to extract the icons and to render them.