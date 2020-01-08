import { h } from 'preact'
/* eslint-env browser */
import { Component } from 'preact'
import { handleBinaryFile } from '@metadata/exif'
import Ellipsis from './Ellipsis'

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
      const res = /** @type {!ArrayBuffer} */ (reader2.result)
      const d = handleBinaryFile(res, {
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
  render({
    name, onRemove, uploadedResults,
    photoIdName = 'photos[]',
  }) {
    /** @type {!_photoUploader.Locale} */
    const LOCALE = this.context.LOCALE
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
    return (h(Copy,{error:error, hasInput:hasInput, processing:processing, src:src, uploaded:uploaded},
      h('div',{'className':"Image"},
        !src &&
          h('span',{'className':"PreviewLoadingSpan"},
            LOCALE.previewLoading,`...`
          ),
        h('img',{'src':src}),
        h('span',{'className':"ImageInfo",'style':"top:0;left:0;"},
          name,
          date && h('br'),
          date,
        ),
        h('span',{'onClick':onRemove,'className':"ImageInfo CloseSpan"},`✕`),
        !result && !error && progress === null &&
          h(BottomLeft,{style:"background:transparent; padding-left:0;"},
            h('a',{'onClick':this.uploadHandle,'className':"btn btn-light btn-sm"},
              LOCALE.upload,
            ),
          )
        ,
        progress !== null && progress != 100 && h(BottomLeft,{},
          h('progress',{'max':100,'value':progress}),
        ),
        processing && h(BottomLeft,{},
          LOCALE.serverProcessing,h(Ellipsis),
          h('div',{'className':"spinner-border text-primary",'role':"status"},
            h('span',{'className':"sr-only"},`Loading...`),
          ),
        ),
        error && h('p',{'className':"ImageInfo PhotoError"},
          LOCALE.error,`: `,error,
        ),
        error && h('a',{'onClick':this.uploadHandle,'href':"#",'className':"btn btn-danger btn-sm",'style':"position:absolute;right:0;bottom:0;"},LOCALE.uploadAgain),
        result &&
          h('p',{'className':"ImageInfo GalleryLink"},
            h('a',{'href':result,'rel':"noopener noreferrer",'target':"_blank"},LOCALE.link),
          )
        ,
        hasInput && photoId &&
          h('input',{'name':photoIdName,'type':"hidden",'value':photoId}),
      ),
    ))
  }
}

/**
 * The sleek background behind the image.
 */
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
  const cl = [
    'ImageCopy',
    `PhotoUploader${className}`,
    ...(src ? [] : ['PreviewLoading']),
  ].join(' ')

  return ( h('div',{'className':cl},
    children,
  ))
}

const BottomLeft = ({ children, style = '', className = 'ImageInfo' }) => {
  return ( h('span',{'className':className, 'style':`bottom:0;left:0;${style}`},
    children,
  ))
}

export default Photo

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('./locale').Locale} _photoUploader.Locale
 */