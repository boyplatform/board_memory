//import section
var express= require('express');
var app=express();
var bodyParser = require('body-parser');
var http=require('http');

var QueueValidation=require('../src/boyMemoryValidation.js');
var QueueValidationObj=new QueueValidation();

var memoryCommon=require('../src/boyMemoryCommon.js');
var conf=require('../src/config.js');

var selfIntroduce=require('../crystalBlock/selfExpress/selfIntroduce');
//var CrystalClusterCommonRulesImp=require('../crystalBlock/common/CrystalClusterCommonRulesImp');
var CrystalClusterCommonRules_deamonThreads=require('../crystalBlock/common/CrystalClusterCommonRulesImp/deamonThreads');
var CrystalClusterCommonRules_decideAndAction=require('../crystalBlock/common/CrystalClusterCommonRulesImp/decideAndAction');
var CrystalClusterCommonRules_interact=require('../crystalBlock/common/CrystalClusterCommonRulesImp/interact');

var CacheShadowGACSchedule=require('../DeamonThread/CacheShadowGACSchedule');


var LocalFeedDiskDORSchedule=require('../DeamonThread/LocalFeedDiskDORSchedule');


var MemCacheDORSchedule=require('../DeamonThread/MemCacheDORSchedule');


var NodeCacheDORSchedule=require('../DeamonThread/NodeCacheDORSchedule');


var RedisCacheDORSchedule=require('../DeamonThread/RedisCacheDORSchedule');



var cacheShadowGACSchedule=new CacheShadowGACSchedule();
var localFeedDiskDORSchedule=new LocalFeedDiskDORSchedule();
var memCacheDORSchedule=new MemCacheDORSchedule();
var nodeCacheDORSchedule=new NodeCacheDORSchedule();
var redisCacheDORSchedule=new RedisCacheDORSchedule();

//var crystalClusterCommonRulesImp=new CrystalClusterCommonRulesImp();
var crystalClusterCommonRules_deamonThreads=new CrystalClusterCommonRules_deamonThreads();
var crystalClusterCommonRules_decideAndAction=new CrystalClusterCommonRules_decideAndAction();
var crystalClusterCommonRules_interact=new CrystalClusterCommonRules_interact();



var NodeCacheOperator=require('../MemoryOperator/NodeCacheOperator');
var nodeCacheOperator=new NodeCacheOperator();

var MemCacheOperator=require('../MemoryOperator/MemCacheOperator');
var memCacheOperator=new MemCacheOperator();

var LocalFeedDiskOperator=require('../MemoryOperator/LocalFeedDiskOperator');
var localFeedDiskOperator=new LocalFeedDiskOperator();

var RedisCacheOperator=require('../MemoryOperator/RedisCacheOperator');
var redisCacheOperator=new RedisCacheOperator();






//install midware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


