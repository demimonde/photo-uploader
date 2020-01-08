import { Component } from 'preact'
import { RU_LOCALE, EN_LOCALE } from './locale'
import Photo from './Photo'
import './style.css'

const loc = {
  'RU_LOCALE': RU_LOCALE,
  'EN_LOCALE': EN_LOCALE,
}

/**
 * The Photo Uploader is the image upload component which has drag and drop functionality to allow adding of files. It renders the list of currently added photos either via dynamic UI interaction or via the input element, and puts photo elements on the page.
 */
class PhotoUploader extends Component {
  constructor() {
    super()
    this.state = { files: [] }
    /** @type {!_photoUploader.Props} */
    this.props = this.props
  }
  removeFile(file) {
    const files = this.state.files.filter(({ file: f }) => f !== file)
    this.setState({ files })
    if (this.props.onRemove) this.props.onRemove(file)
  }
  async addFiles(f) {
    const [...ff] = f
    const files = ff.map(file => ({ file,
      pid: Math.floor(Math.random() * 10000) }))
    this.setState({
      files: [...this.state.files, ...files],
    })
    if (this.props.onAdded) this.props.onAdded()
  }
  getChildContext() {
    return {
      LOCALE: this.LOCALE,
    }
  }
  get LOCALE() {
    let { locale = 'en', LOCALE } = this.props
    if (!LOCALE) LOCALE = loc[locale.toUpperCase() + `_LOCALE`]
    return LOCALE
  }
  /**
   * @param {!_photoUploader.Props} [opts] The photo uploader will create preview elements for each photo and have a hidden input field populated with the `photoId` received when the photo was updated.
   * @param {string} [opts.fieldName] The name of the hidden `input` fields. Default `files[]`.
   * This is for the second part of the submission, and is different from the image upload field, which is just `image`.
   * @param {string} [opts.uploadedResults] The list of photos which were saved and don't need uploading.
   * @param {string} opts.uploadUri The URL where to upload files.
   * @param {_photoUploader.Locale} [opts.LOCALE] An hash map with locale values.
   * @param {string} [opts.locale="en"] A language for existing locales (either `en` or `ru`). Default `en`.
   * @param {function(!Object): void} [opts.onRemove] The function to call when a photo was removed.
   * @param {function(): void} [opts.onAdded] The function to call when a photo was added.
   * @param {function(!Object): void} [opts.onPhotoUploaded] The callback to call when a photo was uploaded with the `result` property of the server response.
   */
  render({ fieldName = 'files[]', onPhotoUploaded, uploadedResults, uploadUri }) {
    const LOCALE = this.LOCALE
    if (!LOCALE) return <div>Photo Uploader Error: Unknown Locale</div>

    const { hid, id } = this.context
    let counter = 0
    return (<div className="PhotoUploader" onDragEnter={(event) => {
      event.preventDefault()
      counter++
      event.currentTarget.style.background = '#E91E63'
    }} onDragLeave={(event) => {
      counter--
      if (counter == 0)
        event.currentTarget.style.background = ''
    }} onDrop={(event) => {
      event.preventDefault()
      event.stopPropagation()
      event.currentTarget.style.background = ''
      const { dataTransfer: { files } } = event
      this.addFiles(files)
    }} onDragOver={(event) => {
      event.preventDefault()
      event.stopPropagation()
    }}>
      <input id={id} aria-described-by={hid} accept="image/*" onChange={(e) => {
        e.preventDefault()
        this.addFiles(e.currentTarget.files)
        e.currentTarget.value = null
      }} type="file" multiple />
      {this.state.addingFiles ? LOCALE.recognition : LOCALE.drop }
      <br/>
      {this.state.files.map(({ file, pid }) => {
        return (<Photo uploadUri={uploadUri} key={pid} name={file.name} file={file} onRemove={() => {
          this.removeFile(file)
        }} fieldName={fieldName} onUploaded={onPhotoUploaded} uploadedResults={uploadedResults}/>)
      })}
    </div>)
  }
}

export default PhotoUploader

/* documentary types/index.xml */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {_photoUploader.Props} Props The photo uploader will create preview elements for each photo and have a hidden input field populated with the `photoId` received when the photo was updated.
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {Object} _photoUploader.Props The photo uploader will create preview elements for each photo and have a hidden input field populated with the `photoId` received when the photo was updated.
 * @prop {string} [fieldName] The name of the hidden `input` fields. Default `files[]`.
 * This is for the second part of the submission, and is different from the image upload field, which is just `image`.
 * @prop {string} [uploadedResults] The list of photos which were saved and don't need uploading.
 * @prop {string} uploadUri The URL where to upload files.
 * @prop {_photoUploader.Locale} [LOCALE] An hash map with locale values.
 * @prop {string} [locale="en"] A language for existing locales (either `en` or `ru`). Default `en`.
 * @prop {function(!Object): void} [onRemove] The function to call when a photo was removed.
 * @prop {function(): void} [onAdded] The function to call when a photo was added.
 * @prop {function(!Object): void} [onPhotoUploaded] The callback to call when a photo was uploaded with the `result` property of the server response.
 */

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('./locale').Locale} _photoUploader.Locale
 */