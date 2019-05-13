/* eslint-env browser */
const { Component } = require('preact');
// import { A } from '../../../frontend/components/Bootstrap'
const { handleBinaryFile } = require('@metadata/exif');
const Ellipsis = require('./Ellipsis');

const getCanvas = (width, height, img) => {
  let canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL()
}

/**
 * The photo block included inside of the `PhotoUploader` which has 3 states: ready, uploaded and added.
 */
class Photo extends Component {
  constructor() {
    super()
    this.state = {
      uploaded: false,
      progress: null,
      error: null,
      preview: null,
      result: null,
    }
    this.uploadHandle = this.uploadHandle.bind(this)
  }
  componentDidMount() {
    this.getPreview(this.props.file)
    this.getMetadata(this.props.file)
  }
  getMetadata(file) {
    const reader2 = new FileReader()
    reader2.readAsArrayBuffer(file)
    reader2.onload = () => {
      const d = handleBinaryFile(reader2.result, {
        parseDates: true,
      })
      this.setState({ metadata: d })
    }
  }
  getPreview(file) {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      this.getCanvas(reader.result)
    }
  }
  getCanvas(data) {
    const tempImg = new Image()
    tempImg.src = data
    tempImg.onload = () => {
      const ratio = tempImg.width / tempImg.height
      const height = 250
      const width = tempImg.width > tempImg.height ? height * ratio : height / ratio
      const c = getCanvas(width, height, tempImg)
      this.setState({ preview: c })
    }
  }
  async upload() {
    const {
      uploadUri = '/upload-asset',
    } = this.props
    this.setState({
      error: null, progress: 0, uploaded: false })
    return this.uploadPost(uploadUri)
  }

  async uploadPost(url) {
    const { file } = this.props
    const formData = new FormData()
    formData.append('image', file)
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${url}&name=${file.name}`, true)
    xhr.seenBytes = 0
    xhr.upload.addEventListener('progress', (e) => {
      this.updateProgress((e.loaded * 100.0 / e.total) || 100)
    })
    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState == 4) {
        this.setState({ uploaded: true, progress: null })
      }
      if (xhr.readyState == 4 && xhr.status == 200) {
        const t = xhr.responseText
        let error, result, photoId
        try {
          ({ 'error': error, 'result': result, 'photoId': photoId } = JSON.parse(t))
        } catch (err) {
          error = `Could not parse JSON: ${err.message}`
        }
        if (error) {
          this.setState({ error })
        } else if (result) {
          this.setState({ result,
            preview: null, // release canvas memory from the state.
            photoId,
          })
          if (this.props.onUploaded) {
            this.props.onUploaded(result)
          }
        }
      } else if (xhr.readyState == 4 && xhr.status != 200) {
        let error = 'XHR Error'
        try {
          ({ 'error': error } = JSON.parse(xhr.responseText))
        } catch (err) {/**/}
        this.setState({ error: error })
      }
    })

    xhr.send(formData)
  }
  updateProgress(progress) {
    this.setState({ progress })
  }
  uploadHandle(e) {
    e.preventDefault()
    this.upload()
    return false
  }
  render ({
    name, onRemove, uploadedResults,
    photoIdName = 'photos[]',
  }) {
    const {
      progress, error, preview, uploaded, result, metadata, photoId,
    } = this.state
    const processing = progress == 100 && !uploaded
    const alreadyExported = photoId && uploadedResults.some(i => i == photoId)
    const hasInput = result && !alreadyExported

    const src = result || preview
    let date
    try {
      date = metadata['data']['DateTime']
      date = date.toLocaleString()
    } catch (er) {
      // ok
    }
    return (<Copy error={error} hasInput={hasInput} processing={processing} src={src} uploaded={uploaded}>
      <div className="Image">
        {!src &&
          <span className="PreviewLoadingSpan">
            Загрузка превью...
          </span>}
        <img src={src} />
        <span className="ImageInfo" style="top:0;left:0;">
          {name}
          {date && <br/>}
          {date}
        </span>
        <span className="ImageInfo CloseSpan" onClick={onRemove}>✕</span>
        {!result && !error && progress === null &&
          <BottomLeft style="background:transparent; padding-left:0;">
            <a className="btn btn-light btn-sm" onClick={this.uploadHandle}>Загрузить</a>
          </BottomLeft>
        }
        {progress !== null && progress != 100 && <BottomLeft>
          <progress max={100} value={progress}/>
        </BottomLeft>}
        {processing && <BottomLeft>
          Выполняется обработка<Ellipsis />
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </BottomLeft>}
        {error && <p className="ImageInfo PhotoError">
          Ошибка: {error}
        </p>}
        {error && <a href="#" className="btn btn-danger btn-sm" onClick={this.uploadHandle} style="position:absolute;right:0;bottom:0;">Загрузить снова</a>}
        {result &&
          <p className="ImageInfo GalleryLink">
            <a rel="noopener noreferrer" target="_blank" href={result}>Ссылка</a>
          </p>
        }
        {hasInput && photoId &&
          <input type="hidden" name={photoIdName} value={photoId}/>}
      </div>
    </Copy>)
  }
}

const Copy = ({ children, processing, error, hasInput, uploaded, src }) => {
  let className = 'Added'
  if (processing) {
    className = 'Uploading'
  } else if (error) {
    className = 'Error'
  } else if (hasInput) {
    className = 'HasInput'
  } else if (uploaded) {
    className = 'Uploaded'
  }
  const cl = ['ImageCopy', src ? undefined : 'PreviewLoading', `PhotoUploader${className}`].filter(Boolean).join(' ')

  return (<div className={cl}>
    {children}
  </div>)
}

const BottomLeft = ({ children, style = '', className = 'ImageInfo' }) => {
  return (<span className={className} style={`bottom:0;left:0;${style}`}>
    {children}
  </span>)
}

module.exports=Photo