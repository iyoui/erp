import formCheck from '../src/components/formCheck/formCheck'
formCheck.install = function (Vue){
  Vue.component(formCheck.name,formCheck)
}
export default formCheck
