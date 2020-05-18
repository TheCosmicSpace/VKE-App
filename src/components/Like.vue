<template>
  <div id="main-content" class="d-flex">
    <input type="checkbox" class="like-checkbox" :checked="liked" :id="idPost"/>
    <label @click="toggleLike">
    <svg id="heart-svg" viewBox="467 392 58 57" xmlns="http://www.w3.org/2000/svg">
      <g id="Group" fill="none" fill-rule="evenodd" transform="translate(467 392)">
      <path d="M29.144 20.773c-.063-.13-4.227-8.67-11.44-2.59C7.63 28.795 28.94 43.256 29.143 43.394c.204-.138 21.513-14.6 11.44-25.213-7.214-6.08-11.377 2.46-11.44 2.59z" id="heart" fill="#AAB8C2"/>
      <circle id="main-circ" fill="#12121C" opacity="0" cx="29.5" cy="29.5" r="1.5"/>

      <g id="grp7" opacity="0" transform="translate(7 6)">
        <circle id="oval1" fill="#9CD8C3" cx="2" cy="6" r="2"/>
        <circle id="oval2" fill="#8CE8C3" cx="5" cy="2" r="2"/>
      </g>

      <g id="grp6" opacity="0" transform="translate(0 28)">
        <circle id="oval1" fill="#CC8EF5" cx="2" cy="7" r="2"/>
        <circle id="oval2" fill="#91D2FA" cx="3" cy="2" r="2"/>
      </g>

      <g id="grp3" opacity="0" transform="translate(52 28)">
        <circle id="oval2" fill="#9CD8C3" cx="2" cy="7" r="2"/>
        <circle id="oval1" fill="#8CE8C3" cx="4" cy="2" r="2"/>
      </g>

      <g id="grp2" opacity="0" transform="translate(44 6)">
        <circle id="oval2" fill="#CC8EF5" cx="5" cy="6" r="2"/>
        <circle id="oval1" fill="#CC8EF5" cx="2" cy="2" r="2"/>
      </g>

      <g id="grp5" opacity="0" transform="translate(14 50)">
        <circle id="oval1" fill="#91D2FA" cx="6" cy="5" r="2"/>
        <circle id="oval2" fill="#91D2FA" cx="2" cy="2" r="2"/>
      </g>

      <g id="grp4" opacity="0" transform="translate(35 50)">
        <circle id="oval1" fill="#F48EA7" cx="6" cy="5" r="2"/>
        <circle id="oval2" fill="#F48EA7" cx="2" cy="2" r="2"/>
      </g>

      <g id="grp1" opacity="0" transform="translate(24)">
        <circle id="oval1" fill="#9FC7FA" cx="2.5" cy="3" r="2"/>
        <circle id="oval2" fill="#9FC7FA" cx="7.5" cy="2" r="2"/>
      </g>
      </g>
    </svg>
    </label>
    <div class="like-count">{{likeCounter}}</div>  
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
  export default {
    props: ['idPost'],
    
    computed: {
      ...mapGetters([
        'getUser',
        'getSomePost'
      ])
    },
    methods: {
      ...mapActions([
        'toLikePost'
      ]),
      toggleLike(){
        this.liked = !this.liked
        this.liked ? this.likeCounter++ : this.likeCounter--
        console.log("LIKE ACTION", this.liked);
        this.toLikePost({postId: this.idPost, userId: this.getUser.id, likeAction: this.liked})
        .then(res => console.log(res))
        .catch(err => console.log(err))
      },
      searchOnLike(likedUsersCollection, userId){
        return likedUsersCollection.includes(userId)
      }
    },
    data:()=>({
      liked: null,
      likedUsers: null,
      likeCounter: null
    }),
    created(){
      this.likedUsers = this.getSomePost(this.idPost).likedUsers;
      this.liked = this.searchOnLike(this.likedUsers, this.getUser.id)
      this.likeCounter = this.likedUsers.length
    }
  }
</script>

<style lang="scss" scoped>
.like-count{
  font-size: 10px;
  transform: translateX(-5px);
  color: #fff;
  transition: .5s;
}
#main-content{
  position: relative;
  align-items: center;
}
svg{
  z-index: 2;
  position: relative;
  cursor:pointer; overflow:visible; width:35px;
  #heart{transform-origin:center; animation:animateHeartOut .3s linear forwards;}
  #main-circ{transform-origin:29.5px 29.5px;}
  user-select:none;
  -webkit-tap-highlight-color:rgba(0,0,0,0);
}