//Programe Entry
var server=app.listen(8080,'0.0.0.0',function(){
 
     console.log('Intelligent boy-memory is running on current crystal node at:'+(new Date()).toLocaleString());
       
     //依赖注入

      
     //-----------打开队列索引守护线程---------------------------
     //--节点队列索引+流量整形Node DB持久化--
      //定时执行时间单位为“秒”
      //定时缓存输出数据刷新
      memoryCommon.setDeamonThreadJob(localFeedDiskDORSchedule.DOR.bind(localFeedDiskDORSchedule),conf.platformArch.DeamonThreadSecRate.forLocalFeedDiskDORSchedule);
      memoryCommon.setDeamonThreadJob(memCacheDORSchedule.DOR.bind(memCacheDORSchedule),conf.platformArch.DeamonThreadSecRate.forMemCacheDORSchedule);
      memoryCommon.setDeamonThreadJob(nodeCacheDORSchedule.DOR.bind(nodeCacheDORSchedule),conf.platformArch.DeamonThreadSecRate.forNodeCacheDORSchedule);
      memoryCommon.setDeamonThreadJob(redisCacheDORSchedule.DOR.bind(redisCacheDORSchedule),conf.platformArch.DeamonThreadSecRate.forRedisCacheDORSchedule);

      //定时本地NodeDB过期缓存快照垃圾回收。
      memoryCommon.setDeamonThreadJob(cacheShadowGACSchedule.ShadowGACExecute.bind(cacheShadowGACSchedule),conf.platformArch.DeamonThreadSecRate.forShadowGACExecute);
    
      //启动master节点相关线程
      memoryCommon.setDeamonThreadJobWithArgs(crystalClusterCommonRules_deamonThreads.nodePerformanceCollect.bind(crystalClusterCommonRules_deamonThreads),conf.platformArch.crystalCluster.httpDefaultMode,conf.platformArch.DeamonThreadSecRate.forNodePerformanceCollection);
      memoryCommon.setDeamonThreadJob(crystalClusterCommonRules_deamonThreads.timelySelfNatureSelectionVote.bind(crystalClusterCommonRules_deamonThreads),conf.platformArch.DeamonThreadSecRate.forMasterNodeSelfSelection);
      memoryCommon.setDeamonThreadJobWithArgs(crystalClusterCommonRules_deamonThreads.timelyMeetingSelectionVote.bind(crystalClusterCommonRules_deamonThreads),conf.platformArch.crystalCluster.httpDefaultMode,conf.platformArch.DeamonThreadSecRate.forMasterNodeMeetingSelection);
      memoryCommon.setDeamonThreadJob(crystalClusterCommonRules_decideAndAction.effectiveMasterNodeVoteResult.bind(crystalClusterCommonRules_decideAndAction),conf.platformArch.DeamonThreadSecRate.forEffectiveMasterNodeVoteResult);
      memoryCommon.setDeamonThreadJob(crystalClusterCommonRules_deamonThreads.timelySelectionVoteResultClear.bind(crystalClusterCommonRules_deamonThreads),conf.platformArch.DeamonThreadSecRate.forTimelySelectionVoteResultClear);
      //启动数据共识处理规则相关线程
            //verify whether current node is master and get node role result for current node
            memoryCommon.setDeamonThreadJob(function(){
               crystalClusterCommonRules_deamonThreads.getCurrentNodeRole(function(nodeRoleRs){
               
                  crystalClusterCommonRules_deamonThreads.nodeRoleRs=nodeRoleRs;
               console.log('nodeRoleRs:',nodeRoleRs);      
            })
      },conf.platformArch.DeamonThreadSecRate.forGetCurrentNodeRolePromiseTime);
      //初始化所有memory operator之连接
      try{
         redisCacheOperator.setConn();
         memCacheOperator.setConn();
         nodeCacheOperator.setConn();
         localFeedDiskOperator.setConn();
      }catch(err){
           console.dir(err);
      }

})


app.post('/memData',async function(req,res){

       //入口参数验证
       let validationRs=await QueueValidationObj.InputValidator(req.body,'/memData');
       if(validationRs.Result===false){
          
            res.end(JSON.stringify(validationRs));
            return;
       }
       
       //进入执行入口
        if(req.body!=null&&req.body!=undefined){
           //write-in , query-out
           if(req.body.messageAction==="write"){
              memDataWrite(req.body,res);
           }else if(req.body.messageAction==="read"){
              memDataRead(req.body,res);
           }else{
             
              var returnRs={result:false,desc:"MemData operation command is wrong,Please re-define your input request parameter."};
              res.end(JSON.stringify(returnRs));
           }

        }
})

