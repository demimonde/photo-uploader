import { Component } from 'preact'
import Photo from './Photo'

/**
 * The Photo Uploader is the image upload component which has drag and drop functionality to allow adding of files. It renders the list of currently added photos either via dynamic UI interaction or via the input element, and puts photo elements on the page.
 */
class PhotoUploader extends Component {
  constructor() {
    super()
    this.state = { files: [] }
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
      {this.state.files.map(({ file, pid }) => {
        return (<Photo uploadUri={uploadUri} key={pid} name={file.name} file={file} onRemove={() => {
          this.removeFile(file)
        }} fieldName={fieldName} onUploaded={onPhotoUploaded} uploadedResults={uploadedResults}/>)
      })}
    </div>)
  }
}

export default PhotoUploader