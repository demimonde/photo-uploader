# photo-uploader

[![npm version](https://badge.fury.io/js/photo-uploader.svg)](https://www.npmjs.com/package/photo-uploader)

`photo-uploader` is A _Preact_ JSX Photo Uploader Component. It supports file uploading using `multipart/form-data` protocol, and can be easily translated. The component depends on _Bootstrap_ styles (skins will follow up soon too).

```console
github:~$ \
yarn add photo-uploader
npm install photo-uploader
```

![Photo Uploader Demo](doc/demo.gif)

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [PhotoUploader](#photouploader)
  * [`Props`](#type-props)
- [Locales](#locales)
  * [`Locale`](#type-locale)
- [Server Response](#server-response)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/0.svg?sanitize=true">
</a></p>

## API

The package is available by importing its default component:

```js
import PhotoUploader from 'photo-uploader'
```

The package has been compiled into `h`-pragma calls (without JSX) using [ÀLaMode](https://artdecocode.com/alamode/) transpiler, and the CSS imports are changed into importing a CSS injector script. See the [build](build) folder to see how it looks. The `import/export` statements are left as they are though, and the recommended usage of the package is to bundle it with [_Depack_](https://artdecocode.com/depack/) &mdash; the front-end bundler that uses _Google Closure Compiler_.

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/1.svg?sanitize=true">
</a></p>

## PhotoUploader

Creates an area with an input to choose files, and a drag-and-drop zone. As soon as photos are added, their previews are generated on a small canvas, to prevent using too much memory to display heavy pictures, and metadata is read to display the date when the photo was taken.

In future releases, the previews will also be rotated according to the orientation from the metadata.

```jsx
/* eslint-env browser */
import { render, Component } from 'preact'
import PhotoUploader from 'photo-uploader'
import 'preact/devtools/'

class Main extends Component {
  render() {
    return (
      <div className="container">
        Hello World
        <PhotoUploader uploadUri="/form" />
      </div>)
  }
}

render(<Main />, document.querySelector('#preact'))
```

__<a name="type-props">`Props`</a>__: The photo uploader will create preview elements for each photo and have a hidden input field populated with the `photoId` received when the photo was updated.

|      Name       |                                   Type                                    |                                                                                    Description                                                                                    | Default |
| --------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| fieldName       | <em>string</em>                                                           | The name of the hidden `input` fields. Default `files[]`.<br/>This is for the second part of the submission, and is different from the image upload field, which is just `image`. | -       |
| uploadedResults | <em>string</em>                                                           | The list of photos which were saved and don't need uploading.                                                                                                                     | -       |
| __uploadUri*__  | <em>string</em>                                                           | The URL where to upload files.                                                                                                                                                    | -       |
| LOCALE          | <em><a href="#type-locale" title="Language translations.">Locale</a></em> | An hash map with locale values.                                                                                                                                                   | -       |
| locale          | <em>string</em>                                                           | A language for existing locales (either `en` or `ru`).                                                                                                                            | `en`    |
| onRemove        | <em>(file: !Object) => void</em>                                          | The function to call when a photo was removed.                                                                                                                                    | -       |
| onAdded         | <em>() => void</em>                                                       | The function to call when a photo was added.                                                                                                                                      | -       |
| onPhotoUploaded | <em>(photo: !Object) => void</em>                                         | The callback to call when a photo was uploaded with the `result` property of the server response.                                                                                 | -       |

When photos are uploaded to the URL provided, their read the `photoId` from the JSON response and add it to the hidden id field provided. The parent form (which is not implemented by this component) can then be used to save the ids of saved pictures to the server. The implementation intentionally decouples uploading photos from saving them on the server, so that it is possible to upload them to a route which is different from the business-logic server that would save the photo into appropriate category (_etc_) which would also be present in the form implemented by the page.

![The Photo Uploader Component](doc/photo-uploader.png)

There are 6 states of the photo:

- <kbd>added</kbd> Just dropped to the component, needs to start uploading [grey].
- <kbd>uploading</kbd> Started the upload process [blue].
- <kbd>error</kbd> Upload failed, there's a button to retry [red].
- <kbd>processing</kbd> The upload has completed, waiting for the server to finish processing (resizing, metadata, _etc_) [blue].
- <kbd>ready</kbd> Ready to be saved [yellow].
- <kbd>saved</kbd> The photo was saved via the form, it's id is present in the `uploadedResults` property of the component, and it won't be saved again [green].

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/2.svg?sanitize=true">
</a></p>

## Locales

It is possible to extend the language of the form by providing a custom `LOCALE` object via the properties. The following interface is used:

__<a name="type-locale">`Locale`</a>__: Language translations.
<table>
 <thead><tr>
  <th>Name</th>
  <th>Type &amp; Description</th>
 </tr></thead>
 <tr>
  <td rowSpan="3" align="center">recognition</td>
  <td><em>string</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   When starting to process local file.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">drop</td>
  <td><em>string</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Drop area label.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">previewLoading</td>
  <td><em>string</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Preview is loading placeholder.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">upload</td>
  <td><em>string</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Upload button.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">uploadAgain</td>
  <td><em>string</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Upload again button (after fail).
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">link</td>
  <td><em>string</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Link text.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">error</td>
  <td><em>string</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Error notification.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">serverProcessing</td>
  <td><em>string</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   The photo is being processed on the server.
  </td>
 </tr>
</table>

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/3.svg?sanitize=true">
</a></p>

## Server Response

The component expects to receive a JSON response with 3 properties: `error`, `result` and `photoId`. The photo ID will be stored in the hidden input field, so that the parent form can send it, unless it's already included in the `uploadedResults` property which should be maintained by the parent form also. The result is the `SRC` of the uploaded image, which will replace the canvas-generated preview. It could be rotated according to metadata or watermarked _etc_. The error will be shown in the notification of the preview.

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/4.svg?sanitize=true">
</a></p>


## Copyright

(c) [Demimonde][1] 2019

[1]: https://demimonde.cc

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/-1.svg?sanitize=true">
</a></p>