function memDataWrite(body,res) {
   
   //full fill data
   for(var key in body.writeSqlParameter){

      body.writeSql=memoryCommon.replaceAll(key,body.writeSqlParameter[key],body.writeSql);
      //body.writeSql=body.writeSql.replace(key,body.writeSqlParameter[key]);
   }

   if(body.blockVerifyOrNot!==undefined&&body.blockVerifyOrNot===false)
   {
            redisCacheOperator.dataWrite(body.reqStorageClusterDbType,redisCacheOperator,conf.platformArch.NonBlockChainPublishChannel.toUpperCase(),body.writeSql,function(result){
               
               var returnRs={result:false,desc:null};
               if(result){
                  
                  console.log("memData was write successfully once.")
                  returnRs.result=result;
                  returnRs.desc="memData was write successfully once.";
                  res.end(JSON.stringify(returnRs));
               
               }else{
                  
                  console.log("memData was write failed once caused by: ",result);
                  returnRs.result=false;
                  returnRs.desc="memData was write failed once caused by: "+result;
                  res.end(JSON.stringify(returnRs));
               }

         });
   }else{

         redisCacheOperator.dataWrite(body.reqStorageClusterDbType,redisCacheOperator,body.targetDbName.toString().toUpperCase(),body.writeSql,function(result){
         
            var returnRs={result:false,desc:null};
            if(result){
               
               console.log("memData was write successfully once.")
               returnRs.result=result;
               returnRs.desc="memData was write successfully once.";
               res.end(JSON.stringify(returnRs));
            
            }else{
               
               console.log("memData was write failed once caused by: ",result);
               returnRs.result=false;
               returnRs.desc="memData was write failed once caused by: "+result;
               res.end(JSON.stringify(returnRs));
            }

      });

   }

    
    
}

function memDataRead(body,res) {
     
     var returnRs={result:false,value:null,desc:"Read memory successfully"};
      //full fill data
      for(var key in body.querySqlParameter){

         body.querySql=body.querySql.replace(key,body.querySqlParameter[key]);
      }
     //Read level 1 memory--node Cached
     
     nodeCacheOperator.dataRead(body.reqStorageClusterDbType,body.targetDbName.toString().toUpperCase(),body.keyObjName,body.keyObjType,body.querySql,body.ttl,body.cacheGenMethod,function(resultValue){
            //mock stone
               if(body.mocktype!==undefined&&body.mocktype==="nodeCacheOperator"){
                     if(resultValue===undefined||resultValue===null||resultValue===[]){

                        //If all not existed,return result with description.
                        returnRs.result=false;
                        returnRs.value=[];
                        returnRs.desc="Read memory failed";
                        res.end(JSON.stringify(returnRs));
                        }else{
                              returnRs.result=true;
                              returnRs.value=resultValue;
                              res.end(JSON.stringify(returnRs));
                        }
               }else if(body.mocktype!==undefined){
                   resultValue=undefined;
               } 
          if(resultValue===undefined||resultValue===null||resultValue===[]){
               //If not existed at level 1 memory, then read level 2 memory--memcached memory
                memCacheOperator.dataRead(body.reqStorageClusterDbType,body.targetDbName.toString().toUpperCase(),body.keyObjName,body.keyObjType,body.querySql,body.ttl,body.cacheGenMethod,function(resultValue){
                     //mock stone
                     if(body.mocktype!==undefined&&body.mocktype==="memCacheOperator"){
                           if(resultValue===undefined||resultValue===null||resultValue===[]){

                              //If all not existed,return result with description.
                              returnRs.result=false;
                              returnRs.value=[];
                              returnRs.desc="Read memory failed";
                              res.end(JSON.stringify(returnRs));
                              }else{
                                    returnRs.result=true;
                                    returnRs.value=resultValue;
                                    res.end(JSON.stringify(returnRs));
                              }
                     }else if(body.mocktype!==undefined){
                        resultValue=undefined;
                     }
                     if(resultValue===undefined||resultValue===null||resultValue===[]){

                         //If not existed at level 2 memory, then read level 3 memory--redis memory
                         redisCacheOperator.dataRead(body.reqStorageClusterDbType,body.targetDbName.toString().toUpperCase(),body.keyObjName,body.keyObjType,body.querySql,body.ttl,body.cacheGenMethod,function(resultValue){
                              //mock stone
                              if(body.mocktype!==undefined&&body.mocktype==="redisCacheOperator"){
                                    if(resultValue===undefined||resultValue===null||resultValue===[]){
                                          //If all not existed,return result with description.
                                          returnRs.result=false;
                                          returnRs.value=[];
                                          returnRs.desc="Read memory failed";
                                          res.end(JSON.stringify(returnRs));
                                       }else{
                                             returnRs.result=true;
                                             returnRs.value=resultValue;
                                             res.end(JSON.stringify(returnRs));
                                       }
                              }else if(body.mocktype!==undefined){
                                 resultValue=undefined;
                              }
                              if(resultValue===undefined||resultValue===null||resultValue===[]){
                                  //If not existed at level 3 memory, then read level 0 backup memory--localFeedDiskOperator memory
                                   localFeedDiskOperator.dataRead(body.reqStorageClusterDbType,body.targetDbName.toString().toUpperCase(),body.keyObjName,body.keyObjType,body.querySql,body.ttl,body.cacheGenMethod,function(resultValue){
                                       if(resultValue===undefined||resultValue===null||resultValue===[]){

                                               //If all not existed,return result with description.
                                               returnRs.result=false;
                                               returnRs.value=[];
                                               returnRs.desc="Read memory failed";
                                               res.end(JSON.stringify(returnRs));

                                       }else{
                                             returnRs.result=true;
                                             returnRs.value=resultValue;
                                             res.end(JSON.stringify(returnRs));
                                       }

                                   })

                                  

                              }else{
                                
                                 returnRs.result=true;
                                 returnRs.value=resultValue;
                                 res.end(JSON.stringify(returnRs)); 

                              }
                              
                         });
                     }else{
                        returnRs.result=true;
                        returnRs.value=resultValue;
                        res.end(JSON.stringify(returnRs)); 
                     }
                });
             
           }else{
               returnRs.result=true;
               returnRs.value=resultValue;
               res.end(JSON.stringify(returnRs));         
           }

     })
    
}

