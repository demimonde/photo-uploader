import __$styleInject from '../css-injector.js'

__$styleInject(`.Image img {
  border-radius: 3px;
  transition: .5s;
}
.Image:hover img {
  box-shadow: 0 0 19px 1px white;
}
.Image .CloseSpan {
  top: 0;
  right: 0;
  padding: 5px;
  cursor: pointer;
  border-radius: 5px;
  width: 1.5rem;
  height: 2rem;
  /* transition: .5s; */
}`)