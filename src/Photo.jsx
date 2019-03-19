import { Component } from 'preact'
import { A } from '../../../frontend/components/Bootstrap'
import { handleBinaryFile } from './jpeg'

const getCanvas = (width, height, img) => {
  let canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL()
}

/**
 * The photo block included inside of the PhotoUploader which has 3 states: ready, uploaded and added.
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
  }
  componentDidMount() {
    this.getPreview(this.props.file)
    this.getMetadata(this.props.file)
  }
  getMetadata(file) {
    const reader2 = new FileReader()
    reader2.readAsArrayBuffer(file)
    reader2.onload = () => {
      const d = handleBinaryFile(reader2.result)
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
  render ({
    name, onRemove, uploadedResults,
    photoIdName = 'photos[]',
  }) {
    const {
      progress, error, preview, uploaded, result, metadata, photoId,
    } = this.state
    const processing = progress == 100 && !uploaded
    const alreadyExported = photoId && uploadedResults.some(i => i ==  photoId)
    const hasInput = result && !alreadyExported

    let className = 'Added'
    const s = {
      'background': 'linear-gradient(lightgrey, grey)',
      'border-color': '#838383',
      'box-shadow': 'rgb(98, 98, 98) 1px -5px 15px inset',
    }
    if (processing) {
      s['background'] = 'linear-gradient(lightblue, blue)'
      s['border-color'] = 'blue'
      s['box-shadow'] = 'inset 1px -5px 15px #2a33a0'
      className = 'Uploading'
    } else if (error) {
      s['background'] = 'linear-gradient(coral, brown)'
      s['border-color'] = 'red'
      s['box-shadow'] = 'rgb(162, 31, 31) 1px -5px 15px inset'
      className = 'Error'
    } else if (hasInput) {
      s.background = "linear-gradient(yellow, rgb(207, 198, 92))"
      s['border-color'] = 'rgb(156, 158, 9)'
      s['box-shadow'] = 'inset 1px -5px 15px #9e7414'
      className = 'HasInput'
    } else if (uploaded) {
      s['background'] = 'linear-gradient(lightgreen, #82d285)'
      s['border-color'] = 'green'
      s['box-shadow'] = 'inset 1px -5px 15px #6f9e14'
      className = 'Uploaded'
    }

    const src = result || preview
    let date
    try {
      date = metadata.data.DateTime
      if (date) date = getDate(date).toLocaleDateString()
    } catch (er) {
      // ok
    }
    const cl = ['Image', src ? undefined : 'PreviewLoading', `PhotoUploader${className}`].filter(Boolean).join(' ')
    return (<div style={s} className={cl} >
      {!src  && <span
        className="ImageInfo"
        style="top:50%;left:50%;transform:translate(-50%, -50%);">
        Загрузка превью...</span>}
      <img src={src} />
      <span className="ImageInfo" style="top:.5rem;left:.5rem;">
        {name}
        {date && <br/>}
        {date}
      </span>
      <span className="ImageInfo CloseSpan" onClick={onRemove}>✕</span>
      {!result && !error && progress === null &&
        <BottomLeft className="Absolute">
          <A className="btn btn-light btn-sm" onClick={() => {
            this.upload()
          }}>Загрузить</A>
        </BottomLeft>
      }
      {progress !== null && progress != 100 && <BottomLeft>
        <progress max={100} value={progress}/>
      </BottomLeft>}
      {processing && <BottomLeft>
        Выполняется обработка...
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </BottomLeft>}
      {error && <p className="ImageInfo PhotoError">
        Ошибка: {error}
      </p>}
      {error && <a href="#" className="btn btn-danger btn-sm" onClick={(e) => {
        e.preventDefault()
        this.upload()
        return false
      }} style="position:absolute;right:.5rem;bottom:.5rem;">Загрузить снова</a>}
      {result &&
        <p className="ImageInfo GalleryLink">
          <a rel="noopener noreferrer" target="_blank" href={result}>Ссылка</a>
        </p>
      }
      {hasInput && photoId && <input type="hidden" name={photoIdName} value={photoId}/>}
    </div>)
  }
}

const BottomLeft = ({ children, className = 'ImageInfo' }) => {
  return (<span className={className} style="bottom:.5rem;left:.5rem;">
    {children}
  </span>)
}


// RobG
// https://stackoverflow.com/a/43084928/1267201
const getDate = (s) => {
  const [year, month, date, hour, min, sec] = s.split(/\D/)
  return new Date(year,month-1,date,hour,min,sec)
}

export default Photo