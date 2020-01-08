/**
 * @fileoverview
 * @externs
 */
/* typal types/locale.xml externs */
/** @const */
var _photoUploader = {}
/**
 * Language translations.
 * @typedef {{ recognition: (string|undefined), drop: (string|undefined), previewLoading: (string|undefined), upload: (string|undefined), uploadAgain: (string|undefined), link: (string|undefined), error: (string|undefined), serverProcessing: (string|undefined) }}
 */
_photoUploader.Locale

/* typal types/index.xml externs */
/**
 * The photo uploader will create preview elements for each photo and have a hidden input field populated with the `photoId` received when the photo was updated.
 * @typedef {{ fieldName: (string|undefined), uploadedResults: (string|undefined), uploadUri: string, LOCALE: (_photoUploader.Locale|undefined), locale: (string|undefined), onRemove: ((function(!Object): void)|undefined), onAdded: ((function(): void)|undefined), onPhotoUploaded: ((function(!Object): void)|undefined) }}
 */
_photoUploader.Props
