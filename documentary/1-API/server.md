## Server Response

The component expects to receive a JSON response with 3 properties: `error`, `result` and `photoId`. The photo ID will be stored in the hidden input field, so that the parent form can send it, unless it's already included in the `uploadedResults` property which should be maintained by the parent form also. The result is the `SRC` of the uploaded image, which will replace the canvas-generated preview. It could be rotated according to metadata or watermarked _etc_. The error will be shown in the notification of the preview.

%~%
