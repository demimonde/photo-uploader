/* yarn example/ */
import photoUploader from '../src'

(async () => {
  const res = await photoUploader({
    text: 'example',
  })
  console.log(res)
})()