//readme api
app.post('/readMe',async function(req,res){
    
        //入口参数验证
       let validationRs=await QueueValidationObj.InputValidator(req.body,'/readMe');
       if(validationRs.Result===false){
          
            res.end(JSON.stringify(validationRs));
            return;
       } 

       //进入执行入口
        let jsonBody=req.body; 
        switch(jsonBody.type.toString()){
             case 'osInfo':
                res.end(JSON.stringify(selfIntroduce.getNodeOSInfo()));
                break;
             case 'mem':
                res.end(JSON.stringify(selfIntroduce.getCurrentNodeMem()));
                break;
             case 'battery':
                res.end(JSON.stringify(selfIntroduce.getCurrentNodeBattery()));
                break;
             case 'crystalCluster':
             
             if(req.body.httpMode!=undefined){
               selfIntroduce.getCurrentCrystalCluster(res,req.body.httpMode,req.body.infoType);
             }else{
               selfIntroduce.getCurrentCrystalCluster(res,conf.platformArch.crystalCluster.httpDefaultMode,req.body.infoType);
             }
                break;
            case 'seekNodeSelectionVoteResult':
                 
                   crystalClusterCommonRules_interact.timelyNodeSelectionVoteResultSeek(function(rows){

                   res.end(JSON.stringify(rows));
                })
                break;
            case 'seekMasterNodeVoteResult':
                
                  crystalClusterCommonRules_interact.seekMasterNodeVoteResult(function(row){

                   res.end(JSON.stringify(row));
                })
                break;
             default:
                res.end('Wrong Command type!Please double check your command.')
        }
   

})

//teachKnowledgeAPI



//learnKnowledgeAPI(take&pull)


//platformOpsIncretionAPI


//modilityFriendSensorAPI--verify,add,remove,weightSetting,role&task allocation vote for cluster/friend node

//modilityKnowSelfBadAPI--get bad report from cluster/friend node 