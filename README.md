# GRAPHQL-TEST-ORDERCHATROOM-delivery-and-user-

Clone the project on your Local.
Install node packages using "npm i / npm install".
Configure the Local MognoDb/ hosted Mongo DB in index js.
Run the app using "npm start".
Excute the GraphQL playground on "http://localhost:4000/".

// createChatRoom (see in (resolver/mutation))

mutation{
  createChatRoom(newUser:{
    orderid:"1"
    userid:"2"
    deliveryid:"2"
    message:"jadsklfjk"
  }){
    orderid
    userid
    deliveryid
    message
  }
}

// chatList (see in (resolver/query))

query{
  chatList(orderid:"1"){
    _id
    orderid
    deliveryid
    message
  }
}

//deleteChatRoom(see in (resolver/mutation))

mutation{
  deleteChatRoom(orderid:"1"){
    response
  }
}

//subscription (see in (resolver/subscription))

subscription{
  chatroom{
    _id
    orderid
    deliveryid
    userid
    message
  }
}
