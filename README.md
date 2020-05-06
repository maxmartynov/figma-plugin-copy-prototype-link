![](img/banner.png)

# Copy Prototype Link &mdash; Figma Plugin

This is a [Figma](figma.com) plugin that provides an easy way to
copy to the clipboard the [Prototype link](https://help.figma.com/hc/en-us/articles/360039822654-Share-your-Prototype-with-Others)
to a specific frame without having to switch into the [Presentation mode](https://help.figma.com/hc/en-us/articles/360040318013-View-Prototypes-with-Presentation-View).



## How To Use

Select a layer and run the command `Copy Prototype Link` and the link will
be copied to the clipboard. When you first start the plugin in a File
you will need to set the **File Key** on the Settings window manually.
Just copy the whole **File URL** from the browser's address bar and
paste it to the input field and the plugin will extract
the **File Key** automatically. You also can paste only
the **File Key** to the input field.

The **File Key** looks like:
> ht<span>tps://figma.com/file/**e9z7p5lisUPmRe9z7p5lisUPm**/FileName

Your file share link is saved in your File safely. It’s not sent to any external server.



### Demo

`// TODO: add the demo`

[<br><img src="img/demo.gif" width="200"/>](img/demo.gif)



## Development

#### Installation
```
npm run install
```

#### Watch

Run the watcher that will transpile .ts files into .js files on change
```
npm run watch
```

#### Build

Build for production
```
npm run build
```

#### Bump the app version

```
npm run bump
# or
npm run patch
```

## TODO
- Add a function to get the File Key automatically without need to insert it
manually. Currently this is not possible, but I hope this feature will be added
to the Figma API soon.
- Fix the blinking while Copy Prototype Link command when the fileId does exist.
The problem is the UI should be displayed to be able to render an input and
copy value to clipboard. So currently the window (UI) shows up for a second.
There is no way to copy value without showing the input. Perhaps Figma will
add an ability to move the window and we will be able to move it out of the
viewport's edge.
- Add [setRelaunchData](https://www.figma.com/plugin-docs/api/properties/nodes-setrelaunchdata/)
- On Figma, you can set a frame as a Starting Frame for a
prototype. When you do, by default when you go into prototype mode
it starts from there. If the starting frame has been set, then
Copy Prototype Link points to that frame, which isn't intended.
We should find a way to bypass this behavior.


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.



## Credits
The idea initiator & artwork - [Filippos Protogeridis](https://github.com/protogeridis)



## License
[MIT](LICENSE)