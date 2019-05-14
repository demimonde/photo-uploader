import { Component } from 'preact'
import Photo from './Photo'
import './style.css'

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
  render({ fieldName = 'files[]', onPhotoUploaded, uploadedResults, uploadUri }) {
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
      {this.state.addingFiles ? 'Идет опознование файлов...' : 'Или переместите файлы сюда...'}
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
 * @prop {function(): void} [onRemove] The function to call when a photo was removed.
 * @prop {function(): void} [onAdded] The function to call when a photo was added.
 * @prop {string} [fieldName] The name of the hidden `input` fields. Default `files[]`.
 * @prop {function(Object):void} [onPhotoUploaded] The callback to call when a photo was uploaded with the `result` property of the server response.
 * @prop {string} [uploadedResults] The list of photos which were saved and don't need uploading.
 * @prop {string} uploadUri The URL where to upload files.
 */
