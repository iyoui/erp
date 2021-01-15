import elToast from "../src/components/toast/elToast";
elToast.install = function (Vue) {
  Vue.component(elToast.name,elToast)
}
export default elToast;
