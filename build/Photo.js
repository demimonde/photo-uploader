import { h } from 'preact'
/* eslint-env browser */
import { Component } from 'preact'
import { handleBinaryFile } from '@metadata/exif'
import Ellipsis from './Ellipsis'
import {
  $PreviewLoading,
  $ImageInfo,
  $ImageCopy,
} from './closure/stylesheet.css'
import { $Added, $Uploading, $Error, $HasInput, $Uploaded } from './closure/stylesheet.css'
import './closure/stylesheet.css'

/**
 * Creates a canvas from the image.
 * @param {string} width
 * @param {string} height
 * @param {HTMLImageElement} img
 */
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
export default class Photo extends Component {
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
  /**
   * Load file.
   * @param {Blob} file
   */
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
    formData.append('originalname', file.name)
    // have to use xhr as fetch doesn't support progress
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url, true)
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
          ({ error, 'result': result, 'photoId': photoId } = JSON.parse(t))
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
          ({ error } = JSON.parse(xhr.responseText))
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
      h('div',{'className':'pu-l position-relative w-100 h-100'},
        !src &&
          h('span',{'className':'pu-f position-absolute text-center'},
            LOCALE.previewLoading,`...`
          ),
        h('img',{'src':src,'className':'mw-100 mh-100'}),
        h('span',{'style':"top:0;left:0;",'className':'pu-a'},
          name,
          date && h('br'),
          date,
        ),
        h('span',{'onClick':onRemove,'className':'pu-a pu-m overflow-hidden text-center'},`✕`),
        !result && !error && progress === null &&
          h(BottomLeft,{style:"background:transparent;",className:'pl-0'},
            h('a',{'onClick':this.uploadHandle,'className':'btn btn-light btn-sm'},
              LOCALE.upload,
            ),
          )
        ,
        progress !== null && progress != 100 && h(BottomLeft,{},
          h('progress',{'max':100,'value':progress}),
        ),
        processing && h(BottomLeft,{},
          LOCALE.serverProcessing,h(Ellipsis),
          h('div',{'role':"status",'className':'spinner-border text-primary'},
            h('span',{'className':'sr-only'},`Loading...`),
          ),
        ),
        error && h('p',{'className':'pu-a pu-b'},
          LOCALE.error,`: `,error,
        ),
        error && h('a',{'onClick':this.uploadHandle,'href':"#",'style':"right:0;bottom:0;",'className':'btn btn-danger btn-sm position-absolute'},LOCALE.uploadAgain),
        result &&
          h('p',{'className':'pu-a pu-d'},
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
  let className = $Added
  if (processing) {
    className = $Uploading
  } else if (error) {
    className = $Error
  } else if (hasInput) {
    className = $HasInput
  } else if (uploaded) {
    className = $Uploaded
  }
  const cl = [
    $ImageCopy,
    className,
    ...(src ? [] : [$PreviewLoading]),
  ].join(' ')

  return (h('div',{'className':cl+' d-inline-block'},
    children,
  ))
}

const BottomLeft = ({ children, style = '', className = $ImageInfo }) => {
  return (h('span',{'className':className+' position-absolute', 'style':`bottom:0;left:0;${style}`},
    children,
  ))
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('./locale').Locale} _photoUploader.Locale
 */