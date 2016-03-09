# food-app-backend
<br>Backend Of Food Project 
<br>user [get] : get All user
<br>user/email [get] : get user by email
<br>user [post] : insert user -> key : {email,token,pic,{public_profile}}
<br>resturant [get] : get All resturant
<br>resturant/res_id [get] : get resturant by res_id
<br>resturant [post] :insert resturant -> key :{name,lat,lng}
<br>resturant [put] : update resturant -> key :{name,lat,lng}
<br>resturant/rout [get][ทดสอบ] :  rout resturant 
<br>menu/res_id [get] : get All menu of res_id
<br>menu/res_id [post] : insert menu from res_id -> key: {name,price,pic,type}
<br>menu/res_id [put] : update menu from res_id -> key: {name,price,pic,type}
<br>order/preorder [get] : get All preorder 
<br>order/preorder/menu [post] : add menu to preorder -> key: {email,res_id,menu_id,menu_num,menu_des,order_lat,order_lng,order_detail}
