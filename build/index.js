import { h } from 'preact'
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
    /** @type {PhotoUploaderProps} */
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
    return (h('div',{ 'onDragEnter':(event) => {
      event.preventDefault()
      counter++
      event.currentTarget.style.background = '#E91E63'
    },'className':"PhotoUploader", 'onDragLeave':(event) => {
      counter--
      if (counter == 0)
        event.currentTarget.style.background = ''
    }, 'onDrop':(event) => {
      event.preventDefault()
      event.stopPropagation()
      event.currentTarget.style.background = ''
      const { dataTransfer: { files } } = event
      this.addFiles(files)
    }, 'onDragOver':(event) => {
      event.preventDefault()
      event.stopPropagation()
    }},
      h('input',{'id':id,'aria-described-by':hid,'onChange':(e) => {
        e.preventDefault()
        this.addFiles(e.currentTarget.files)
        e.currentTarget.value = null
      },'accept':"image/*",'type':"file",'multiple':true}),
      this.state.addingFiles ? 'Идет опознование файлов...' : 'Или переместите файлы сюда...',
      h('br'),
      this.state.files.map(({ file, pid }) => {
        return (h(Photo,{uploadUri:uploadUri,key:pid,name:file.name,file:file,onRemove:() => {
          this.removeFile(file)
        },fieldName:fieldName,onUploaded:onPhotoUploaded,uploadedResults:uploadedResults}))
      }),
    ))
  }
}

export default PhotoUploader

/* documentary types/index.xml */
/**
 * @typedef {Object} PhotoUploaderProps Options for the PhotoUploader component.
 * @prop {function} [onRemove] The function to call when a photo was removed.
 * @prop {function} [onAdded] The function to call when a photo was added.
 * @prop {string} [fieldName="files[]"] The name of the hidden `input` fields. Default `files[]`.
 * @prop {function} [onPhotoUploaded] The callback to call when a photo was uploaded.
 * @prop {string} [uploadedResults="[]"] The list of photos which were saved and don't need uploading. Default `[]`.
 * @prop {string} uploadUri The URL where to upload files.
 */
