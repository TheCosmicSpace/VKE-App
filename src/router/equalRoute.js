const hideEqualRoutesName = ['PostItem', 'ChatItem']
let initEqualRoutesName = true
export default function (routeName){
  if(initEqualRoutesName) return initEqualRoutesName = false

  if(hideEqualRoutesName.includes(routeName)) HideBottomNav(true)
  else HideBottomNav(false)
}