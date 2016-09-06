var db = require('../models/Database.js');

module.exports = {

  fetchFriends: function(req, res, next){
    console.log("GET FETCHFRIENDS QUERY RECEIVED");

    db.Relationships.findAll({ where: {user1: req.user.id }})
      .then(function(friends){
        var query = friends.reduce(function(total,friend){
          total.push(friend.dataValues.user2)
          return total;
        },[])
        db.User.findAll({
          where: {
              id: {
                $any: query
              }
          }
        })
          .then(function(friendList){
            console.log("This is the friendslist", friendList)
            res.status(201).json(friendList)
          })
          .catch(function(err){
            res.status(404).json(err)
          })
      })
      .catch(function(err){
        res.status(404).json(err)
      })
  },

  acceptFriendReq: function(req, res, next){
    console.log("POST ACCEPTFRIENDSREQ QUERY RECEIVED");

    var rev = {
      user1: req.body.user2,
      user2: req.body.user1
    }

    var query = [req.body,rev]
    //Need to create two entries in relationships.

    db.Relationships.bulkCreate(query)
      .then(function(){
        return db.Relationships.findAll()
      })
      .then(function(relationships){
        console.log("Relationships:" ,relationships)
        res.status(201).send("Success")
      })
      .catch(function(err){
        res.status(404).json(err)
      })
  },


}