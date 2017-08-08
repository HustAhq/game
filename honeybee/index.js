 var Game = {//敌人数据
           oEnemy : {
               e1 : {style:'enemy1', blood:1, speed:5, score:1},
               e2 : {style:'enemy2', blood:2, speed:7, score:2},
               e3 : {style:'enemy3', blood:3, speed:10, score:3}
           },
           gk : [//关卡数据
               {
                   eMap :[
                        'e2','e2','e2','e2','e2','e2','e2','e2','e2','e2',
                        'e2','e2','e2','e2','e2','e2','e2','e2','e2','e2',
                        'e2','e2','e2','e2','e2','e2','e2','e2','e2','e2',
                        'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
                        'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
                        'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1'
                   ],
                    colNum : 10,
                    iSpeedX : 10,
                    iSpeedY : 10,
                    times : 2000
               },
               {
                   eMap :[
                        'e3','e3','e3','e3','e3','e3','e3','e3','e3','e3',
                        'e3','e3','e3','e3','e3','e3','e3','e3','e3','e3',
                        'e3','e3','e3','e3','e3','e3','e3','e3','e3','e3',
                        'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
                        'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
                        'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1'
                   ],
                    colNum : 10,
                    iSpeedX : 10,
                    iSpeedY : 10,
                    times : 2000
               }
           ],
           air :  {//飞机的数据
              style : 'air1',
              bulletStyle : 'bullet'
           },
           init : function (id) {//初始化
               this.oParent = document.getElementById(id);
               this.createScore();
               this.createEemey(0);
               this.createAir();
           },
           createScore : function () {//创建分数
              var oS = document.createElement('div');
              oS.id = 'score';
              oS.innerHTML = '积分：<span>0</span>';
              this.oParent.appendChild(oS);
              this.oSNum = oS.getElementsByTagName('span')[0];
           },
           createEemey : function (isNow) {//创建小蜜蜂
               
               if(this.oUl){
                   clearInterval(this.oUl.timer);
                   this.oParent.removeChild(this.oUl)
               }

              document.title = '第'+ (isNow + 1) +'关';

              var gk = this.gk[isNow];
              var oUl = document.createElement('ul');
              var arr = [];
              oUl.id = 'bee';
              oUl.style.width = gk.colNum * 40 + 'px';
              this.oParent.appendChild(oUl);
              oUl.style.left = (this.oParent.offsetWidth - oUl.offsetWidth) / 2 + 'px';
              
              this.oUl = oUl;

              for(var i = 0; i < gk.eMap.length; i++){
                 var oLi = document.createElement('li');
                 oLi.className = this.oEnemy[gk.eMap[i]].style;
                 oLi.blood = this.oEnemy[gk.eMap[i]].blood;
                 oLi.speed = this.oEnemy[gk.eMap[i]].speed;
                 oLi.score = this.oEnemy[gk.eMap[i]].score;
                 oUl.appendChild(oLi);
              }
              this.aLi = oUl.getElementsByTagName('li');
              //将li的位置进行存储
              for (var i = 0; i < this.aLi.length; i++){
                  arr.push([this.aLi[i].offsetLeft, this.aLi[i].offsetTop]);
              }
             //进行布局转换  float-》position
              for(var i = 0; i < this.aLi.length; i++){
                  this.aLi[i].style.position = 'absolute';
                  this.aLi[i].style.left = arr[i][0] + 'px';
                  this.aLi[i].style.top = arr[i][1] + 'px';                  
              }
              this.runEnemy(gk);
           },
           runEnemy : function (gk) {//oUl的整体移动
               var This = this;
               var L = 0;
               var R = this.oParent.offsetWidth - this.oUl.offsetWidth;//右边的最大left
             
              this.oUl.timer = setInterval(function (){
                   
                    if(This.oUl.offsetLeft > R){
                        gk.iSpeedX *= -1;
                        This.oUl.style.top = This.oUl.offsetTop + gk.iSpeedY + 'px';
                    }else if(This.oUl.offsetLeft < L){
                        gk.iSpeedX *= -1;
                        This.oUl.style.top = This.oUl.offsetTop + gk.iSpeedY + 'px';
                    }
                    
                    This.oUl.style.left = This.oUl.offsetLeft + gk.iSpeedX + 'px';
            
              }, 200);

              setInterval(function (){
                  This.onemove();
              }, gk.times);
           },
           
           onemove: function (){//每一个小蜜蜂进行攻击
               var This = this;
               var nowLi = this.aLi[ Math.floor( Math.random()* this.aLi.length) ];
               nowLi.timer = setInterval(function (){
                  
                   var a = (This.oA.offsetLeft + This.oA.offsetWidth/2) - (nowLi.offsetLeft + nowLi.parentNode.offsetLeft + nowLi.offsetWidth/2);
		           var b = (This.oA.offsetTop + This.oA.offsetHeight/2) - (nowLi.offsetTop + nowLi.parentNode.offsetTop + nowLi.offsetHeight / 2);
                   
                   var c = Math.sqrt(a*a + b*b);
                   
                   var iSX = nowLi.speed * a / c;
                   var iSY = nowLi.speed * b / c;
                   
                   nowLi.style.left = nowLi.offsetLeft + iSX + 'px';
                   nowLi.style.top = nowLi.offsetTop + iSY + 'px';

                    if( This.pz( This.oA , nowLi ) ){
                        alert('游戏结束');
                        window.location.reload();
                    }
               }, 30);
           },
          
           createAir : function () {//飞机创建
               var oA = document.createElement('div');
               oA.className = this.air.style;
               this.oParent.appendChild(oA);
               this.oA = oA;
               oA.style.left = (this.oParent.offsetWidth - oA.offsetWidth)/2 + 'px';
               oA.style.top = (this.oParent.offsetHeight - oA.offsetHeight) + 'px';
               this.bindAir();
           },
         
           bindAir : function () {//操作飞机
              var timer = null;
              var iNum = 0;
              var This = this;
              document.onkeydown = function (e){
                  var e = e || window.event;
                  if(!timer){
                      timer = setInterval(show, 30);//开启定时器不至于子弹连续飞出
                  }
                  if(e.keyCode == 37){
                     iNum = 1;
                  }else if (e.keyCode == 39){
                     iNum = 2;
                  }
              }
              document.onkeyup = function (e) {
                    var e = e || window.event;
                    clearInterval(timer);
                    timer = null;
                    iNum = 0;
                    if(e.keyCode == 32){
                       This.createBullet();
                    }
              }
              function show () {
                  if(iNum == 1){
                      This.oA.style.left = This.oA.offsetLeft - 10 + 'px';
                  }else if(iNum == 2){
                     This.oA.style.left = This.oA.offsetLeft + 10 + 'px';
                  }
              }
           },
           
           createBullet : function () {//创建子弹
               var oB = document.createElement('div');
               oB.className = this.air.bulletStyle;
               this.oParent.appendChild(oB);
               oB.style.left = this.oA.offsetLeft + this.oA.offsetWidth/2 + 'px';
	           oB.style.top = this.oA.offsetTop - 10 + 'px';
               this.runBullet(oB);
           },
           runBullet : function (oB) { //子弹的运动
              var This = this;
              oB.timer = setInterval(function (){
                  if(oB.offsetTop < -10){
                     clearInterval(oB.timer);
                     This.oParent.removeChild(oB);
                  }else{
                     oB.style.top = oB.offsetTop - 10 + 'px';
                  }

                  for(var i = 0; i < This.aLi.length; i++){
                      if( This.pz(oB, This.aLi[i]) ){
                         if(This.aLi[i]. blood === 1){
                            clearInterval(This.aLi[i].timer);
                            This.oSNum.innerHTML = parseInt(This.oSNum.innerHTML) + This.aLi[i].score;
                            This.oUl.removeChild( This.aLi[i] );
                         }else{
                            This.aLi[i]. blood--;
                         }
                     
                         clearInterval(oB.timer);
                         This.oParent.removeChild(oB);
                      }
                  }

                    if( !This.aLi.length ){
                     This.createEemey(1);
                  }

              }, 30);
           },
           pz : function (obj1, obj2) {//碰撞检测
               var L1 = obj1.offsetLeft;
               var R1 = obj1.offsetLeft + obj1.offsetWidth;
               var T1 = obj1.offsetTop;
               var B1 = obj1.offsetTop + obj1.offsetHeight;

               var L2 = obj2.offsetLeft + obj2.parentNode.offsetLeft;
               var R2 = obj2.offsetLeft + obj2.offsetWidth + obj2.parentNode.offsetLeft;
               var T2 = obj2.offsetTop + obj2.parentNode.offsetTop;
               var B2 = obj2.offsetTop + obj2.offsetHeight + obj2.parentNode.offsetTop;

               if( R1 < L2 || L1 > R2 || B1 < T2 || T1 > B2){//碰不到
                  return false;
               }else{//pengdao
                  return true;
               }
           }
      }