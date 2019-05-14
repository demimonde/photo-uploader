import __$styleInject from './css-injector.js'

__$styleInject(`.PhotoUploader .ImageCopy.PhotoUploaderAdded {
  background: linear-gradient(lightgrey, grey);
  border-color: #838383;
  box-shadow: rgb(98, 98, 98) 1px -5px 15px inset;
}
.PhotoUploader .ImageCopy.PhotoUploaderHasInput {
  background: linear-gradient(yellow, rgb(207, 198, 92));
  border-color: rgb(156, 158, 9);
  box-shadow: inset 1px -5px 15px #9e7414;
}
.PhotoUploader .ImageCopy.PhotoUploaderError {
  background: linear-gradient(coral, brown);
  border-color: red;
  box-shadow: rgb(162, 31, 31) 1px -5px 15px inset
}
.PhotoUploader .ImageCopy.PhotoUploaderUploaded {
  background: linear-gradient(lightgreen, #82d285);
  border-color: green;
  box-shadow: inset 1px -5px 15px #6f9e14;
}
.PhotoUploader .ImageCopy.PhotoUploaderUploading {
  background: linear-gradient(lightblue, blue);
  border-color: blue;
  box-shadow: inset 1px -5px 15px #2a33a0;
}

.PhotoUploader .ImageInfo {
  background: rgba(255, 255, 255, 0.75);
  word-break: break-all;
  max-width: 100%;
  overflow: scroll;
  position: absolute;
  margin: 0;
  /* margin-left: .5rem; */
  /* margin-right: .5rem; */
  padding-left: .25rem;
  padding-right: .25rem;
}
.ImageInfo.PhotoError {
  background: rgba(156, 66, 60, 0.63);
  border-color: red;
  color: navajowhite;
  text-shadow: 1px 1px brown;
  bottom: 0;
  left: 0;
}
.PhotoError:hover {
  z-index: 5;
}
.PreviewLoading {
  width: 290px;
}
.PhotoUploader .GalleryLink {
  bottom: 0;
  left: 0;
  padding-left: .25rem;
  padding-right: .25rem;
}
/* .PhotoUploader .Image {
  padding: .5rem;
} */
.PhotoUploader .ImageCopy {
  padding: .5rem;
  border: 1px solid grey;
  background: #cecece;
  display: inline-block;
  border-radius: 5px;
  margin: .25rem;
  height: 200px;
  vertical-align: top;
}
.PhotoUploader .Image img {
  max-width: 100%;
  max-height: 100%;
  border-radius: 3px;
  transition: .5s;
}
.PhotoUploader .Image:hover img {
  box-shadow: 0 0 19px 1px white;
}
.PhotoUploaderHasInput:hover img {
  box-shadow: 0 0 19px 1px #ecff4a;
}
.PhotoUploaderUploading:hover img {
  box-shadow: 0 0 19px 1px lightblue;
}
.PhotoUploaderError:hover img {
  box-shadow: 0 0 19px 1px lightsalmon;
}
.PhotoUploaderUploaded:hover img {
  box-shadow: 0 0 19px 1px lightgreen;
}
.PhotoLoadingPlaceholder {
  background:lightgrey;
  text-align: center;
}
.PhotoUploader .Image .CloseSpan {
  top: 0;
  right: 0;
  padding: 5px;
  cursor: pointer;
  border-radius: 5px;
  width: 1.5rem;
  height: 2rem;
  overflow: hidden;
  text-align: center;
  /* transition: .5s; */
}
.PhotoUploader .Image {
  position: relative;
  width: 100%;
  height: 100%;
}
.PhotoUploader .PreviewLoadingSpan {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.75);
  padding: .5rem;
  text-align: center;
  white-space: nowrap;
}`)