.like-checkbox{display:none;}
.like-checkbox:checked ~ .like-count{
  color: #E2264D;
}
#heart{stroke: #fff; stroke-width: 3px; fill: none;};
.like-checkbox:checked + label svg{
    #heart{transform:scale(.2); fill:#E2264D; stroke: none; animation:animateHeart .3s linear forwards .25s;}
    #main-circ{transition:all 2s; animation:animateCircle .3s linear forwards; opacity:1;}
    #grp1{
      opacity:1; transition:.1s all .3s;
      #oval1{
        transform:scale(0) translate(0, -30px);
        transform-origin:0 0 0;
        transition:.5s transform .3s;}
      #oval2{
        transform:scale(0) translate(10px, -50px);
        transform-origin:0 0 0;
        transition:1.5s transform .3s;}
    }
    #grp2{
      opacity:1; transition:.1s all .3s;
      #oval1{
        transform:scale(0) translate(30px, -15px); 
        transform-origin:0 0 0;
        transition:.5s transform .3s;}
      #oval2{
        transform:scale(0) translate(60px, -15px); 
        transform-origin:0 0 0;
        transition:1.5s transform .3s;}
    }
    #grp3{
      opacity:1; transition:.1s all .3s;
      #oval1{
        transform:scale(0) translate(30px, 0px);
        transform-origin:0 0 0;
        transition:.5s transform .3s;}
      #oval2{
        transform:scale(0) translate(60px, 10px);
        transform-origin:0 0 0;
        transition:1.5s transform .3s;}
    }
    #grp4{
      opacity:1; transition:.1s all .3s;
      #oval1{
        transform:scale(0) translate(30px, 15px);
        transform-origin:0 0 0;
        transition:.5s transform .3s;}
      #oval2{
        transform:scale(0) translate(40px, 50px);
        transform-origin:0 0 0;
        transition:1.5s transform .3s;}
    }
    #grp5{
      opacity:1; transition:.1s all .3s;
      #oval1{
        transform:scale(0) translate(-10px, 20px);
        transform-origin:0 0 0;
        transition:.5s transform .3s;}
      #oval2{
        transform:scale(0) translate(-60px, 30px);
        transform-origin:0 0 0;
        transition:1.5s transform .3s;}
    }
    #grp6{
      opacity:1; transition:.1s all .3s;
      #oval1{
        transform:scale(0) translate(-30px, 0px);
        transform-origin:0 0 0;
        transition:.5s transform .3s;}
      #oval2{
        transform:scale(0) translate(-60px, -5px);
        transform-origin:0 0 0;
        transition:1.5s transform .3s;}
    }
    #grp7{
      opacity:1; transition:.1s all .3s;
      #oval1{
        transform:scale(0) translate(-30px, -15px);
        transform-origin:0 0 0;
        transition:.5s transform .3s;}
      #oval2{
        transform:scale(0) translate(-55px, -30px);
        transform-origin:0 0 0;
        transition:1.5s transform .3s;}
    }
    #grp2{opacity:1; transition:.1s opacity .3s;}
    #grp3{opacity:1; transition:.1s opacity .3s;}
    #grp4{opacity:1; transition:.1s opacity .3s;}
    #grp5{opacity:1; transition:.1s opacity .3s;}
    #grp6{opacity:1; transition:.1s opacity .3s;}
    #grp7{opacity:1; transition:.1s opacity .3s;}
}

@keyframes animateCircle{
  40%{transform:scale(10); opacity:1; fill:#DD4688;}
  55%{transform:scale(11); opacity:1; fill:#D46ABF;}
  65%{transform:scale(12); opacity:1; fill:#CC8EF5;}
  75%{transform:scale(13); opacity:1; fill:transparent; stroke:#CC8EF5; stroke-width:.5;}
  85%{transform:scale(17); opacity:1; fill:transparent; stroke:#CC8EF5; stroke-width:.2;}
  95%{transform:scale(18); opacity:1; fill:transparent; stroke:#CC8EF5; stroke-width:.1;}
  100%{transform:scale(19); opacity:1; fill:transparent; stroke:#CC8EF5; stroke-width:0;}
}

@keyframes animateHeart{
  0%{transform:scale(.2);}
  40%{transform:scale(1.2);}
  100%{transform:scale(1);}
}

@keyframes animateHeartOut{
  0%{transform:scale(1.4);}
  100%{transform:scale(1);}
}
</style>