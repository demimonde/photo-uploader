## API

The package is available by importing its default component:

```js
import photoUploader from 'photo-uploader'
```

%~%

```## PhotoUploader
```

Creates an area with an input to choose files, and a drag-and-drop zone. As soon as photos are added, their previews are generated on a small canvas, to prevent using too much memory to display heavy pictures, and metadata is read to display the date when the photo was taken.

In future releases, the previews will also be rotated according to the orientation from the metadata.

%EXAMPLE: example/App, ../src => photo-uploader%

%TYPEDEF types/index.xml%

When photos are uploaded to the URL provided, their read the `photoId` from the JSON response and add it to the hidden id field provided. The parent form (which is not implemented by this component) can then be used to save the ids of saved pictures to the server. The implementation intentionally decouples uploading photos from saving them on the server, so that it is possible to upload them to a route which is different from the business-logic server that would save the photo into appropriate category (_etc_) which would also be present in the form implemented by the page.

![The Photo Uploader Component](doc/photo-uploader.png)

There are 6 states of the photo:

- <kdb>added</kbd> Just dropped to the component, needs to start uploading [grey].
- <kdb>uploading</kbd> Started the upload process [blue].
- <kdb>error</kbd> Upload failed, there's a button to retry [red].
- <kdb>processing</kbd> The upload has completed, waiting for the server to finish processing (resizing, metadata, _etc_) [blue].
- <kdb>ready</kbd> Ready to be saved [yellow].
- <kdb>saved</kbd> The photo was saved via the form, it's id is present in the `uploadedResults` property of the component, and it won't be saved again [green].

%~%